import { takeEvery, call, put } from 'redux-saga/effects';
import { message } from 'antd';
import server from '../server/index';
import { download } from '../common/download';
// 请求
const {
  terminalManagement: {
    // getOrganizationTree,
    getAdvancedSearch,
    getDownloadImportTemplate,
    downLoadDetectionErrorMsg,
    terminalDownloadList,
    importTemplate,
    importTemplateError,
    getAllServersData,
    edit,
    update,
    delate,
    detailSIM,
    detailSpecialUpdate,
    detailPosition,
    chargeDetail,
    chargePost,
    chargeUpdate,
    rechargeQuery,
    // 短信
    sendSmsMessage,
    readDeviceParam,
    checkDeviceisOnLine,
  },
} = server;

/* <========> constant <=======> */
// 存储点击列表数据
const SEND_SAVE_TABLE_SELECTION_DATA = { type: 'terminalManagement/SEND_SAVE_TABLE_SELECTION_DATA' };
// 存储勾选列表数据
const GET_TABLE_CHECK_DATA = { type: 'terminalManagement/GET_TABLE_CHECK_DATA' };
// 操作设置窗口状态
const SET_OPERATION_SETTING_MODAL_STATE = { type: 'terminalManagement/SET_OPERATION_SETTING_MODAL_STATE' };
// 列表查询+高级搜索+导入查询
const SEND_ADVANCED_SEARCH = { type: 'terminalManagement/SEND_ADVANCED_SEARCH' };
const GET_ADVANCED_SEARCH = { type: 'terminalManagement/GET_ADVANCED_SEARCH' };
// 下载终端管理查询模板
const SEND_DOWNLOADIMPORT_TEMPLATE = { type: 'terminalManagement/SEND_DOWNLOADIMPORT_TEMPLATE' };
const GET_DOWNLOADIMPORT_TEMPLATE = { type: 'terminalManagement/GET_DOWNLOADIMPORT_TEMPLATE' };
// 下载终端管理导入查询失败原因
const SEND_TERMINAL_SEARCH_ERR_TEMPLATE = { type: 'terminalManagement/SEND_TERMINAL_SEARCH_ERR_TEMPLATE' };
const GET_TERMINAL_SEARCH_ERR_TEMPLATE = { type: 'terminalManagement/GET_TERMINAL_SEARCH_ERR_TEMPLATE' };
// 导出终端列表
const SEND_TERMINAL_DOWNLOAD_LIST = { type: 'terminalManagement/SEND_TERMINAL_DOWNLOAD_LIST' };
const GET_TERMINAL_DOWNLOAD_LIST = { type: 'terminalManagement/GET_TERMINAL_DOWNLOAD_LIST' };
// 下载导入终端信息模板
const SEND_IMPORTANT_TEMPLATE = { type: 'terminalManagement/SEND_IMPORTANT_TEMPLATE' };
const GET_IMPORTANT_TEMPLATE = { type: 'terminalManagement/GET_IMPORTANT_TEMPLATE' };
// 下载导入终端错误信息
const SEND_IMPORTANT_TEMPLATE_ERROR = { type: 'terminalManagement/SEND_IMPORTANT_TEMPLATE_ERROR' };
const GET_IMPORTANT_TEMPLATE_ERROR = { type: 'terminalManagement/GET_IMPORTANT_TEMPLATE_ERROR' };
// 修改+批量修改
const SEND_EDIT = { type: 'terminalManagement/SEND_EDIT' };
const GET_EDIT = { type: 'terminalManagement/GET_EDIT' };
// 更新+批量更新
const SEND_UPDATE = { type: 'terminalManagement/SEND_UPDATE' };
const GET_UPDATE = { type: 'terminalManagement/GET_UPDATE' };
// 删除+批量删除
const SEND_DELATE = { type: 'terminalManagement/SEND_DELATE' };
const GET_DELATE = { type: 'terminalManagement/GET_DELATE' };
// 详情操作（包括sim卡信息）
const SEND_DETAILSIM = { type: 'terminalManagement/SEND_DETAILSIM' };
const GET_DETAILSIM = { type: 'terminalManagement/GET_DETAILSIM' };
// 详情页更新（sim卡号+余额+更新时间）
const SEND_DETAIL_SPECIAL_UPDATE = { type: 'terminalManagement/SEND_DETAIL_SPECIAL_UPDATE' };
const GET_DETAIL_SPECIAL_UPDATE = { type: 'terminalManagement/GET_DETAIL_SPECIAL_UPDATE' };
// 详情页面获取数据（定位信息）
const SEND_DETAIL_POSITION = { type: 'terminalManagement/SEND_DETAIL_POSITION' };
const GET_DETAIL_POSITION = { type: 'terminalManagement/GET_DETAIL_POSITION' };
// 充值详情
const SEND_CHARGE_DETAIL = { type: 'terminalManagement/SEND_CHARGE_DETAIL' };
const GET_CHARGE_DETAIL = { type: 'terminalManagement/GET_CHARGE_DETAIL' };
// 提交充值
const SEND_CHARGE_POST = { type: 'terminalManagement/SEND_CHARGE_POST' };
const GET_CHARGE_POST = { type: 'terminalManagement/GET_CHARGE_POST' };
// 充值页面更新
const SEND_CHARGE_UPDATE = { type: 'terminalManagement/SEND_CHARGE_UPDATE' };
const GET_CHARGE_UPDATE = { type: 'terminalManagement/GET_CHARGE_UPDATE' };
// 订单查询-->用户选择充值成功后，更新充值状态
const SEND_RECHARGE_QUERY = { type: 'terminalManagement/SEND_RECHARGE_QUERY' };
const GET_RECHARGE_QUERY = { type: 'terminalManagement/GET_RECHARGE_QUERY' };

// 改变组织id
const CHANGE_ORGANIZATIONID = { type: 'terminalManagement/CHANGE_ORGANIZATIONID' };
/**
 * 下发短信相关
 */
// 获取服务器数据
const GET_SERVERDATA_ACTION = { type: 'terminalManagement/GET_SERVERDATA_ACTION' };
const GET_SERVERDATA_SUCCESS = { type: 'terminalManagement/GET_SERVERDATA_SUCCESS' };
// 下发短信
const SEND_MESSAGE_ACTION = { type: 'terminalManagement/SEND_MESSAGE_ACTION' };
// 读取终端参数
const READ_DEVICEPARAM_ACTION = { type: 'terminalManagement/READ_DEVICEPARAM_ACTION' };

const defaultState = {
  tableSelectionData: {}, // table点击数据
  tableCheckData: [], // 列表勾选的数据
  operationSettingModalState: false, // 操作设置窗口状态
  advancedSearchData: {}, // 高级查询
  advancedSearchStatus: false, // 列表查询状态(true代表正在请求列表接口)
  serversData: [], // 服务器信息
  editStatus: {}, // 修改+批量修改后返回
  updateStatus: {}, // 更新+批量更新后返回
  delateStatus: {}, // 删除+批量删除后返回
  detailSIM: {}, // 详情操作返回
  detailSpecialUpdateData: {}, // 详情页更新（sim卡号+余额+更新时间）
  detailPositionStatus: {}, // 详情页面获取数据（定位信息）
  chargeDetail: {}, // 充值详情
  chargePost: {}, // 提交充值返回
  chargeUpdate: {}, // 充值页面更新
  organizationId: '', // 当前选择的组织id
  // 订单查询-->用户选择充值成功后，更新充值状态
};

/* <========> reducer <=======> */

const terminalManagementReducers = (state = defaultState, { type, payload }) => {
  Object.assign(state, { advancedSearchStatus: false });
  switch (type) {
    case SEND_SAVE_TABLE_SELECTION_DATA.type:
      return Object.assign({}, state, { tableSelectionData: payload });
    case GET_TABLE_CHECK_DATA.type:
      return Object.assign({}, state, { tableCheckData: payload });
    case SET_OPERATION_SETTING_MODAL_STATE.type:
      return Object.assign({}, state, { operationSettingModalState: payload });
    case GET_ADVANCED_SEARCH.type:
      return Object.assign({}, state,
        { advancedSearchData: payload.data, advancedSearchStatus: true });
    case GET_DOWNLOADIMPORT_TEMPLATE.type:
      return Object.assign({}, state);
    case GET_TERMINAL_SEARCH_ERR_TEMPLATE.type:
      return Object.assign({}, state);
    case GET_TERMINAL_DOWNLOAD_LIST.type:
      return Object.assign({}, state);
    case GET_IMPORTANT_TEMPLATE.type:
      return Object.assign({}, state);
    case GET_IMPORTANT_TEMPLATE_ERROR.type:
      return Object.assign({}, state);
    case GET_SERVERDATA_SUCCESS.type:
      return Object.assign({}, state, { serversData: payload });
    case GET_EDIT.type:
      return Object.assign({}, state, { editStatus: payload.data });
    case GET_UPDATE.type:
      return Object.assign({}, state, { updateStatus: payload.data });
    case GET_DELATE.type:
      return Object.assign({}, state, { delateStatus: payload.data });
    case GET_DETAILSIM.type:
      return Object.assign({}, state, { detailSIM: payload.data.data });
    case GET_DETAIL_SPECIAL_UPDATE.type:
      return Object.assign({}, state, { detailSpecialUpdateData: payload.data.data });
    case GET_DETAIL_POSITION.type:
      return Object.assign({}, state, { detailPositionStatus: payload.data });
    case GET_CHARGE_DETAIL.type:
      return Object.assign({}, state, { chargeDetail: payload.data });
    case GET_CHARGE_POST.type:
      return Object.assign({}, state, { chargePost: payload.data });
    case GET_CHARGE_UPDATE.type:
      return Object.assign({}, state, { chargeUpdate: payload.data });
    case GET_RECHARGE_QUERY.type:
      return Object.assign({}, state);
    case CHANGE_ORGANIZATIONID.type:// 改变组织id
      return Object.assign(defaultState, { organizationId: payload });
    default:
      return state;
  }
};

/* <========> 请求 <=======> */
// 高级查询
function* requestAdvancedSearch(data) {
  const { organizationId } = defaultState;
  const param = data.payload;
  param.organizationId = organizationId;
  const request = yield call(getAdvancedSearch, param);
  yield put({
    type: GET_ADVANCED_SEARCH.type,
    payload: request,
  });
}
// 下载终端管理查询模板
function* requestDownloadImportTemplate() {
  const res = yield call(getDownloadImportTemplate);
  download(res, '终端管理导入查询模板.xlsx');
}
// 下载终端管理导入查询失败原因
function* requestTerminalSearchErrTemplate() {
  const res = yield call(downLoadDetectionErrorMsg);
  download(res, '终端管理导入查询失败原因.xlsx');
}
// 导出终端列表
function* requestTerminalDownloadList(data) {
  const { param } = data;
  const res = yield call(terminalDownloadList, { ...param });
  download(res, '终端列表.xlsx');
}
// 下载导入终端信息模板
function* requestImportTemplate() {
  const res = yield call(importTemplate);
  download(res, '导入终端信息模板.xlsx');
}
// 下载导入终端错误信息
function* requestImportTemplateError() {
  const res = yield call(importTemplateError);
  download(res, '导入终端列表错误信息.xlsx');
}
// 修改+批量修改
function* requestEdit(data) {
  const request = yield call(edit, data.param);
  yield put({
    type: GET_EDIT.type,
    payload: request,
  });
  // 回调
  const callback = data.param.callBack;
  callback();
}
// 更新+批量更新
function* requestUpdate(data) {
  const request = yield call(update, data.param);
  yield put({
    type: GET_UPDATE.type,
    payload: request,
  });
  // 回调
  const callback = data.param.callBack;
  callback();
}
// 删除+批量删除
function* requestDelate(data) {
  const request = yield call(delate, data.param);
  yield put({
    type: GET_DELATE.type,
    payload: request,
  });
  // 回调
  const callback = data.param.callBack;
  callback();
}
// 详情操作（包括sim卡信息）
function* requestDetailSIM(data) {
  const request = yield call(detailSIM, data.param);
  console.log(data, '这');
  yield put({
    type: GET_DETAILSIM.type,
    payload: request,
  });
}
// 详情页更新（sim卡号+余额+更新时间）
function* requestDetailSpecialUpdate(data) {
  const request = yield call(detailSpecialUpdate, data.param);
  yield put({
    type: GET_DETAIL_SPECIAL_UPDATE.type,
    payload: request,
  });
  // // 回调
  // const callback = data.param.callBack;
  // callback();
}
// 详情页面获取数据（定位信息）
function* requestDetailPosition(data) {
  const request = yield call(detailPosition, data.param);
  yield put({
    type: GET_DETAIL_POSITION.type,
    payload: request,
  });
}
// 充值详情
function* requestChargeDetail(data) {
  const request = yield call(chargeDetail, data.param);
  yield put({
    type: GET_CHARGE_DETAIL.type,
    payload: request,
  });
}
// 提交充值
function* requestChargePost(data) {
  const request = yield call(chargePost, data.param);
  yield put({
    type: GET_CHARGE_POST.type,
    payload: request,
  });

  // 回调
  const callback = data.param.callBack;
  callback();
}
// 充值页面更新
function* requestChargeUpdate(data) {
  const request = yield call(chargeUpdate, data.param);
  yield put({
    type: GET_CHARGE_POST.type,
    payload: request,
  });

  // // 回调
  // const callback = data.param.callBack;
  // callback();
}
// 订单查询-->用户选择充值成功后，更新充值状态
function* requestRechargeQuery(data) {
  const request = yield call(rechargeQuery, data.param);
  yield put({
    type: GET_RECHARGE_QUERY.type,
    payload: request,
  });
}
/**
 * 下发短信模块
 */
// 获取服务器数据
function* getServerData() {
  const response = yield call(getAllServersData);
  if (response.status === 200 && response.data.code === 1) {
    yield put({
      type: GET_SERVERDATA_SUCCESS.type,
      payload: response.data.data,
    });
  }
}
// 下发短信
function* sendSmsMessageFun({ payload: { data, data: { internationalMobiles }, sendCallback } }) {
  if (internationalMobiles.indexOf(',') !== -1) { // 批量下发时不用校验终端是否在线
    const response = yield call(sendSmsMessage, data);
    if (response.status === 200 && response.data.code === 1) {
      message.success('参数已下发!');
      sendCallback();
    } else {
      message.warning('下发失败!');
    }
  } else {
    const res = yield call(checkDeviceisOnLine, { internationalMobile: internationalMobiles });
    if (res.status === 200 && res.data.data) {
      const response = yield call(sendSmsMessage, data);
      if (response.status === 200 && response.data.code === 1) {
        message.success('参数已下发!');
        sendCallback();
      } else {
        message.warning('下发失败!');
      }
    } else {
      message.warning('终端离线!');
    }
  }
}
// 读取终端参数
function* readParamFun({ payload, payload: { internationalMobile } }) {
  const res = yield call(checkDeviceisOnLine, { internationalMobile });
  if (res.status === 200 && res.data.data) {
    const response = yield call(readDeviceParam, payload);
    if (response.status === 200 && response.data.code === 1) {
      // message.success('读取终端参数成功!');
    } else {
      message.warning('读取终端参数失败!');
    }
  } else {
    message.warning('终端离线!');
  }
}


/* <========> saga <=======> */

function* terminalManagementSaga() {
  // 高级查询
  yield takeEvery(SEND_ADVANCED_SEARCH.type, requestAdvancedSearch);
  // 下载终端管理查询模板
  yield takeEvery(SEND_DOWNLOADIMPORT_TEMPLATE.type, requestDownloadImportTemplate);
  // 下载终端管理导入查询失败原因
  yield takeEvery(SEND_TERMINAL_SEARCH_ERR_TEMPLATE.type, requestTerminalSearchErrTemplate);
  // 导出终端列表
  yield takeEvery(SEND_TERMINAL_DOWNLOAD_LIST.type, requestTerminalDownloadList);
  // 下载导入终端信息模板
  yield takeEvery(SEND_IMPORTANT_TEMPLATE.type, requestImportTemplate);
  // 下载导入终端错误信息
  yield takeEvery(SEND_IMPORTANT_TEMPLATE_ERROR.type, requestImportTemplateError);
  // 修改+批量修改
  yield takeEvery(SEND_EDIT.type, requestEdit);
  // 更新+批量更新
  yield takeEvery(SEND_UPDATE.type, requestUpdate);
  // 删除+批量删除
  yield takeEvery(SEND_DELATE.type, requestDelate);
  // 详情操作（包括sim卡信息）
  yield takeEvery(SEND_DETAILSIM.type, requestDetailSIM);
  // 详情页更新（sim卡号+余额+更新时间）
  yield takeEvery(SEND_DETAIL_SPECIAL_UPDATE.type, requestDetailSpecialUpdate);
  // 详情页面获取数据（定位信息）
  yield takeEvery(SEND_DETAIL_POSITION.type, requestDetailPosition);
  // 充值详情
  yield takeEvery(SEND_CHARGE_DETAIL.type, requestChargeDetail);
  // 提交充值
  yield takeEvery(SEND_CHARGE_POST.type, requestChargePost);
  // 充值页面更新
  yield takeEvery(SEND_CHARGE_UPDATE.type, requestChargeUpdate);
  // 订单查询-->用户选择充值成功后，更新充值状态
  yield takeEvery(SEND_RECHARGE_QUERY.type, requestRechargeQuery);

  /**
   * 下发短信模块
   */
  // 获取服务器信息
  yield takeEvery(GET_SERVERDATA_ACTION.type, getServerData);
  // 下发短信
  yield takeEvery(SEND_MESSAGE_ACTION.type, sendSmsMessageFun);
  // 读取终端参数
  yield takeEvery(READ_DEVICEPARAM_ACTION.type, readParamFun);
}

export default {
  terminalManagementReducers,
  terminalManagementSaga,
};