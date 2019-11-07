// 账户信息
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Row, Input, Col,
} from 'antd';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import styles from './index.module.less';

class AccountInfoForm extends Component {
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
    this.state = {
    };
  }

  render() {
    const {
      visibleKey, intl: { messages },
      form: { getFieldDecorator, getFieldsValue },
    } = this.props;
    const { accountName, bankBranch, depositBank, bankAccount } = getFieldsValue();

    return (
      <div className={styles['drawer-rowPanel']}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label={<FormattedMessage id="groupTree_account_name" />}>
              {getFieldDecorator('accountName')(
                visibleKey === 'detail'
                  ? (<div className={styles['detail-info-text']}>{accountName}</div>)
                  : <Input placeholder={messages.groupTree_input_accountname} maxLength={50} autoComplete="off" allowClear />,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={<FormattedMessage id="groupTree_bank_account" />}>
              {getFieldDecorator('bankAccount', {
                rules: [
                  {
                    pattern: new RegExp(/^\d{13,19}$/),
                    message: <FormattedMessage id="groupTree_number_validate" values={{ digits: '13-19' }} />,
                  },
                ] })(
                visibleKey === 'detail'
                  ? (<div className={styles['detail-info-text']}>{bankAccount}</div>)
                  : <Input placeholder={messages.groupTree_input_bankaccount} maxLength={19} autoComplete="off" allowClear />,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={<FormattedMessage id="groupTree_deposit_bank" />}>
              {getFieldDecorator('depositBank', {
                rules: [
                  {
                    pattern: new RegExp(/^[\u4e00-\u9fa5]{0,20}$/),
                    message: <FormattedMessage id="groupTree_chinese_validate" values={{ digits: '0-20' }} />,
                  },
                ] })(
                visibleKey === 'detail'
                  ? (<div className={styles['detail-info-text']}>{depositBank}</div>)
                  : <Input placeholder={messages.groupTree_input_depositbank} maxLength={20} autoComplete="off" allowClear />,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label={<FormattedMessage id="groupTree_bank_branch" />}>
              {getFieldDecorator('bankBranch', {
                rules: [
                  {
                    pattern: new RegExp(/^[\u4e00-\u9fa5]{0,20}$/),
                    message: <FormattedMessage id="groupTree_chinese_validate" values={{ digits: '0-20' }} />,
                  },
                ] })(
                visibleKey === 'detail'
                  ? (<div className={styles['detail-info-text']}>{bankBranch}</div>)
                  : <Input placeholder={messages.groupTree_input_bankbranch} maxLength={20} autoComplete="off" allowClear />,
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
)(injectIntl(AccountInfoForm));
