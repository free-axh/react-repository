// 列表数据搜索
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Popover,
  Input,
  Form,
  Button,
  Icon,
} from 'antd';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import styles from './index.module.less';

class RegistrationForm extends Component {
  static propTypes = {
    searchFun: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      dropdownVisible: false,
    };
  }

  // 显示隐藏搜索项
  hideMenu=(value) => {
    this.setState({
      dropdownVisible: value,
    });
    this.resetFormData();
  }

  // 重置表单数据
  resetFormData=() => {
    const { form: { resetFields } } = this.props;
    resetFields();
  }

  // 执行搜索
  handleSubmit=(e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      // console.log('模糊查询0', values);
      if (!err) {
        const { searchFun } = this.props;
        const param = {
          orderQuery: values.order,
          imeiQuery: values.imei,
          iccidQuery: values.iccid,
          simCardQuery: values.sim,
        };
        // console.log('模糊查询', param);
        searchFun(param);
        this.hideMenu(false);
      }
    });
  }

  renderContent=() => {
    const { getFieldDecorator } = this.props.form;

    return (
      <div className={styles['dropdown-wrapper']}>
        <div className={styles['dropdown-header']}>
          <Icon type="search" /> 搜索
        </div>

        <Form
          layout="vertical"
          onSubmit={this.handleSubmit}
        >
          <Form.Item label="订单号">
            {getFieldDecorator('order')(
              <Input placeholder="请输入订单号" autoComplete="off" />,
            )}
          </Form.Item>
          <Form.Item label="IMEI号">
            {getFieldDecorator('imei')(
              <Input placeholder="请输入IMEI号" autoComplete="off" />,
            )}
          </Form.Item>
          <Form.Item label="ICCID">
            {getFieldDecorator('iccid')(
              <Input placeholder="请输入ICCID" autoComplete="off" />,
            )}
          </Form.Item>
          <Form.Item label="SIM卡号">
            {getFieldDecorator('sim')(
              <Input placeholder="请输入SIM卡号" autoComplete="off" />,
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={this.handleSubmit}>搜索</Button>
            <Button onClick={() => { this.hideMenu(false); }}>取消</Button>
            <Button type="link" className={styles['search-clear-button']} onClick={this.resetFormData}>清空</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }

  render() {
    const { dropdownVisible } = this.state;

    return (
      <Popover
        content={this.renderContent()}
        trigger="click"
        placement="bottomRight"
        visible={dropdownVisible}
        onVisibleChange={(visible) => {
          if (!visible) {
            this.hideMenu(false);
          }
        }}
      >
        <Button
          type="link"
          className={styles['list-search-button']}
          onClick={() => { this.hideMenu(true); }}
        >
          <Icon
            className={styles['list-search-button']}
            type="search"
          />
        </Button>
      </Popover>
    );
  }
}
const SearchForm = Form.create({ name: 'coordinated' })(RegistrationForm);
export default connect(
  null,
  null,
)(injectIntl(SearchForm));
