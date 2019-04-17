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
