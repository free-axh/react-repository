import axios from '../utils/server/axios';

const terminalDetect = {
  /**
   * 获取终端检测的检测列表数据
   */
  getDetectionList: data => axios('/api/detectionList/getDetectionList', 'GET', data),
  /**
   * 导出检测列表数据
   */
  exportDetectionData: data => axios('/api/detectionList/export', 'GET', data, 30000, 'blob'),
  /**
   * 下载导入模板
   */
  downLoadImportTemplate: () => axios('/api/detectionList/downLoadImportTemplate', 'GET', {}, 8000, 'blob'),
  /**
   * 检测列表批量更新
   */
  detectionBatchUpdate: data => axios('/api/detectionList/batchSend', 'POST', data),
  /**
   * 检测列表批量合格
   */
  detectionBatchQualified: data => axios('/api/detectionList/batchQualified', 'PUT', data),
  /**
   * 检测列表批量删除
   */
  detectionBatchDelete: data => axios('/api/detectionList/batchDelete', 'DELETE', data),
  /**
   * 获取合格列表数据
   */
  getQualifiedTableData: data => axios('/api/device/qualified/list', 'POST', data),
  /**
   * 导出合格列表数据
   */
  exportQualifiedData: data => axios('/api/device/qualified/export', 'POST', data, 8000, 'blob'),
  /**
   * 下载导入查询模板
   */
  downloadImportSearchTemplate: () => axios('/api/device/qualified/downloadTemplate', 'GET', {}, 8000, 'blob'),
  /**
   * 合格列表批量删除
   */
  qualifiedBatchDelete: data => axios('/api/device/qualified/batchDelete', 'DELETE', data),
  /**
   * 下载检测列表导入失败原因文件
   */
  downLoadDetectionErrorMsg: () => axios('/api/detectionList/downLoadErrorMsg', 'GET', {}, 8000, 'blob'),
  /**
   * 批量修改检测列表终端信息
   */
  detectionBatchEdit: data => axios('/api/detectionList/updateByBatch', 'PUT', data),
  /**
   * 合格列表导入查询下载失败表格
   */
  downloadQualifiedImportSearchError: () => axios('/api/device/qualified/downloadErrorTemplate', 'GET', {}, 8000, 'blob'),
  /**
   * 合格列表修改和批量修改
   */
  qualifiedBatchEdit: data => axios('/api/device/qualified/batchDeviceOrganization', 'PUT', data),
  /**
   * 导入查询失败后删除数据
   */
  exportSearchFailedDelete: () => axios('/api/device/qualified/errorTemplate', 'DELETE'),
};

export default terminalDetect;