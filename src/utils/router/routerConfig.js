const routes = [
  { path: '/login', key: 'login', component: 'views/login/index', common: false, title: 'CLBS' },
  { path: '/home', key: 'home', component: 'views/home/index', common: true, title: '主页' },
  // { path: '/demo', key: 'demo', component: 'views/demo/index', common: true },
  { path: '/demo/skinDemo', key: 'skinDemo', component: 'views/demo/skinDemo/index', common: true, title: '主题色' },
  { path: '/demo/localeDemo', key: 'localeDemo', component: 'views/demo/localeDemo/index', common: true, title: '多语言' },
  { path: '/', key: 'login', component: 'views/login/index', common: false, title: 'CLBS' },
];

export default routes;