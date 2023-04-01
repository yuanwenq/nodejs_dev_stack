module.exports = {
  base: '/nodejs_dev_stack/',
  title: '《Nodejs技术栈》',
  theme: 'reco',
  themeConfig: {
    subSidebar: 'auto',
    // 右上角导航
    nav: [],
    // 侧边栏
    sidebar: [
      {
        title: '基础',
        path: '/base/',
        collapsable: false,
        sidebarDepth: 1, // 可选的, 默认值是 1
        children: [
          {
            title: 'Buffer缓冲区',
            path: '/base/buffer',
          },
        ],
      },
    ],
  },
};
