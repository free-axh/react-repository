// 设置里程基值
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Input,
} from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

class SetMileageBaseValue extends Component {
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
        {activeTabKey === '13'
          ? (
            <div>
              <Form.Item label={<FormattedMessage id="terminalManagement_mileage" />}>
                {getFieldDecorator('mileage', {
                  rules: [
                    { required: true, message: <FormattedMessage id="terminalManagement_input_mileage" /> },
                    {
                      pattern: new RegExp(/^\d{1,9}$/),
                      message: <FormattedMessage id="terminalManagement_integer_validate" />,
                    },
                  ],
                })(<Input placeholder={messages.terminalManagement_input_mileage} maxLength={9} autoComplete="off" allowClear />)}
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
export default connect()(injectIntl(SetMileageBaseValue));
