---
title: "核心概念"
---

## 原始数据类型 / 对象类型

JavScript 的类型分为两种：
- 原始数据类型：<span class="e-1">string</span>、<span class="e-1">number</span>、<span class="e-1">boolean</span>、<span class="e-1">undefined</span>、<span class="e-1">undefined</span>、<span class="e-1">Symbol</span>、<span class="e-1">BigInt</span>
- 对象类型：<span class="e-1">Object</span>

## 任意值

任意值(<span class="e-1">any</span>)用来表示允许赋值为任意类型
```typescript
let hello : any = 'seven';
hello = 7;
```

## 类型推论

类型推论就是说如果没有明确的指定类型，那么 TypeScript 会依照类型推论(Type Inference)的规则推断出一个类型。有两种情况.
1. 声明变量时赋值，值的类型就是变量的类型
```typescript
let a = 'hello world!';
a = 9527;
// Type 'number' is not assignable to type 'string'.

// 上面的代码等价于:
let a : string = 'hello world!';
a = 9527;
```
2. 如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 `any` 类型而完全不被类型检查:
```typescript
let a;
a = 'hello world!';
a = 9527;
```

## 联合类型

联合类型(Union Types)就是表示取值可以为多种类型的一种。用 <span class="e-1">|</span> 分隔
```typescript
let a : string | number | boolean;
a = 'hello';
a = 9527;
a = false;
console.log(a); // 输出 false
```