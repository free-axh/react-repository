// 远程升级
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Input, Radio,
} from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

class RemoteUpgrade extends Component {
  static propTypes = {
    activeTabKey: PropTypes.string.isRequired,
    form: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      patternKey: '', // 当前显示阈值
    };

    this.patternChenge = this.patternChenge.bind(this);
  }

  // 格式切换
  patternChenge=(e) => {
    const { target: { value } } = e;
    this.setState({
      patternKey: value,
    });
    const { form: { resetFields } } = this.props;
    resetFields();
  }

  // 校验域名及IP
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
    const { patternKey } = this.state;

    return (
      <div>
        {activeTabKey === '7'
          ? (
            <div>
              <Form.Item label={<FormattedMessage id="terminalManagement_format_type" />}>
                {getFieldDecorator('pattern', {
                  rules: [
                    { required: true, message: <FormattedMessage id="terminalManagement_select_format" /> },
                  ],
                })(
                  <Radio.Group onChange={this.patternChenge}>
                    <Radio value={messages.terminalManagement_format_one}>
                      <FormattedMessage id="terminalManagement_format_one" />
                    </Radio>
                    <Radio value={messages.terminalManagement_format_two}>
                      <FormattedMessage id="terminalManagement_format_two" />
                    </Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label={<FormattedMessage id="terminalManagement_file_name" />}>
                {getFieldDecorator('fileName', {
                  rules: [
                    { required: true, message: <FormattedMessage id="terminalManagement_input_filename" /> },
                  ],
                })(
                  <Input placeholder={messages.terminalManagement_input_filename} maxLength={50} autoComplete="off" allowClear />,
                )}
              </Form.Item>
              {
                patternKey === messages.terminalManagement_format_two
                  ? (
                    <div>
                      <Form.Item label={<FormattedMessage id="terminalManagement_user_name" />}>
                        {getFieldDecorator('userName', {
                          rules: [
                            { required: true, message: <FormattedMessage id="terminalManagement_input_username" /> },
                          ],
                        })(
                          <Input placeholder={messages.terminalManagement_input_username} maxLength={20} autoComplete="off" allowClear />,
                        )}
                      </Form.Item>
                      <Form.Item label={<FormattedMessage id="terminalManagement_password" />}>
                        {getFieldDecorator('userPassWord', {
                          rules: [
                            { required: true, message: <FormattedMessage id="terminalManagement_input_password" /> },
                          ],
                        })(
                          <Input.Password placeholder={messages.terminalManagement_input_password} maxLength={20} autoComplete="off" allowClear />,
                        )}
                      </Form.Item>
                      <Form.Item label={<FormattedMessage id="terminalManagement_ip_address" />}>
                        {getFieldDecorator('ipAddress', {
                          rules: [
                            { required: true, message: <FormattedMessage id="terminalManagement_input_ipaddress" /> },
                            {
                              validator: this.serverValidate,
                            },
                          ],
                        })(
                          <Input placeholder={messages.terminalManagement_input_ipaddress} autoComplete="off" allowClear />,
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
                      <Form.Item label={<FormattedMessage id="terminalManagement_path" />}>
                        {getFieldDecorator('path', {
                          rules: [
                            { required: true, message: <FormattedMessage id="terminalManagement_input_path" /> },
                          ],
                        })(
                          <Input placeholder={messages.terminalManagement_input_path} maxLength={50} autoComplete="off" allowClear />,
                        )}
                      </Form.Item>
                    </div>
                  )
                  : null
              }
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
export default connect()(injectIntl(RemoteUpgrade));
