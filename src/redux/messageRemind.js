import { takeEvery, call, put } from 'redux-saga/effects';
import { message } from 'antd';
import server from '../server/index';

const {
  messageRemind: { getMessageRemindData },
} = server;

const MSGDATA_ACTION = { type: 'message/MSGDATA_ACTION' };
const GET_MSGDATA_ACTION = { type: 'message/GET_MSGDATA_ACTION' };

const defaultState = {
  messageRemindData: null, // 消息提醒数据
};

const messageRemindReducers = (state = defaultState, { type, payload }) => {
  let newData = null;
  switch (type) {
    case GET_MSGDATA_ACTION.type:
      if (payload.status === 200 && payload.data.code === 1) {
        newData = payload.data.data;
      } else {
        message.warning('获取消息提醒数量失败!');
      }
      return Object.assign({}, state,
        {
          messageRemindData: newData,
        });
    default:
      return Object.assign({}, state);
  }
};

// 获取消息提醒数据
function* getMessageRemindDataRequest() {
  const response = yield call(getMessageRemindData);
  yield put({ type: GET_MSGDATA_ACTION.type, payload: response });
}

function* messageRemindSaga() {
  yield takeEvery(MSGDATA_ACTION.type, getMessageRemindDataRequest);
}

export default {
  messageRemindReducers,
  messageRemindSaga,
};