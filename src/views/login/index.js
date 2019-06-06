import React, { Component } from 'react';
import { connect } from 'react-redux';

import LoginValidation from './loginValidation';

import styles from './index.module.less';

class Login extends Component {
  render() {
    return (
      <div className={styles['login-bg']}>
        <LoginValidation {...this.props} />
      </div>
    );
  }
}

export default connect(null, null)(Login);
