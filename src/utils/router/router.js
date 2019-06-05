import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
// import PropTypes from 'prop-types';
import routes from './renderLoadable';
import { saveHistory } from './routeMethods';
import renderRoutesMap from './renderRoutesMap';
import Page404 from '../../views/error/page404';
// import Header from '../../views/header';

const customHistory = createBrowserHistory();

saveHistory(customHistory);

class Navigator extends Component {
  // static propTypes = {
  //   common: PropTypes.bool.isRequired,
  // }

  render() {
    // const { common } = this.props;
    return (
      <Router history={customHistory}>
        <div>
          <Switch>
            {
              renderRoutesMap(routes)
            }
            <Route component={Page404} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default connect(
  state => ({
    common: state.rootReducers.common,
  }),
  null,
)(Navigator);