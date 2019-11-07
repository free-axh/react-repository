import axios from '../utils/server/axios';

/**
 * 充值查询
*/
const rechargeSearch = {
  // 获取充值查询列表
  getRechargeList: data => axios('/api/recharge/getRechargeList', 'POST', data),
  // 导出
  epxort: data => axios('/api/recharge/download', 'POST', data, 8000, 'blob'),
  // 更新
  upDateRechargeList: data => axios('/api/recharge/query', 'POST', data),
};

export default rechargeSearch;