---
title: "Typescript 安装"
---

## 安装TypeScript

TypeScript 的命名行工具安装方法，使用 [npm](https://github.com/nvm-sh/nvm) 全局安装：
```shell
npm install -g typescript
```

完成安装之后我们可以在任何地方执行`tsc`命令，将 `.ts` 文件编辑为 `.js` 文件
```shell
tsc hello.ts
```

## 单独运行 .ts 文件

单独运行`.ts`文件需要全局安装一些npm包
- [ts-node](https://www.npmjs.com/package/ts-node) : 用于node.js的TypeScript执行和REPL，支持源代码地图和本地ESM
- [tslib](https://www.npmjs.com/package/tslib) : TypeScript 的运行时库，包含所有 TypeScript 辅助函数
- [@types/node](https://www.npmjs.com/package/@types/node)

```shell
# 安装
npm install -g ts-node tslib @types/node

# 使用
ts-node hello.js
```