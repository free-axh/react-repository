import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { message } from 'antd';
import { getStore } from '../localStorage';
import { replace, push } from './routeMethods';

class RouterGuard extends Component {
  static propTypes = {
    component: PropTypes.func.isRequired,
    common: PropTypes.bool.isRequired,
    changeCommon: PropTypes.func.isRequired,
    path: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    menuActiveCodeChange: PropTypes.func.isRequired,
    code: PropTypes.string,
    logineSuccessd: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  }

  static defaultProps = {
    code: null,
  }

  componentWillMount() {
    this.isToken();
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    const { common, changeCommon } = nextProps;
    changeCommon(common);
  }

  componentDidMount() {
    /**
     * 设置页面标题
     */
    const { name } = this.props;
    global.document.title = name;
  }

  /**
   * 路由拦截
   * 首先判断token是否存在，不存在退出到登录页
   *
   */
  async isToken() {
    const { path, menuActiveCodeChange, code, location: { pathname }, logineSuccessd } = this.props;
    const token = getStore('token');
    console.log('path', path);
    console.log('props', this.props);
    /**
     * 根据用户权限，判断是否调转到指定页面
     */
    const authorMenuList = getStore('authorMenuList');
    if (authorMenuList !== null) {
      const author = JSON.parse(authorMenuList);
      if (author.indexOf(code) === -1 && code !== null) {
        push('/404');
        return false;
      }
    }
    menuActiveCodeChange(code);

    if (!token) {
      replace('/login');
    } else if (this.isTokenFailure()) {
      if (path === '/login' || (path === '/' && pathname === '/')) {
        replace('/home');
      } else if (path !== pathname) {
        push('/404');
      }
      logineSuccessd();
    } else if (path !== '/login') {
      message.error('登录状态失效，请重新登录');
      replace('/login');
    }
    return true;
  }

  /**
   * 比对token过期时间，判断token是否过期
   */
  isTokenFailure = () => {
    const time = getStore('expiration');
    const nowTime = new Date().getTime();
    return time > nowTime;
  }

  render() {
    const { component } = this.props;
    const LoadableComponent = component;
    return (
      <LoadableComponent {...this.props} />
    );
  }
}

export default withRouter(connect(
  null,
  dispatch => ({
    changeCommon: (payload) => {
      dispatch({ type: 'root/CHANGE_COMMON', payload });
    },
    menuActiveCodeChange: (payload) => {
      dispatch({ type: 'root/MENU_ACTIVE_CODE', payload });
    },
    logineSuccessd: () => {
      dispatch({ type: 'login/LOGIN_SUCCESS' });
    },
  }),
)(RouterGuard));