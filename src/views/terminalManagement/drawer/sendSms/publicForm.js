// 公共表单
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
    currentKey: PropTypes.string.isRequired,
    form: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      activeTabKey, currentKey, intl: { messages },
      form: { getFieldDecorator },
    } = this.props;

    return (
      <div>
        {activeTabKey === currentKey
          ? (
            <Form.Item label={<FormattedMessage id="terminalManagement_terminal_password" />}>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: <FormattedMessage id="terminalManagement_input_terminalpwd" /> },
                ],
              })(
                <Input.Password placeholder={messages.terminalManagement_input_terminalpwd} maxLength={20} autoComplete="off" allowClear />,
              )}
            </Form.Item>
          ) : null
            }
      </div>
    );
  }
}
export default connect()(injectIntl(SetApnForm));
