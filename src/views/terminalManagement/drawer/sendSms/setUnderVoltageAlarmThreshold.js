// 设置欠压报警阈值
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Input,
} from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

class SetUnderVoltageAlarmThreshold extends Component {
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
        {activeTabKey === '14'
          ? (
            <div>
              <Form.Item label={<FormattedMessage id="terminalManagement_volatage" />}>
                {getFieldDecorator('volatage', {
                  rules: [
                    { required: true, message: <FormattedMessage id="terminalManagement_input_volatage" /> },
                    {
                      pattern: new RegExp(/^(([1-9]{1}\d*)|(0{1}))(\.\d{1})?$/),
                      message: <FormattedMessage id="terminalManagement_volatage_validate" />,
                    },
                  ],
                })(<Input placeholder={messages.terminalManagement_input_volatage} maxLength={4} autoComplete="off" allowClear />)}
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
export default connect()(injectIntl(SetUnderVoltageAlarmThreshold));
