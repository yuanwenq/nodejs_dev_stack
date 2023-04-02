---
title: '函数的类型'
---

:::tip
函数是JavaScript中的一等公民
:::

## 定义函数

在 JavaScript 中，有两种常见的定义函数的方法：
- **函数声明(Function Declaration)**
- **函数表达式(Function Expression)**

```ts
// 函数声明
function sum(x, y) {
  return x + y;
}

// 函数表达式
let sum = function(x, y) {
  return x + y;
}
```

函数有输入和输出，要在 Typescript 中对其进行约束，需要把输入和输出都考虑到

```ts
// 函数声明的定义
function sum(x: number, y: number) : number {
  return x + y;
}

// 函数表达式的定义
let sum = function(x: number, y: number) : number {
  return x + y;
}
let sum: (x: number, y: number) => number = function(x: number, y: number) : number {
  return x + y;
}
```

## 接口定义函数的形状

采用函数表达式，接口定义函数的方式时，对变量进行类型限制，可以保证以后对函数名赋值时保证参数个数，参数类型，返回值类型不变。

```ts
let sum: (x: number, y: number) => number = function(x: number, y: number) : number {
  return x + y;
}

// 上面的代码等价于:
interface SumFunc {
  (x: number, y: number) : number;
}

let sum : SumFunc;
sum = function(x: number, y: number) : number {
  return x + y;
}
```

## 可选参数

函数入参时，输入少于或多于都是不被允许的。那么如何定义可选的参数？与接口中的可选属性类型，使用<span class="e-1">?</span>表示可选参数：

:warning: **可选参数必须放在必填参数后面**

```ts {3}
function buildName(
  firstName: string,
  lastName?: string
) : string {
  if (lastName) {
    return firstName + ' ' + lastName;
  } else {
    return firstName;
  }
}

let tomcat = buildName('Tom', 'cat');
let tom = buildName('Tom');
```

## 参数默认值

在ES6中，我们允许给函数的参数添加默认值，Typescript会将添加了默认值的参数识别为可选参数，此时就不受【可选参数必须放在必填参数后面】的约束

```ts {1,7}
function buildName(firstName: string, lastName: string = 'Cat') {
    return firstName + ' ' + lastName;
}
let tomcat = buildName('Tom', 'Cat');
let tom = buildName('Tom');
// --------可选参数不必放在必填参数后面--------
function buildName(firstName: string = 'Tom', lastName: string) {
    return firstName + ' ' + lastName;
}
let tomcat = buildName('Tom', 'Cat'); // 输出 Tom Cat
let cat = buildName(undefined, 'Cat'); // 输出 Tom Cat
```

## 剩余参数

ES6中，可以使用<span class="e-1">...rest</span>的方式获取函数中的剩余参数(rest参数):

```ts {1}
function push(array, ...items) {
  items.forEach((item) => {
    array.push(item);
  });
}

let a : any[] = [];
push(a, 1, 2, 3);
```

事实上，`items`是一个数组。所以我们可以用数组的类型来定义它：

:warning: **rest参数只能是最后一个参数** 参考[ES6中的rest参数](https://es6.ruanyifeng.com/#docs/function#rest%E5%8F%82%E6%95%B0)

```ts
function push(array: any[], ...items: any[]) {
    items.forEach(function(item) {
        array.push(item);
    });
}

let a = [];
push(a, 1, 2, 3);
```

## 重载

重载允许一个函数接受不同数量或类型的参数时，作出不同的处理。

- 利用联合类型

这样有一个缺点，就是不能够精确的表达，输入为数字的时候，输出也应该为数字，输入为字符串时，也应该输出为字符串

```ts {1}
function reverse(x: number | string): number | string | void {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```

- 定义多个函数类型

:warning: Typescript 会优先从最前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面

```ts {1-3}
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string | void {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```