// 设置车牌号
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Input, Select,
} from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const { Option } = Select;

class SetPlateNumber extends Component {
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
        {activeTabKey === '12'
          ? (
            <div>
              <Form.Item label={<FormattedMessage id="terminalManagement_plate_number" />}>
                {getFieldDecorator('plateNumber', {
                  rules: [
                    { required: true, message: <FormattedMessage id="terminalManagement_input_platenumber" /> },
                    {
                      pattern: new RegExp(/^[0-9A-Z\u4e00-\u9fa5]{1,10}$/),
                      message: <FormattedMessage id="terminalManagement_platnumber_validate" />,
                    },
                  ],
                })(<Input placeholder={messages.terminalManagement_input_platenumber} maxLength={10} autoComplete="off" allowClear />)}
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
              <Form.Item label={<FormattedMessage id="terminalManagement_vin_code" />}>
                {getFieldDecorator('vin', {
                  rules: [
                    { required: true, message: <FormattedMessage id="terminalManagement_input_vincode" /> },
                    {
                      pattern: new RegExp(/^[0-9A-Z]{17}$/),
                      message: <FormattedMessage id="terminalManagement_numberAZrange_validate" values={{ num: 17 }} />,
                    },
                  ],
                })(<Input placeholder={messages.terminalManagement_input_vincode} maxLength={17} autoComplete="off" allowClear />)}
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
export default connect()(injectIntl(SetPlateNumber));
