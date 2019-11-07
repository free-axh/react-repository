import axios from '../utils/server/axios';

/**
 * 日志查询
*/
const logs = {
  // 获取日志查询列表
  getLogLists: data => axios('/api/logSearch/list', 'POST', data),
  // 导出
  epxort: data => axios('/api/logSearch/export', 'POST', data, 8000, 'blob'),
};

export default logs;