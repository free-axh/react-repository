/**
 * 总菜单
 * path 路由跳转路径
 * key 标识
 * component 跳转后对应单页面路径
 * common 是否有header和menu公共部分 false 无 true 有
 * name 单页面标题
 */
const routes = [
  { path: '/demo/tableDemo', key: 'tableDemo', component: 'views/demo/tableDemo/index', common: true, name: 'table' },
  { path: '/organizationAndUser', key: 'organizationAndUser', component: 'views/organizationAndUser/index', common: true, name: '组织与用户管理', code: 'UserList' },
  { path: '/login', key: 'login', component: 'views/login/index', common: false, name: 'CLBS' },
  { path: '/home', key: 'home', component: 'views/home/index', common: true, name: '工作台', code: 'home' },
  { path: '/demo/skinDemo', key: 'skinDemo', component: 'views/demo/skinDemo/index', common: true, name: '主题色', code: 'skinDemo' },
  { path: '/demo/localeDemo', key: 'localeDemo', component: 'views/demo/localeDemo/index', common: true, name: '多语言', code: 'localeDemo' },
  { path: '/logs', key: 'logs', component: 'views/logs/index', common: true, name: '日志查询', code: 'LogList' },
  { path: '/rechargeSearch', key: 'rechargeSearch', component: 'views/rechargeSearch/index', common: true, name: '充值查询', code: 'RechargeQueryList' },
  { path: '/terminalDetect', key: 'terminalDetect', component: 'views/terminalDetect/index', common: true, name: '终端检测', code: 'DeviceList' },
  { path: '/terminalManagement', key: 'terminalManagement', component: 'views/terminalManagement/index', common: true, name: '终端管理', code: 'DeviceManagementList' }, // 终端管理路由配置
  { path: '/404', key: '404', component: 'views/error/page404', common: true, name: '404' },
  { path: '/' },
];

export default routes;