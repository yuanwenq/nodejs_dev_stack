---
title: '接口'
---

在 TypeScript 中，我们使用接口（Interfaces）来定义对象的类型。TypeScript 中的接口是一个非常灵活的概念，除了可用于对类的一部分行为进行抽象外，也常用于对“对象的形状”进行描述。

接口可以理解为充电插头与手机充电接口的关系，必须完全匹配才能`插进去`。

> 下面例子表示了，少了多了都不行。

```typescript
interface Person {
  name: string,
  age: number
}

let tom : Person = {
  name: 'Tom'
}
// Property 'age' is missing in type '{ name: string; }' but required in type 'Person'

let tom : Person = {
  name: 'Tom',
  age: 18,
  gender: 'male'
}
// Type '{ name: string; age: number; gender: string; }' is not assignable to type 'Person'.
// Object literal may only specify known properties, and 'gender' does not exist in type 'Person'.
```

## 可选属性

有时我们希望不要完全匹配一个形状，那么可以用可选属性。语法上就是<span class="e-1">属性名?: type</span>
```typescript {3}
interface Person {
  name: string;
  age?: number;
}

let tom : Person = {
  name: 'Tom'
}

let tom : Person = {
  name: 'Tom',
  age: 18
}
```

## 只读属性

一些对象属性只能在`对象创建`的时候修改其值。可以在属性名前使用<span class="e-1">readonly</span>来指定只读属性

```typescript {2}
interface Person {
  readonly id: number;
  name: string;
  age: number;
}
```

Typescript 具有 <span class="e-1">ReadonlyArray\<T\></span> 类型，它与 <span class="e-1">Array\<T\></span> 相似，只是把所有可变方法去掉了，因此可以确保数组创建后不可变

变量使用 `const`, 属性使用 `readonly`

```typescript {2}
let a : number[] = [1, 2, 3, 4];
let ro : ReadonlyArray<number> = a;
ro[0] = 12; // error!
ro.push(5); // error!
ro.length = 100; // error!
a = ro; // error!
```

## 额外的属性检查

```typescript {4}
interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
}

let square : SquareConfig = {
  hello: 'hello',
  test: 1
}
// 额外属性设置为 any，后续的属性不会进行检查
```

## 函数类型

```typescript
interface SearchFunc {
  (source: string, substring: string) : boolean;
}

let mySearch: SearchFunc;
mySearch = (source, substring) => {
  let result = source.search(substring);
  return result > -1;
}
```