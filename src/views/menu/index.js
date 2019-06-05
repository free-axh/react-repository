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
  }

  render() {
    const { menuList } = this.data;

    return (
      <div className={styles.menu}>
        <ul>
          {
            menuList.map(list => (
              <li>
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
