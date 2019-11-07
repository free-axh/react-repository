const SWITCH_LOCALEN = { type: 'root/SWITCH_LOCALEN' };
const CHANGE_COMMON = { type: 'root/CHANGE_COMMON' };
const LOADING_STATE = { type: 'root/LOADING_STATE' };
const MENU_COLLAPSED_STATE = { type: 'root/MENU_COLLAPSED_STATE' };
const MENU_ACTIVE_CODE = { type: 'root/MENU_ACTIVE_CODE' };
const TABLES_ROUTER_WAY = { type: 'root/TABLES_ROUTER_WAY' };
const MENU_ROUTER_WAY = { type: 'root/MENU_ROUTER_WAY' };

const defaultState = {
  currLocale: 'zh',
  common: false,
  loadingState: false,
  collapsed: false, // 菜单收缩状态
  activePathCode: null, // menu点击菜单code值
  isTablesWay: false, // 是否是点击tabls方式切换页面
  special: 'admin', // 特殊权限用户
};

const rootReducers = (state = defaultState, { type, payload }) => {
  switch (type) {
    case SWITCH_LOCALEN.type:
      return Object.assign({}, state, { currLocale: payload });
    case CHANGE_COMMON.type:
      return Object.assign({}, state, { common: payload });
    case LOADING_STATE.type:
      return Object.assign({}, state, { loadingState: payload });
    case MENU_COLLAPSED_STATE.type:
      return Object.assign({}, state, { collapsed: !state.collapsed });
    case MENU_ACTIVE_CODE.type:
      return Object.assign({}, state, { activePathCode: payload });
    case TABLES_ROUTER_WAY.type:
      return Object.assign({}, state, { isTablesWay: true });
    case MENU_ROUTER_WAY.type:
      return Object.assign({}, state, { isTablesWay: false });
    default:
      return state;
  }
};

export default {
  rootReducers,
};