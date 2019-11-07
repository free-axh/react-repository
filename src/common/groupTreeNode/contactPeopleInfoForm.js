// 联系人信息
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Row, Input, Col,
} from 'antd';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import CitySelect from '../citySelect';
import styles from './index.module.less';

class ContactPeopleInfoForm extends Component {
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
      visibleKey, form: mainForm, intl: { messages },
      form: { getFieldDecorator, getFieldsValue },
    } = this.props;
    const {
      contacts, contactNumber, contactArea,
      contactAddress, email, remark,
    } = getFieldsValue();

    return (
      <div>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label={<FormattedMessage id="groupTree_contacts" />}>
              {getFieldDecorator('contacts', {
                rules: [
                  {
                    pattern: new RegExp(/^[\u4e00-\u9fa5]{0,4}$/),
                    message: <FormattedMessage id="groupTree_chinese_validate" values={{ digits: '0-4' }} />,
                  },
                ],
              })(
                visibleKey === 'detail'
                  ? (<div className={styles['detail-info-text']}>{contacts}</div>)
                  : <Input placeholder={messages.groupTree_input_contacts} autoComplete="off" maxLength={4} allowClear />,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={<FormattedMessage id="groupTree_contact_number" />}>
              {getFieldDecorator('contactNumber', {
                rules: [
                  {
                    pattern: new RegExp(/^1[3456789]\d{9}$/),
                    message: <FormattedMessage id="groupTree_phone_validate" />,
                  }],
              })(
                visibleKey === 'detail'
                  ? (<div className={styles['detail-info-text']}>{contactNumber}</div>)
                  : <Input placeholder={messages.groupTree_input_contactnumber} autoComplete="off" allowClear />,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={<FormattedMessage id="groupTree_contact_area" />}>
              {getFieldDecorator('contactArea')(
                visibleKey === 'detail'
                  ? (<div className={styles['detail-info-text']}>{contactArea ? contactArea.split(',')[0] : ''}</div>)
                  : <CitySelect form={mainForm} name="contactArea" />,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label={<FormattedMessage id="groupTree_contact_address" />}>
              {getFieldDecorator('contactAddress')(
                visibleKey === 'detail'
                  ? (<div className={styles['detail-info-text']}>{contactAddress}</div>)
                  : <Input placeholder={messages.groupTree_input_contactaddress} maxLength={50} autoComplete="off" allowClear />,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={<FormattedMessage id="groupTree_email" />}>
              {getFieldDecorator('email', {
                rules: [
                  {
                    pattern: new RegExp(/^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/),
                    message: <FormattedMessage id="groupTree_email_validate" />,
                  }],
              })(
                visibleKey === 'detail'
                  ? (<div className={styles['detail-info-text']}>{email}</div>)
                  : <Input placeholder={messages.groupTree_input_email} autoComplete="off" allowClear />,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={<FormattedMessage id="groupTree_remark" />}>
              {getFieldDecorator('remark')(
                visibleKey === 'detail'
                  ? (<div className={styles['detail-info-text']}>{remark}</div>)
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
)(injectIntl(ContactPeopleInfoForm));
