import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { replace } from '../../utils/router/routeMethods';

import styles from './loginValidation.module.less';

class LoginValidation extends Component {
  static propTypes = {
    loginRequest: PropTypes.func.isRequired,
    logined: PropTypes.bool.isRequired,
    // history: PropTypes.object.isRequired,
    loginExit: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    const { loginExit } = this.props;
    loginExit();
  }

  login() {
    const { loginRequest } = this.props;
    loginRequest();
  }

  componentWillReceiveProps(nextProps) {
    const { logined } = nextProps;
    if (logined) {
      // const { history } = this.props;
      replace('/home');
    }
  }

  render() {
    return (
      <div className={styles['login-validation']}>
        <div>
          <input type="text" placeholder="请输入账号" />
        </div>
        <div>
          <input type="text" placeholder="请输入密码" />
        </div>
        <button type="button" onClick={this.login}>登录</button>
      </div>
    );
  }
}

export default connect(
  state => ({
    logined: state.loginReducers.logined,
  }),
  dispatch => ({
    loginRequest: () => {
      dispatch({ type: 'login/LOGIN_ACTION' });
    },
    loginExit: () => {
      dispatch({ type: 'login/LOGIN_EXIT' });
    },
  }),
)(LoginValidation);
