// 修改用户
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

const { TabPane } = Tabs;

class EditForm extends Component {
  static propTypes = {
    treeData: PropTypes.array.isRequired,
    selectRowData: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    editUserFun: PropTypes.func.isRequired,
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
      currentUserData: {},
      groupTreeData: [],
      authorizationDate: moment(new Date()), // 授权截止日期
    };
  }

  componentWillReceiveProps(nextProps) {
    const { treeData, selectRowData, selectRowData: { authorizationDateStr } } = nextProps;
    const { currentUserData, groupTreeData } = this.state;
    if (groupTreeData !== treeData && treeData) {
      this.setState({
        groupTreeData: treeData,
      });
    }
    if (Object.keys(selectRowData).length > 0 && selectRowData !== currentUserData) {
      this.setState({
        currentUserData: selectRowData,
        authorizationDate: moment(authorizationDateStr),
      });
      const { form: { setFieldsValue, getFieldsValue } } = this.props;
      const newObj = {};
      const formParam = getFieldsValue();
      Object.keys(formParam).map((item) => {
        newObj[item] = selectRowData[item];
        return item;
      });
      newObj.authorizationDate = authorizationDateStr;
      console.log('修改用户', newObj);
      setFieldsValue(newObj);
    }
  }

  // 表单提交
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { currentUserData: { id: userId } } = this.state;
        const param = values;
        param.id = userId;
        const { editUserFun } = this.props;
        editUserFun(param);
      }
    });
  };

  // 授权截止日期改变
  dateChange=(dates, date) => {
    this.setState({
      authorizationDate: date ? moment(date) : '',
    });
    const { form: { setFieldsValue } } = this.props;
    setFieldsValue({ authorizationDate: date });
  }

  // 关闭抽屉
  drawerCloseFun=() => {
    const { changeVisibleKey } = this.props;
    changeVisibleKey('clear');
  }

  render() {
    const { visibleKey, form: { getFieldDecorator }, intl: { messages } } = this.props;
    const { authorizationDate, groupTreeData } = this.state;

    return (
      <Drawer
        title={<FormattedMessage id="organizationAndUser_edit_user" />}
        width={500}
        onClose={this.drawerCloseFun}
        visible={visibleKey === 'editUser'}
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
                {getFieldDecorator('username')(<Input maxLength={25} disabled autoComplete="off" allowClear />)}
              </Form.Item>
              <Form.Item label={<FormattedMessage id="organizationAndUser_password_title" />}>
                {getFieldDecorator('password', {
                  rules: [
                    { required: true, message: <FormattedMessage id="organizationAndUser_input_password" /> },
                    { min: 6,
                      max: 25,
                      message: <FormattedMessage id="organizationAndUser_password_validate" /> },
                  ],
                })(<Input placeholder={messages.organizationAndUser_input_password} maxLength={25} autoComplete="off" allowClear />)}
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
const EditUserForm = Form.create({ name: 'coordinated' })(EditForm);
export default connect(
  state => ({
    treeData: state.organizationAndUserReducers.allTreeData,
    selectRowData: state.organizationAndUserReducers.selectRowData,
    visibleKey: state.organizationAndUserReducers.visibleKey,
  }),
  dispatch => ({
    editUserFun: (payload) => {
      dispatch({ type: 'user/EDIT_USER_ACTION', payload });
    },
    changeVisibleKey: (data) => {
      dispatch({ type: 'user/CHANGE_VISIBLEkEY_ACTION', payload: data });
    },
  }),
)(injectIntl(EditUserForm));
