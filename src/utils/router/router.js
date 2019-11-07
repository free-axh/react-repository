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
import RouterTabs from '../../common/routerTabs/routerTabs';

const { Header, Sider, Content } = Layout;

const customHistory = createBrowserHistory();

saveHistory(customHistory);

class Navigator extends Component {
  static propTypes = {
    common: PropTypes.bool.isRequired,
    loadingState: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    collapsed: PropTypes.bool.isRequired,
    activePathCode: PropTypes.string,
    logined: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    activePathCode: null,
  }

  componentWillMount() {
    const { dispatch } = this.props;
    saveDispatch(dispatch);
  }

  render() {
    const { common, loadingState, collapsed, activePathCode, logined } = this.props;
    console.log('logined', logined);

    return (
      <Router history={customHistory}>

        <Layout style={{ minHeight: '100vh' }}>
          {
            common ? (
              <Sider
                collapsed={collapsed}
                width={256}
              >
                <div style={{ position: 'fixed', top: 0, left: 0 }}>
                  <Sider collapsed={collapsed} width={256}>
                    <Menu />
                  </Sider>
                </div>
              </Sider>
            ) : null
          }
          <Layout>
            {
              common ? (
                <Header style={{ background: '#ffffff', padding: 0, height: '104px' }}>
                  <HeaderPage />
                  <RouterTabs activePathCode={activePathCode} />
                </Header>
              ) : null
            }
            <Content style={{ padding: logined ? '7px 7px 0 7px' : 0 }}>
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
    logined: state.loginReducers.logined,
    loadingState: state.rootReducers.loadingState,
    collapsed: state.rootReducers.collapsed,
    activePathCode: state.rootReducers.activePathCode,
  }),
  null,
)(Navigator);