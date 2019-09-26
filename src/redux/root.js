const SWITCH_LOCALEN = { type: 'root/SWITCH_LOCALEN' };
const CHANGE_COMMON = { type: 'root/CHANGE_COMMON' };
const LOADING_STATE = { type: 'root/LOADING_STATE' };
const MENU_COLLAPSED_STATE = { type: 'root/MENU_COLLAPSED_STATE' };

const defaultState = {
  currLocale: 'zh',
  common: 'false',
  loadingState: false,
  collapsed: false, // 菜单收缩状态
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
    default:
      return state;
  }
};

export default {
  rootReducers,
};