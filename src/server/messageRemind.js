import axios from '../utils/server/axios';

const messageRemind = {
  /**
   * 获取消息提醒数量
   */
  getMessageRemindData: () => axios('/api/device/management/serviceStatusCount', 'GET'),
};

export default messageRemind;