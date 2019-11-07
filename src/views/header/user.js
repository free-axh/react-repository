import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import { Button, Popover, Icon } from 'antd';
import PropTypes from 'prop-types';
import { removeStore } from '../../utils/localStorage';
import { replace } from '../../utils/router/routeMethods';

import styles from './index.module.less';

class User extends Component {
  static propTypes = {
    loginExit: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
  }

  /**
   * 退出登录
   * 清空所有缓存对象
   */
  logOut = () => {
    removeStore('token');
    removeStore('historyRouters');
    removeStore('menuKeyPath');
    removeStore('expiration');
    removeStore('username');
    removeStore('authorMenuList');
    if (global.socket) {
      global.socket.close();
      global.socket = null;
    }
    const { loginExit } = this.props;
    loginExit();
    replace('login');
  }

  /**
   * 组装消息提醒数据
   */
  getMessageDom = () => {
    const data = [
      {
        title: '退出登录',
        type: 1,
      },
    ];

    return (
      <ul className={styles.user}>
        {
          data.map(item => (
            <li key={item.type}><span onClick={this.logOut}><Icon type="poweroff" />{item.title}</span></li>
          ))
        }
      </ul>
    );
  }

  render() {
    const content = this.getMessageDom();

    return (
      <Popover content={content} trigger="click" placement="bottomRight">
        <Button type="primary" shape="circle" icon="user" />
      </Popover>
    );
  }
}

export default connect(
  null,
  dispatch => ({
    loginExit: () => {
      dispatch({ type: 'login/LOGIN_EXIT' });
    },
  }),
)(User);
