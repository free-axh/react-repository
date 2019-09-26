import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Icon } from 'antd';
import { removeStore } from '../../utils/localStorage';
import { replace } from '../../utils/router/routeMethods';
// import logo from '../../static/image/logo.png';

import styles from './index.module.less';

class Header extends Component {
  static propTypes = {
    loginExit: PropTypes.func.isRequired,
    menuCollapsed: PropTypes.func.isRequired,
    collapsed: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.toggleCollapsed = this.toggleCollapsed.bind(this);
  }

  logOut = () => {
    removeStore('token');
    const { loginExit } = this.props;
    loginExit();
    replace('login');
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
      <div className={styles.header}>
        {/* <div className={styles['header-left']}>
          <img alt="logo图片" src={logo} />
        </div> */}
        <div className={styles['header-right']}>
          <span className={styles.trigger} onClick={this.toggleCollapsed}>
            <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
          </span>
          {/* <span className={styles['platform-title']}>免费短信充值平台</span> */}
          <div className={styles['header-right-components']}>
            <Button type="primary" onClick={this.logOut}>退出登录</Button>
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
