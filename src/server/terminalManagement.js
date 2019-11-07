import axios from '../utils/server/axios';

const terminalManagement = {
  // 获取组织树
  getOrganizationTree: data => axios('/api/device/management/getOrganizationTree', 'GET', data),
  // 列表查询+高级搜索+导入查询
  getAdvancedSearch: data => axios('/api/device/management/list', 'POST', data),
  // 下载终端管理查询模板
  getDownloadImportTemplate: () => axios('/api/device/management/downloadSearchTemplate', 'GET', {}, 8000, 'blob'),
  // 下载终端管理导入查询失败原因
  downLoadDetectionErrorMsg: () => axios('/api/device/management/downloadSearchErrorTemplate', 'GET', {}, 8000, 'blob'),
  // 导出终端列表
  terminalDownloadList: data => axios('/api/device/management/exportDevice', 'POST', data, 30000, 'blob'),
  // 下载导入终端信息模板
  importTemplate: () => axios('/api/device/management/downloadImportTemplate', 'GET', {}, 8000, 'blob'),
  // 下载导入终端错误信息
  importTemplateError: () => axios('/api/device/management/downloadImportErrorTemplate', 'GET', {}, 8000, 'blob'),
  // 修改+批量修改
  edit: data => axios('/api/device/management/updateDevice', 'POST', data),
  // 更新+批量更新
  update: data => axios('/api/device/management/updateSimCardInfo', 'POST', data),
  // 删除+批量删除
  delate: data => axios('/api/device/management/deleteDeviceInfo', 'POST', data),
  // 详情操作（包括sim卡信息）
  detailSIM: data => axios('/api/device/management/getDeviceDetail', 'POST', data),
  // 详情页更新（sim卡号+余额+更新时间）
  detailSpecialUpdate: data => axios('/api/device/management/updateDeviceDetailSimCardInfo', 'POST', data),
  // 详情页面获取数据（定位信息）
  detailPosition: data => axios('/api/device/management/updateDeviceDetailLocationInfo', 'POST', data),
  // 充值详情
  chargeDetail: data => axios('/api/recharge/getDeviceInfo', 'POST', data),
  // 提交充值
  chargePost: data => axios('/api/recharge/submit', 'POST', data),
  // 充值页面更新
  chargeUpdate: data => axios('/api/device/management/updateDeviceRechargeSimCardInfo', 'POST', data),
  // 订单查询-->用户选择充值成功后，更新充值状态
  rechargeQuery: data => axios('/api/recharge/query', 'POST', data),

  /**
   * 下发短信相关接口
   */
  // 获取所有服务器信息
  getAllServersData: data => axios('/api/group/findAllServers', 'POST', data),
  // 下发短信
  sendSmsMessage: data => axios('/api/sendMessage/send', 'POST', data),
  // 判断终端是否在线
  checkDeviceisOnLine: data => axios('/api/sendMessage/isOnLine', 'POST', data),
  // 读取终端参数
  readDeviceParam: data => axios('/api/sendMessage/read', 'POST', data),
};

export default terminalManagement;