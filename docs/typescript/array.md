---
title: '数组的类型'
---

## 常规表示

最简单的方法是使用<span class="e-1">[类型 + 方括号]</span>来表示数组：

```typescript
// 存放数字的数组
let arr : number[] = [1, 2, 3, 4];

// 存放字符串的数组
let arr : string[] = ['a', 'b', 'c', 'b'];
```

数组的一些方法的参数也会根据数组的定义时约定的类型进行约束：

```typescript {2}
let arr : number[] = [1, 2, 3, 4];
arr.push('hello');

// Argument of type '"hello"' is not assignable to parameter of type 'number'.
```

## 数组泛型

我们也可以使用数组泛型(Array Generic) <span class="e-1">Array\<elementType\></span>来表示数组:

```typescript
let arr : Array<number> = [1, 2, 3, 4];
```

## 接口数组

`NumberArray` 表示：只要索引的类型是数字时，那么值的类型必须是数字，虽然接口可以用来描述数组，但是一般不会这么做，因为这种比较复杂

```typescript
interface NumberArray {
  [index: number]: number;
}

let arr : NumberArray = [1, 2, 3, 4]
```

## 类数组

类数组不是数组类型，比如`arguments`:

事实上常用的类数组都有自己的接口定义，如 `IArguments`、 `NodeList`、 `HTMLCollection` 等：

```ts
function sum() {
  let args : number[] = arguments;
}

// Type 'IArguments' is missing the following properties from type 'number[]': pop, push, concat, join, and 24 more.
// arguments 实际上是一个类数组，不能用普通的数组方式来描述，而应该使用接口：

function sum() {
  let args: {
    [index: number] : number;
    length: number;
    callee: Function;
  } = arguments;
}

function sum() {
  let args: IArguments = arguments;
}
```

## 任意类型数组

```ts
let arr : any[] = ['hello', 2, {website: 'https://www.google.com'}];
```