// 收票信息
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Row, Input, Col,
} from 'antd';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import CitySelect from '../citySelect';
import styles from './index.module.less';

class TicketInfoForm extends Component {
  static propTypes = {
    visibleKey: PropTypes.string,
    form: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  }

  static defaultProps = {
    visibleKey: null,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      visibleKey, form: mainForm, intl: { messages },
      form: { getFieldDecorator, getFieldsValue },
    } = this.props;
    const {
      ticketCollector, accountAddress, accountNumber,
      accountEmail, accountArea, accountRemark,
    } = getFieldsValue();
    return (
      <div>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label={<FormattedMessage id="groupTree_ticket_collector" />}>
              {getFieldDecorator('ticketCollector', {
                rules: [
                  {
                    pattern: new RegExp(/^[\u4e00-\u9fa5]{0,4}$/),
                    message: <FormattedMessage id="groupTree_chinese_validate" values={{ digits: '0-4' }} />,
                  },
                ] })(
                visibleKey === 'detail'
                  ? (<div className={styles['detail-info-text']}>{ticketCollector}</div>)
                  : <Input placeholder={messages.groupTree_input_ticketcollector} autoComplete="off" maxLength={4} allowClear />,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={<FormattedMessage id="groupTree_account_number" />}>
              {getFieldDecorator('accountNumber', {
                rules: [
                  {
                    pattern: new RegExp(/^1[3456789]\d{9}$/),
                    message: <FormattedMessage id="groupTree_phone_validate" />,
                  }],
              })(
                visibleKey === 'detail'
                  ? (<div className={styles['detail-info-text']}>{accountNumber}</div>)
                  : <Input placeholder={messages.groupTree_input_accountnumber} autoComplete="off" allowClear />,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={<FormattedMessage id="groupTree_account_area" />}>
              {getFieldDecorator('accountArea')(
                visibleKey === 'detail'
                  ? (<div className={styles['detail-info-text']}>{accountArea ? accountArea.split(',')[0] : ''}</div>)
                  : <CitySelect form={mainForm} name="accountArea" />,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label={<FormattedMessage id="groupTree_account_address" />}>
              {getFieldDecorator('accountAddress')(
                visibleKey === 'detail'
                  ? (<div className={styles['detail-info-text']}>{accountAddress}</div>)
                  : <Input placeholder={messages.groupTree_input_accountaddress} maxLength={50} autoComplete="off" allowClear />,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={<FormattedMessage id="groupTree_email" />}>
              {getFieldDecorator('accountEmail', {
                rules: [
                  {
                    pattern: new RegExp(/^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/),
                    message: <FormattedMessage id="groupTree_email_validate" />,
                  }],
              })(
                visibleKey === 'detail'
                  ? (<div className={styles['detail-info-text']}>{accountEmail}</div>)
                  : <Input placeholder={messages.groupTree_input_email} autoComplete="off" allowClear />,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={<FormattedMessage id="groupTree_remark" />}>
              {getFieldDecorator('accountRemark')(
                visibleKey === 'detail'
                  ? (<div className={styles['detail-info-text']}>{accountRemark}</div>)
                  : <Input placeholder={messages.groupTree_input_remark} maxLength={50} autoComplete="off" allowClear />,
              )}
            </Form.Item>
          </Col>
        </Row>
      </div>
    );
  }
}
export default connect(
  state => ({
    visibleKey: state.groupTreeReducers.visibleKey,
  }),
)(injectIntl(TicketInfoForm));
