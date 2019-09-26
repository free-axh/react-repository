/**
 * 总菜单
 * path 路由跳转路径
 * key 标识
 * component 跳转后对应单页面路径
 * common 是否有header和menu公共部分 false 无 true 有
 * name 单页面标题
 */
const routes = [
  { path: '/login', key: 'login', component: 'views/login/index', common: false, name: 'CLBS' },
  { path: '/home', key: 'home', component: 'views/home/index', common: true, name: '主页', code: 'home' },
  { path: '/demo/skinDemo', key: 'skinDemo', component: 'views/demo/skinDemo/index', common: true, name: '主题色', code: 'skinDemo' },
  { path: '/demo/localeDemo', key: 'localeDemo', component: 'views/demo/localeDemo/index', common: true, name: '多语言', code: 'localeDemo' },
  { path: '/', key: 'login', component: 'views/login/index', common: false, name: 'CLBS' },
];

export default routes;