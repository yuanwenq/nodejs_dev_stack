---
title: "装饰器"
---

## 执行顺序

1. 装饰器的执行顺序，方法的装饰器如果有多个，则是从下往上执行

```ts
@Get()
@UseGuards(AuthGuard('jwt')) // 执行第二
@UseGuards(AdminGuard) // 执行第一
getUsers(): any {
  // 逻辑代码
}
```

2. 如果使用<span class="e-1">UseGuards</span>传递多个守卫，则从前往后执行，如果前面的<span class="e-1">Guard</span>没有通过，则后面的<span class="e-1">Guard</span>不会执行

```ts
@Get()
@UseGuards(AuthGuard('jwt'), AdminGuard)
getUsers(): any {
  // 逻辑代码
}
```

## 装饰器聚合

```typescript
import { applyDecorators } from '@nestjs/common';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized"' })
  );
}
```

## 参考

- [装饰器聚合](https://docs.nestjs.cn/9/customdecorators?id=%e4%bd%bf%e7%94%a8%e7%ae%a1%e9%81%93)