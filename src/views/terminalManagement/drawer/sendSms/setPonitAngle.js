// 设置拐点补偿角度
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Input, Select,
} from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const { Option } = Select;

class SetPonitAngle extends Component {
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
        {activeTabKey === '8'
          ? (
            <div>
              <Form.Item label={<FormattedMessage id="terminalManagement_compensation_mode" />}>
                {getFieldDecorator('compensationMode', {
                  rules: [
                    { required: true, message: <FormattedMessage id="terminalManagement_select_compensationmode" /> },
                  ],
                })(
                  <Select
                    style={{ width: '100%' }}
                    placeholder={messages.terminalManagement_select_compensationmode}
                    allowClear
                  >
                    <Option value="0">
                      <FormattedMessage id="terminalManagement_azimuth" />
                    </Option>
                    <Option value="1">
                      <FormattedMessage id="terminalManagement_gyroscope" />
                    </Option>
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label={<FormattedMessage id="terminalManagement_compensation_angle" />}>
                {getFieldDecorator('compensationAngle', {
                  rules: [
                    { required: true, message: <FormattedMessage id="terminalManagement_input_compensationangle" /> },
                    {
                      pattern: new RegExp(/^([0-2][0-9]{0,2}|[4-9][0-9]{0,1}|[3][0-9]{0,1}|[3][0-5][0-9])$/),
                      message: <FormattedMessage id="terminalManagement_number_validate" values={{ digits: '0-359' }} />,
                    },
                  ],
                })(
                  <Input placeholder={messages.terminalManagement_zero_compensationangle} maxLength={3} autoComplete="off" allowClear />,
                )}
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
export default connect()(injectIntl(SetPonitAngle));
