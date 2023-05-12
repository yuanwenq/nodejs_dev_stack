---
title: "权限/CASL"
---

## 概念

- **User Action:** 用户操作
- **Subject:** 操作对象
- **Fields:** 操作属性，范围
- **Conditions:** 满足`Subject`的条件，筛选操作

例子

```ts
import { defineAbility } from '@casl/ability';

// 创建权限能力
export default (user) => defineAbility((can) => {
  // 所有用户都可以阅读文章
  can('read', 'Article');

  // 只有文章的拥有者可以修改文章的“标题”与“描述”
  can('update', 'Article', ['title', 'description'], { authorId: user.id })

  // 只有版主可以更新文章的发布字段
  if (user.isModerator) {
    can('update', 'Article', ['published'])
  }
});

const moderator = { id: 2, isModerator: true };
const ownArticle = new Article({ authorId: moderator.id });
const foreignArticle = new Article({ authorId: 10 });
const ability = defineAbilityFor(moderator);

// 权限验证阶段
ability.can('read', 'Article') // true
ability.can('update', 'Article', 'published') // true
ability.can('update', ownArticle, 'published') // true
ability.can('update', foreignArticle, 'title') // false
```

## NestJS集成

1. 通过守卫获取控制器的自定义装饰器
2. 装饰器通过<span class="e-1">ability</span>权限判断返回`Boolean`
3. 守卫通过<span class="e-1">ability</span>的结果决定是否放行

### controller

```ts {5,9}
@Controller('logs')
@UseGuards(
  JwtGuard, // Json web token
  AdminGuard, // 管理员守卫
  CaslGuard // 策略权限守卫
)
export class LogsController {
  @Get()
  @Can(Action.Read, Logs) // 权限判断
  getLogs() {
    return 'logs list';
  }
}
```

### service

这里设置用户角色的能力，能做什么，不能做什么

```ts
import .....

export const getEntities = (path: string) => {
  // /user -> User, /logs -> Logs, /roles -> Roles, ...
  const map = {
    '/user': User,
    '/logs': Logs,
    '/roles': Roles,
    '/menus': Menus,
    '/auth': 'Auth',
  };

  for (let i = 0; i < Object.keys(map).length; i++) {
    const key = Object.keys(map)[i];
    if (path.startsWith(key)) {
      return map[key];
    }
  }
};

@Injectable()
export class CaslAbilityService {
  constructor(private userService: UserService) {}

  async forRoot(username: string) {
    // 针对于整个系统的 -> createUser xx
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    // 从数据库中获取用户信息
    /**
     * user: {
     *  id: 42
     *  roles: [
     *    {
     *      id: 1,
     *      menus: [],
     *      name: "管理员"
     *    },
     *    {
     *      id: 2,
     *      menus: [
     *        {
     *          acl: 'read, create, delete, update, manage',
     *          id: 3,
     *          name: '用户管理',
     *          order: 1,
     *          path: "/users"
     *        },
     *        ....
     *      ],
     *      name: "普通用户"
     *    },
     *  ]
     * }
     */
    const user = await this.userService.find(username);

    // 遍历权限菜单，设置 can
    user.roles.forEach((o) => {
      o.menus.forEach((menu) => {
        const actions = menu.acl.split(',');
        for (let i = 0; i < actions.length; i++) {
          const action = actions[i];
          can(action, getEntities(menu.path));
        }
      });
    });

    const ability = build({
      detectSubjectType: (object) =>
        object.constructor as ExtractSubjectType<any>,
    });

    return ability;
  }
}
```

### decorator

```ts
import { AnyMongoAbility, InferSubjects } from '@casl/ability';
import { SetMetadata } from '@nestjs/common';
import { Action } from '../enum/action.enum';

export enum CHECK_POLICIES_KEY {
  HANDLER = 'CHECK_POLICIES_HANDLER',
  CAN = 'CHECK_POLICIES_CAN',
  CANNOT = 'CHECK_POLICIES_CANNOT',
}

export type PoliciesHandlerCallback = (ability: AnyMongoAbility) => boolean;

export type CaslHandlerType =
  | PoliciesHandlerCallback
  | PoliciesHandlerCallback[];

/**
 * 通过守卫获取下面的装饰器
 * GUARDS -> routes meta -> @CheckPolicies @Can @Cannot
 * @CheckPolicies -> handler -> ability => boolean
 * @Can -> Action, Subject, Conditions
 * @Cannot -> Action, Subject, Conditions
 */

export const CheckPolicies = (...handlers: PoliciesHandlerCallback[]) =>
  SetMetadata(CHECK_POLICIES_KEY.HANDLER, handlers);

export const Can = (
  action: Action,
  subject: InferSubjects<any>,
  conditions?: any,
) =>
  SetMetadata(CHECK_POLICIES_KEY.CAN, (ability: AnyMongoAbility) =>
    ability.can(action, subject, conditions),
  );

export const Cannot = (
  action: Action,
  subject: InferSubjects<any>,
  conditions?: any,
) =>
  SetMetadata(CHECK_POLICIES_KEY.CANNOT, (ability: AnyMongoAbility) =>
    ability.cannot(action, subject, conditions),
  );
```

### guards

1. 获取<span class="e-1">MetaData</span>元数据
2. 获取用户权限设置
3. 进行判断返回 true/false

```ts
@Injectable()
export class CaslGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityService: CaslAbilityService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. 获取 MetaData 元数据
    const handlers = this.reflector.getAllAndMerge<PoliciesHandlerCallback[]>(
      CHECK_POLICIES_KEY.HANDLER,
      [context.getHandler(), context.getClass()],
    );

    const canHandlers = this.reflector.getAllAndMerge<any[]>(
      CHECK_POLICIES_KEY.CAN,
      [context.getHandler(), context.getClass()],
    ) as CaslHandlerType;

    const cannotHandlers = this.reflector.getAllAndMerge<any[]>(
      CHECK_POLICIES_KEY.CANNOT,
      [context.getHandler(), context.getClass()],
    ) as CaslHandlerType;

    // 判断，如果用户未设置上述的任何一个，那么就直接返回true
    if (!handlers || !canHandlers || !cannotHandlers) {
      return true;
    }

    // 通过上下文获取用户用户信息
    const req = context.switchToHttp().getRequest();

    if (req.user) {
      // 2. 通过caslAbilityService服务，获取用户权限设置
      const ability = await this.caslAbilityService.forRoot(req.user.username);

      let flag = true;

      // 3. 进行判断返回 true/false
      if (handlers.length) {
        flag = flag && handlers.every((handler) => handler(ability));
      }

      if (flag && canHandlers) {
        if (canHandlers instanceof Array) {
          flag = flag && canHandlers.every((handler) => handler(ability));
        } else if (typeof canHandlers === 'function') {
          flag = flag && canHandlers(ability);
        }
      }

      if (flag && cannotHandlers) {
        if (cannotHandlers instanceof Array) {
          flag = flag && cannotHandlers.every((handler) => handler(ability));
        } else if (typeof cannotHandlers === 'function') {
          flag = flag && cannotHandlers(ability);
        }
      }
      return flag;
    } else {
      return false;
    }
  }
}
```

## 参考/文档

- [CASL](https://casl.js.org/v6/en/)
- [Reflection and metadata](https://docs.nestjs.com/fundamentals/execution-context#reflection-and-metadata)