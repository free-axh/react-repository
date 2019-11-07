/**
 * 详情
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Drawer, Tabs, Button, Form, Row, Col, message } from 'antd';
import PropTypes from 'prop-types';
import { Map, Marker, InfoWindow } from 'react-amap';
import styles from '../index.module.less';
// 获取本地存储
import { getStore } from '../../../utils/localStorage';

const { TabPane } = Tabs;

class EditCom extends Component {
  static propTypes = {
    visibleKey: PropTypes.string.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
    // data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    data: PropTypes.object.isRequired,
    detailSIM: PropTypes.object,
    getDetailSpecialUpdate: PropTypes.func.isRequired,
    detailSpecialUpdateData: PropTypes.object,
    getDetailPostion: PropTypes.func.isRequired,
  }

  static defaultProps={
    detailSIM: {},
    detailSpecialUpdateData: {},
  }


  constructor(props) {
    super(props);
    this.state = {
      curVisibleWindow: false,
      markerPosition: {
        longitude: 0,
        latitude: 0,
      },
      address: null,
      locationTime: null,
      internationalMobile: null,
    };

    this.username = getStore('username');
  }

  componentDidMount() {
    this.socketConnected();
  }

  /**
   * 建立socket连接
   */
  socketConnected = () => {
    const self = this;
    setTimeout(() => {
      const headers = { access_token: getStore('token') };
      if (!global.socket) {
        this.socketConnected();
      } else {
        global.socket.subscribe(headers, `/user/${this.username}/deviceDetailPage`,
          res => self.setPosition(res.body), null, null);
      }
    }, 1000);
  }

  // 定位信息
  setPosition =(res) => {
    const data = JSON.parse(res);

    const { address,
      locationTime,
      latitude,
      internationalMobile,
      longitude } = data;

    this.setState({
      address,
      locationTime,
      internationalMobile,
      markerPosition: {
        latitude,
        longitude,
      },
      curVisibleWindow: true,
    });
  }

  // 判断有无数据
  isSave = (data, id) => <span className={styles.value}>{data && data[id]}</span>

  // 更新
  updateSpecial = () => {
    const { getDetailSpecialUpdate, data, getDetailPostion } = this.props;
    if (getDetailSpecialUpdate) {
      getDetailSpecialUpdate({
        deviceId: data.id,
        callBack: this.testUpdateSpecial,
      });
      if (global.socket) {
        const headers = { access_token: getStore('token') };
        const param = { deviceId: data.id, username: this.username };
        global.socket.subscribe(headers, null,
          (res) => { console.log(res); }, '/app/subscribe/deviceDetail', param);
      }
      getDetailPostion({
        deviceId: data.id,
      });
    }
  }

  // 检测更新结果返回
  testUpdateSpecial = () => {
    const { detailSpecialUpdateData } = this.props;
    if (Object.keys(detailSpecialUpdateData).length > 0) {
      const { msg } = detailSpecialUpdateData.data;
      console.log('详情返回', detailSpecialUpdateData);

      if (msg === 'success') {
        message.success('更新成功');
      } else {
        message.error('更新失败');
      }
    }
  }

  // 关闭抽屉
  closeDraw = () => {
    const { toggleDrawer } = this.props;
    toggleDrawer('clear');
    this.setState({
      curVisibleWindow: false,
      markerPosition: {
        longitude: 0,
        latitude: 0,
      },
      address: null,
      locationTime: null,
      internationalMobile: null,
    });
  }

  render() {
    const { visibleKey,
      data,
      detailSIM,
      detailSpecialUpdateData } = this.props;

    // let ups;
    console.log(detailSpecialUpdateData, '||||||||||||||||');
    // if (Object.keys(detailSpecialUpdateData).length > 0) {
    //   console.log(detailSpecialUpdateData, '++++++++++++');
    //   ups = detailSpecialUpdateData.data;
    // }

    const {
      address,
      locationTime,
      internationalMobile,
      markerPosition,
      curVisibleWindow,
    } = this.state;
    // const { latitude, longitude } = markerPosition;
    // console.log(ups, '))))))))))))))');
    return (
      <Drawer
        title="详情"
        width={500}
        onClose={this.closeDraw}
        visible={visibleKey === 'detail'}
        className="drawer-detail"
      >
        <Tabs defaultActiveKey="1" className={styles['drawer-detail-tabs']}>
          <TabPane tab="基本信息" key="1">
            <Row>
              <Col span={8} className={styles.col}>
                <span className={styles.title}>IMEI</span>
                {this.isSave(data, 'internationalMobile')}
              </Col>
              <Col span={8} className={styles.col}>
                <span className={styles.title}>所属组织</span>
                {this.isSave(data, 'organizationName')}
              </Col>
              <Col span={8} className={styles.col}>
                <span className={styles.title}>终端号</span>
                {this.isSave(data, 'deviceNumber')}
              </Col>
              <Col span={8} className={styles.col}>
                <span className={styles.title}>短信状态</span>
                {this.isSave(data, 'messageStatus')}
              </Col>
              <Col span={8} className={styles.col}>
                <span className={styles.title}>下发时间</span>
                {this.isSave(data, 'sendTime')}
              </Col>
              <Col span={8} className={styles.col}>
                <span className={styles.title}>在线状态</span>
                {this.isSave(data, 'isOnline')}
              </Col>
              <Col span={8} className={styles.col}>
                <span className={styles.title}>服务模式</span>
                {this.isSave(data, 'servicePattern')}
              </Col>
              <Col span={8} className={styles.col}>
                <span className={styles.title}>服务状态</span>
                {this.isSave(data, 'serviceStatus')}
              </Col>
              <Col span={8} className={styles.col}>
                <span className={styles.title}>更新时间</span>
                {
                  detailSpecialUpdateData ? (
                    <span className={styles.value}>
                      {detailSpecialUpdateData && detailSpecialUpdateData.updatedSimCardTime}
                    </span>
                  ) : (this.isSave(data, 'updatedSimCardTime'))
                }
              </Col>
              <Col span={8} className={styles.col}>
                <span className={styles.title}>终端服务到期时间</span>
                {this.isSave(data, 'deviceServiceExpireTime')}
              </Col>
              <Col span={16} className={styles.col}>
                <span className={styles.title}>终端到期提前提醒时间</span>
                {this.isSave(data, 'deviceExpireRemindTime')}
              </Col>
              <Col span={24} className={styles.col}>
                <span className={styles.title}>备注</span>
                {this.isSave(data, 'remark')}
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="SIM卡信息" key="2">
            <Row>
              <Col span={8} className={styles.col}>
                <span className={styles.title}>ICCID</span>
                {this.isSave(detailSIM, 'integrateCircuitCardIdentity')}
              </Col>
              <Col span={8} className={styles.col}>
                <span className={styles.title}>SIM卡号</span>
                {
                  detailSpecialUpdateData ? (
                    <span className={styles.value}>
                      {detailSpecialUpdateData && detailSpecialUpdateData.simCardNumber}
                    </span>
                  ) : (this.isSave(detailSIM, 'simCardNumber'))
                }
              </Col>
              <Col span={8} className={styles.col}>
                <span className={styles.title}>套餐</span>
                {this.isSave(detailSIM, 'simCardSalePackageName')}
              </Col>
              <Col span={8} className={styles.col}>
                <span className={styles.title}>月费</span>
                {this.isSave(detailSIM, 'simCardMonthlyFee')}
              </Col>
              <Col span={8} className={styles.col}>
                <span className={styles.title}>余额</span>
                {
                  detailSpecialUpdateData ? (
                    <span className={styles.value}>
                      {detailSpecialUpdateData && detailSpecialUpdateData.simCardBalance}
                    </span>
                  ) : (this.isSave(detailSIM, 'simCardBalance'))
                }
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="定位信息" key="3" style={{ border: 'none', width: '100%', minHeight: '775px' }}>
            <Map
              amapkey="788e08def03f95c670944fe2c78fa76f"
              style={{ border: 'none', width: '100%', minHeight: '775px' }}
              center={markerPosition}
              zoom={6}
            >
              <Marker
                position={markerPosition}
                clickable
                visible={curVisibleWindow}
              />
              <InfoWindow
                position={markerPosition}
                visible={curVisibleWindow}
                offset={[0, -35]}
                isCustom // 是否自定义窗体。
              >
                <div>
                  <p>
                    <span>定位时间：</span>
                    <span>{locationTime}</span>
                  </p>
                  <p>
                    <span>IMEI：</span>
                    <span>{internationalMobile}</span>
                  </p>
                  <p>
                    <span>位置：</span>
                    <span>{address}</span>
                  </p>
                </div>
              </InfoWindow>
            </Map>,
          </TabPane>
        </Tabs>

        <div className={styles['drawer-footerBtns']}>
          <Button onClick={this.updateSpecial} type="primary">
              更新
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
    detailSIM: state.terminalManagementReducers.detailSIM, // 详情操作返回
    detailSpecialUpdateData: state.terminalManagementReducers.detailSpecialUpdateData, // 详情更新返回
  }),
  dispatch => ({
    // 详情页更新（sim卡号+余额+更新时间）
    getDetailSpecialUpdate: (param) => {
      dispatch({ type: 'terminalManagement/SEND_DETAIL_SPECIAL_UPDATE', param });
    },
    // 详情页面获取数据（定位信息）
    getDetailPostion: (param) => {
      dispatch({ type: 'terminalManagement/SEND_DETAIL_POSITION', param });
    },
  }),
)(injectIntl(EditUserForm));