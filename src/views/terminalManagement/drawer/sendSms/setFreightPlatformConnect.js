// 设置货运平台连接
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Input, Radio, Select,
} from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const { Option } = Select;

class SetFreightPlatformConnect extends Component {
  static propTypes = {
    activeTabKey: PropTypes.string.isRequired,
    form: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 校验服务器地址(域名及IP)
  serverValidate=(rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }
    // IP
    const ipReg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    // 域名
    const domainNamereg = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
    if (ipReg.test(value) || domainNamereg.test(value)) {
      callback();
    } else {
      callback(<FormattedMessage id="terminalManagement_ipdomain_validate" />);
    }
  }

  render() {
    const { activeTabKey, intl: { messages }, form: { getFieldDecorator } } = this.props;

    return (
      <div>
        {activeTabKey === '11'
          ? (
            <div>
              <Form.Item label={<FormattedMessage id="terminalManagement_ip_type" />}>
                {getFieldDecorator('ipName', {
                  rules: [
                    { required: true, message: <FormattedMessage id="terminalManagement_select_iptype" /> },
                  ],
                })(
                  <Radio.Group>
                    <Radio value="IP1">IP1</Radio>
                    <Radio value="IP2">IP2</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label={<FormattedMessage id="terminalManagement_server_address" />}>
                {getFieldDecorator('ip', {
                  rules: [
                    { required: true, message: <FormattedMessage id="terminalManagement_input_serveraddress" /> },
                    {
                      validator: this.serverValidate,
                    },
                  ],
                })(
                  <Input placeholder={messages.terminalManagement_input_serveraddress} autoComplete="off" allowClear />,
                )}
              </Form.Item>
              <Form.Item label={<FormattedMessage id="terminalManagement_port" />}>
                {getFieldDecorator('port', {
                  rules: [
                    { required: true, message: <FormattedMessage id="terminalManagement_input_port" /> },
                    {
                      pattern: new RegExp(/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{4}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/),
                      message: <FormattedMessage id="terminalManagement_port_validate" />,
                    },
                  ],
                })(
                  <Input placeholder={messages.terminalManagement_input_port} maxLength={5} autoComplete="off" allowClear />,
                )}
              </Form.Item>
              <Form.Item label={<FormattedMessage id="terminalManagement_sim_number" />}>
                {getFieldDecorator('simCard', {
                  rules: [
                    { required: true, message: <FormattedMessage id="terminalManagement_input_simnumber" /> },
                    {
                      pattern: new RegExp(/^\d{1,20}$/),
                      message: <FormattedMessage id="terminalManagement_integerrange_validate" values={{ range: '1-20' }} />,
                    },
                  ],
                })(
                  <Input placeholder={messages.terminalManagement_input_simnumber} maxLength={20} autoComplete="off" allowClear />,
                )}
              </Form.Item>
              <Form.Item label={<FormattedMessage id="terminalManagement_terminal_id" />}>
                {getFieldDecorator('deviceId', {
                  rules: [
                    { required: true, message: <FormattedMessage id="terminalManagement_input_terminalid" /> },
                    {
                      pattern: new RegExp(/^[A-Z\d]{1,30}$/),
                      message: <FormattedMessage id="terminalManagement_numberAZ_validate" />,
                    },
                  ],
                })(
                  <Input placeholder={messages.terminalManagement_input_terminalid} maxLength={30} autoComplete="off" allowClear />,
                )}
              </Form.Item>
              <Form.Item label={<FormattedMessage id="terminalManagement_plate_color" />}>
                {getFieldDecorator('plateColor', {
                  rules: [
                    { required: true, message: <FormattedMessage id="terminalManagement_select_platecolor" /> },
                  ],
                })(
                  <Select
                    style={{ width: '100%' }}
                    placeholder={messages.terminalManagement_select_platecolor}
                    allowClear
                  >
                    <Option value="0">
                      <FormattedMessage id="terminalManagement_no_registration" />
                    </Option>
                    <Option value="1">
                      <FormattedMessage id="terminalManagement_blue_color" />
                    </Option>
                    <Option value="2">
                      <FormattedMessage id="terminalManagement_yellow_color" />
                    </Option>
                    <Option value="3">
                      <FormattedMessage id="terminalManagement_black_color" />
                    </Option>
                    <Option value="4">
                      <FormattedMessage id="terminalManagement_white_color" />
                    </Option>
                    <Option value="5">
                      <FormattedMessage id="terminalManagement_green_color" />
                    </Option>
                    <Option value="9">
                      <FormattedMessage id="terminalManagement_other_color" />
                    </Option>
                  </Select>,
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
export default connect()(injectIntl(SetFreightPlatformConnect));
