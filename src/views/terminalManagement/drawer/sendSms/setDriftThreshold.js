// 设置漂移阈值
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Input,
} from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

class SetApnForm extends Component {
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
        {activeTabKey === '17'
          ? (
            <div>
              <Form.Item label={<FormattedMessage id="terminalManagement_distance_value" />}>
                {getFieldDecorator('distanceValue', {
                  rules: [
                    { required: true, message: <FormattedMessage id="terminalManagement_input_distancevalue" /> },
                    {
                      pattern: new RegExp(/^[0-9]\d*$/),
                      message: <FormattedMessage id="terminalManagement_integer_validate" />,
                    },
                  ],
                })(<Input placeholder={messages.terminalManagement_input_distancevalue} maxLength={3} autoComplete="off" allowClear />)}
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
export default connect()(injectIntl(SetApnForm));
