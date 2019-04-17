import { takeEvery, call, put } from 'redux-saga/effects';
import server from '../server/index';
import { setStore } from '../utils/localStorage';

console.log('login', server);

const LOGIN_ACTION = { type: 'login/LOGIN_ACTION' };
const LOGIN_SUCCESS = { type: 'login/LOGIN_SUCCESS' };
const LOGIN_EXIT = { type: 'login/LOGIN_EXIT' };

const defaultState = {
  logined: false,
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

function* loginRequest() {
  console.log('sssdsdsdsdsd');
  const data = yield call(server.login.login);
  console.log('data', data);
  if (data.status === 200) {
    setStore('token', data.data.token);
    yield put({ type: LOGIN_SUCCESS.type });
  }
}

function* loginSaga() {
  yield takeEvery(LOGIN_ACTION.type, loginRequest);
}

export default {
  loginReducers,
  loginSaga,
};