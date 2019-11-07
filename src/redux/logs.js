import {
  takeEvery,
  call,
  put,
} from 'redux-saga/effects';
import server from '../server/index';
import { download } from '../common/download';

const {
  logs,
} = server;

// 获取日志查询列表
const GET_LOGLIST_ACTION = { type: 'logs/GET_LOGLIST_ACTION' };
const GET_LOGLIST_SUCCESS = { type: 'logs/GET_LOGLIST_SUCCESS' };
const GET_LOGLIST_FAILED = { type: 'logs/GET_LOGLIST_FAILED' };
// 导出
const LIST_EXPORT_ACTION = { type: 'logs/LIST_EXPORT_ACTION' };
// const LIST_EXPORT_SUCCESS = { type: 'logs/LIST_EXPORT_SUCCESS' };
// const lIST_EXPORT_FAILED = { type: 'logs/lIST_EXPORT_FAILED' };

const defaultState = {
  logLists: {}, // 日志查询数据
  logsStatus: null,
  exportStatus: null,
};

const logsReducers = (state = defaultState, actions) => {
  let newState = null;

  switch (actions.type) {
    // 获取查询日志列表
    case GET_LOGLIST_SUCCESS.type:
      newState = {
        ...state,
        logLists: actions.datas,
        logsStatus: 'success',
      };
      return newState;
    case GET_LOGLIST_FAILED.type:
      newState = {
        ...state,
        logsStatus: 'failed',
      };
      return newState;
      // 导出
    // case LIST_EXPORT_SUCCESS.type:
    //   newState = {
    //     ...state,
    //     exportStatus: actions.datas,
    //   };
    //   return newState;
    default:
      return state;
  }
};

// 获取日志列表
function* getLogsListsFun(payload) {
  const result = yield call(logs.getLogLists, payload.data);

  if (!result) {
    return;
  }

  // console.log('日志列表', result);
  if (result.status === 200) {
    const {
      data,
    } = result;
    const payloads = {
      dataSource: data.records,
      totalPages: data.totalPages,
      totalRecords: data.totalRecords,
    };
    yield put({ type: GET_LOGLIST_SUCCESS.type, datas: payloads });
  } else {
    yield put({ type: GET_LOGLIST_FAILED.type });
  }
}

// 报表导出
function* listExport(payload) {
  // console.log('日志查询', payload.data);
  const result = yield call(logs.epxort, payload.data);

  if (!result) {
    return;
  }

  if (result.status === 200) {
    download(result, '日志查询.xlsx');
  }
}

function* logsSaga() {
  yield takeEvery(GET_LOGLIST_ACTION.type, getLogsListsFun);// 获取日志查询列表
  yield takeEvery(LIST_EXPORT_ACTION.type, listExport);// 日志报表导出
}

export default {
  logsReducers,
  logsSaga,
};