import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button, Select, Popover, Icon, Input } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import styles from './index.module.less';

const { Option } = Select;

class DetectionSeniorSearchList extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    detectionDataSearchConditions: PropTypes.object.isRequired,
    getDetectionTableData: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.detectionTableDataSearch = this.detectionTableDataSearch.bind(this);
    this.searchConditionsReset = this.searchConditionsReset.bind(this);
    this.state = {
      stateValue: '2',
      isOnLineValue: '2',
      isLocationValue: '2',
    };
  }

  /**
   * 查询table数据
   */
  detectionTableDataSearch = (e) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const { imei, isOnLocation, isOnline, state } = values;
        const { detectionDataSearchConditions, getDetectionTableData } = this.props;
        detectionDataSearchConditions.simpleQueryParam = imei || '';
        detectionDataSearchConditions.isOnline = isOnline;
        detectionDataSearchConditions.isLocation = isOnLocation;
        detectionDataSearchConditions.state = state;
        getDetectionTableData(detectionDataSearchConditions);
      }
    });
  }

  /**
   * 重置检测列表查询条件
   */
  searchConditionsReset = () => {
    const { form: { resetFields } } = this.props;
    resetFields();
  }

  render() {
    const { form: { getFieldDecorator }, intl: { messages } } = this.props;
    const { stateValue, isOnLineValue, isLocationValue } = this.state;

    return (
      <Popover
        content={(
          <Form onSubmit={this.detectionTableDataSearch} style={{ width: '340px' }}>
            <div>
              <span>
                <Icon type="search" />&nbsp;<FormattedMessage id="terminalDetect_search" />
              </span>
            </div>
            <Form.Item label={<FormattedMessage id="terminalDetect_imei" />}>
              {getFieldDecorator('imei')(
                <Input placeholder={messages.terminalDetect_please_input} allowClear autoComplete="off" />,
              )}
            </Form.Item>
            <Form.Item label={<FormattedMessage id="terminalDetect_state" />}>
              {
                getFieldDecorator('state', {
                  initialValue: stateValue,
                })(
                  <Select
                    showSearch
                  >
                    <Option value="2"><FormattedMessage id="terminalDetect_all" /></Option>
                    <Option value="1"><FormattedMessage id="terminalDetect_normal" /></Option>
                    <Option value="0"><FormattedMessage id="terminalDetect_abnormal" /></Option>
                  </Select>,
                )
              }
            </Form.Item>
            <Form.Item label={<FormattedMessage id="terminalDetect_isonline" />}>
              {
                getFieldDecorator('isOnline', {
                  initialValue: isOnLineValue,
                })(
                  <Select
                    showSearch
                    // defaultValue="0"
                  >
                    <Option value="2"><FormattedMessage id="terminalDetect_all" /></Option>
                    <Option value="1"><FormattedMessage id="terminalDetect_yes" /></Option>
                    <Option value="0"><FormattedMessage id="terminalDetect_no" /></Option>
                  </Select>,
                )
              }
            </Form.Item>
            <Form.Item label={<FormattedMessage id="terminalDetect_isonlocation" />}>
              {
                getFieldDecorator('isOnLocation', {
                  initialValue: isLocationValue,
                })(
                  <Select
                    showSearch
                    // defaultValue="0"
                  >
                    <Option value="2"><FormattedMessage id="terminalDetect_all" /></Option>
                    <Option value="1"><FormattedMessage id="terminalDetect_yes" /></Option>
                    <Option value="0"><FormattedMessage id="terminalDetect_no" /></Option>
                  </Select>,
                )
              }
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                <FormattedMessage id="terminalDetect_search" />
              </Button>
              &nbsp;
              <Button onClick={this.searchConditionsReset}>
                <FormattedMessage id="terminalDetect_empty" />
              </Button>
            </Form.Item>
          </Form>
      )}
        trigger="click"
        placement="bottomRight"
        arrowPointAtCenter
        overlayStyle={{ borderTop: '1px solid #edeaea' }}
      >
        <Icon type="search" className={styles['search-icon']} />
      </Popover>
    );
  }
}

export default connect(
  state => ({
    detectionDataSearchConditions: state.terminaDetectReducers.detectionDataSearchConditions,
  }),
  dispatch => ({
    getDetectionTableData: (data) => {
      dispatch({ type: 'terminaDetect/GET_DETECTION_TABLE_DATA', payload: data });
    },
  }),
)(Form.create({ name: 'detection-senior-search-form' })(injectIntl(DetectionSeniorSearchList)));
