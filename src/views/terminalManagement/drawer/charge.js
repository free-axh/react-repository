/**
 * 充值
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Drawer, Tabs, Button, Form, Input, Radio, Modal, message } from 'antd';
import PropTypes from 'prop-types';
import styles from '../index.module.less';

// 获取本地存储
import { getStore } from '../../../utils/localStorage';

const { TabPane } = Tabs;
const { confirm } = Modal;

// const { Title } = Typography;

class EditCom extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    visibleKey: PropTypes.string.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
    // tableData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    tableData: PropTypes.object.isRequired,
    getChargePost: PropTypes.func.isRequired,
    chargePost: PropTypes.object,
    getChargeUpdate: PropTypes.func.isRequired,
    chargeUpdate: PropTypes.object,
    detail: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    getRechargeQuery: PropTypes.func.isRequired,
  }

  static defaultProps = {
    chargePost: {},
    chargeUpdate: {},
  }

  constructor(props) {
    super(props);
    this.username = getStore('username');

    this.state = {
      id: null,
      paymentType: null,
      money: null,
      isUpdate: false,
      // url: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { id, money, isUpdate } = this.state;
    const { tableData, detail: { data } } = nextProps;
    if ((tableData.id !== id)
    || (money && money !== data.suggestRechargeAmount)) {
      console.log(nextProps, 'PPPPPPPP');
      this.setState({
        id: tableData.id,
      });
    }

    if (data && data.suggestRechargeAmount !== this.state.money && !isUpdate) {
      this.setState({
        money: data.suggestRechargeAmount,
        isUpdate: true,
      });
    }
  }

  // 选择充值方式
  changePaymentType = (e) => {
    this.setState({
      paymentType: e.target.value,
    });
  }

  // 选择充值金额
  changeMoney = (e) => {
    console.log(e.target.value, typeof e.target.value, ']]]]]]]]___----------');
    this.setState({
      money: e.target.value,
    });
  }

  // 提交充值请求
  submit =() => {
    this.props.form.validateFields((err) => {
      if (!err) {
        const { getChargePost } = this.props;
        // const { paymentType, money } = this.state;
        const { id, paymentType, money } = this.state;
        if (getChargePost) {
          getChargePost({
            // id: 2,
            id,
            paymentType,
            money,
            callBack: this.testChargePost,
          });
        }
      }
    });
  }

  // 获取充值结果
  testChargePost = () => {
    const { chargePost } = this.props;
    if (chargePost) {
      if (chargePost.msg === 'success') {
        // 打开新窗口;
        const { data: { url, orderNo } } = chargePost;
        if (url) {
          // this.setState({
          //   url,
          // });
          const w = global.window.open('about:blank');
          w.location.href = url;

          this.openConfirm(orderNo);
        }
      } else {
        message.error(chargePost.msg);
      }
    }
  }

  // 弹框确认
  openConfirm = (orderNo) => {
    const { getRechargeQuery } = this.props;

    const self = this;
    confirm({
      title: '充值结果',
      content: '是否已充值成功？',
      okText: '是，关闭窗口',
      cancelText: '否，重新提交',
      onOk() {
        // 充值成功
        // 调用更新接口，更新余额等信息
        // self.chargeUpdate();
        getRechargeQuery({ orderNo });
        // 关闭抽屉
        self.closeDraw();
      },
      onCancel() {
        // 未充值成功，重新提交
        self.submit();
      },
    });
  }

  // 充值更新
  chargeUpdate = () => {
    const { getChargeUpdate } = this.props;
    const { id } = this.state;
    if (getChargeUpdate) {
      getChargeUpdate({
        deviceId: id,
      });
    }
  }

  // 关闭抽屉
  closeDraw = () => {
    const { toggleDrawer, form: { resetFields } } = this.props;
    if (toggleDrawer) {
      toggleDrawer('clear');
      resetFields();
    }
  }

  render() {
    const { visibleKey,
      detail: { data },
      form: { getFieldDecorator },
      chargeUpdate } = this.props;

    let sim; // sim卡号
    let rest; // 余额
    let time; // 更新时间
    let final; // sim卡到期时间
    let suggest; // 建议充值金额
    if (chargeUpdate) {
      sim = chargeUpdate.simCardNumber;
      rest = chargeUpdate.simCardBalance;
      time = chargeUpdate.updatedSimCardTime;
      final = chargeUpdate.simCardExpireTime;
      suggest = chargeUpdate.suggestRechargeAmount;
      console.log(suggest, '??????????????--------', typeof suggest);
    }

    if (data) {
      console.log(data.suggestRechargeAmount, '{{{{{{{{{-------------', typeof data.suggestRechargeAmount);
    }

    return (
      <Drawer
        title="设备充值"
        width={500}
        onClose={this.closeDraw}
        visible={visibleKey === 'charge'}
        className="drawer-charge"
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="基本信息" key="1">
            <Form
              labelCol={{
                span: 7,
              }}
              wrapperCol={{
                span: 16,
              }}
            >
              <Form.Item label="IMEI">
                {getFieldDecorator('imei', {
                  initialValue: data && data.internationalMobile,
                })(<Input
                  autoComplete="off"
                  disabled
                />)}
              </Form.Item>
              <Form.Item label="终端号">
                {getFieldDecorator('deviceNumber', {
                  initialValue: data && data.deviceNumber,
                })(
                  <Input disabled autoComplete="off" />,
                )}
              </Form.Item>
              <Form.Item label="SIM卡号">
                {getFieldDecorator('simCardNumber', {
                  initialValue: sim || (data && data.simCardNumber),
                  // 当更新时，优先使用更新返回结果sim
                })(
                  <Input disabled autoComplete="off" />,
                )}
              </Form.Item>
              <Form.Item label="ICCID">
                {getFieldDecorator('integrateCircuitCardIdentity', {
                  initialValue: data && data.integrateCircuitCardIdentity,
                })(
                  <Input disabled autoComplete="off" />,
                )}
              </Form.Item>
              <Form.Item label="销售套餐">
                {getFieldDecorator('simCardMonthlyFee', {
                  initialValue: data && data.simCardMonthlyFee,
                })(
                  <Input disabled autoComplete="off" />,
                )}
              </Form.Item>
              <Form.Item label="所属组织">
                {getFieldDecorator('organizationName', {
                  initialValue: data && data.organizationName,
                })(
                  <Input disabled autoComplete="off" />,
                )}
              </Form.Item>
              <Form.Item label="设备服务到期时间">
                {getFieldDecorator('deviceServiceExpireTime', {
                  initialValue: data && data.deviceServiceExpireTime,
                })(
                  <Input disabled autoComplete="off" />,
                )}
              </Form.Item>
              <Form.Item label="SIM卡到期时间">
                {getFieldDecorator('simCardNumber', {
                  initialValue: final || (data && data.simCardNumber),
                  // 当更新时，优先使用更新返回结果final
                })(
                  <Input disabled autoComplete="off" />,
                )}
              </Form.Item>
              <Form.Item label="余额">
                {getFieldDecorator('simCardBalance', {
                  initialValue: rest || (data && data.simCardBalance),
                  // 当更新时，优先使用更新返回结果rest
                })(
                  <Input disabled autoComplete="off" />,
                )}
              </Form.Item>
              <Form.Item label="更新时间">
                {getFieldDecorator('updatedSimCardTime', {
                  initialValue: time || (data && data.updatedSimCardTime),
                  // 当更新时，优先使用更新返回结果time
                })(
                  <Input disabled autoComplete="off" />,
                )}
              </Form.Item>
              <Form.Item label="充值方式">
                {getFieldDecorator('paymentType', {
                  rules: [{
                    required: true,
                    message: '请选择充值方式',
                  }],
                })(
                  <Radio.Group onChange={this.changePaymentType}>
                    <Radio value="ALIPAY-WAP">支付宝充值</Radio>
                    <Radio value="WEIXIN-NATIVE">微信充值</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label="充值金额">
                {getFieldDecorator('money', {
                  rules: [{
                    required: true,
                    pattern: new RegExp(/^([1-4]\d{0,2}|([1-9]\d{0,1})|500)(\.\d{1})?$/), // 可以不写小数点
                    message: '请输入 1.0-500.0 之间的金额',
                  }],
                  initialValue: suggest || (data && data.suggestRechargeAmount),
                  // 当更新时，优先使用更新返回结果suggest
                })(
                  <Input
                    placeholder="请输入 1.0-500.0 之间的金额"
                    autoComplete="off"
                    allowClear
                    onChange={this.changeMoney}
                  />,
                )}
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
        <div className={styles['drawer-footerBtns']}>
          <Button onClick={this.chargeUpdate} type="primary">
              更新
          </Button>
          <Button onClick={this.submit} type="primary">
              确定
          </Button>
          <Button onClick={this.closeDraw}>
              取消
          </Button>
        </div>
      </Drawer>
    );
  }
}

const EditUserForm = Form.create({ name: 'editDrawer' })(EditCom);
export default connect(
  state => ({
    chargePost: state.terminalManagementReducers.chargePost, // 提交充值返回
    chargeUpdate: state.terminalManagementReducers.chargeUpdate, // 充值页面更新返回
  }),
  dispatch => ({
    // 提交充值
    getChargePost: (param) => {
      dispatch({ type: 'terminalManagement/SEND_CHARGE_POST', param });
    },
    // 充值页面更新
    getChargeUpdate: (param) => {
      dispatch({ type: 'terminalManagement/SEND_CHARGE_UPDATE', param });
    },
    // 订单查询-->用户选择充值成功后，更新充值状态
    getRechargeQuery: (param) => {
      dispatch({ type: 'terminalManagement/SEND_RECHARGE_QUERY', param });
    },
  }),
)(injectIntl(EditUserForm));