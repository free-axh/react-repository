import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getStore } from '../localStorage';
import { replace } from './routeMethods';
import server from '../../server/index';
// import Header from '../../views/header/index';

class RouterGuard extends Component {
  static propTypes = {
    component: PropTypes.string.isRequired,
    common: PropTypes.bool.isRequired,
    changeCommon: PropTypes.func.isRequired,
  }

  componentWillMount() {
    this.isToken();
  }

  async isToken() {
    const token = getStore('token');
    if (!token) {
      replace('login');
      return;
    }
    const data = await server.login.validationToken({ token });
    if (data.status === 200) {
      if (data.data.isToken) {
        if (data.path === '/login') {
          replace('home');
        }
      } else {
        replace('login');
      }
    }
  }

  render() {
    const { component, common, changeCommon } = this.props;
    const LoadableComponent = component;
    changeCommon(common);
    return (
      <div>
        <LoadableComponent {...this.props} />
      </div>
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