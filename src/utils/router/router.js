import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import { Router, Switch, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import PropTypes from 'prop-types';
import routes from './renderLoadable';
import { saveHistory } from './routeMethods';
import renderRoutesMap from './renderRoutesMap';
import Page404 from '../../views/error/page404';
import HeaderPage from '../../views/header';
import Menu from '../../views/menu';
import Loading from '../../common/loading';
import { saveDispatch } from '../localStorage';

// import styles from '../../static/css/main.module.less';

const { Header, Sider, Content } = Layout;

const customHistory = createBrowserHistory();

saveHistory(customHistory);

class Navigator extends Component {
  static propTypes = {
    common: PropTypes.bool.isRequired,
    loadingState: PropTypes.bool.isRequired,
    dispatch: PropTypes.object.isRequired,
    collapsed: PropTypes.bool.isRequired,
  }

  componentWillMount() {
    const { dispatch } = this.props;
    saveDispatch(dispatch);
  }

  render() {
    const { common, loadingState, collapsed } = this.props;

    return (
      <Router history={customHistory}>

        <Layout style={{ minHeight: '100vh' }}>
          {
            common ? (
              <Sider collapsed={collapsed}>
                <Menu />
              </Sider>
            ) : null
          }
          <Layout>
            {
              common ? (
                <Header style={{ background: '#ffffff', padding: 0 }}>
                  <HeaderPage />
                </Header>
              ) : null
            }
            <Content>
              {
                <Switch>
                  {
                    renderRoutesMap(routes)
                  }
                  <Route component={Page404} />
                </Switch>
              }
              <Loading loadingState={loadingState} />
            </Content>
          </Layout>
        </Layout>

      </Router>
    );
  }
}

export default connect(
  state => ({
    common: state.rootReducers.common,
    loadingState: state.rootReducers.loadingState,
    collapsed: state.rootReducers.collapsed,
  }),
  null,
)(Navigator);