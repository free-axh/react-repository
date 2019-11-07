// 组织基本信息
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Row,
  Input,
  Col, Select,
} from 'antd';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import server from '../../server/index';
import CitySelect from '../citySelect';
import styles from './index.module.less';

const { Option } = Select;

class BasicInfoForm extends Component {
  static propTypes = {
    visibleKey: PropTypes.string,
    slectTreeId: PropTypes.string.isRequired,
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

  // 校验组织名称是否已存在
  repeatGroupFun=(rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }
    const { visibleKey, slectTreeId } = this.props;
    const param = {
      name: value,
    };
    if (visibleKey === 'edit') {
      param.id = slectTreeId;
    }
    server.groupTree.repeatGroupName(param).then((res) => {
      if (res.status === 200 && res.data.data) {
        callback();
      } else {
        callback(<FormattedMessage id="groupTree_groupname_validate" />);
      }
    });
  }

  // 获取组织类型
  getGroupType=(type) => {
    switch (type) {
      case 1:
        return <FormattedMessage id="groupTree_company" />;
      case 2:
        return <FormattedMessage id="groupTree_department" />;
      case 3:
        return <FormattedMessage id="groupTree_personal" />;
      default:
        return '';
    }
  }

  // 获取公司类型
  getCompanyType=(type) => {
    switch (type) {
      case 1:
        return <FormattedMessage id="groupTree_limited_company" />;
      case 2:
        return <FormattedMessage id="groupTree_limited_liabilitycompany" />;
      case 3:
        return <FormattedMessage id="groupTree_individual_proprietorship" />;
      case 4:
        return <FormattedMessage id="groupTree_partnership" />;
      case 5:
        return <FormattedMessage id="groupTree_individual_business" />;
      default:
        return '';
    }
  }

  render() {
    const { visibleKey, intl: { messages }, form: mainForm,
      form: { getFieldDecorator, getFieldsValue },
    } = this.props;
    const {
      name, type, companyType, socialCode,
      companyArea, companyAddress, companyFullName, legalPerson,
    } = getFieldsValue();

    return (
      <div>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label={<FormattedMessage id="groupTree_group_name" />}>
              {getFieldDecorator('name', {
                rules: [
                  { required: true, message: <FormattedMessage id="groupTree_input_groupname" /> },
                  {
                    validator: this.repeatGroupFun,
                  },
                ],
              })(
                visibleKey === 'detail'
                  ? (<div className={styles['detail-info-text']}>{name}</div>)
                  : <Input placeholder={messages.groupTree_input_groupname} maxLength={10} autoComplete="off" allowClear />,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={<FormattedMessage id="groupTree_group_type" />}>
              {getFieldDecorator('type', {
                rules: [
                  { required: true, message: <FormattedMessage id="groupTree_select_grouptype" /> },
                ],
              })(
                visibleKey === 'detail'
                  ? (<div className={styles['detail-info-text']}>{this.getGroupType(type)}</div>)
                  : (
                    <Select
                      style={{ width: '100%' }}
                      placeholder={messages.groupTree_select_grouptype}
                      allowClear
                      disabled={visibleKey === 'detail'}
                    >
                      <Option value={1}><FormattedMessage id="groupTree_company" /></Option>
                      <Option value={2}><FormattedMessage id="groupTree_department" /></Option>
                      <Option value={3}><FormattedMessage id="groupTree_personal" /></Option>
                    </Select>
                  ),
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={<FormattedMessage id="groupTree_company_fullname" />}>
              {getFieldDecorator('companyFullName')(
                visibleKey === 'detail'
                  ? (<div className={styles['detail-info-text']}>{companyFullName}</div>)
                  : <Input placeholder={messages.groupTree_input_companyfullname} maxLength={50} autoComplete="off" allowClear />,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label={<FormattedMessage id="groupTree_company_type" />}>
              {getFieldDecorator('companyType')(
                visibleKey === 'detail'
                  ? (<div className={styles['detail-info-text']}>{this.getCompanyType(companyType)}</div>)
                  : (
                    <Select
                      style={{ width: '100%' }}
                      placeholder={messages.groupTree_select_companytype}
                      allowClear
                      disabled={visibleKey === 'detail'}
                    >
                      <Option value={1}><FormattedMessage id="groupTree_limited_company" /></Option>
                      <Option value={2}><FormattedMessage id="groupTree_limited_liabilitycompany" /></Option>
                      <Option value={3}><FormattedMessage id="groupTree_individual_proprietorship" /></Option>
                      <Option value={4}><FormattedMessage id="groupTree_partnership" /></Option>
                      <Option value={5}><FormattedMessage id="groupTree_individual_business" /></Option>
                    </Select>
                  ),
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={<FormattedMessage id="groupTree_social_code" />}>
              {getFieldDecorator('socialCode', {
                rules: [
                  {
                    pattern: new RegExp(/^[A-Z0-9]{18}$/),
                    message: <FormattedMessage id="groupTree_numberAZ_validate" values={{ num: 18 }} />,
                  },
                ],
              })(
                visibleKey === 'detail'
                  ? (<div className={styles['detail-info-text']}>{socialCode}</div>)
                  : <Input placeholder={messages.groupTree_input_socialcode} maxLength={18} autoComplete="off" allowClear />,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={<FormattedMessage id="groupTree_company_area" />}>
              {getFieldDecorator('companyArea')(
                visibleKey === 'detail'
                  ? (<div className={styles['detail-info-text']}>{companyArea ? companyArea.split(',')[0] : ''}</div>)
                  : <CitySelect form={mainForm} name="companyArea" />,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label={<FormattedMessage id="groupTree_company_address" />}>
              {getFieldDecorator('companyAddress')(
                visibleKey === 'detail'
                  ? (<div className={styles['detail-info-text']}>{companyAddress}</div>)
                  : <Input placeholder={messages.groupTree_input_companyaddress} maxLength={50} autoComplete="off" allowClear />,
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={<FormattedMessage id="groupTree_legal_person" />}>
              {getFieldDecorator('legalPerson', {
                rules: [
                  {
                    pattern: new RegExp(/^[\u4e00-\u9fa5]{0,4}$/),
                    message: <FormattedMessage id="groupTree_chinese_validate" values={{ digits: '0-4' }} />,
                  },
                ],
              })(
                visibleKey === 'detail'
                  ? (<div className={styles['detail-info-text']}>{legalPerson}</div>)
                  : <Input placeholder={messages.groupTree_input_legalperson} maxLength={4} autoComplete="off" allowClear />,
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
    slectTreeId: state.groupTreeReducers.slectTreeId,
    visibleKey: state.groupTreeReducers.visibleKey,
  }),
)(injectIntl(BasicInfoForm));
