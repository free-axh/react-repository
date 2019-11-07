import { takeEvery, call, put } from 'redux-saga/effects';
import { message } from 'antd';
import server from '../server/index';
import { download } from '../common/download';
// import { setStore } from '../utils/localStorage';
const GET_DETECTION_TABLE_DATA = { type: 'terminaDetect/GET_DETECTION_TABLE_DATA' }; // 获取终端检测的检测列表数据
const DETECTION_TABLE_SELECTION_DATA = { type: 'terminaDetect/DETECTION_TABLE_SELECTION_DATA' }; // 检测列表勾选数据
const TABLE_SELECTION_DATA_EXPORT = { type: 'terminaDetect/DETECTION_TABLE_SELECTION_DATA_EXPORT' }; // 导出
const TABLE_FUZZY_SEARCH = { type: 'terminaDetect/TABLE_FUZZY_SEARCH' }; // 模糊查询
const SAVE_DETECTION_TABLE_DATA = { type: 'terminaDetect/SAVE_DETECTION_TABLE_DATA' }; // 保存检测列表数据
const DOWNLOAD_IMPORT_TEMPLATE = { type: 'terminaDetect/DOWNLOAD_IMPORT_TEMPLATE' }; // 保存检测列表数据
const DETECTION_BATCH_UPDATE = { type: 'terminaDetect/DETECTION_BATCH_UPDATE' }; // 检测列表批量更新
const DETECTION_BATCH_QUALIFIED = { type: 'terminaDetect/DETECTION_BATCH_QUALIFIED' }; // 检测列表批量合格
const DETECTION_BATCH_DELETE = { type: 'terminaDetect/DETECTION_BATCH_DELETE' }; // 检测列表批量删除
const SAVE_DETECTION_TABLE_SEARCH_CONDITIONS = { type: 'terminaDetect/SAVE_DETECTION_TABLE_SEARCH_CONDITIONS' }; // 保存检测列表查询条件
const DOWNLOAD_DETECTION_IMPORT_ERR = { type: 'terminaDetect/DOWNLOAD_DETECTION_IMPORT_ERR' }; // 下载检测列表导入失败原因文件
const DETECTION_BATCH_EDIT = { type: 'terminaDetect/DETECTION_BATCH_EDIT' }; // 批量修改检测列表终端信息

const GET_QUALIFIED_TABLE_DATA = { type: 'terminaDetect/GET_QUALIFIED_TABLE_DATA' }; // 获取合格列表数据
const SAVE_QUALIFIED_TABLE_SELECTION_DATA = { type: 'terminaDetect/SAVE_QUALIFIED_TABLE_SELECTION_DATA' }; // 保存合格列表勾选数据
const SAVE_QUALIFIED_TABLE_SEARCH_CONDITIONS = { type: 'terminaDetect/SAVE_QUALIFIED_TABLE_SEARCH_CONDITIONS' }; // 保存合格列表查询条件
const SAVE_QUALIFIED_TABLE_DATA = { type: 'terminaDetect/SAVE_QUALIFIED_TABLE_DATA' }; // 保存合格列表数据
const DOWNLOAD_IMPORT_SEARCH_TEMPLATE = { type: 'terminaDetect/DOWNLOAD_IMPORT_SEARCH_TEMPLATE' }; // 下载导入查询模板
const SAVE_QUALIFIED_TABLE_CHANGE_INFOS = { type: 'terminaDetect/SAVE_QUALIFIED_TABLE_CHANGE_INFOS' }; // 保存合格列表单列点击修改数据
const QUALIFIED_BATCH_DELETE = { type: 'terminaDetect/QUALIFIED_BATCH_DELETE' }; // 合格列表批量删除
const QUALIFIED_TABLE_DATA_EXPORT = { type: 'terminaDetect/QUALIFIED_TABLE_DATA_EXPORT' }; // 合格列表导出数据
const DOWNLOAD_QUALIFIED_IMPORT_SEARCH_ERR = { type: 'terminaDetect/DOWNLOAD_QUALIFIED_IMPORT_SEARCH_ERR' }; // 合格列表导入查询失败原因
const QUALIFIED_BATCH_EDIT = { type: 'terminaDetect/QUALIFIED_BATCH_EDIT' }; // 合格列表批量修改

const GET_GROUP_TREE_DATA = { type: 'terminaDetect/GET_GROUP_TREE_DATA' }; // 获取所属组织树数据
const SAVE_GROUP_TREE_DATA = { type: 'terminaDetect/SAVE_GROUP_TREE_DATA' }; // 保存所属组织树数据

const SET_DETECTION_BATCH_EDIT_STATE = { type: 'terminaDetect/SET_DETECTION_BATCH_EDIT_STATE' }; // 检测列表批量修改状态
const SET_QUALIFIED_EDIT_STATE = { type: 'terminaDetect/SET_QUALIFIED_EDIT_STATE' }; // 合格列表批量修改/修改状态
const SET_QUALIFIED_TABLE_OPERATION_SETTING = { type: 'terminaDetect/SET_QUALIFIED_TABLE_OPERATION_SETTING' }; // 合格列表操作设置弹窗显示状态
const EXPOERT_SEARCH_FAILED_DELETE = { type: 'terminaDetect/EXPOERT_SEARCH_FAILED_DELETE' }; // 导入查询失败后删除数据
const CANCEL_QUALIFIED_TABLE_SELECTION = { type: 'terminaDetect/CANCEL_QUALIFIED_TABLE_SELECTION' }; // 是否取消合格列表选中高亮

const defaultState = {
  detectionTableSelectionData: null,
  detectionTableData: null,
  detectionDataSearchConditions: {
    page: 1,
    limit: 100,
    state: 2,
    isOnline: 2,
    isLocation: 2,
    simpleQueryParam: '',
  },
  qualifiedTableSelectionData: null,
  qualifiedTableData: null,
  qualifiedDataSearchConditions: {
    page: 1,
    limit: 100,
    simpleQueryParam: '',
    checkQualifiedStartTime: '',
    checkQualifiedEndTime: '',
    type: 0,
  },
  qualifiedTableChangeInfos: null,
  groupTreeData: [],
  detectionBatchEditModalState: 0, // 检测列表批量修改状态 0 默认 1关闭
  qualifiedEditModalState: 0, // 合格列表批量修改/修改状态 0 默认 1关闭
  qualifiedTableOperationSettingModalState: 0, // 合格列表操作设置弹窗显示状态 0 默认 1关闭
  cancelQulifiedTableSelection: false, // 是否取消合格列表选中高亮
};

const terminaDetectReducers = (state = defaultState, { type, payload }) => {
  switch (type) {
    case DETECTION_TABLE_SELECTION_DATA.type:
      return Object.assign({}, state, { detectionTableSelectionData: payload });
    case SAVE_DETECTION_TABLE_DATA.type:
      return Object.assign({}, state, { detectionTableData: payload });
    case SAVE_DETECTION_TABLE_SEARCH_CONDITIONS.type:
      return Object.assign({}, state, { detectionDataSearchConditions: payload });
    case SAVE_QUALIFIED_TABLE_SELECTION_DATA.type:
      return Object.assign({}, state, { qualifiedTableSelectionData: payload });
    case SAVE_QUALIFIED_TABLE_SEARCH_CONDITIONS.type:
      return Object.assign({}, state, { qualifiedDataSearchConditions: payload });
    case SAVE_QUALIFIED_TABLE_DATA.type:
      return Object.assign({}, state, { qualifiedTableData: payload });
    case SAVE_QUALIFIED_TABLE_CHANGE_INFOS.type:
      return Object.assign({}, state, { qualifiedTableChangeInfos: payload });
    case SAVE_GROUP_TREE_DATA.type:
      return Object.assign({}, state, { groupTreeData: payload });
    case SET_DETECTION_BATCH_EDIT_STATE.type:
      return Object.assign({}, state, { detectionBatchEditModalState: payload });
    case SET_QUALIFIED_EDIT_STATE.type:
      return Object.assign({}, state, { qualifiedEditModalState: payload });
    case SET_QUALIFIED_TABLE_OPERATION_SETTING.type:
      return Object.assign({}, state, { qualifiedTableOperationSettingModalState: payload });
    case CANCEL_QUALIFIED_TABLE_SELECTION.type:
      return Object.assign({}, state, { cancelQulifiedTableSelection: payload });
    default:
      return state;
  }
};

/**
 * 获取终端检测的检测列表数据
 */
function* getDetectionTableData(data) {
  const { payload } = data;
  const res = yield call(server.terminalDetect.getDetectionList, payload);
  if (res.status === 200) {
    yield put({ type: DETECTION_TABLE_SELECTION_DATA.type, payload: null });
    yield put({ type: SAVE_DETECTION_TABLE_SEARCH_CONDITIONS, payload });
    yield put({ type: SAVE_DETECTION_TABLE_DATA.type, payload: res.data });
  }
}

/**
 * 导出检测列表table数据
 */
function* tableDataExportAction(data) {
  const { payload: { conditions, ids } } = data;

  const params = {
    state: conditions.state,
    isOnline: conditions.isOnline,
    isLocation: conditions.isLocation,
    simpleQueryParam: conditions.simpleQueryParam,
    ids,
  };
  const res = yield call(server.terminalDetect.exportDetectionData, params);
  download(res, '检测列表.xlsx');
}

/**
 * table模糊查询
 */
function* tableFuzzySearchAction(data) {
  yield call(console.log('table模糊查询', data));
}

/**
 * 下载导入模板
 */
function* downLoadImportTemplate() {
  const res = yield call(server.terminalDetect.downLoadImportTemplate);
  download(res, '检测列表模板.xlsx');
}

/**
 * 检测列表批量更新ianz
 */
function* detectionBatchUpdate(data) {
  const { payload } = data;
  const res = yield call(server.terminalDetect.detectionBatchUpdate, payload);
  if (res.status === 200) {
    if (res.data.data) {
      message.success('批量更新成功');
      yield put({ type: DETECTION_TABLE_SELECTION_DATA.type, payload: null });
      const res1 = yield call(
        server.terminalDetect.getDetectionList,
        defaultState.detectionDataSearchConditions,
      );
      if (res1.status === 200) {
        yield put({ type: SAVE_DETECTION_TABLE_DATA.type, payload: res1.data });
      }
    }
  } else {
    message.success('批量更新失败');
  }
}

/**
 * 检测列表批量合格
 */
function* detectionBatchQualified(data) {
  const { payload } = data;
  const res = yield call(server.terminalDetect.detectionBatchQualified, payload);
  if (res.status === 200) {
    if (res.data.data) {
      message.success('批量合格成功');
      yield put({ type: DETECTION_TABLE_SELECTION_DATA.type, payload: null });
      /**
       * 检测列表数据
       */
      const res1 = yield call(
        server.terminalDetect.getDetectionList,
        defaultState.detectionDataSearchConditions,
      );
      if (res1.status === 200) {
        yield put({ type: SAVE_DETECTION_TABLE_DATA.type, payload: res1.data });
      }

      /**
       * 合格列表数据
       */
      const res2 = yield call(
        server.terminalDetect.getQualifiedTableData,
        defaultState.qualifiedDataSearchConditions,
      );
      if (res2.status === 200) {
        yield put({ type: SAVE_QUALIFIED_TABLE_DATA.type, payload: res2.data });
      }
    } else {
      message.warning('勾选数据状态异常');
    }
  } else {
    message.error('批量合格失败');
  }
}

/**
 * 检测列表批量删除
 */
function* detectionBatchDelete(data) {
  const { payload } = data;
  const res = yield call(server.terminalDetect.detectionBatchDelete, payload);
  if (res.status === 200) {
    if (res.data.data) {
      message.success('批量删除成功');
      yield put({ type: DETECTION_TABLE_SELECTION_DATA.type, payload: null });
      const res1 = yield call(
        server.terminalDetect.getDetectionList,
        defaultState.detectionDataSearchConditions,
      );
      if (res1.status === 200) {
        yield put({ type: SAVE_DETECTION_TABLE_DATA.type, payload: res1.data });
      }
    }
  } else {
    message.success('批量删除失败');
  }
}

/**
 * 获取合格列表数据
 */
function* getQualifiedTableData(data) {
  const { payload } = data;
  const res = yield call(server.terminalDetect.getQualifiedTableData, payload);
  if (res.status === 200) {
    yield put({ type: SAVE_QUALIFIED_TABLE_SELECTION_DATA.type, payload: null });
    yield put({ type: SAVE_QUALIFIED_TABLE_SEARCH_CONDITIONS, payload });
    yield put({ type: SAVE_QUALIFIED_TABLE_DATA.type, payload: res.data });
  }
}

/**
 * 下载导入查询模板
 */
function* downloadImportSearchTemplate() {
  const res = yield call(server.terminalDetect.downloadImportSearchTemplate);
  download(res, '合格列表模板.xlsx');
}

/**
 * 合格列表批量删除
 */
function* qualifiedBatchDelete(data) {
  const { payload } = data;
  const res = yield call(server.terminalDetect.qualifiedBatchDelete, payload);
  if (res.status === 200) {
    if (res.data.data) {
      message.success('删除成功');
      yield put({ type: SAVE_QUALIFIED_TABLE_SELECTION_DATA.type, payload: null });
      yield put({ type: SET_QUALIFIED_TABLE_OPERATION_SETTING.type, payload: 1 });
      const res1 = yield call(
        server.terminalDetect.getQualifiedTableData,
        defaultState.qualifiedDataSearchConditions,
      );
      if (res1.status === 200) {
        yield put({ type: SAVE_QUALIFIED_TABLE_DATA.type, payload: res1.data });
      }
    }
  } else {
    message.success('删除成功');
  }
}

/**
 * 合格列表导出数据
 */
function* qualifiedTableDataExport(data) {
  const { payload: { conditions, ids } } = data;

  const params = {
    simpleQueryParam: conditions.simpleQueryParam,
    checkQualifiedStartTime: conditions.checkQualifiedStartTime,
    checkQualifiedEndTime: conditions.checkQualifiedEndTime,
    deviceIds: ids,
    type: conditions.type,
  };
  const res = yield call(server.terminalDetect.exportQualifiedData, params);
  download(res, '合格列表.xlsx');
}

/**
 * 下载检测列表导入失败原因文件
 */
function* downloadDetectionImportErr() {
  const res = yield call(server.terminalDetect.downLoadDetectionErrorMsg);
  download(res, '导入失败原因.xlsx');
}

/**
 * 获取所属组织树数据
 */
function* getGroupTreeData() {
  const res = yield call(server.groupTree.getGroupTree);
  if (res.status === 200) {
    yield put({ type: SAVE_GROUP_TREE_DATA.type, payload: res.data.data });
  }
}

/**
 * 批量修改检测列表终端信息
 */
function* detectionBatchEdit(data) {
  const { payload } = data;
  const res = yield call(server.terminalDetect.detectionBatchEdit, payload);
  if (res.status === 200) {
    if (res.data.data) {
      message.success('批量修改成功');
      yield put({ type: DETECTION_TABLE_SELECTION_DATA.type, payload: null });
      yield put({ type: SET_DETECTION_BATCH_EDIT_STATE.type, payload: 1 });
      const res1 = yield call(
        server.terminalDetect.getDetectionList,
        defaultState.detectionDataSearchConditions,
      );
      if (res1.status === 200) {
        yield put({ type: SAVE_DETECTION_TABLE_DATA.type, payload: res1.data });
      }
    }
  }
}

/**
 * 合格列表导入查询失败原因
 */
function* downloadQualifiedImportErr() {
  const res = yield call(server.terminalDetect.downloadQualifiedImportSearchError);
  download(res, '导入查询失败.xlsx');
}

/**
 * 合格列表批量修改
 */
function* qualifiedBatchEdit(data) {
  const { payload } = data;
  const res = yield call(server.terminalDetect.qualifiedBatchEdit, payload);
  if (res.status === 200) {
    if (res.data.data) {
      message.success('修改成功');
      yield put({ type: SAVE_QUALIFIED_TABLE_SELECTION_DATA.type, payload: null });
      yield put({ type: SET_QUALIFIED_EDIT_STATE.type, payload: 1 });
      const res1 = yield call(
        server.terminalDetect.getQualifiedTableData,
        defaultState.qualifiedDataSearchConditions,
      );
      if (res1.status === 200) {
        yield put({ type: SAVE_QUALIFIED_TABLE_DATA.type, payload: res1.data });
      }
    }
  }
}

/**
 * 导入查询失败后删除数据
 */
function* exportSearchFailedDelete() {
  yield call(server.terminalDetect.exportSearchFailedDelete);
}

function* terminaDetectSaga() {
  yield takeEvery(GET_DETECTION_TABLE_DATA.type, getDetectionTableData);
  yield takeEvery(TABLE_SELECTION_DATA_EXPORT.type, tableDataExportAction);
  yield takeEvery(TABLE_FUZZY_SEARCH.type, tableFuzzySearchAction);
  yield takeEvery(DOWNLOAD_IMPORT_TEMPLATE.type, downLoadImportTemplate);
  yield takeEvery(DETECTION_BATCH_UPDATE.type, detectionBatchUpdate);
  yield takeEvery(DETECTION_BATCH_QUALIFIED.type, detectionBatchQualified);
  yield takeEvery(DETECTION_BATCH_DELETE.type, detectionBatchDelete);
  yield takeEvery(DOWNLOAD_DETECTION_IMPORT_ERR.type, downloadDetectionImportErr);
  yield takeEvery(DETECTION_BATCH_EDIT.type, detectionBatchEdit);

  yield takeEvery(GET_QUALIFIED_TABLE_DATA.type, getQualifiedTableData);
  yield takeEvery(DOWNLOAD_IMPORT_SEARCH_TEMPLATE.type, downloadImportSearchTemplate);
  yield takeEvery(QUALIFIED_BATCH_DELETE.type, qualifiedBatchDelete);
  yield takeEvery(QUALIFIED_TABLE_DATA_EXPORT.type, qualifiedTableDataExport);
  yield takeEvery(DOWNLOAD_QUALIFIED_IMPORT_SEARCH_ERR.type, downloadQualifiedImportErr);
  yield takeEvery(QUALIFIED_BATCH_EDIT.type, qualifiedBatchEdit);
  yield takeEvery(EXPOERT_SEARCH_FAILED_DELETE.type, exportSearchFailedDelete);

  yield takeEvery(GET_GROUP_TREE_DATA.type, getGroupTreeData);
}

export default {
  terminaDetectReducers,
  terminaDetectSaga,
};