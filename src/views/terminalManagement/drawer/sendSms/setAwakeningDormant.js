// 设置苏醒(休眠)模式
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Input, Select,
} from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const { Option } = Select;

class SetAwakeningDormant extends Component {
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
        {activeTabKey === '9'
          ? (
            <div>
              <Form.Item label={<FormattedMessage id="terminalManagement_sleep_mode" />}>
                {getFieldDecorator('sleepMode', {
                  rules: [
                    { required: true, message: <FormattedMessage id="terminalManagement_select_sleepMode" /> },
                  ],
                })(
                  <Select
                    style={{ width: '100%' }}
                    placeholder={messages.terminalManagement_select_sleepMode}
                    allowClear
                  >
                    <Option value="0">
                      <FormattedMessage id="terminalManagement_no_sleep" />
                    </Option>
                    <Option value="1">
                      <FormattedMessage id="terminalManagement_engine_status" />
                    </Option>
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label={<FormattedMessage id="terminalManagement_is_reportlocation" />}>
                {getFieldDecorator('isReportLocation', {
                  rules: [
                    { required: true, message: <FormattedMessage id="terminalManagement_select_isreportlocation" /> },
                  ],
                })(
                  <Select
                    style={{ width: '100%' }}
                    placeholder={messages.terminalManagement_select_isreportlocation}
                    allowClear
                  >
                    <Option value="0">
                      <FormattedMessage id="terminalManagement_sleep_noreport" />
                    </Option>
                    <Option value="1">
                      <FormattedMessage id="terminalManagement_sleep_report" />
                    </Option>
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label={<FormattedMessage id="terminalManagement_location_reportinterval" />}>
                {getFieldDecorator('locationReportInterval', {
                  rules: [
                    { required: true, message: <FormattedMessage id="terminalManagement_input_locationreportinterval" /> },
                    {
                      type: 'number',
                      min: 5,
                      max: 300,
                      transform: (value) => {
                        if (value) {
                          return Number(value);
                        }
                        return value;
                      },
                      message: <FormattedMessage id="terminalManagement_number_validate" values={{ digits: '5-300' }} />,
                    },
                  ],
                })(
                  <Input placeholder={messages.terminalManagement_input_locationreportinterval} maxLength={3} autoComplete="off" allowClear />,
                )}
              </Form.Item>
              <Form.Item label={<FormattedMessage id="terminalManagement_heart_reportinterval" />}>
                {getFieldDecorator('heartReportInterval', {
                  rules: [
                    { required: true, message: <FormattedMessage id="terminalManagement_input_heartreportinterval" /> },
                    {
                      type: 'number',
                      min: 120,
                      max: 400,
                      transform: (value) => {
                        if (value) {
                          return Number(value);
                        }
                        return value;
                      },
                      message: <FormattedMessage id="terminalManagement_number_validate" values={{ digits: '120-400' }} />,
                    },
                  ],
                })(
                  <Input placeholder={messages.terminalManagement_input_heartreportinterval} maxLength={3} autoComplete="off" allowClear />,
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
export default connect()(injectIntl(SetAwakeningDormant));
