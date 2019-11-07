/**
 * token 登录验证标识
 * expiration token过期时间
 * username 用户名
 * authorMenuList 用户全选菜单列表
 */

let dispacth = null;

/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  let thisContent = content;
  if (!name) return;
  if (typeof thisContent !== 'string') {
    thisContent = JSON.stringify(thisContent);
  }
  global.localStorage.setItem(name, thisContent);
};

/**
 * 获取localStorage
 */
export const getStore = (name) => {
  if (!name) {
    return false;
  }
  return global.localStorage.getItem(name);
};

/**
 * 删除localStorage
 */
export const removeStore = (name) => {
  if (!name) return;
  global.localStorage.removeItem(name);
};

/**
 * 保存dispatch
 */
export const saveDispatch = (dis) => {
  dispacth = dis;
};

/**
 * 返回dispatch
 */
export const getDispatch = () => dispacth;
