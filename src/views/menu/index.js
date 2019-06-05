import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getMenuList } from '../../utils/menuConfig';

import styles from './index.module.less';

class Menu extends Component {
  data = {
    menuList: null,
  }

  constructor(props) {
    super(props);
    this.data.menuList = getMenuList();
    this.menuListClick = this.menuListClick.bind(this);
    this.state = {
      focusKey: null,
    };
  }

  menuListClick = (list) => {
    this.setState({ focusKey: list.key });
  }

  render() {
    const { menuList } = this.data;
    const { focusKey } = this.state;

    return (
      <div className={styles.menu}>
        <ul>
          {
            menuList.map(list => (
              <li onClick={() => this.menuListClick(list)} className={focusKey === list.key ? 'list-focus' : null}>
                <Link to={list.router}>{list.title}</Link>
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}

export default connect(null, null)(Menu);
