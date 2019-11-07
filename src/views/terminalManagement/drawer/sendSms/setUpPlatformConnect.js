// 设置连接上级平台
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Input, Radio, Select,
} from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const { Option } = Select;

class SetUpPlatformConnect extends Component {
  static propTypes = {
    activeTabKey: PropTypes.string.isRequired,
    form: PropTypes.object.isRequired,
    serversData: PropTypes.array.isRequired,
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

  serverChange=(value) => {
    const { serversData, form: { setFieldsValue } } = this.props;
    const newObj = {
      ip: '',
      port: '',
    };
    serversData.map((item) => {
      if (item.id === value) {
        newObj.ip = item.serverAddress;
        newObj.port = item.port;
      }
      return item;
    });
    setFieldsValue(newObj);
  }

  render() {
    const {
      activeTabKey, serversData, intl: { messages },
      form: { getFieldDecorator },
    } = this.props;

    return (
      <div>
        {activeTabKey === '2'
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
              <Form.Item label={<FormattedMessage id="terminalManagement_server_name" />}>
                {getFieldDecorator('serverName')(
                  <Select
                    style={{ width: '100%' }}
                    onChange={this.serverChange}
                    placeholder={messages.terminalManagement_select_servername}
                    notFoundContent={messages.terminalManagement_no_server}
                    allowClear
                  >
                    {serversData.map(item => (
                      <Option
                        value={item.id}
                        key={`server${item.id}`}
                      >
                        {item.serverName}
                      </Option>
                    ))}

                  </Select>,
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
export default connect(
  state => ({
    serversData: state.terminalManagementReducers.serversData,
  }),
)(injectIntl(SetUpPlatformConnect));
