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
        title: '业务',
        collapsable: false,
        children: [
          {
            title: '信息加密',
            path: '/business/encryption',
          },
          {
            title: 'Telegram交互',
            path: '/business/telegram_push',
          },
        ],
      },
      {
        title: '基础模块',
        collapsable: false,
        children: [
          {
            title: 'Buffer缓冲区',
            path: '/base/buffer',
          },
        ],
      },
      {
        title: 'Nest.js',
        collapsable: false,
        children: [
          {
            title: 'Introduce',
            path: '/nest/introduce',
          },
          {
            title: '环境变量',
            path: '/nest/config',
          },
          {
            title: 'TypeORM',
            path: '/nest/orm',
          },
          {
            title: '装饰器',
            path: '/nest/decorator',
          },
          {
            title: '守卫',
            path: '/nest/guards',
          },
          {
            title: '拦截器',
            path: '/nest/interceptor',
          },
          {
            title: 'JWT鉴权',
            path: '/nest/jwt_auth',
          },
          {
            title: '权限/CASL',
            path: '/nest/casl_auth',
          },
          {
            title: 'swagger接口文档',
            path: '/nest/swagger',
          },
          {
            title: 'winston日志',
            path: '/nest/winston_log',
          },
          {
            title: 'redis配置',
            path: '/nest/redis',
          },
        ],
      },
      {
        title: '数据库',
        collapsable: false,
        children: [
          {
            title: '实体关系图(ERD)',
            path: '/database/ERD',
          },
        ],
      },
    ],
  },
  markdown: {
    lineNumbers: true,
  },
};
