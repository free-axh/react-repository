import login from './login';
import organizationAndUser from './organizationAndUser';
import logs from './logs';
import groupTree from './groupTree';
import rechargeSearch from './rechargeSearch';
import terminalDetect from './terminalDetect';
import messageRemind from './messageRemind';
import terminalManagement from './terminalManagement';

export default {
  login,
  groupTree, // 组织树
  organizationAndUser, // 组织与用户管理
  terminalDetect, // 终端检测
  logs, // 日志查询
  rechargeSearch, // 充值查询
  messageRemind, // 页面顶部消息提醒
  terminalManagement, // 终端管理
};