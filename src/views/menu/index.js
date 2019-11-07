import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import PropTypes from 'prop-types';
import routerConfig from '../../utils/router/routerConfig';
import { menuIconConfig, getMenuList } from '../../utils/menuConfig';
import { getStore, setStore } from '../../utils/localStorage';
import logo from '../../static/image/logo.svg';

import styles from './index.module.less';

const { SubMenu } = Menu;

class MenuPage extends Component {
  static propTypes = {
    menuActiveCodeChange: PropTypes.func.isRequired,
    menuRouterWayHandler: PropTypes.func.isRequired,
    activePathCode: PropTypes.string.isRequired,
    collapsed: PropTypes.bool.isRequired,
  }

  data = {
    author: [],
  }

  constructor(props) {
    super(props);
    const menuList = getStore('basic'); // getMenuList();
    const defaultMenuList = getMenuList();
    const newMenuList = menuList
      ? this.menuListHandler(defaultMenuList.concat(JSON.parse(menuList)), routerConfig) : [];
    setStore('authorMenuList', this.data.author);
    this.state = {
      menuList: newMenuList,
      openKeys: ['home', 'Dashboard'],
      current: 'home',
    };
    this.updateMenuKeyPath('home', ['home', 'Dashboard']);
    this.onOpenChange = this.onOpenChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { activePathCode, collapsed } = this.props;
    this.setMenuOpenKers(activePathCode, collapsed);
  }

  componentWillReceiveProps = (nextProps) => {
    /**
     * activePatchCode的改变进行左侧菜单项的展开和收起
     */
    const { activePathCode, collapsed } = nextProps;
    this.setMenuOpenKers(activePathCode, collapsed);
  }

  /**
   * 组装当前页面需展开和选中的menu值
   */
  setMenuOpenKers = (activePathCode, collapsed) => {
    const menuKeyPath = getStore('menuKeyPath');
    if (activePathCode) {
      const keyPath = menuKeyPath ? JSON.parse(menuKeyPath) : null;
      let activePath = [];
      if (keyPath) { activePath = keyPath[activePathCode]; }
      this.setState({
        current: activePathCode,
        openKeys: collapsed ? [] : (activePath || []),
      });
    }
  }

  /**
   * menu数组组装
   */
  menuListHandler = (menuList, rConfig) => menuList.map(
    item => this.listConfigHandler(item, rConfig),
  );

  listConfigHandler = (item, rConfig) => {
    let rItem = item;
    if (rItem.childPermissions) {
      const list = [];
      for (let i = 0; i < rItem.childPermissions.length; i += 1) {
        list.push(this.listConfigHandler(rItem.childPermissions[i], rConfig));
      }
      rItem = this.nodeHandler(rItem, rConfig);
      rItem.childPermissions = list;
      return rItem;
    }
    return this.nodeHandler(rItem, rConfig);
  }

  nodeHandler = (list, rConfig) => {
    let newItem = list;
    for (let i = 0; i < rConfig.length; i += 1) {
      if (rConfig[i].code === newItem.code) {
        this.authorMenuList(rConfig[i].code);
        newItem = rConfig[i];
        break;
      }
    }
    newItem.icon = menuIconConfig[newItem.code];
    return newItem;
  }

  /**
   * 用户权限页面code集合
   */
  authorMenuList = (code) => {
    if (this.data.author.indexOf(code) === -1) {
      this.data.author.push(code);
    }
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
    const { menuActiveCodeChange, menuRouterWayHandler } = this.props;
    const { key, keyPath } = e;
    console.log(key, ';;');
    this.setState({ current: key });
    menuActiveCodeChange(key);
    menuRouterWayHandler();
    this.updateMenuKeyPath(key, keyPath);
  }

  /**
   * 保存选中menu keypath
   * 每次选中menu，将对应的keypath存入缓存，在页面手动刷新或通过点击Tabs选项切换页面时，获取存入缓存的数据menuKeyPath
   * 进行动态的展开左侧菜单项
   */
  updateMenuKeyPath = (key, keyPath) => {
    const menuSelectedKeyPath = getStore('menuKeyPath');
    if (menuSelectedKeyPath !== null) {
      const menuKeyPath = JSON.parse(menuSelectedKeyPath);
      if (menuKeyPath[key] === undefined) {
        menuKeyPath[key] = keyPath;
        setStore('menuKeyPath', menuKeyPath);
      }
    } else {
      const config = {};
      config[key] = keyPath;
      setStore('menuKeyPath', config);
    }
  }

  render() {
    const { menuList, openKeys, current } = this.state;

    return (
      <div>
        <div className={styles['menu-logo']} id="logo">
          <img alt="logo图片" src={logo} />
          <h1>运维平台</h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          onClick={this.handleClick}
          onOpenChange={this.onOpenChange}
          openKeys={openKeys}
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
    activePathCode: state.rootReducers.activePathCode,
  }),
  dispatch => ({
    menuActiveCodeChange: (payload) => {
      dispatch({ type: 'root/MENU_ACTIVE_CODE', payload });
    },
    menuRouterWayHandler: () => {
      dispatch({ type: 'root/MENU_ROUTER_WAY' });
    },
  }),
)(MenuPage);
