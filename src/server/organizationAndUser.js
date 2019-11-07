import axios from '../utils/server/axios';

const organizationAndUser = {
  /**
   * 获取用户列表
   */
  getUserDataList: data => axios('/api/users/list', 'POST', data),

  /**
   * 新增用户
   */
  addUser: data => axios('/api/users/addUser', 'POST', data),

  /**
   * 修改用户
   */
  editUser: data => axios('/api/users/updateUser', 'POST', data),

  /**
   * 删除用户
   */
  deleteUser: data => axios('/api/users/deleteUser', 'POST', data),

  /**
   * 企业树结构
   */
  getGroupTree: data => axios(`/api/group/groupTree_${data ? data.query : ''}`, 'POST', data),

  /**
   * 校验用户是否已存在
   */
  repeatUser: data => axios('/api/users/checkUserNameIsUsable', 'POST', data),

  /**
   * 获取当前用户可分配的角色信息
   */
  getUserRoles: data => axios('/api/userRoles/roleList', 'GET', data),

  /**
   * 分配用户角色
   */
  updateUserRoles: data => axios('/api/userRoles/updateUserRole', 'POST', data),
};

export default organizationAndUser;