import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Button } from 'antd';
import { replace } from '../../utils/router/routeMethods';


import styles from './index.module.less';
import './antdTest.less';


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
      <Form onSubmit={this.handleSubmit} className={styles['login-form']}>
        <Form.Item>
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Username"
          />,
        </Form.Item>
        <Form.Item>
          <Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="Password"
          />,
        </Form.Item>
        <Form.Item>
          <Button onClick={this.login} type="primary" htmlType="submit" className={styles['login-form-button']}>
            登录
          </Button>
        </Form.Item>
      </Form>
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
