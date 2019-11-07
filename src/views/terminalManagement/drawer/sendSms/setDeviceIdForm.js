// 设置终端ID
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Input,
} from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

class SetDeviceIdForm extends Component {
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
        {activeTabKey === '4'
          ? (
            <div>
              <Form.Item label={<FormattedMessage id="terminalManagement_terminal_phone" />}>
                {getFieldDecorator('phoneNumber', {
                  rules: [
                    { required: true, message: <FormattedMessage id="terminalManagement_input_terminalphone" /> },
                    {
                      pattern: new RegExp(/^1[3456789]\d{9}$/),
                      message: <FormattedMessage id="terminalManagement_phone_validate" />,
                    },
                  ],
                })(<Input placeholder={messages.terminalManagement_input_terminalphone} maxLength={11} autoComplete="off" allowClear />)}
              </Form.Item>
              <Form.Item label={<FormattedMessage id="terminalManagement_terminal_id" />}>
                {getFieldDecorator('deviceId', {
                  rules: [
                    { required: true, message: <FormattedMessage id="terminalManagement_input_terminalid" /> },
                  ],
                })(<Input placeholder={messages.terminalManagement_input_terminalid} maxLength={30} autoComplete="off" allowClear />)}
              </Form.Item>
              <Form.Item label={<FormattedMessage id="terminalManagement_terminal_password" />}>
                {getFieldDecorator('password', {
                  rules: [
                    { required: true, message: <FormattedMessage id="terminalManagement_input_terminalpwd" /> },
                  ],
                })(
                  <Input.Password placeholder={messages.terminalManagement_input_terminalpwd} maxLength={20} autoComplete="off" allowClear />,
                )}
              </Form.Item>
            </div>
          ) : null
            }
      </div>
    );
  }
}
export default connect()(injectIntl(SetDeviceIdForm));
