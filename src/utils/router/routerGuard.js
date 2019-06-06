import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getStore } from '../localStorage';
import { replace } from './routeMethods';
import server from '../../server/index';
// import Header from 'antd/lib/calendar/Header';
// import Header from '../../views/header/index';
// import Menu from '../../views/menu/index';
// import styles from '../../static/css/main.module.less';

class RouterGuard extends Component {
  static propTypes = {
    component: PropTypes.string.isRequired,
    common: PropTypes.bool.isRequired,
    changeCommon: PropTypes.func.isRequired,
    path: PropTypes.string.isRequired,
  }

  componentWillMount() {
    this.isToken();
  }

  async isToken() {
    const { path } = this.props;
    const token = getStore('token');
    if (!token) {
      replace('login');
      return;
    }
    const data = await server.login.validationToken({ token });
    if (data.status === 200) {
      if (data.data.isToken) {
        if (path === '/login') {
          replace('home');
        }
        if (path === '/') {
          replace('home');
        }
      } else {
        replace('login');
      }
    } else if (data.status === 500) {
      if (path === '/') {
        replace('login');
      }
    }
  }

  render() {
    const { component, common, changeCommon } = this.props;
    const LoadableComponent = component;
    changeCommon(common);
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
  }),
)(RouterGuard));