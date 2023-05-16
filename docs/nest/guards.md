---
title: "守卫"
---

## 守卫是什么？

> 守卫有一个单独的责任。它们根据运行时出现的某些条件（例如权限，角色，访问控制列表等）来确定给定的请求是否由路由处理程序处理

守卫与中间件的不同之处就在于，中间件不知道调用<span class="e-1">next()</span>函数后会执行那个处理程序，而守卫可以访问<span class="e-1">ExecutionContext</span>，也就是上下文，因此确切地知道接下来要执行什么。它们的设计与异常过滤器、管道和拦截器非常相似，目的是让您在请求/响应周期的正确位置插入处理逻辑，并以声明的方式进行插入。这有助于保持代码的简洁和声明性。

:::tip
守卫在每个中间件之后执行，但在任何拦截器或管道之前执行。
:::

## 怎么用？

### 创建

```shell
nest g gu path/file --no-spec --flat
```

### 例子

```ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/user.entity';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. 获取请求对象
    const req = context.switchToHttp().getRequest();
    // 2. 获取请求中的用户信息进行逻辑上的判断 -> 角色判断
    const user = (await this.userService.find(req.user.name)) as User;
    console.log(user);
    // 用户判断
    // 后面加入更多的逻辑
    if (user.roles.filter((o) => o.id === 4).length > 0) {
      return true;
    }
    return false;
  }
}

```

### 全局使用

全局使用需要在`main.ts`文件中使用

```ts
app.useGlobalGuards(xxxx);
```

这种全局使用存在弊端，无法使用<span class="e-1">DI系统(依赖注入)</span>，解决方法就是在<span class="e-1">app.module.ts</span>中进行<span class="e-1">providers</span>

```ts
@Module({
  imports: [...],
  controllers: [],
  providers: [
    ...,
    {
      provide: APP_GUARD,
      useClass: AdminGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    }
  ],
  exports: [Logger],
})
export class AppModule {}
```
如果存在多个守卫，执行顺序为从上到下，索引越少执行越早。上面执行顺序为：<span class="e-1">AdminGuard</span>，<span class="e-1">JwtGuard</span>

## 参考

- [Nest.js 中文文档-守卫](https://docs.nestjs.cn/9/guards)