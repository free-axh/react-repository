// 新增组织
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Button, Drawer,
  Tabs, Collapse, Icon,
  message,
} from 'antd';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import styles from './index.module.less';
import './detailForm.less';
import BasicInfoForm from './basicInfoForm';// 基本信息表单
import ContactPeopleInfoForm from './contactPeopleInfoForm';// 联系人信息
import AccountInfoForm from './accountInfoForm';// 账户信息
import TicketInfoForm from './ticketInfoForm';// 收票信息
import ServerInfoForm from './serverInfoForm';

const { TabPane } = Tabs;
const { Panel } = Collapse;

class PublicForm extends Component {
  static propTypes = {
    slectTreeData: PropTypes.object,
    visibleKey: PropTypes.string,
    form: PropTypes.object.isRequired,
    slectTreeId: PropTypes.string,
    addGroup: PropTypes.func.isRequired,
    editGroup: PropTypes.func.isRequired,
    insertGroup: PropTypes.func.isRequired,
    changeVisibleKey: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  }

  static defaultProps={
    slectTreeData: null,
    visibleKey: null,
    slectTreeId: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      currentTreeData: null,
      additionalServerData: [true], // 附加服务器
    };
  }

  // props改变时触发
  componentWillReceiveProps(nextProps) {
    const { slectTreeData, visibleKey } = nextProps;
    const { currentTreeData } = this.state;
    if (visibleKey === 'edit' || visibleKey === 'detail') {
      if (currentTreeData === null) {
        const newData = JSON.parse(JSON.stringify(slectTreeData));
        const { organizationServers } = newData;
        this.setState({
          currentTreeData: newData,
          additionalServerData: organizationServers.length > 0 ? organizationServers : [true],
        }, () => {
          setTimeout(() => { // 此延迟用于解决页面还未加载完成,参数赋值失败的问题
            this.renderFormParam();
          }, 310);
        });
      }
    }
  }

  // 表单参数赋值
  renderFormParam=() => {
    const { currentTreeData, currentTreeData: { organizationServers } } = this.state;
    const { form: { setFieldsValue, getFieldsValue } } = this.props;
    const obj = {};
    organizationServers.map((item, index) => {
      Object.keys(item).map((key) => {
        const newKey = `${key}${index}`;
        obj[newKey] = item[key];
        return key;
      });
      return item;
    });
    Object.assign(obj, currentTreeData);
    const formParam = getFieldsValue();
    Object.keys(formParam).map((item) => {
      formParam[item] = obj[item];
      return item;
    });
    setFieldsValue(formParam);
  }

  // 表单提交
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {
          slectTreeId, slectTreeData, visibleKey,
          addGroup, editGroup, insertGroup,
        } = this.props;
        const param = values;
        // 组装服务器地址数据
        const serverInfoArr = [];
        Object.keys(param).map((item) => {
          if (item.indexOf('serverName') !== -1 && param[item]) {
            const index = item.replace('serverName', '');
            const obj = {
              serverName: param[item],
              serverAddress: param[`serverAddress${index}`],
              port: param[`port${index}`],
            };
            serverInfoArr.push(obj);
          }
          return item;
        });
        param.organizationServers = JSON.stringify(serverInfoArr);
        param.pid = slectTreeData.pid;

        if (visibleKey === 'add') {
          param.pid = slectTreeData.id;
          addGroup(param);
        }
        if (visibleKey === 'edit') {
          param.id = slectTreeId;
          editGroup(param);
        }
        if (visibleKey === 'insert') {
          param.pid = slectTreeId;
          insertGroup(param);
        }
        this.setState({
          currentTreeData: null,
          additionalServerData: [true],
        });
      }
    });
  };

  // 抽屉隐藏
  changeVisibleKeyFun = () => {
    const { changeVisibleKey } = this.props;
    // 添加一点延迟,防止抽屉还未关闭时内容重绘
    setTimeout(() => {
      this.resetFormData();
      this.setState({
        currentTreeData: null,
        additionalServerData: [true],
      });
      changeVisibleKey();
    }, 300);
  };

  // 重置表单数据
  resetFormData=() => {
    const { resetFields } = this.props.form;
    resetFields();
    this.setState({
      currentTreeData: null,
    });
  }

  // 改变服务器地址表单
  changeServerParam=(type, index) => {
    const { intl: { messages } } = this.props;
    const { additionalServerData } = this.state;
    const newData = [].concat(additionalServerData);
    if (type === 'addServer') {
      if (newData.length >= 10) {
        const msg = messages.groupTree_most_server.replace('{num}', 10);
        message.warning(msg);
        return;
      }
      newData.push(true);
    } else {
      newData.splice(index, 1);
    }
    this.setState({
      additionalServerData: newData,
    }, () => {
      // 删除服务器地址时,重新设置相应输入框的值
      if (type === 'deleteServer' && additionalServerData[index] !== true) {
        const { setFieldsValue } = this.props.form;
        const obj = {};
        obj[`serverName${index}`] = '';
        obj[`serverAddress${index}`] = '';
        obj[`port${index}`] = '';
        setFieldsValue(obj);
      }
    });
  }

  // 获取抽屉名称
  getDrawerTitle=() => {
    const { visibleKey } = this.props;
    let drawerTitle = <FormattedMessage id="groupTree_add_group" />;
    if (visibleKey === 'edit') {
      drawerTitle = <FormattedMessage id="groupTree_edit_group" />;
    }
    if (visibleKey === 'detail') {
      drawerTitle = <FormattedMessage id="groupTree_group_detail" />;
    }
    if (visibleKey === 'insert') {
      drawerTitle = <FormattedMessage id="groupTree_insert_group" />;
    }
    return drawerTitle;
  }

  render() {
    const { visibleKey, form: mainForm } = this.props;
    const { additionalServerData } = this.state;

    return (
      <Drawer
        title={this.getDrawerTitle()}
        width={700}
        destroyOnClose
        onClose={this.changeVisibleKeyFun}
        visible={!!visibleKey}
      >
        <Form
          layout="vertical"
          onSubmit={this.handleSubmit}
          className={visibleKey === 'detail' ? 'detail-form' : ''}
        >
          <Tabs defaultActiveKey="1" className={styles['detail-tabs']}>
            <TabPane tab={<FormattedMessage id="groupTree_basic_info" />} key="1">
              <Collapse
                bordered={false}
                expandIconPosition="right"
                defaultActiveKey={['1', '2', '3']}
                expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 270 : 90} />}
              >
                <Panel header={<FormattedMessage id="groupTree_basic_info" />} key="1">
                  <BasicInfoForm form={mainForm} />
                </Panel>
                <Panel header={<FormattedMessage id="groupTree_contactpeople_info" />} key="2">
                  <ContactPeopleInfoForm form={mainForm} />
                </Panel>
                <Panel header={<FormattedMessage id="groupTree_server_address" />} key="3">
                  <ServerInfoForm
                    form={mainForm}
                    additionalServerData={additionalServerData}
                    changeServerParam={this.changeServerParam}
                  />
                </Panel>
              </Collapse>
            </TabPane>
            <TabPane tab={<FormattedMessage id="groupTree_account_info" />} key="2" forceRender>
              <AccountInfoForm form={mainForm} />
              <Collapse
                bordered={false}
                expandIconPosition="right"
                defaultActiveKey={['1']}
                expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 270 : 90} />}
              >
                <Panel header={<FormattedMessage id="groupTree_ticket_info" />} key="1">
                  <TicketInfoForm form={mainForm} />
                </Panel>
              </Collapse>
            </TabPane>
          </Tabs>
        </Form>
        <div className={styles['drawer-footerBtns']}>
          {
          visibleKey === 'detail' ? null
            : (
              <Button onClick={this.handleSubmit} type="primary">
                <FormattedMessage id="groupTree_confirm" />
              </Button>
            )
          }
          <Button onClick={this.changeVisibleKeyFun}>
            <FormattedMessage id="groupTree_cancel" />
          </Button>
        </div>
      </Drawer>
    );
  }
}
const PublicDrawer = Form.create({ name: 'groupInfo' })(PublicForm);
export default connect(
  state => ({
    slectTreeId: state.groupTreeReducers.slectTreeId,
    slectTreeData: state.groupTreeReducers.slectTreeData,
    visibleKey: state.groupTreeReducers.visibleKey,
  }),
  dispatch => ({
    changeVisibleKey: (data) => {
      dispatch({ type: 'tree/CHANGE_VISIBLEkEY_ACTION', payload: data });
    },
    addGroup: (data) => {
      dispatch({ type: 'tree/ADD_TREE_ACTION', payload: data });
    },
    editGroup: (data) => {
      dispatch({ type: 'tree/EDIT_TREE_ACTION', payload: data });
    },
    insertGroup: (data) => {
      dispatch({ type: 'tree/INSERT_TREE_ACTION', payload: data });
    },
  }),
)(injectIntl(PublicDrawer));
