import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import routerConfig from '../../utils/router/routerConfig';
import { push } from '../../utils/router/routeMethods';
import { getStore, setStore } from '../../utils/localStorage';
import styles from './index.module.less';

const { TabPane } = Tabs;

class RouterTabs extends Component {
  static propTypes = {
    collapsed: PropTypes.bool.isRequired,
    menuActiveCodeChange: PropTypes.func.isRequired,
    tablesRouterWayHandler: PropTypes.func.isRequired,
    activePathCode: PropTypes.string.isRequired,
  }

  data = {
    defaultRouter: [{
      name: '工作台',
      code: 'home',
      path: '/home',
    }],
    defaultActiveKey: 'home',
    breadcrumbMessage: [
      { title: 'demo' },
      { title: 'demo' },
      { title: '多语言' },
    ],
  }

  constructor(props) {
    super(props);
    const { activePathCode } = this.props;
    const historyRoutersLocalStorage = getStore('historyRouters');
    const historyRouters = historyRoutersLocalStorage === null
      ? this.data.defaultRouter : JSON.parse(historyRoutersLocalStorage);
    setStore('historyRouters', historyRouters);
    this.state = {
      historyRouters,
      activeKey: activePathCode || 'home',
    };
    this.onChange = this.onChange.bind(this);
    this.onEdit = this.onEdit.bind(this);
  }

  componentWillReceiveProps = (nextProps) => {
    const { activePathCode } = nextProps;
    if (activePathCode !== null) {
      const { historyRouters } = this.state;
      const config = historyRouters.filter(item => item.code === activePathCode);
      if (config.length === 0) {
        const path = this.getActivePath(activePathCode);
        const newHistoryRouters = historyRouters.concat(path);
        setStore('historyRouters', newHistoryRouters);
        this.setState({
          historyRouters: newHistoryRouters,
          activeKey: activePathCode,
        });
      } else {
        this.setState({ activeKey: activePathCode });
      }
    } else {
      this.setState({
        historyRouters: this.data.defaultRouter,
        activeKey: activePathCode,
      });
    }
  }

  onChange = (activeKey) => {
    const { historyRouters } = this.state;
    const { menuActiveCodeChange, tablesRouterWayHandler } = this.props;
    this.setState({ activeKey });
    const config = historyRouters.filter(item => item.code === activeKey);
    if (config) {
      menuActiveCodeChange(activeKey);
      tablesRouterWayHandler();
      push(config[0].path);
    }
  }

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }

  remove = (targetKey) => {
    const { activeKey, historyRouters } = this.state;
    const { menuActiveCodeChange } = this.props;
    let newActiveKey;
    let lastIndex;
    historyRouters.forEach((pane, i) => {
      if (pane.code === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = historyRouters.filter(pane => pane.code !== targetKey);
    if (panes.length && activeKey === targetKey) {
      setStore('historyRouters', panes);
      if (lastIndex >= 0) {
        newActiveKey = panes[lastIndex].code;
      } else {
        newActiveKey = panes[0].code;
      }
      this.setState({ historyRouters: panes, activeKey: newActiveKey });
      const config = historyRouters.filter(item => item.code === newActiveKey);
      push(config[0].path);
      menuActiveCodeChange(newActiveKey);
    } else if (!panes.length) {
      const { defaultRouter, defaultActiveKey } = this.data;
      setStore('historyRouters', this.data.defaultRouter);
      this.setState({ historyRouters: defaultRouter, activeKey: defaultActiveKey });
      push(defaultRouter[0].path);
    } else {
      setStore('historyRouters', panes);
      this.setState({ historyRouters: panes });
    }
  };

  /**
   * 获取当前路由的config
   */
  getActivePath = code => routerConfig.filter(item => item.code === code)

  render() {
    const { historyRouters, activeKey } = this.state;
    const { collapsed } = this.props;

    return (
      <Tabs
        className={styles.tabs}
        style={collapsed ? { left: '80px' } : null}
        onChange={this.onChange}
        onEdit={this.onEdit}
        activeKey={activeKey}
        hideAdd="true"
        type="editable-card"
      >
        {
          historyRouters.map(item => (
            <TabPane tab={item.name} key={item.code} closable={item.closable} />
          ))
        }
      </Tabs>
    );
  }
}

export default connect(
  state => ({
    collapsed: state.rootReducers.collapsed,
  }),
  dispatch => ({
    menuActiveCodeChange: (payload) => {
      dispatch({ type: 'root/MENU_ACTIVE_CODE', payload });
    },
    tablesRouterWayHandler: () => {
      dispatch({ type: 'root/TABLES_ROUTER_WAY' });
    },
  }),
)(RouterTabs);
