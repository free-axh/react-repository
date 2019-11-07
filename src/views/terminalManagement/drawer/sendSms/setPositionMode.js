// 设置定位模式
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Input, Select,
} from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const { Option } = Select;

class SetPositionMode extends Component {
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
        {activeTabKey === '15'
          ? (
            <div>
              <Form.Item label={<FormattedMessage id="terminalManagement_location_type" />}>
                {getFieldDecorator('locationType', {
                  rules: [
                    { required: true, message: <FormattedMessage id="terminalManagement_select_locationtype" /> },
                  ],
                })(
                  <Select
                    style={{ width: '100%' }}
                    placeholder={messages.terminalManagement_select_locationtype}
                    allowClear
                  >
                    <Option value="0">
                      <FormattedMessage id="terminalManagement_gps_bigdipper" />
                    </Option>
                    <Option value="1">GPS</Option>
                    <Option value="2">
                      <FormattedMessage id="terminalManagement_bigdipper" />
                    </Option>
                    <Option value="3">
                      <FormattedMessage id="terminalManagement_base_station" />
                    </Option>
                    <Option value="4">
                      <FormattedMessage id="terminalManagement_satellite_basestation" />
                    </Option>
                    <Option value="5">
                      <FormattedMessage id="terminalManagement_all_satellitebasestation" />
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
export default connect()(injectIntl(SetPositionMode));
