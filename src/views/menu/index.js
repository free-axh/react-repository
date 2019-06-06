import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';
import { getMenuList } from '../../utils/menuConfig';

// import styles from './index.module.less';

const { SubMenu } = Menu;

class MenuPage extends Component {
  data = {
    menuList: null,
  }

  constructor(props) {
    super(props);
    this.data.menuList = getMenuList();
  }

  render() {
    const { menuList } = this.data;

    return (
      <div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
        >
          {
            menuList.map(list => list.options ? (
              <SubMenu
                key={list.key}
                title={(
                  <span>
                    <Icon type={list.icon} />
                    {list.title}
                  </span>
                )}
              >
                {
                  list.options ? list.options.map(option => (
                    <Menu.Item key={option.key}>
                      <Link to={option.path}>{option.title}</Link>
                    </Menu.Item>
                  )) : null
                }
              </SubMenu>
            ) : (
              <Menu.Item key={list.key}>
                <Link to={list.path}>{list.title}</Link>
              </Menu.Item>
            ))
          }
        </Menu>
      </div>
    );
  }
}

export default connect(null, null)(MenuPage);
