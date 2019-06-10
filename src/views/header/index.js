import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { removeStore } from '../../utils/localStorage';
import { replace } from '../../utils/router/routeMethods';
import logo from '../../static/image/logo.png';

import styles from './index.module.less';

class Header extends Component {
  static propTypes = {
    loginExit: PropTypes.func.isRequired,
  }

  logOut = () => {
    removeStore('token');
    const { loginExit } = this.props;
    loginExit();
    replace('login');
  }

  render() {
    return (
      <div className={styles.header}>
        <div className={styles['header-left']}>
          <img alt="logo图片" src={logo} />
        </div>
        <div className={styles['header-right']}>
          <Button type="primary" onClick={this.logOut}>退出登录</Button>
        </div>
      </div>
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
)(Header);
