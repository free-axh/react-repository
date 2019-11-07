import { takeEvery, call, put } from 'redux-saga/effects';
import server from '../server/index';

const {
  organizationAndUser: {
    getGroupTree, getUserDataList,
    addUser, editUser, deleteUser,
    getUserRoles, updateUserRoles,
  },
} = server;

// 获取组织树节点数据
const TREEDATA_ACTION = { type: 'usertree/TREEDATA_ACTION' };
const GET_TREEDATA_ACTION = { type: 'usertree/GET_TREEDATA_ACTION' };

// 获取当前用户可分配角色
const ROLEDATA_ACTION = { type: 'user/ROLEDATA_ACTION' };
const GET_ROLEDATA_ACTION = { type: 'user/GET_ROLEDATA_ACTION' };

// 给用户分配角色
const UPDATE_USERROLE_ACTION = { type: 'user/UPDATE_USERROLE_ACTION' };
const GET_UPDATE_USERROLE_ACTION = { type: 'user/GET_UPDATE_USERROLE_ACTION' };

// 获取用户列表
const USERDATA_ACTION = { type: 'user/USERDATA_ACTION' };
const GET_USERDATA_SUCCESS = { type: 'user/GET_USERDATA_SUCCESS' };

// 新增用户
const ADD_USER_ACTION = { type: 'user/ADD_USER_ACTION' };
const GET_ADD_USER_ACTION = { type: 'user/GET_ADD_USER_ACTION' };

// 修改用户
const EDIT_USER_ACTION = { type: 'user/EDIT_USER_ACTION' };
const GET_EDIT_USER_ACTION = { type: 'user/GET_EDIT_USER_ACTION' };

// 删除用户
const DELETE_USER_ACTION = { type: 'user/DELETE_USER_ACTION' };
const GET_DELETE_USER_ACTION = { type: 'user/GET_DELETE_USER_ACTION' };

// 列表选中行改变
const CHANGE_SELECTROW_ACTION = { type: 'user/CHANGE_SELECTROW_ACTION' };

// 显示抽屉改变
const CHANGE_VISIBLEkEY_ACTION = { type: 'user/CHANGE_VISIBLEkEY_ACTION' };

const defaultState = {
  allTreeData: [], // 组织树全部节点数据
  currentUserRoles: [], // 当前用户可分配角色
  selectRowData: {}, // 用户列表当前选中行数据
  visibleKey: null, // 当前显示抽屉(新增:'addUser',修改:'editUser',详情:'userDetail',分配角色:'assignRoles')
  handleType: null, //  操作类型
  handleBackData: null, // 操作返回值
};

const organizationAndUserReducers = (state = defaultState, { type, payload }) => {
  let handleType = null;
  let newData = [];
  let { selectRowData } = state;
  switch (type) {
    case GET_TREEDATA_ACTION.type:
      handleType = '获取组织树节点数据';
      if (payload.status === 200 && payload.data.code === 1) {
        newData = payload.data.data;
      }
      return Object.assign({}, state,
        {
          allTreeData: newData,
          handleBackData: payload,
          handleType,
        });
    case GET_USERDATA_SUCCESS.type:
      handleType = '获取用户列表数据';
      return Object.assign({}, state,
        {
          handleType,
          handleBackData: payload,
          visibleKey: null,
          selectRowData: {},
        });
    case CHANGE_SELECTROW_ACTION.type:
      return Object.assign({}, state, { selectRowData: payload || {}, handleType });
    case CHANGE_VISIBLEkEY_ACTION.type:
      if (payload !== 'editUser' && payload !== 'assignRoles' && payload !== 'userDetail') { // 关闭弹窗时清除选中行数据
        selectRowData = {};
      }
      return Object.assign({}, state, { visibleKey: payload || null, handleType, selectRowData });
    case GET_ADD_USER_ACTION.type:
      handleType = '新增用户';
      return Object.assign({}, state, { handleBackData: payload, handleType });
    case GET_EDIT_USER_ACTION.type:
      handleType = '修改用户';
      return Object.assign({}, state, { handleBackData: payload, handleType });
    case GET_DELETE_USER_ACTION.type:
      handleType = '删除用户';
      return Object.assign({}, state, { handleBackData: payload, handleType });
    case GET_ROLEDATA_ACTION.type:
      handleType = '获取用户可分配角色';
      if (payload.status === 200 && payload.data.code === 1) {
        newData = payload.data.data;
      }
      return Object.assign({}, state,
        { currentUserRoles: newData, handleBackData: payload, handleType });
    case GET_UPDATE_USERROLE_ACTION.type:
      handleType = '分配角色';
      return Object.assign({}, state, { handleBackData: payload, handleType });
    default:
      return Object.assign({}, state, { handleType });
  }
};

// 获取组织树节点数据
function* getTreeDataRequest(payload) {
  const request = yield call(getGroupTree, payload.data);
  yield put({ type: GET_TREEDATA_ACTION.type, payload: request });
}

// 获取当前用户可分配角色
function* getUserRolesRequest() {
  const request = yield call(getUserRoles);
  yield put({ type: GET_ROLEDATA_ACTION.type, payload: request });
}

// 为用户分配角色
function* updateUserRolesRequest(payload) {
  const request = yield call(updateUserRoles, payload.payload);
  yield put({ type: GET_UPDATE_USERROLE_ACTION.type, payload: request });
}

// 获取用户列表方法
function* getUserDataRequest(payload) {
  const request = yield call(getUserDataList, payload.data);
  yield put({ type: GET_USERDATA_SUCCESS.type, payload: request });
}

// 新增用户方法
function* addUserRequest(payload) {
  const request = yield call(addUser, payload.payload);
  yield put({ type: GET_ADD_USER_ACTION.type, payload: request });
}

// 修改用户方法
function* editUserRequest(payload) {
  const request = yield call(editUser, payload.payload);
  yield put({ type: GET_EDIT_USER_ACTION.type, payload: request });
}

// 删除用户方法
function* deleteUserRequest(payload) {
  const request = yield call(deleteUser, payload.payload);
  yield put({ type: GET_DELETE_USER_ACTION.type, payload: request });
}

function* organizationAndUserSaga() {
  // 获取组织树节点数据
  yield takeEvery(TREEDATA_ACTION.type, getTreeDataRequest);
  // 获取当前用户可分配角色
  yield takeEvery(ROLEDATA_ACTION.type, getUserRolesRequest);
  // 为用户分配角色
  yield takeEvery(UPDATE_USERROLE_ACTION.type, updateUserRolesRequest);
  // 用户列表及相关操作
  yield takeEvery(USERDATA_ACTION.type, getUserDataRequest);
  yield takeEvery(ADD_USER_ACTION.type, addUserRequest);
  yield takeEvery(EDIT_USER_ACTION.type, editUserRequest);
  yield takeEvery(DELETE_USER_ACTION.type, deleteUserRequest);
}

export default {
  organizationAndUserReducers,
  organizationAndUserSaga,
};