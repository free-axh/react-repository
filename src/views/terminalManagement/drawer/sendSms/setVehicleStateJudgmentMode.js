// 设置车辆状态判断模式
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Input, Select,
} from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const { Option } = Select;

class SetVehicleStateJudgmentMode extends Component {
  static propTypes = {
    activeTabKey: PropTypes.string.isRequired,
    form: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      thresholdKey: '', // 当前显示阈值
    };

    this.patternChenge = this.patternChenge.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { form: { getFieldsValue } } = nextProps;
    const { pattern } = getFieldsValue();
    const { thresholdKey } = this.state;
    if (pattern !== undefined && pattern !== thresholdKey) {
      this.setState({
        thresholdKey: pattern,
      });
    }
  }

  // 模式切换
  patternChenge=(value) => {
    this.setState({
      thresholdKey: value,
    });
  }

  render() {
    const { activeTabKey, intl: { messages }, form: { getFieldDecorator } } = this.props;
    const { thresholdKey } = this.state;

    return (
      <div>
        {activeTabKey === '16'
          ? (
            <div>
              <Form.Item label={<FormattedMessage id="terminalManagement_pattern" />}>
                {getFieldDecorator('pattern', {
                  rules: [
                    { required: true, message: <FormattedMessage id="terminalManagement_select_pattern" /> },
                  ],
                })(
                  <Select
                    style={{ width: '100%' }}
                    placeholder={messages.terminalManagement_select_pattern}
                    onChange={this.patternChenge}
                    allowClear
                  >
                    <Option value="0">
                      <FormattedMessage id="terminalManagement_accstatus_speed" />
                    </Option>
                    <Option value="1">
                      <FormattedMessage id="terminalManagement_accstatus_speedvibration" />
                    </Option>
                    <Option value="2">
                      <FormattedMessage id="terminalManagement_self_learningmodel" />
                    </Option>
                  </Select>,
                )}
              </Form.Item>
              {
                thresholdKey === '1'
                  ? (
                    <Form.Item label={<FormattedMessage id="terminalManagement_speed_threshold" />}>
                      {getFieldDecorator('value', {
                        rules: [
                          { required: true, message: <FormattedMessage id="terminalManagement_input_speedthreshold" /> },
                          {
                            pattern: /^[0-9]\d*$/,
                            message: <FormattedMessage id="terminalManagement_integer_validate" />,
                          },
                        ],
                      })(
                        <Input placeholder={messages.terminalManagement_input_speedthreshold} maxLength={3} autoComplete="off" allowClear />,
                      )}
                    </Form.Item>
                  )
                  : null
              }
              {
                thresholdKey === '2'
                  ? (
                    <Form.Item label={<FormattedMessage id="terminalManagement_vh_percentage" />}>
                      {getFieldDecorator('value', {
                        rules: [
                          { required: true, message: <FormattedMessage id="terminalManagement_input_vhpercentage" /> },
                          {
                            type: 'number',
                            min: 40,
                            max: 80,
                            transform: (value) => {
                              if (value) {
                                return Number(value);
                              }
                              return value;
                            },
                            message: <FormattedMessage id="terminalManagement_number_validate" values={{ digits: '40-80' }} />,
                          },
                        ],
                      })(
                        <Input placeholder={messages.terminalManagement_input_vhpercentage} maxLength={2} autoComplete="off" allowClear />,
                      )}
                    </Form.Item>
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
export default connect()(injectIntl(SetVehicleStateJudgmentMode));
