---
title: '声明文件'
---

当使用第三方库时，我们需要引用它的声明文件，才能获得对应的代码补全、接口提示等功能。

## 新语法索引

- <span class="e-1">declare var</span> 声明全局变量
- <span class="e-1">declare function</span> 声明全局方法
- <span class="e-1">declare class</span> 声明全局类
- <span class="e-1">declare enum</span> 声明全局枚举类型
- <span class="e-1">declare namespace</span> 声明（含有子属性的）全局对象
- <span class="e-1">interface 和 type</span> 声明全局类型
- <span class="e-1">export</span> 导出变量
- <span class="e-1">export namespace</span> 导出（含有子属性的）对象
- <span class="e-1">export default</span> ES6 默认导出
- <span class="e-1">export =</span> commonjs 导出模块
- <span class="e-1">export as namespace</span> UMD 库声明全局变量
- <span class="e-1">declare global</span> 扩展全局变量
- <span class="e-1">declare module</span> 扩展模块
- <span class="e-1">/// \<reference \/\></span> 三斜线指令

## 什么是声明语句

声明语句就是告诉`ts`,它是什么

假如我们想使用第三方库jQuery，一种常见的方式是在 html 中通过`<script>`标签引入jQuery，然后就可以使用全局变量`$`或`jQuery`了，但是在`ts`中,编辑器并不知道`$`或`jQuery`是什么东西，这时，我们需要使用`declare var`来定义它的类型

```ts
declare var jQuery: (selector: string) => any;

jQuery("#foo");
```

## 什么是声明文件

通常我们会把声明语句放到一个单独文件(`jQuery.d.ts`)中，这就是声明文件

:warning: 声明文件必须以 <span class="e-1">.d.ts</span> 为后缀

一般来说，typescript 会解析项目中所有的 `*.ts` 文件，当然也包含以 `.d.ts` 结尾的文件。所以当我们将 `jQuery.d.ts` 放到项目中时，其他所有 `*.ts` 文件就都可以获得 jQuery 的类型定义了

假如仍然无法解析，那么可以检查下 `tsconfig.json` 中的 `files`、`include` 和 `exclude` 配置，确保其包含了 `jQuery.d.ts` 文件。

### 第三方声明文件

一般第三方声明文件可以直接下载就使用，因为社区已经帮我们定义好了

推荐的使用方式是使用`@types`统一管理第三方库的声明文件

`@types` 的使用方式很简单，直接用 npm 安装对应的声明模块即可，以 jQuery 举例：

```shell
npm install @types/jquery --save-dev
```