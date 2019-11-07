import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import {
  Card, Row, Col, Typography, Icon,
} from 'antd';
import { push } from '../../utils/router/routeMethods';
import styles from './index.module.less';
import { getStore, setStore } from '../../utils/localStorage';
import BreadcrumbComponent from '../../common/Breadcrumb/BreadcrumbComponent';


class Home extends Component {
  constructor(props) {
    super(props);
    const username = getStore('username');
    this.state = {
      defArr: [1, 2, 3, 4, 5, 6], // 用于循环快捷导航默认的结构
      username,
    };
    this.toTerminalManagement = this.toTerminalManagement.bind(this);
    this.toRechargeSearch = this.toRechargeSearch.bind(this);
  }

  data = {
    breadcrumb: [
      { title: 'Dashboard' },
      { title: '工作台' },
    ],
  };

  toTerminalManagement = () => {
    const code = 'DeviceManagementList';
    const authorMenuList = getStore('authorMenuList');
    if (authorMenuList !== null) {
      const author = JSON.parse(authorMenuList);
      if (author.indexOf(code) === -1) {
        push('/404');
      } else {
        const menuSelectedKeyPath = getStore('menuKeyPath');
        if (menuSelectedKeyPath !== null) {
          const menuKeyPath = JSON.parse(menuSelectedKeyPath);
          if (menuKeyPath[code] === undefined) {
            menuKeyPath[code] = ['DeviceManagementList', 'Device'];
            setStore('menuKeyPath', menuKeyPath);
          }
        }
        push('/terminalManagement');
      }
    }
  }

  toRechargeSearch = () => {
    const code = 'RechargeQueryList';
    const authorMenuList = getStore('authorMenuList');
    if (authorMenuList !== null) {
      const author = JSON.parse(authorMenuList);
      if (author.indexOf(code) === -1) {
        push('/404');
      } else {
        const menuSelectedKeyPath = getStore('menuKeyPath');
        if (menuSelectedKeyPath !== null) {
          const menuKeyPath = JSON.parse(menuSelectedKeyPath);
          if (menuKeyPath[code] === undefined) {
            menuKeyPath[code] = ['RechargeQueryList', 'ReportForm'];
            setStore('menuKeyPath', menuKeyPath);
          }
        }
        push('/rechargeSearch');
      }
    }
  }

  render() {
    const { defArr, username } = this.state;

    return (
      <div className={styles['bg-wrapper']}>
        <BreadcrumbComponent breadcrumbMessage={this.data.breadcrumb} />
        <Card className={styles['card-header']}>
          <div className={styles['user-header']}>
            <div className={styles['user-left']}>
              <img alt="user img" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            </div>
            <div className={styles['user-title']}>
              <span>
                {username}，<FormattedMessage
                  id="home_wish"
                />
              </span>
            </div>
          </div>
        </Card>
        <Card
          className={styles['menu-card']}
          title={(
            <FormattedMessage
              id="home_quick_navigation"
            />
          )}
        >
          <Row>
            {/* 终端管理 */}
            <Col span={6} className={styles['menu-col']}>
              <Typography.Text strong className={styles['has-link']}>
                <span
                  className={styles['menu-col-link']}
                  onClick={this.toTerminalManagement}
                >
                  <FormattedMessage
                    id="home_terminal_management"
                  />
                </span>
              </Typography.Text>
            </Col>
            {/* 充值查询 */}
            <Col span={6} className={styles['menu-col']}>
              <Typography.Text strong className={styles['has-link']}>
                <span
                  className={styles['menu-col-link']}
                  onClick={this.toRechargeSearch}
                >
                  <FormattedMessage
                    id="home_top_up_query"
                  />
                </span>
              </Typography.Text>
            </Col>
            {/* 默认占位结构 */}
            {defArr.map(index => (
              <Col key={index} span={6} className={styles['menu-col']}>
                <span
                  className={styles['menu-col-link']}
                >
                  <Icon type="plus" />
                </span>
              </Col>
            ))}
          </Row>
        </Card>
        <Card
          className={styles['dynamic-card']}
          title={(
            <FormattedMessage
              id="home_dynamic"
            />
          )}
        >
          <p>
            <FormattedMessage
              id="home_construction"
            />
          </p>
        </Card>
      </div>
    );
  }
}

export default connect(null, null)(injectIntl(Home));
