// import { getStore } from './localStorage';

const defaultConfig = [
  { title: '主页', path: '/home', key: 'home', icon: 'user' },
  { title: 'demo',
    path: '/demo',
    key: 'demo',
    icon: 'user',
    options: [
      { title: '主题色', path: '/demo', key: 'demo' },
    ] },
];

/**
 * 根据用户权限获取菜单
 */

export const getMenuList = () => defaultConfig;
