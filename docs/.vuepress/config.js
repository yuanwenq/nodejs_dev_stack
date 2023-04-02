module.exports = {
  base: '/nodejs_dev_stack/',
  title: '《Nodejs技术栈》',
  theme: 'reco',
  themeConfig: {
    // 密钥
    // keyPage: {
    //   keys: ['e10adc3949ba59abbe56e057f20f883e'], // 1.3.0 版本后需要设置为密文
    //   color: '#42b983', // 登录页动画球的颜色
    //   lineColor: '#42b983', // 登录页动画线的颜色
    //   absoluteEncryption: true,
    // },
    subSidebar: 'auto',
    // 右上角导航
    nav: [],
    // 侧边栏
    sidebar: [
      {
        title: 'Introduction',
        collapsable: false,
        children: [
          {
            title: '简介',
            path: '/introduction/',
          },
        ],
      },
      {
        title: 'Typescript',
        // path: '/base/',
        // collapsable: false,
        children: [
          {
            title: '简介',
            path: '/typescript/introduction',
          },
          {
            title: '安装',
            path: '/typescript/typescript_env',
          },
          {
            title: '基础概念',
            path: '/typescript/concept',
          },
          {
            title: '接口',
            path: '/typescript/interface',
          },
          {
            title: '数组的类型',
            path: '/typescript/array',
          },
          {
            title: '函数的类型',
            path: '/typescript/func',
          },
          {
            title: '类型断言',
            path: '/typescript/assert',
          },
          {
            title: '声明文件',
            path: '/typescript/declare',
          },
        ],
      },
      {
        title: '基础模块',
        // path: '/base/',
        collapsable: false,
        children: [
          {
            title: 'Buffer缓冲区',
            path: '/base/buffer',
          },
        ],
      },
    ],
  },
  markdown: {
    lineNumbers: true,
  },
};
