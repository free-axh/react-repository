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

// import styles from '../../static/css/main.module.less';

const { Header, Sider, Content } = Layout;

const customHistory = createBrowserHistory();

saveHistory(customHistory);

class Navigator extends Component {
  static propTypes = {
    common: PropTypes.bool.isRequired,
  }

  render() {
    const { common } = this.props;
    return (
      <Router history={customHistory}>
        <div>
          <Layout>
            {
              common ? (
                <Header style={{ background: '#ffffff', paddingLeft: 0 }}>
                  <HeaderPage />
                </Header>
              ) : null
            }
            <Layout style={{ position: 'absolute', top: common ? '64px' : 0, bottom: 0, left: 0, right: 0 }}>
              {
                common ? (
                  <Sider>
                    <Menu />
                  </Sider>
                ) : null
              }
              <Content style={{ margin: common ? '24px' : 0 }}>
                {
                  <Switch>
                    {
                      renderRoutesMap(routes)
                    }
                    <Route component={Page404} />
                  </Switch>
                }
              </Content>
            </Layout>
          </Layout>
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