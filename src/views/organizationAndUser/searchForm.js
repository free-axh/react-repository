// 列表数据搜索
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Popover, Input, Form, Button, Icon,
} from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import styles from './index.module.less';

class RegistrationForm extends Component {
  static propTypes = {
    searchFun: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      paramObj: {},
    };
  }

  // 显示隐藏搜索项
  hideMenu=(value) => {
    this.setState({
      visible: value,
    });
    if (!value) {
      this.resetFormData();
    }
  }

  // 重置表单数据
  resetFormData=() => {
    const { form: { resetFields, setFieldsValue } } = this.props;
    const { paramObj } = this.state;
    if (Object.keys(paramObj).length === 0) {
      resetFields();
    } else {
      setFieldsValue(paramObj);
    }
  }

  // 执行搜索
  handleSubmit=(e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { searchFun } = this.props;
        searchFun(values);
        this.setState({
          paramObj: values,
        }, () => {
          this.hideMenu(false);
        });
      }
    });
  }

  render() {
    const { form: { getFieldDecorator }, intl: { messages } } = this.props;
    const { visible } = this.state;
    return (
      <Popover
        content={(
          <div className={styles['dropdown-wrapper']}>
            <div className={styles['dropdown-header']}>
              <Icon type="search" /> <FormattedMessage id="organizationAndUser_search" />
            </div>
            <Form
              layout="vertical"
              onSubmit={this.handleSubmit}
            >
              <Form.Item label={<FormattedMessage id="organizationAndUser_table_username" />}>
                {getFieldDecorator('username')(
                  <Input placeholder={messages.organizationAndUser_input_username} autoComplete="off" allowClear />,
                )}
              </Form.Item>
              <Form.Item label={<FormattedMessage id="organizationAndUser_table_realname" />}>
                {getFieldDecorator('realName')(
                  <Input placeholder={messages.organizationAndUser_input_realname} autoComplete="off" allowClear />,
                )}
              </Form.Item>
              <Form.Item label={<FormattedMessage id="organizationAndUser_table_mobile" />}>
                {getFieldDecorator('mobile')(
                  <Input placeholder={messages.organizationAndUser_input_mobile} autoComplete="off" allowClear />,
                )}
              </Form.Item>
              <Form.Item label={<FormattedMessage id="organizationAndUser_table_mail" />}>
                {getFieldDecorator('mail')(
                  <Input placeholder={messages.organizationAndUser_input_mail} autoComplete="off" allowClear />,
                )}
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={this.handleSubmit}>
                  <FormattedMessage id="organizationAndUser_search" />
                </Button>
                <Button onClick={() => { this.hideMenu(false); }}>
                  <FormattedMessage id="organizationAndUser_cancel" />
                </Button>
                <Button type="link" className={styles['search-clear-button']} onClick={this.resetFormData}>
                  <FormattedMessage id="organizationAndUser_clear" />
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}
        trigger="click"
        placement="bottomRight"
        visible={visible}
        onVisibleChange={(modalvisible) => {
          if (!modalvisible) {
            this.hideMenu(false);
          }
        }}
      >
        <Button type="link" className={styles['list-search-button']} onClick={() => { this.hideMenu(true); }}>
          <Icon type="search" />
        </Button>
      </Popover>
    );
  }
}
const SearchForm = Form.create({ name: 'userSearch' })(RegistrationForm);
export default connect()(injectIntl(SearchForm));
