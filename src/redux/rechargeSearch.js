import {
  takeEvery,
  call,
  put,
} from 'redux-saga/effects';
import server from '../server/index';
import { download } from '../common/download';

const {
  rechargeSearch,
} = server;

// 获取日志查询列表
const GET_LIST_ACTION = { type: 'rechargeSearch/GET_LIST_ACTION' };
const GET_LIST_SUCCESS = { type: 'rechargeSearch/GET_LIST_SUCCESS' };
const GET_LIST_FAILED = { type: 'rechargeSearch/GET_LIST_FAILED' };

// 导出
const LIST_EXPORT_ACTION = { type: 'rechargeSearch/LIST_EXPORT_ACTION' };

// 更新
const UPDATE_LIST_ACTION = { type: 'rechargeSearch/UPDATE_LIST_ACTION' };
const UPDATE_LIST_SUCCESS = { type: 'rechargeSearch/UPDATE_LIST_SUCCESS' };
const UPDATE_LIST_FAILED = { type: 'rechargeSearch/UPDATE_LIST_FAILED' };

const defaultState = {
  lists: {}, // 日志查询数据
  listStatus: null,
  updateStatus: null,
};

const rechargeSearchReducers = (state = defaultState, actions) => {
  let newState = null;

  switch (actions.type) {
    // 获取查询日志列表
    case GET_LIST_SUCCESS.type:
      newState = {
        ...state,
        lists: actions.datas,
        listStatus: 'success',
        updateStatus: null,
      };
      return newState;
    case GET_LIST_FAILED.type:
      newState = {
        ...state,
        listStatus: 'failed',
        updateStatus: null,
      };
      return newState;
      // 更新报表
    case UPDATE_LIST_SUCCESS.type:
      newState = {
        ...state,
        updateStatus: 'success',
        listStatus: null,
      };
      return newState;
    case UPDATE_LIST_FAILED.type:
      newState = {
        ...state,
        updateStatus: 'failed',
        listStatus: null,
      };
      return newState;
    default:
      return state;
  }
};

// 获取组织树节点数据
function* getListsFun(payload) {
  const result = yield call(rechargeSearch.getRechargeList, payload.data);
  // console.log('充值 查询列表', result);

  if (!result) {
    return;
  }

  if (result.status === 200) {
    const {
      data,
    } = result;
    const payloads = {
      dataSource: data.records,
      totalRecords: data.totalRecords,
    };
    yield put({ type: GET_LIST_SUCCESS.type, datas: payloads });
  } else {
    yield put({ type: GET_LIST_FAILED.type });
  }
}

// 报表导出
function* listExport(payload) {
  const result = yield call(rechargeSearch.epxort, payload.data);

  if (!result) {
    return;
  }

  download(result, '充值查询.xlsx');
}

// 报表更新
function* updateList(payload) {
  const result = yield call(rechargeSearch.upDateRechargeList, payload.data);

  if (!result) {
    return;
  }

  if (result.data.code === 1) {
    yield put({ type: UPDATE_LIST_SUCCESS.type });
  } else {
    yield put({ type: UPDATE_LIST_FAILED.type });
  }
}

function* rechargeSearchSaga() {
  yield takeEvery(GET_LIST_ACTION.type, getListsFun);// 获取日志查询列表
  yield takeEvery(LIST_EXPORT_ACTION.type, listExport);// 报表导出
  yield takeEvery(UPDATE_LIST_ACTION.type, updateList);// 报表更新
}

export default {
  rechargeSearchReducers,
  rechargeSearchSaga,
};