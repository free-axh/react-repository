import axios from '../utils/server/axios';

const groupTree = {
  /**
   * 获取组织树节点数据
   */
  getGroupTree: data => axios(`/api/group/groupTree_${data ? data.query : ''}`, 'POST', data),
  /**
   * 根据组织id,获取组织详细数据
   */
  getTreeDataById: data => axios(`/api/group/detail_${data ? data.id : ''}`, 'POST', data),
  /**
   * 组织名称重复校验
   */
  repeatGroupName: data => axios('/api/group/checkName', 'POST', data),
  /**
   * 新增组织
   */
  addGroup: data => axios('/api/group/addGroup', 'POST', data),
  /**
   * 修改组织
   */
  editGroup: data => axios('/api/group/updateGroup', 'POST', data),
  /**
   * 插入组织
   */
  insertGroup: data => axios('/api/group/insertGroup', 'POST', data),
  /**
   * 删除组织
   */
  deleteGroup: data => axios(`/api/group/deleteGroup_${data ? data.id : ''}`, 'POST', data),
  /**
   * 删除组织时判断组织下是否有用户
   */
  groupHasUser: data => axios('/api/group/checkDelete', 'POST', data),
};

export default groupTree;