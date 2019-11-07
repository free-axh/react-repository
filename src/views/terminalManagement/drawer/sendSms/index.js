// 下发短信
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Form, Button, Drawer,
  Tabs, Input, Modal, message,
} from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import styles from './index.module.less';
import { getStore } from '../../../../utils/localStorage';
import SetPasswordForm from './setPasswordForm';// 设置密码
import SetUpPlatformConnect from './setUpPlatformConnect';// 设置连接上级平台
import SetApnForm from './setApnForm';// 设置APN
import SetDeviceIdForm from './setDeviceIdForm';// 设置终端ID
import PublicForm from './publicForm';// 公共表单,用于只有终端密码的指令
import RemoteUpgrade from './remoteUpgrade';// 远程升级
import SetPonitAngle from './setPonitAngle';// 设置拐点补偿角度
import SetAwakeningDormant from './setAwakeningDormant';// 设置苏醒(休眠)模式
import CloseSmsChannel from './closeSmsChannel';// 关闭短信通道
import SetFreightPlatformConnect from './setFreightPlatformConnect';// 设置货运平台连接
import SetPlateNumber from './setPlateNumber';// 设置车牌号
import SetMileageBaseValue from './setMileageBaseValue';// 设置里程基值
import SetUnderVoltageAlarmThreshold from './setUnderVoltageAlarmThreshold';// 设置欠压报警阈值
import SetPositionMode from './setPositionMode';// 设置定位模式
import SetVehicleStateJudgmentMode from './setVehicleStateJudgmentMode';// 设置车辆状态判断模式
import SetDriftThreshold from './setDriftThreshold';// 设置漂移阈值

const { TabPane } = Tabs;

class SendSmsForm extends Component {
  static propTypes = {
    toggleDrawer: PropTypes.func.isRequired,
    getServerData: PropTypes.func.isRequired,
    sendSmsMessage: PropTypes.func.isRequired,
    readDeviceParam: PropTypes.func.isRequired,
    visibleKey: PropTypes.string.isRequired,
    form: PropTypes.object.isRequired,
    advancedSearch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    isMass: PropTypes.bool.isRequired,
    tableSelectionData: PropTypes.object.isRequired, // 列表点击数据
    tCheckData: PropTypes.array.isRequired, // 列表勾选数据
    toggleMass: PropTypes.func.isRequired,
    param: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      currentIMEI: '', // 当前终端的IMEI值
      activeTabKey: '1', // 当前显示的tab页key值
      devicePassword: '', // 终端密码
      readSocket: null, // 读取参数的socket连接
    };

    this.changeVisibleKeyFun = this.changeVisibleKeyFun.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendCallback = this.sendCallback.bind(this);
    this.tabsChange = this.tabsChange.bind(this);
    this.changeDevicePwd = this.changeDevicePwd.bind(this);
    this.readDeviceParamFun = this.readDeviceParamFun.bind(this);
    this.readFun = this.readFun.bind(this);
    this.readBtnShow = this.readBtnShow.bind(this);
  }

  componentDidMount() {
    const { getServerData } = this.props;
    getServerData();
  }

  componentWillReceiveProps(nextProps) {
    const { isMass, tableSelectionData, tCheckData } = nextProps;
    let deviceData = tableSelectionData;
    console.log('短信数据', isMass, tableSelectionData, tCheckData);

    if (isMass) {
      deviceData = tCheckData;
    }
    const { currentIMEI } = this.state;
    let internationalMobile = '';
    if (deviceData.length > 1) {
      const newArr = [];
      deviceData.forEach((d) => {
        newArr.push(d.internationalMobile);
      });
      internationalMobile = newArr.join(',');
    } else {
      const { internationalMobile: newImei } = deviceData[0] ? deviceData[0] : deviceData;
      internationalMobile = newImei;
    }
    if (currentIMEI !== internationalMobile) {
      this.setState({
        currentIMEI: internationalMobile,
      }, () => {
        const { form: { setFieldsValue } } = this.props;
        setFieldsValue({
          IMEI: internationalMobile,
        });
      });
    }
  }

  /**
   * 抽屉隐藏
   */
  changeVisibleKeyFun = () => {
    const { toggleDrawer, toggleMass } = this.props;
    toggleDrawer();
    toggleMass(false);
    this.setState({
      currentIMEI: '',
      activeTabKey: '1',
    });
  };

  /**
   * tab切换
   * (2,7,11)为含有radio单选框的指令,切换时需要勾选其中默认一项
   */
  tabsChange=(activeKey) => {
    const {
      form: { resetFields, setFieldsValue },
    } = this.props;
    const { currentIMEI } = this.state;
    resetFields();
    this.setState({
      activeTabKey: activeKey,
    }, () => {
      const newObj = {
        IMEI: currentIMEI,
      };
      if (activeKey === '2' || activeKey === '11') {
        newObj.ipName = 'IP1';
      }
      if (activeKey === '7') {
        newObj.pattern = '格式1';
      }
      setFieldsValue(newObj);
    });
  }

  // 输入终端密码
  changeDevicePwd=(e) => {
    this.setState({ devicePassword: e.target.value });
  }

  // 读取终端参数
  readDeviceParamFun=() => {
    const { intl: { messages } } = this.props;
    const { activeTabKey } = this.state;
    if (activeTabKey === '1') {
      this.readFun();
      return;
    }
    Modal.confirm({
      title: messages.terminalManagement_confirm_title,
      content: <Input
        placeholder={messages.terminalManagement_input_terminalpwd}
        maxLength={20}
        onChange={this.changeDevicePwd}
        allowClear
      />,
      okText: messages.terminalManagement_confirm,
      cancelText: messages.terminalManagement_cancel,
      onOk: this.readFun,
    });
  }

  readFun=() => {
    const { intl: { messages } } = this.props;
    const { activeTabKey, devicePassword, readSocket, currentIMEI } = this.state;
    if (activeTabKey !== '1' && devicePassword === '') {
      message.warning(messages.terminalManagement_input_terminalpwd);
      return;
    }
    const { readDeviceParam } = this.props;
    const param = {
      internationalMobile: currentIMEI,
      type: parseInt(activeTabKey, 10) + 9,
      password: devicePassword,
    };
    const { socket } = global;
    if (socket) {
      if (!readSocket) { // 建立socket连接
        const headers = { access_token: getStore('token') };
        const username = getStore('username');
        const newReadSocket = socket.subscribe(headers, `/user/${username}/textReply`,
          this.subCallBack, null, null);
        this.setState({ readSocket: newReadSocket });
      }
    } else {
      this.setState({ readSocket: null });
    }
    readDeviceParam(param);
  }

  /**
   * 读取socket回调方法
   * (2,11等指令,终端上传的数据与下发的不一致,需做一些处理)
    */
  subCallBack=(res) => {
    const result = JSON.parse(res.body);
    const { activeTabKey } = this.state;
    if (activeTabKey === '1') {
      message.success(result.password);
      return;
    }
    const { form: { setFieldsValue, getFieldsValue } } = this.props;
    const { ipName } = getFieldsValue();
    let suffix = 'One';
    let newParamObj = {};
    switch (activeTabKey) {
      case '2':// 设置上级平台连接
      case '11':// 设置货运平台连接
        if (ipName === 'IP2') {
          suffix = 'Two';
        }
        Object.keys(result).map((item) => {
          if (item.indexOf(suffix) !== -1) {
            newParamObj[item.replace(suffix, '')] = result[item];
          }
          return item;
        });
        break;
      case '16':// 设置车辆状态判断模式
        newParamObj = result;
        setFieldsValue(newParamObj);
        break;
      default:
        newParamObj = result;
        break;
    }
    if (Object.keys(newParamObj).length > 0) {
      setFieldsValue(newParamObj);
    }
  }

  /**
   * 设置默认值
   * 部分指令有设置默认值功能
   */
  setDefaultParam=() => {
    const { form: { setFieldsValue, getFieldsValue } } = this.props;
    const { activeTabKey } = this.state;
    const newObj = {};
    const { pattern } = getFieldsValue();
    switch (activeTabKey) {
      case '8':
        newObj.compensationAngle = 25;
        break;
      case '9':
        newObj.isReportLocation = '1';
        newObj.locationReportInterval = 120;
        break;
      case '16':
        if (pattern === '1') { newObj.value = 50; }
        if (pattern === '2') { newObj.value = 60; }
        break;
      case '17':
        newObj.distanceValue = 240;
        break;
      default:
        break;
    }
    if (Object.keys(newObj).length > 0) {
      setFieldsValue(newObj);
    }
  }

  // 控制读取按钮显示
  readBtnShow=() => {
    const { activeTabKey, currentIMEI } = this.state;
    console.log('currentIMEI', currentIMEI);
    if (currentIMEI && currentIMEI.indexOf(',') !== -1) { // 批量操作无读取按钮
      return false;
    }
    if (getStore('username') === 'admin' && activeTabKey === '1') {
      return true;
    }
    if (activeTabKey === '2' || (parseInt(activeTabKey, 10) > 7 && activeTabKey !== '13')) {
      return true;
    }
    return false;
  }

  // 控制默认值按钮显示
  defaultBtnShow=() => {
    const { activeTabKey } = this.state;
    if (activeTabKey === '8' || activeTabKey === '9' || activeTabKey === '16' || activeTabKey === '17') {
      return true;
    }
    return false;
  }

  // 下发短信
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {
          sendSmsMessage, intl: { messages },
        } = this.props;
        const { activeTabKey, currentIMEI } = this.state;
        const param = {
          internationalMobiles: currentIMEI,
          type: parseInt(activeTabKey, 10) + 9,
          parameter: JSON.stringify(values),
        };
        Modal.confirm({
          title: messages.terminalManagement_confirm_title,
          content: messages.terminalManagement_confirm_content,
          okText: messages.terminalManagement_confirm,
          cancelText: messages.terminalManagement_cancel,
          onOk: () => {
            sendSmsMessage({ data: param, sendCallback: this.sendCallback });
          },
        });
      }
    });
  };

  // 下发短信回调
  sendCallback=() => {
    const { advancedSearch, param } = this.props;
    // 关闭抽屉
    this.changeVisibleKeyFun();
    // 列表更新
    advancedSearch({
      // page: 1, // 当前页
      // limit: 10, // 每页容量
      // simpleQueryParam: '', // 模糊查询
      // // deviceNumber: '', // 终端号
      // messageStatus: null, // 短信状态 0发送中 1发送成功 8发送失败（全部时此字段为空）
      // isOnline: null, // 在线状态 1：在线 0：离线（全部时此字段为空）
      // servicePattern: null, // 服务模式 0 ：SIM卡到期模式 1：终端服务到期模式（全部时此字段为空）
      // serviceStatus: null, // 服务状态 0：异常 1：正常 2：即将停机 3：服务即将到期 4：已停机 5：服务已到期（全部时此字段为空）
      // startTime: '',
      // endTime: '',
      // searchType: 0, // 查询类型 0：正常查询  1：导入查询
      ...param,
    });
  }

  render() {
    const {
      visibleKey, form: mainForm,
      form: { getFieldDecorator },
    } = this.props;
    const { activeTabKey } = this.state;
    const hasReadBtn = this.readBtnShow();
    const hasDefaultBtn = this.defaultBtnShow();

    return (
      <Drawer
        title={<FormattedMessage id="terminalManagement_send_sms" />}
        width={700}
        destroyOnClose
        onClose={this.changeVisibleKeyFun}
        visible={visibleKey === 'sendSms'}
      >
        <Form
          labelCol={{
            span: (activeTabKey === '9' || activeTabKey === '16') ? 8 : 6,
          }}
          wrapperCol={{
            span: 16,
          }}
          onSubmit={this.handleSubmit}
        >
          <div className={styles['header-form']}>
            <Form.Item label="IMEI">
              {getFieldDecorator('IMEI')(<Input placeholder="IMEI" disabled />)}
            </Form.Item>
          </div>
          <div className={styles['instruction-title']}>
            <FormattedMessage id="terminalManagement_instruction_title" />
          </div>
          <Tabs
            defaultActiveKey="1"
            tabPosition="left"
            style={{ height: '100%' }}
            tabBarGutter={0}
            onChange={this.tabsChange}
          >
            <TabPane tab={<FormattedMessage id="terminalManagement_set_password" />} key="1">
              <SetPasswordForm activeTabKey={activeTabKey} form={mainForm} />
            </TabPane>
            <TabPane tab={<FormattedMessage id="terminalManagement_set_upplatformcconnect" />} key="2">
              <SetUpPlatformConnect activeTabKey={activeTabKey} form={mainForm} />
            </TabPane>
            <TabPane tab={<FormattedMessage id="terminalManagement_set_apn" />} key="3">
              <SetApnForm activeTabKey={activeTabKey} form={mainForm} />
            </TabPane>
            <TabPane tab={<FormattedMessage id="terminalManagement_set_terminalid" />} key="4">
              <SetDeviceIdForm activeTabKey={activeTabKey} form={mainForm} />
            </TabPane>
            <TabPane tab={<FormattedMessage id="terminalManagement_terminal_reset" />} key="5">
              <PublicForm activeTabKey={activeTabKey} form={mainForm} currentKey="5" />
            </TabPane>
            <TabPane tab={<FormattedMessage id="terminalManagement_factory_reset" />} key="6">
              <PublicForm activeTabKey={activeTabKey} form={mainForm} currentKey="6" />
            </TabPane>
            <TabPane tab={<FormattedMessage id="terminalManagement_remote_upgrade" />} key="7">
              <RemoteUpgrade activeTabKey={activeTabKey} form={mainForm} />
            </TabPane>
            <TabPane tab={<FormattedMessage id="terminalManagement_set_ponitangle" />} key="8">
              <SetPonitAngle activeTabKey={activeTabKey} form={mainForm} />
            </TabPane>
            <TabPane tab={<FormattedMessage id="terminalManagement_set_awakeningdormant" />} key="9">
              <SetAwakeningDormant activeTabKey={activeTabKey} form={mainForm} />
            </TabPane>
            <TabPane tab={<FormattedMessage id="terminalManagement_close_smschannel" />} key="10">
              <CloseSmsChannel activeTabKey={activeTabKey} form={mainForm} />
            </TabPane>
            <TabPane tab={<FormattedMessage id="terminalManagement_set_freightplatformconnect" />} key="11">
              <SetFreightPlatformConnect activeTabKey={activeTabKey} form={mainForm} />
            </TabPane>
            <TabPane tab={<FormattedMessage id="terminalManagement_set_platenumber" />} key="12">
              <SetPlateNumber activeTabKey={activeTabKey} form={mainForm} />
            </TabPane>
            <TabPane tab={<FormattedMessage id="terminalManagement_set_mileagebaseValue" />} key="13">
              <SetMileageBaseValue activeTabKey={activeTabKey} form={mainForm} />
            </TabPane>
            <TabPane tab={<FormattedMessage id="terminalManagement_set_undervoltagealarmthreshold" />} key="14">
              <SetUnderVoltageAlarmThreshold activeTabKey={activeTabKey} form={mainForm} />
            </TabPane>
            <TabPane tab={<FormattedMessage id="terminalManagement_set_positionmode" />} key="15">
              <SetPositionMode activeTabKey={activeTabKey} form={mainForm} />
            </TabPane>
            <TabPane tab={<FormattedMessage id="terminalManagement_set_vehiclestatejudgmentmode" />} key="16">
              <SetVehicleStateJudgmentMode activeTabKey={activeTabKey} form={mainForm} />
            </TabPane>
            <TabPane tab={<FormattedMessage id="terminalManagement_set_driftthreshold" />} key="17">
              <SetDriftThreshold activeTabKey={activeTabKey} form={mainForm} />
            </TabPane>
          </Tabs>
        </Form>
        <div className={styles['drawer-footerBtns']}>
          {
          hasDefaultBtn
            ? (
              <Button type="primary" onClick={this.setDefaultParam}>
                <FormattedMessage id="terminalManagement_default_value" />
              </Button>
            ) : null
          }
          {
          hasReadBtn
            ? (
              <Button type="primary" onClick={this.readDeviceParamFun}>
                <FormattedMessage id="terminalManagement_read_value" />
              </Button>
            ) : null
          }
          <Button onClick={this.handleSubmit} type="primary">
            <FormattedMessage id="terminalManagement_send_title" />
          </Button>
          <Button onClick={this.changeVisibleKeyFun}>
            <FormattedMessage id="terminalManagement_cancel" />
          </Button>
        </div>
      </Drawer>
    );
  }
}
const SendSms = Form.create({ name: 'sms' })(SendSmsForm);
export default connect(
  state => ({
    tableSelectionData: state.terminalManagementReducers.tableSelectionData, // 列表点击数据
    tCheckData: state.terminalManagementReducers.tableCheckData, // 列表勾选数据
  }),
  dispatch => ({
    // 获取服务器数据
    getServerData: () => {
      dispatch({ type: 'terminalManagement/GET_SERVERDATA_ACTION' });
    },
    // 下发短信
    sendSmsMessage: (data) => {
      dispatch({ type: 'terminalManagement/SEND_MESSAGE_ACTION', payload: data });
    },
    // 读取终端参数
    readDeviceParam: (data) => {
      dispatch({ type: 'terminalManagement/READ_DEVICEPARAM_ACTION', payload: data });
    },
    // 高级查询
    advancedSearch: (payload) => {
      dispatch({ type: 'terminalManagement/SEND_ADVANCED_SEARCH', payload });
    },
  }),
)(injectIntl(SendSms));
