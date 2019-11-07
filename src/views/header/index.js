import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import WebsocketUtil from '../../utils/webSocket';
import { getStore } from '../../utils/localStorage';
import MessageRemind from './messageRemind';
import User from './user';
import http from '../../utils/server/http';

import styles from './index.module.less';

class Header extends Component {
  static propTypes = {
    menuCollapsed: PropTypes.func.isRequired,
    collapsed: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.socketConnected = this.socketConnected.bind(this);
    this.toggleCollapsed = this.toggleCollapsed.bind(this);
  }

  componentDidMount() {
    this.socketConnected();
  }

  /**
   * 建立全局socket连接
   */
  socketConnected = () => {
    if (!global.socket) {
      const token = getStore('token');
      const headers = { access_token: token };
      const socket = new WebsocketUtil();
      socket.init(`${http.baseUrl}/sms?access_token=${token}`, headers, () => {
        global.socket = socket;
        console.log('连接', socket);
      }, () => {
        global.socket = null;
        console.log('连接断开');
      });
    }
  }

  /**
   * 收缩菜单按钮点击事件
   */
  toggleCollapsed = () => {
    const { menuCollapsed } = this.props;
    menuCollapsed();
  }

  render() {
    const { collapsed } = this.props;

    return (
      <div className={styles.header} style={collapsed ? { left: '80px' } : null}>
        <div className={styles['header-right']}>
          <span className={styles.trigger} onClick={this.toggleCollapsed}>
            <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
          </span>
          <div className={styles['header-right-components']}>
            <div>
              <MessageRemind />
            </div>
            <div>
              <User />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    collapsed: state.rootReducers.collapsed,
  }),
  dispatch => ({
    loginExit: () => {
      dispatch({ type: 'login/LOGIN_EXIT' });
    },
    menuCollapsed: () => {
      dispatch({ type: 'root/MENU_COLLAPSED_STATE' });
    },
  }),
)(Header);
