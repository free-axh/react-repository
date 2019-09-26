import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import PropTypes from 'prop-types';
// import { getMenuList } from '../../utils/menuConfig';
// import { styles } from 'ansi-colors';
import { getMenuList } from '../../utils/menuList';
import routerConfig from '../../utils/router/routerConfig';
import { menuIconConfig } from '../../utils/menuConfig';
import logo from '../../static/image/logo.svg';

import styles from './index.module.less';

const { SubMenu } = Menu;

class MenuPage extends Component {
  static propTypes = {
    collapsed: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    const menuList = getMenuList();
    const newMenuList = this.menuListHandler(menuList, routerConfig);
    console.log(newMenuList);
    this.state = {
      menuList: newMenuList,
      openKeys: [],
      current: 'home',
    };
    this.onOpenChange = this.onOpenChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  /**
   * menu数组组装
   */
  menuListHandler = (menuList, rConfig) => menuList.map(
    item => this.listConfigHandler(item, rConfig),
  );

  listConfigHandler = (item, rConfig) => {
    const rItem = item;
    if (item.childPermissions) {
      const list = [];
      for (let i = 0; i < rItem.childPermissions.length; i += 1) {
        if (rItem.childPermissions[i].childPermissions) {
          this.menuListHandler(rItem.childPermissions[i].childPermissions, rConfig);
        } else {
          list.push(this.nodeHandler(rItem.childPermissions[i], rConfig));
        }
      }
      rItem.childPermissions = list;
      return rItem;
    }
    return this.nodeHandler(rItem, rConfig);
  }

  nodeHandler = (list, rConfig) => {
    let newItem = list;
    for (let i = 0; i < rConfig.length; i += 1) {
      if (rConfig[i].code === newItem.code) {
        console.log(menuIconConfig[newItem.code]);
        newItem = rConfig[i];
        newItem.icon = menuIconConfig[newItem.code];
        break;
      }
    }
    return newItem;
  }

  /**
   * SubMenu 展开/关闭的回调
   */
  onOpenChange = (keys) => {
    const { openKeys } = this.state;
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    this.setState({
      openKeys: [latestOpenKey],
    });
  }

  /**
   * menu选中事件
   */
  handleClick = (e) => {
    console.log(e);
    this.setState({ current: e.key });
  }

  render() {
    const { menuList, openKeys, current } = this.state;
    console.log('openKeys', openKeys);
    const { collapsed } = this.props;
    // console.log(current);

    return (
      <div>
        <div className={styles['menu-logo']} id="logo">
          <img alt="logo图片" src={logo} />
          <h1>免费短信充值平台</h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          onClick={this.handleClick}
          onOpenChange={this.onOpenChange}
          openKeys={collapsed ? [] : openKeys}
          selectedKeys={[current]}
        >
          {
            menuList.map(list => list.childPermissions ? (
              <SubMenu
                key={list.code}
                title={(
                  <span>
                    <Icon type={list.icon} />
                    <span>{list.name}</span>
                  </span>
                )}
              >
                {
                  list.childPermissions ? list.childPermissions.map(option => (
                    <Menu.Item key={option.code}>
                      <Link to={option.path}>{option.name}</Link>
                    </Menu.Item>
                  )) : null
                }
              </SubMenu>
            ) : (
              <Menu.Item key={list.code}>
                <Link to={list.path}>{list.name}</Link>
              </Menu.Item>
            ))
          }
        </Menu>
      </div>
    );
  }
}

export default connect(
  state => ({
    collapsed: state.rootReducers.collapsed,
  }),
  null,
)(MenuPage);
