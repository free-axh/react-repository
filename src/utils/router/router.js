import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import routes from './routerConfig';
import { saveHistory } from './routeMethods';
import renderRoutesMap from './renderRoutesMap';
import Page404 from '../../views/error/page404';
// import Login from '../../views/login'

const customHistory = createBrowserHistory();

saveHistory(customHistory);

class Navigator extends Component {
  render() {
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

export default connect(null, null)(Navigator);