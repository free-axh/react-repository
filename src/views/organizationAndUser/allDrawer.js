// 用户列表相关抽屉
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import AddUserForm from './addUserDrawer';// 新增用户
import UserDetailForm from './userDetailDrawer';// 用户详情
import EditUserForm from './editUserDrawer';// 修改用户
import AssignRoles from './assignRolesDrawer';// 分配角色

class AllDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        {/* 新增用户 */}
        <AddUserForm />
        {/* 用户详情 */}
        <UserDetailForm />
        {/* 修改用户 */}
        <EditUserForm />
        {/* 分配角色 */}
        <AssignRoles />
      </div>
    );
  }
}
export default connect()(injectIntl(AllDrawer));
