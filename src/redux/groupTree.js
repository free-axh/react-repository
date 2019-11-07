import { takeEvery, call, put } from 'redux-saga/effects';
import server from '../server/index';

const {
  groupTree: {
    getGroupTree, getTreeDataById, addGroup,
    editGroup, insertGroup, deleteGroup,
    groupHasUser,
  },
} = server;

// 获取组织树节点数据
const TREEDATA_ACTION = { type: 'tree/TREEDATA_ACTION' };
const GET_TREEDATA_ACTION = { type: 'tree/GET_TREEDATA_ACTION' };

// 选中的组织ID改变
const CHANGE_TREEID_ACTION = { type: 'tree/CHANGE_TREEID_ACTION' };

// 显示抽屉改变
const CHANGE_VISIBLEkEY_ACTION = { type: 'tree/CHANGE_VISIBLEkEY_ACTION' };

// 新增组织
const ADD_TREE_ACTION = { type: 'tree/ADD_TREE_ACTION' };
const GET_ADD_TREE_ACTION = { type: 'tree/GET_ADD_TREE_ACTION' };

// 修改组织
const EDIT_TREE_ACTION = { type: 'tree/EDIT_TREE_ACTION' };
const GET_EDIT_TREE_ACTION = { type: 'tree/GET_EDIT_TREE_ACTION' };

// 组织详情
const DETAIL_TREE_ACTION = { type: 'tree/DETAIL_TREE_ACTION' };
const GET_DETAIL_TREE_ACTION = { type: 'tree/GET_DETAIL_TREE_ACTION' };

// 插入组织
const INSERT_TREE_ACTION = { type: 'tree/INSERT_TREE_ACTION' };
const GET_INSERT_TREE_ACTION = { type: 'tree/GET_INSERT_TREE_ACTION' };

// 删除组织
const DELETE_TREE_ACTION = { type: 'tree/DELETE_TREE_ACTION' };
const GET_DELETE_TREE_ACTION = { type: 'tree/GET_DELETE_TREE_ACTION' };

// 判断组织是否可删除
const GROUP_HASUSER_ACTION = { type: 'tree/GROUP_HASUSER_ACTION' };


const defaultState = {
  treeData: [], // 组织树节点数据
  visibleKey: null, // 当前显示抽屉(新增:'add',修改:'edit',详情:'detail',插入:'insert')
  slectTreeId: null, // 选中的组织id
  slectTreeData: null, // 选中的组织详细信息
  handleType: null, //  操作类型
  handleBackData: null, // 操作返回值
};

const groupTreeReducers = (state = defaultState, { type, payload }) => {
  let handleType = null;
  let newTreeData = [];
  let newSlectTreeData = [];
  switch (type) {
    case GET_TREEDATA_ACTION.type:
      if (payload.status === 200 && payload.data.code === 1) {
        newTreeData = payload.data.data;
      }
      return Object.assign({}, state,
        {
          treeData: newTreeData,
          handleBackData: payload,
          handleType,
        });
    case CHANGE_TREEID_ACTION.type:
      return Object.assign({}, state, { slectTreeId: payload.id, handleType });
    case CHANGE_VISIBLEkEY_ACTION.type:
      return Object.assign({}, state, { visibleKey: payload || null, handleType });
    case GET_ADD_TREE_ACTION.type:
      handleType = '新增组织';
      return Object.assign({}, state, { handleBackData: payload, handleType });
    case GET_EDIT_TREE_ACTION.type:
      handleType = '修改组织';
      return Object.assign({}, state, { handleBackData: payload, handleType });
    case GET_DETAIL_TREE_ACTION.type:
      if (payload.status === 200 && payload.data.code === 1) {
        newSlectTreeData = payload.data.data;
      }
      return Object.assign({}, state,
        { handleBackData: payload, slectTreeData: newSlectTreeData, handleType });
    case GET_INSERT_TREE_ACTION.type:
      handleType = '插入组织';
      return Object.assign({}, state, { handleBackData: payload, handleType });
    case GET_DELETE_TREE_ACTION.type:
      handleType = '删除组织';
      return Object.assign({}, state, { handleBackData: payload, handleType });
    case GROUP_HASUSER_ACTION.type:
      handleType = '判断组织是否可删除';
      return Object.assign({}, state, { handleBackData: payload, handleType });

    default:
      return Object.assign({}, state, { handleType });
  }
};

// 获取组织树节点数据
function* getTreeDataRequest(payload) {
  const response = yield call(getGroupTree, payload.data);
  yield put({ type: GET_TREEDATA_ACTION.type, payload: response });
}
// 新增组织
function* addTreeDataRequest({ payload }) {
  const response = yield call(addGroup, payload);
  yield put({ type: GET_ADD_TREE_ACTION.type, payload: response });
}

// 修改组织
function* editTreeDataRequest({ payload }) {
  const response = yield call(editGroup, payload);
  yield put({ type: GET_EDIT_TREE_ACTION.type, payload: response });
}

// 获取组织详情
function* detailTreeDataRequest({ payload }) {
  const response = yield call(getTreeDataById, payload);
  yield put({ type: GET_DETAIL_TREE_ACTION.type, payload: response });
}

// 插入组织
function* insertTreeDataRequest({ payload }) {
  const response = yield call(insertGroup, payload);
  yield put({ type: GET_INSERT_TREE_ACTION.type, payload: response });
}

// 删除组织
function* deleteTreeDataRequest({ payload }) {
  const res = yield call(groupHasUser, payload);
  // 判断组织下是否有用户(有则不能删除)
  if (res.status === 200 && !res.data.data) {
    const response = yield call(deleteGroup, payload);
    yield put({ type: GET_DELETE_TREE_ACTION.type, payload: response });
  } else {
    yield put({ type: GROUP_HASUSER_ACTION.type, payload: res });
  }
}

function* groupTreeSaga() {
  // 获取组织树节点数据
  yield takeEvery(TREEDATA_ACTION.type, getTreeDataRequest);
  // 新增组织
  yield takeEvery(ADD_TREE_ACTION.type, addTreeDataRequest);
  // 修改组织
  yield takeEvery(EDIT_TREE_ACTION.type, editTreeDataRequest);
  // 组织详情
  yield takeEvery(DETAIL_TREE_ACTION.type, detailTreeDataRequest);
  // 插入组织
  yield takeEvery(INSERT_TREE_ACTION.type, insertTreeDataRequest);
  // 删除组织
  yield takeEvery(DELETE_TREE_ACTION.type, deleteTreeDataRequest);
}

export default {
  groupTreeReducers,
  groupTreeSaga,
};