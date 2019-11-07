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
    loginExit: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
    // onLogin: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { loginExit } = this.props;
    loginExit();
  }

  componentWillReceiveProps(nextProps) {
    const { logined } = nextProps;
    // const { onLogin } = this.props;
    if (logined) {
      replace('/home');
      // onLogin();
    }
  }

  /**
   * 登录
   */
  handleSubmit = (e) => {
    e.preventDefault();
    const { form, loginRequest } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        loginRequest(values);
      }
    });
  };

  render() {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Form onSubmit={this.handleSubmit} className={styles['login-form']}>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入用户名' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="用户名"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="密码"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className={styles['login-form-button']}>
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
    loginRequest: (data) => {
      dispatch({ type: 'login/LOGIN_ACTION', data });
    },
    loginExit: () => {
      dispatch({ type: 'login/LOGIN_EXIT' });
    },
  }),
)(Form.create({ name: 'normal_login' })(LoginValidation));
