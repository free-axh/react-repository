import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { removeStore } from '../../utils/localStorage';
import { replace } from '../../utils/router/routeMethods';
import { switchSkin } from '../../utils/skin/skin';

import styles from './index.module.less';

class Header extends Component {
  static propTypes = {
    currLocale: PropTypes.string.isRequired,
    switchLocale: PropTypes.func.isRequired,
    loginExit: PropTypes.func.isRequired,
  }

  switchLocale = () => {
    const { currLocale, switchLocale } = this.props;
    console.log('currLocale', currLocale);
    const lc = currLocale === 'en' ? 'zh' : 'en';
    switchLocale(lc);
  }

  logOut = () => {
    removeStore('token');
    const { loginExit } = this.props;
    loginExit();
    replace('login');
  }

  skin = (skin) => {
    switchSkin(skin);
  }

  render() {
    return (
      <div>
        <text>this is header!</text>
        <button className={styles.defaultButton} type="button" onClick={this.switchLocale}>切换语言</button>
        <button type="button" onClick={this.logOut}>退出登录</button>
        <button type="button" onClick={() => this.skin('skin-default')}>默认皮肤</button>
        <button type="button" onClick={() => this.skin('skin-red')}>红色皮肤</button>
      </div>
    );
  }
}

export default connect(
  state => ({
    currLocale: state.rootReducers.currLocale,
  }),
  dispatch => ({
    switchLocale: (payload) => {
      dispatch({ type: 'root/SWITCH_LOCALEN', payload });
    },
    loginExit: () => {
      dispatch({ type: 'login/LOGIN_EXIT' });
    },
  }),
)(Header);
