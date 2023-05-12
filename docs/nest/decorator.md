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