// import { getStore } from './localStorage';

const defaultConfig = [
  { title: '主页', router: '/home', key: 'home' },
  { title: 'demo', router: '/demo', key: 'demo' },
];

/**
 * 根据用户权限获取菜单
 */

export const getMenuList = () => defaultConfig;
