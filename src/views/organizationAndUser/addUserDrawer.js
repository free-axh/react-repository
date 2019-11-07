// 新增用户
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Button, Radio,
  Drawer, Tabs, Input,
  DatePicker, TreeSelect,
} from 'antd';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import moment from 'moment';
import styles from './index.module.less';
import server from '../../server/index';

const { TabPane } = Tabs;

class AddForm extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    treeData: PropTypes.array.isRequired,
    addUserFun: PropTypes.func.isRequired,
    changeVisibleKey: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    visibleKey: PropTypes.string,
  }

  static defaultProps = {
    visibleKey: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      groupTreeData: [],
      authorizationDate: moment(new Date()), // 授权截止日期
    };
  }

  componentDidMount() {
    const { form: { setFieldsValue } } = this.props;
    setFieldsValue({
      authorizationDate: moment(new Date()).format('YYYY-MM-DD'),
      gender: 1,
      isActive: 1,
    });
  }

  // props改变时触发
  componentWillReceiveProps(nextProps) {
    const { treeData } = nextProps;
    const { groupTreeData } = this.state;
    if (groupTreeData !== treeData && treeData) {
      this.setState({
        groupTreeData: treeData,
      });
    }
  }

  // 表单提交
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { addUserFun } = this.props;
        addUserFun(values);
        this.resetFormData();
      }
    });
  };

  // 授权截止日期改变
  dateChange=(dates, date) => {
    this.setState({
      authorizationDate: date ? moment(date) : '',
    });
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ authorizationDate: date });
  }

  // 校验用户名是否已存在
  repeatUserFun=(rule, value, callback) => {
    server.organizationAndUser.repeatUser({ username: value }).then((res) => {
      if (res.status === 200 && res.data.data) {
        callback();
      } else {
        callback(<FormattedMessage id="organizationAndUser_username_existing" />);
      }
    });
  }

  // 重置表单数据
  resetFormData=() => {
    const { setFieldsValue, resetFields } = this.props.form;
    resetFields();
    setFieldsValue({
      gender: 1,
      isActive: 1,
      authorizationDate: moment(new Date()).format('YYYY-MM-DD'),
    });
  }

  // 关闭抽屉
  drawerCloseFun=() => {
    this.resetFormData();
    const { changeVisibleKey } = this.props;
    changeVisibleKey();
  }

  render() {
    const { visibleKey, form: { getFieldDecorator }, intl: { messages } } = this.props;
    const { authorizationDate, groupTreeData } = this.state;

    return (
      <Drawer
        title={<FormattedMessage id="organizationAndUser_add_user" />}
        width={500}
        onClose={this.drawerCloseFun}
        visible={visibleKey === 'addUser'}
      >
        <Tabs defaultActiveKey="1" className={styles['detail-tabs']}>
          <TabPane tab={<FormattedMessage id="organizationAndUser_basic_info" />} key="1">
            <Form
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 16,
              }}
              onSubmit={this.handleSubmit}
            >
              <Form.Item label={<FormattedMessage id="organizationAndUser_table_username" />}>
                {getFieldDecorator('username', {
                  rules: [
                    { required: true, message: <FormattedMessage id="organizationAndUser_input_username" /> },
                    {
                      pattern: new RegExp(/^[a-zA-Z0-9\u4e00-\u9fa5-_]{1,25}$/),
                      message: <FormattedMessage id="organizationAndUser_username_validate" />,
                    },
                    {
                      validator: this.repeatUserFun,
                    },
                  ],
                })(<Input placeholder={messages.organizationAndUser_input_username} maxLength={25} autoComplete="off" allowClear />)}
              </Form.Item>
              <Form.Item label={<FormattedMessage id="organizationAndUser_password_title" />}>
                {getFieldDecorator('password', {
                  rules: [
                    { required: true, message: <FormattedMessage id="organizationAndUser_input_password" /> },
                    { min: 6,
                      max: 25,
                      message: <FormattedMessage id="organizationAndUser_password_validate" /> },
                  ],
                })(<Input.Password placeholder={messages.organizationAndUser_input_password} maxLength={25} autoComplete="off" allowClear />)}
              </Form.Item>
              <Form.Item label={<FormattedMessage id="organizationAndUser_table_organizationname" />}>
                {getFieldDecorator('organizationId', {
                  rules: [{ required: true, message: <FormattedMessage id="organizationAndUser_input_organizationname" /> }],
                })(
                  <TreeSelect
                    treeDataSimpleMode
                    dropdownMatchSelectWidth
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={groupTreeData}
                    placeholder={messages.organizationAndUser_input_organizationname}
                    treeDefaultExpandAll
                    showSearch
                    allowClear
                    treeNodeFilterProp="title"
                    onChange={this.onTreeChange}
                  />,
                )}
              </Form.Item>
              <Form.Item label={<FormattedMessage id="organizationAndUser_table_isactive" />}>
                {getFieldDecorator('isActive')(
                  <Radio.Group>
                    <Radio value={1}><FormattedMessage id="organizationAndUser_table_enable" /></Radio>
                    <Radio value={0}><FormattedMessage id="organizationAndUser_table_disable" /></Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label={<FormattedMessage id="organizationAndUser_table_authorizationdatestr" />}>
                {getFieldDecorator('authorizationDate')(<Input hidden autoComplete="off" />)}
                <DatePicker value={authorizationDate} onChange={this.dateChange} style={{ width: '100%' }} readOnly />
              </Form.Item>
              <Form.Item label={<FormattedMessage id="organizationAndUser_table_realname" />}>
                {getFieldDecorator('realName')(<Input placeholder={messages.organizationAndUser_input_realname} autoComplete="off" allowClear />)}
              </Form.Item>
              <Form.Item label={<FormattedMessage id="organizationAndUser_table_gender" />}>
                {getFieldDecorator('gender')(
                  <Radio.Group>
                    <Radio value="1"><FormattedMessage id="organizationAndUser_table_man" /></Radio>
                    <Radio value="2"><FormattedMessage id="organizationAndUser_table_woman" /></Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label={<FormattedMessage id="organizationAndUser_table_mobile" />}>
                {getFieldDecorator('mobile', {
                  rules: [
                    {
                      pattern: new RegExp(/^1[3456789]\d{9}$/),
                      message: <FormattedMessage id="organizationAndUser_mobile_validate" />,
                    }],
                })(<Input placeholder={messages.organizationAndUser_input_mobile} maxLength={11} autoComplete="off" allowClear />)}
              </Form.Item>
              <Form.Item label={<FormattedMessage id="organizationAndUser_table_mail" />}>
                {getFieldDecorator('mail', {
                  rules: [
                    {
                      pattern: new RegExp(/^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/),
                      message: <FormattedMessage id="organizationAndUser_mail_validate" />,
                    }],
                })(<Input placeholder={messages.organizationAndUser_input_mail} autoComplete="off" allowClear />)}
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
        <div className={styles['drawer-footerBtns']}>
          <Button onClick={this.handleSubmit} type="primary">
            <FormattedMessage id="organizationAndUser_confirm" />
          </Button>
          <Button onClick={this.drawerCloseFun}>
            <FormattedMessage id="organizationAndUser_cancel" />
          </Button>
        </div>
      </Drawer>
    );
  }
}
const AddUserForm = Form.create({ name: 'addForm' })(AddForm);
export default connect(
  state => ({
    treeData: state.organizationAndUserReducers.allTreeData,
    visibleKey: state.organizationAndUserReducers.visibleKey,
  }),
  dispatch => ({
    addUserFun: (payload) => {
      dispatch({ type: 'user/ADD_USER_ACTION', payload });
    },
    changeVisibleKey: (data) => {
      dispatch({ type: 'user/CHANGE_VISIBLEkEY_ACTION', payload: data });
    },
  }),
)(injectIntl(AddUserForm));
