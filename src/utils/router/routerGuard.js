import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import renderRoutesMap from './renderRoutesMap';
import { getStore } from '../localStorage';
import { replace } from './routeMethods';
import server from '../../server/index';
import Loading from '../../common/loading/index';
import Header from '../../views/header/index';

console.log('server', server);

// const mapStateToProps = state => (state);
// const mapDispatchToProps = dispatch => ({ ...dispatch });

class RouterGuard extends Component {
  static propTypes = {
    logined: PropTypes.bool.isRequired,
    component: PropTypes.string.isRequired,
    routes: PropTypes.array.isRequired,
    common: PropTypes.bool.isRequired,
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
    console.log('2222', data);
    if (data.status === 200) {
      if (data.data.isToken) {
        replace('home');
      } else {
        replace('login');
      }
    }
  }

  render() {
    const { component, common, routes = [] } = this.props;
    const LoadableComponent = Loadable({
      loader: () => import(`../../${component}`),
      loading: () => (
        <Loading />
      ),
    });
    return (
      <div>
        {
          common ? (
            <Header />
          ) : null
        }
        <LoadableComponent {...this.props} />
        {renderRoutesMap(routes)}
      </div>
    );
  }
}

export default withRouter(connect(null, null)(RouterGuard));