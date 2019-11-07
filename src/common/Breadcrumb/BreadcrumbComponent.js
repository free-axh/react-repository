import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import styles from './index.module.less';


class BreadcrumbComponent extends Component {
  static propTypes = {
    breadcrumbMessage: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    const { breadcrumbMessage } = this.props;
    this.state = {
      breadcrumbMessage,
    };
  }

  render() {
    const { breadcrumbMessage } = this.state;
    return (
      Array.isArray(breadcrumbMessage) ? (
        <Breadcrumb className={styles.breadcrumb}>
          {
            breadcrumbMessage.map(item => (
              <Breadcrumb.Item key={item.title}>
                {
                  !item.path ? item.title : (
                    <Link to={item.path}>{item.title}</Link>
                  )
                }
              </Breadcrumb.Item>
            ))
          }
        </Breadcrumb>
      ) : null
    );
  }
}

export default connect(null, null)(BreadcrumbComponent);
