/**
 * 终端列表弹框
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Drawer, Form, Tabs, Row, Col, Typography, Button, message, Modal } from 'antd';
import PropTypes from 'prop-types';
import styles from './index.module.less';

import { getStore } from '../../utils/localStorage'; // 获取本地存储
// 抽屉
import Edit from './drawer/edit'; // 修改
import SendSms from './drawer/sendSms'; // 下发短信
import Charge from './drawer/charge'; // 充值
import Detail from './drawer/detail'; // 详情

const { TabPane } = Tabs;
const { Title } = Typography;

class OperationSettingModal extends Component {
  data = {
    details: {
      imei: '',
      group: '',
      qualifiedTime: '',
      people: '',
    },
  }

  static propTypes = {
    // tableSelectionDatas: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    tableSelectionDatas: PropTypes.object.isRequired, // 列表点击对象为单个
    visibleKey: PropTypes.string.isRequired,
    operateDetail: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
    special: PropTypes.string.isRequired,
    getUpdate: PropTypes.func.isRequired,
    updateStatus: PropTypes.object.isRequired,
    getDelate: PropTypes.func.isRequired,
    delateStatus: PropTypes.object.isRequired,
    getChargeDetail: PropTypes.func.isRequired,
    chargeDetail: PropTypes.object,
    getDetailSIM: PropTypes.func.isRequired,
    advancedSearch: PropTypes.func.isRequired,
    tableCheckData: PropTypes.array.isRequired,
    isMass: PropTypes.bool.isRequired,
    toggleMass: PropTypes.func.isRequired,
    param: PropTypes.object.isRequired,
    // saveTableSelectionData: PropTypes.func.isRequired,
  }

  static defaultProps={
    chargeDetail: {},
  }

  constructor(props) {
    super(props);

    this.username = getStore('username'); // 当前用户名
  }

  // componentWillReceiveProps(nextProps) {
  //   const { visible, saveTableSelectionData } = nextProps;
  //   // 详情弹框关闭时，清空勾选的数据
  //   if (!visible) {
  //     saveTableSelectionData(); // 点击的为对象，用于单个修改
  //   }
  // }

  // 判断有无数据
  isSave = (data, id) => <span className={styles.value}>{data && data[id]}</span>

  // 更新操作
  updates = () => {
    const { getUpdate, tableSelectionDatas } = this.props;
    // console.log(tableSelectionDatas);
    if (getUpdate) {
      getUpdate({
        ids: tableSelectionDatas.id, // 此处我用了imei
        type: 0,
        callBack: this.testUpdate,
      });
    }
  }

  // 检测更新成功与否
  testUpdate = () => {
    const { updateStatus, toggleDrawer } = this.props;

    if (updateStatus.data) {
      message.success('更新成功');
      // 关闭抽屉
      toggleDrawer('clear');
    } else {
      message.error('更新失败');
    }
  }

  // 删除
  delate = () => {
    Modal.confirm({
      title: '操作确认',
      content: '删掉就没了,请谨慎下手!',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const { getDelate, tableSelectionDatas } = this.props;
        if (getDelate) {
          getDelate({
            ids: tableSelectionDatas.id, // 此处我用了imei
            callBack: this.testDelate,
          });
        }
      },
    });
  }

  // 检测删除成功与否
  testDelate = () => {
    const { delateStatus, toggleDrawer, advancedSearch, param } = this.props;
    if (delateStatus.msg === 'success') {
      message.success('删除成功');
      // 关闭抽屉
      toggleDrawer('clear');
      // 列表更新
      advancedSearch({ ...param });
    } else {
      message.error(`删除失败：${delateStatus.msg}`);
    }
  }

  // 充值
  chargeOperate = () => {
    const { toggleDrawer, getChargeDetail, tableSelectionDatas } = this.props;
    toggleDrawer('charge');
    if (getChargeDetail && tableSelectionDatas.id) {
      getChargeDetail({
        id: tableSelectionDatas.id,
      });
    }
  }

  detailOperate = () => {
    const { toggleDrawer, tableSelectionDatas, getDetailSIM } = this.props;

    toggleDrawer('detail');

    if (tableSelectionDatas.id && getDetailSIM) {
      // 详情
      getDetailSIM({
        id: tableSelectionDatas.id,
      });
    }
  }

  render() {
    const { tableSelectionDatas, visibleKey, operateDetail,
      visible, toggleDrawer, tableCheckData, isMass,
      toggleMass, param } = this.props;
    console.log('列表点击数据', tableSelectionDatas);
    console.log('列表勾选数据√√√√√√√√√√√√', tableCheckData);
    return (
      <>
        <Drawer
          title="终端详情"
          visible={visible}
          closable
          onClose={() => operateDetail(false)}
          width={700}
          mask={false}
        >
          <div className={styles['operation-setting-details']}>
            <Tabs defaultActiveKey="1" className={styles['detail-tabs']}>
              <TabPane tab="基本信息" key="1">
                <Row>
                  <Col span={8} className={styles.col}>
                    <span className={styles.title}>IMEI</span>
                    {this.isSave(tableSelectionDatas, 'internationalMobile')}
                  </Col>
                  <Col span={8} className={styles.col}>
                    <span className={styles.title}>所属组织</span>
                    {this.isSave(tableSelectionDatas, 'organizationName')}
                  </Col>
                  <Col span={8} className={styles.col}>
                    <span className={styles.title}>终端号</span>
                    {this.isSave(tableSelectionDatas, 'deviceNumber')}
                  </Col>
                  <Col span={8} className={styles.col}>
                    <span className={styles.title}>短信状态</span>
                    {this.isSave(tableSelectionDatas, 'messageStatus')}
                  </Col>
                  <Col span={8} className={styles.col}>
                    <span className={styles.title}>下发时间</span>
                    {this.isSave(tableSelectionDatas, 'sendTime')}
                  </Col>
                  <Col span={8} className={styles.col}>
                    <span className={styles.title}>在线状态</span>
                    {this.isSave(tableSelectionDatas, 'isOnline')}
                  </Col>
                  <Col span={8} className={styles.col}>
                    <span className={styles.title}>服务模式</span>
                    {this.isSave(tableSelectionDatas, 'servicePattern')}
                  </Col>
                  <Col span={8} className={styles.col}>
                    <span className={styles.title}>服务状态</span>
                    {this.isSave(tableSelectionDatas, 'serviceStatus')}
                  </Col>
                  <Col span={8} className={styles.col}>
                    <span className={styles.title}>更新时间</span>
                    {this.isSave(tableSelectionDatas, 'updatedSimCardTime')}
                  </Col>
                  <Col span={8} className={styles.col}>
                    <span className={styles.title}>终端服务到期时间</span>
                    {this.isSave(tableSelectionDatas, 'deviceServiceExpireTime')}
                  </Col>
                  <Col span={16} className={styles.col}>
                    <span className={styles.title}>终端到期提前提醒时间</span>
                    {this.isSave(tableSelectionDatas, 'deviceExpireRemindTime')}
                  </Col>
                  <Col span={24} className={styles.col}>
                    <span className={styles.title}>备注</span>
                    {this.isSave(tableSelectionDatas, 'remark')}
                  </Col>
                  {/* </>
              ):null */}
                </Row>
              </TabPane>
            </Tabs>
          </div>
          <div className={styles['operation-setting-btn']}>
            <Title className={styles.title}>操作</Title>
            <div className={styles.btn}>
              <Button onClick={() => toggleDrawer('edit')}>修改</Button>
            </div>
            <div className={styles.btn}>
              <Button onClick={this.updates}>更新</Button>
            </div>
            <div className={styles.btn}>
              <Button onClick={() => toggleDrawer('sendSms')}>短信</Button>
            </div>
            <div className={styles.btn}>
              <Button onClick={this.chargeOperate}>充值</Button>
            </div>
            <div className={styles.btn}>
              <Button onClick={this.detailOperate}>详情</Button>
            </div>
            {
            this.username === this.props.special
              ? (
                <div className={styles.btn}>
                  <Button onClick={this.delate}>删除</Button>
                </div>
              ) : null
          }
          </div>
        </Drawer>
        <Edit
          visibleKey={visibleKey}
          toggleDrawer={toggleDrawer}
          // data={tableSelectionDatas || []}
          isMass={isMass} // 当前是批量操作or单独修改
          toggleMass={toggleMass}
          param={param}
        />
        <SendSms
          visibleKey={visibleKey}
          toggleDrawer={toggleDrawer}
          isMass={isMass}
          toggleMass={toggleMass}
          param={param}
        />
        <Charge
          visibleKey={visibleKey}
          toggleDrawer={toggleDrawer}
          tableData={tableSelectionDatas || []}
          detail={this.props.chargeDetail}
        />
        <Detail
          visibleKey={visibleKey}
          toggleDrawer={toggleDrawer}
          data={tableSelectionDatas || []}
        />
      </>
    );
  }
}

export default connect(
  state => ({
    // 操作详情弹框
    operationSettingModalState: state.terminalManagementReducers.operationSettingModalState,
    // 列表点击数据
    tableSelectionDatas: state.terminalManagementReducers.tableSelectionData,
    // ? state.terminalManagementReducers.tableSelectionData
    // : {},
    tableCheckData: state.terminalManagementReducers.tableCheckData, // 列表勾选数据
    special: state.rootReducers.special, // 获取具有特殊权限用户，用于比对展示特殊按钮
    updateStatus: state.terminalManagementReducers.updateStatus, // 更新操作后的状态
    delateStatus: state.terminalManagementReducers.delateStatus, // 删除操作后的返回
    chargeDetail: state.terminalManagementReducers.chargeDetail, // 充值详情返回数据
  }),
  dispatch => ({
    // 高级查询
    advancedSearch: (payload) => {
      dispatch({ type: 'terminalManagement/SEND_ADVANCED_SEARCH', payload });
    },
    // 更新+批量更新
    getUpdate: (param) => {
      dispatch({ type: 'terminalManagement/SEND_UPDATE', param });
    },
    // 删除+批量删除
    getDelate: (param) => {
      dispatch({ type: 'terminalManagement/SEND_DELATE', param });
    },
    // 充值详情
    getChargeDetail: (param) => {
      dispatch({ type: 'terminalManagement/SEND_CHARGE_DETAIL', param });
    },
    // 详情操作
    getDetailSIM: (param) => {
      dispatch({ type: 'terminalManagement/SEND_DETAILSIM', param });
    },
    // // 存储点击列表数据
    // saveTableSelectionData: (payload) => {
    //   dispatch({ type: 'terminalManagement/SEND_SAVE_TABLE_SELECTION_DATA', payload });
    // },
  }),
)(Form.create({ name: 'form-termina-management-operation-setting' })(OperationSettingModal));
