// 设置密码
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Input,
} from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

class SetPasswordForm extends Component {
  static propTypes = {
    activeTabKey: PropTypes.string.isRequired,
    form: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { activeTabKey, intl: { messages }, form: { getFieldDecorator } } = this.props;

    return (
      <div>
        {activeTabKey === '1'
          ? (
            <div>
              <Form.Item label={<FormattedMessage id="terminalManagement_old_password" />}>
                {getFieldDecorator('password', {
                  rules: [
                    { required: true, message: <FormattedMessage id="terminalManagement_input_oldpassword" /> },
                  ],
                })(<Input.Password placeholder={messages.terminalManagement_input_oldpassword} maxLength={20} autoComplete="off" allowClear />)}
              </Form.Item>
              <Form.Item label={<FormattedMessage id="terminalManagement_new_password" />}>
                {getFieldDecorator('newPassword', {
                  rules: [
                    { required: true, message: <FormattedMessage id="terminalManagement_input_newpassword" /> },
                  ],
                })(<Input.Password placeholder={messages.terminalManagement_input_newpassword} maxLength={20} autoComplete="off" allowClear />)}
              </Form.Item>
            </div>
          ) : null
            }
      </div>
    );
  }
}
export default connect()(injectIntl(SetPasswordForm));
