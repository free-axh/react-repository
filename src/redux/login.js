import { takeEvery, call, put } from 'redux-saga/effects';
import server from '../server/index';
import { setStore } from '../utils/localStorage';
import { encrypt } from '../utils/crypto';

const LOGIN_ACTION = { type: 'login/LOGIN_ACTION' };
const LOGIN_SUCCESS = { type: 'login/LOGIN_SUCCESS' };
const LOGIN_EXIT = { type: 'login/LOGIN_EXIT' };

const defaultState = {
  logined: false,
  // basicData: null,
};

const loginReducers = (state = defaultState, { type }) => {
  switch (type) {
    case LOGIN_SUCCESS.type:
      return Object.assign({}, state, { logined: true });
    case LOGIN_EXIT.type:
      return Object.assign({}, state, { logined: false });
    default:
      return state;
  }
};

function* loginRequest(payload) {
  const { data } = payload;
  const params = {
    username: data.username,
    password: encrypt(data.password),
    client_id: 'mobile_1',
    client_secret: 'secret_1',
    grant_type: 'password',
    scope: 'read',
  };
  const res = yield call(server.login.login, params);
  if (res.status === 200) {
    /**
     * 保存token到缓存
     */
    setStore('token', res.data.value);
    /**
     * 保存token过期时间到缓存
     */
    const date = res.data.expiration;
    const time = new Date(date.replace(/-/g, '/')).getTime();
    setStore('expiration', time);
    const basic = yield call(server.login.getUserBasic);
    if (basic.status === 200) {
      setStore('basic', basic.data.data.menuTree);
      setStore('username', basic.data.data.username);
      yield put({ type: LOGIN_SUCCESS.type });
    }
  }
}

function* loginSaga() {
  yield takeEvery(LOGIN_ACTION.type, loginRequest);
}

export default {
  loginReducers,
  loginSaga,
};