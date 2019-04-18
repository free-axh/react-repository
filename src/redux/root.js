const SWITCH_LOCALEN = { type: 'root/SWITCH_LOCALEN' };
const CHANGE_COMMON = { type: 'root/CHANGE_COMMON' };

const defaultState = {
  currLocale: 'zh',
  common: 'false',
};

const rootReducers = (state = defaultState, { type, payload }) => {
  switch (type) {
    case SWITCH_LOCALEN.type:
      return Object.assign({}, state, { currLocale: payload });
    case CHANGE_COMMON.type:
      return Object.assign({}, state, { common: payload });
    default:
      return state;
  }
};

export default {
  rootReducers,
};