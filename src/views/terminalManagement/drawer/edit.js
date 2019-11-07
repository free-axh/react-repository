/**
 * 修改抽屉
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Drawer, Tabs, Button, Form, Input, Radio, TreeSelect,
  message, Checkbox } from 'antd';
import styles from '../index.module.less';
import '../index.css';

// 获取本地存储
import { getStore } from '../../../utils/localStorage';

const { TabPane } = Tabs;

class EditCom extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    getAllTreeData: PropTypes.func.isRequired,
    allTreeData: PropTypes.array.isRequired,
    special: PropTypes.string.isRequired,
    visibleKey: PropTypes.string.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
    // data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    // data: PropTypes.object.isRequired, // 列表点击数据
    getEdit: PropTypes.func.isRequired,
    editStatus: PropTypes.any.isRequired,
    advancedSearch: PropTypes.func.isRequired,
    isMass: PropTypes.bool.isRequired,
    tableSelectionData: PropTypes.object.isRequired, // 列表点击数据
    // tableSelectionData: state.terminalManagementReducers.tableSelectionData,
    tCheckData: PropTypes.array.isRequired, // 列表勾选数据
    toggleMass: PropTypes.func.isRequired,
    param: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.username = getStore('username');
    this.state = {
      internationalMobiles: '', // IMEI
      organizationId: null, // 所属组织id
      // deviceNumber: null, // 终端号
      servicePattern: null, // 服务模式
      // remark: null, // 备注
      data: {},
      istDeviceNumber: false, // 是否勾选终端号
      isRemark: false, // 是否勾选备注
    };
  }

  componentDidMount() {
    // 获取组织树
    const { getAllTreeData } = this.props;
    if (getAllTreeData) {
      getAllTreeData();
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      form, isMass,
      tCheckData, // 列表勾选的数据
      tableSelectionData, // table点击数据
      form: { setFieldsValue },
    } = nextProps;

    if (isMass && tCheckData
      && Object.keys(tCheckData).length > 0
      && tCheckData !== this.state.data) {
      // 多选操作时:<所属组织>、<服务模式>显示为空
      setFieldsValue({
        remark: '',
        deviceNumber: '',
      });
      this.setState({
        data: tCheckData,
      });
      let internationalMobiles = ''; // imei
      const len = tCheckData.length;
      tCheckData.forEach((d, i) => {
        if ((len - 1) !== i) {
          internationalMobiles += `${d.internationalMobile},`;
        } else {
          internationalMobiles += d.internationalMobile;
        }
        // internationalMobiles += `${d.internationalMobile},`;
      });

      form.setFieldsValue({
        internationalMobiles,
      });

      this.setState({
        internationalMobiles,
      });
    } else if (!isMass && tableSelectionData
      && Object.keys(tableSelectionData).length > 0
      && tableSelectionData !== this.state.data) {
      // 单独操作

      this.setState({
        data: tableSelectionData,
      });

      setFieldsValue({
        remark: tableSelectionData.remark,
        deviceNumber: tableSelectionData.deviceNumber,
      });

      let service;
      switch (tableSelectionData.servicePattern) {
        case 'SIM卡到期模式':
          service = 0;
          break;
        case '终端服务到期模式':
          service = 1;
          break;
        default:
          service = undefined;
      }

      form.setFieldsValue({
        internationalMobiles: tableSelectionData.internationalMobile, // IMEI
        organizationId: tableSelectionData.organizationId, // 所属企业id
        deviceNumber: tableSelectionData.deviceNumber, // 终端号
        servicePattern: service, // 服务模式
        remark: tableSelectionData.remark, // 备注
      });

      this.setState({
        internationalMobiles: tableSelectionData.internationalMobile,
        organizationId: tableSelectionData.organizationId,
        // deviceNumber: tableSelectionData.deviceNumber,
        servicePattern: tableSelectionData.servicePattern,
        // remark: tableSelectionData.remark,
      });
    }
    // }
    // }
  }

  // 所属组织
  setOrganizationId = (e) => {
    this.setState({
      organizationId: e,
    });
  }


  // 服务模式
  setServicePattern = (e) => {
    this.setState({
      servicePattern: e.key,
    });
  }

  // 是否勾选终端号
  selectDeviceNumber = () => {
    const { istDeviceNumber } = this.state;
    this.setState({
      istDeviceNumber: !istDeviceNumber,
    });
    console.log();
  }

  // 是否勾选备注
  selectRemark = () => {
    const { isRemark } = this.state;
    this.setState({
      isRemark: !isRemark,
    });
  }

  // 修改提交
  handleSubmit = () => {
    const { testResult } = this;
    const { getEdit, isMass } = this.props;
    const { istDeviceNumber, isRemark } = this.state;

    this.props.form.validateFields((err, d) => {
      if (!err) {
        if (getEdit) {
          if (isMass) {
            // 批量修改时
            //     internationalMobiles: tableSelectionData.internationalMobile, // IMEI
            // organizationId: tableSelectionData.organizationId, // 所属企业id
            // deviceNumber: tableSelectionData.deviceNumber, // 终端号
            // servicePattern: service, // 服务模式
            // remark: tableSelectionData.remark, // 备注

            let values;
            if (isRemark && istDeviceNumber) {
              // 勾选备注+终端号
              console.log('勾选备注+终端号');
              values = { ...d };
            } else if (isRemark && !istDeviceNumber) {
              // 勾选备注
              console.log('勾选备注');
              values = {
                internationalMobiles: d.internationalMobiles, // IMEI
                organizationId: d.organizationId, // 所属组织id
                servicePattern: d.servicePattern, // 服务模式
                remark: d.remark, // 备注
              };
            } else if (!isRemark && istDeviceNumber) {
              // 勾选终端号
              console.log('勾选终端号');
              values = {
                internationalMobiles: d.internationalMobiles, // IMEI
                organizationId: d.organizationId, // 所属组织id
                servicePattern: d.servicePattern, // 服务模式
                deviceNumber: d.deviceNumber, // 终端号
              };
            } else {
              // 都不勾选
              console.log('都不勾选');
              values = {
                internationalMobiles: d.internationalMobiles, // IMEI
                organizationId: d.organizationId, // 所属组织id
                servicePattern: d.servicePattern, // 服务模式
              };
            }
            getEdit({
              ...values,
              callBack: testResult,
            });

            // getEdit({
            //   ...d,
            //   deviceNumber: istDeviceNumber ? d.deviceNumber : '',
            //   remark: isRemark ? d.remark : '',
            //   callBack: testResult,
            // });
          } else {
            // 单独修改时
            getEdit({ ...d, callBack: testResult });
          }
        }
      }
    });
  }

  // 验证请求结果
  testResult = () => {
    const { editStatus, toggleDrawer,
      advancedSearch, form: { resetFields },
      param, toggleMass,
    } = this.props;
    // console.log(this.props.data);
    if (editStatus.msg === 'success') {
      message.success('修改成功');
      // 列表更新
      advancedSearch({ ...param });
      // 关闭抽屉
      toggleDrawer('clear');
      // mass置成false
      toggleMass(false);

      // 清空
      resetFields();
      // 不勾选复选框

      this.setState({
        isRemark: false,
        istDeviceNumber: false,
      });
    } else {
      message.error('修改失败');
    }
  }

  // 关闭弹框
  close = () => {
    const { toggleDrawer, toggleMass } = this.props;
    toggleDrawer('clear');
    toggleMass(false);
    this.setState({
      istDeviceNumber: false, // 是否勾选终端号
      isRemark: false, // 是否勾选备注
    });
  }

  render() {
    const { allTreeData, special, visibleKey,
      // data,
      isMass, form: { getFieldDecorator } } = this.props;

    const {
      internationalMobiles, // IMEI
      organizationId, // 所属组织id
      // deviceNumber, // 终端号
      servicePattern, // 服务模式
      // remark, // 备注
      istDeviceNumber,
      isRemark,
    } = this.state;

    // 检测是否是批量修改
    const title = isMass ? '批量修改终端信息' : '修改终端信息';

    const rules = isMass ? []
      : [{ min: 15,
        max: 17,
        message: '请输入15-17位数字',
        required: true,
      }];
    return (
      <Drawer
        title={title}
        width={500}
        onClose={this.close}
        visible={visibleKey === 'edit'}
        className="drawer-edit"
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="基本信息" key="1">
            <Form
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 16,
              }}
              onSubmit={this.handleSubmit}
            >
              <Form.Item label="IMEI">
                {getFieldDecorator('internationalMobiles', {
                  rules,
                  initialvalue: internationalMobiles,
                })(<Input
                  placeholder="请输入IMEI"
                  autoComplete="off"
                  allowClear
                  type="telephone"
                  initialvalue=""
                  // onChange={this.setImei}
                  disabled
                  // value={internationalMobile}
                />)}
              </Form.Item>
              {
                this.username === special
                  ? (
                    <Form.Item label="所属组织">
                      {getFieldDecorator('organizationId', {
                        rules: [{ required: true }],
                        initialvalue: organizationId,

                      })(<TreeSelect
                        treeDataSimpleMode
                        dropdownMatchSelectWidth
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={allTreeData}
                        placeholder="请选择所属组织"
                        treeDefaultExpandAll
                        showSearch
                        allowClear
                        // value="1"
                        treeNodeFilterProp="title"
                        onChange={this.setOrganizationId}
                      />)}
                    </Form.Item>
                  ) : null
              }
              <Form.Item label="服务模式">
                {getFieldDecorator('servicePattern', {
                  rules: [
                    { message: '请选择服务模式', required: true },
                  ],
                  initialvalue: servicePattern,

                })(
                  <Radio.Group onChange={this.setServicePattern}>
                    <Radio value={0}>SIM卡到期模式</Radio>
                    <Radio value={1}>终端服务到期模式</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              {
                // Array.isArray(data) && data.length > 1
                isMass
                  ? (
                    <Form.Item
                      label={(
                        <Checkbox
                          onChange={this.selectDeviceNumber}
                          checked={istDeviceNumber}
                        >终端号
                        </Checkbox>
                      )}
                    >
                      {getFieldDecorator('deviceNumber', {
                        rules: [
                          { message: '请输入终端号' },
                        ],
                        // initialvalue: '请输入终端号',
                      })(
                        <Input
                          placeholder="请输入终端号"
                          maxLength={50}
                          autoComplete="off"
                          allowClear
                          // onChange={this.setDeviceNumber}
                          disabled={!istDeviceNumber}
                        />,
                      )}
                    </Form.Item>
                  )
                  : (
                    <Form.Item
                      label="终端号"
                    >
                      {getFieldDecorator('deviceNumber', {
                        rules: [
                          { message: '请输入终端号' },
                        ],
                        // initialvalue: deviceNumber,
                      })(
                        <Input
                          placeholder="请输入终端号"
                          maxLength={50}
                          autoComplete="off"
                          allowClear
                          // onChange={this.setDeviceNumber}
                        />,
                      )}
                    </Form.Item>
                  )}
              {
                    // Array.isArray(data) && data.length > 1
                    isMass
                      ? (
                        <Form.Item label={<Checkbox onChange={this.selectRemark}>备注</Checkbox>}>
                          {getFieldDecorator('remark', {
                            rules: [
                              { message: '请输入备注' },
                            ],
                            // initialvalue: null,
                          })(
                            <Input
                              placeholder="请输入备注"
                              maxLength={50}
                              autoComplete="off"
                              allowClear
                              onChange={this.setRemark}
                              disabled={!isRemark}
                            />,
                          )}
                        </Form.Item>
                      ) : (
                        <Form.Item label="备注">
                          {getFieldDecorator('remark', {
                            rules: [
                              { message: '请输入备注' },
                            ],
                            // initialvalue: remark,
                          })(
                            <Input
                              placeholder="请输入备注"
                              maxLength={50}
                              autoComplete="off"
                              allowClear
                              onChange={this.setRemark}
                            />,
                          )}
                        </Form.Item>
                      )
                  }
            </Form>
          </TabPane>
        </Tabs>
        <div className={styles['drawer-footerBtns']}>
          <Button onClick={this.handleSubmit} type="primary">
              确定
          </Button>
          <Button onClick={this.close}>
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
    allTreeData: state.organizationAndUserReducers.allTreeData, // 组织树
    special: state.rootReducers.special, // 权限用户
    // tableSelectDatas: state.terminalManagementReducers.tableSelectionData, // 列表存储数据
    editStatus: state.terminalManagementReducers.editStatus, // 修改+批量修改后的返回
    tableSelectionData: state.terminalManagementReducers.tableSelectionData, // 列表点击数据
    tCheckData: state.terminalManagementReducers.tableCheckData, // 列表勾选数据
  }),
  dispatch => ({
    // 获取组织树
    getAllTreeData: (payload) => {
      dispatch({ type: 'usertree/TREEDATA_ACTION', payload });
    },
    // 修改+批量修改
    getEdit: (param) => {
      dispatch({ type: 'terminalManagement/SEND_EDIT', param });
    },
    // 高级查询
    advancedSearch: (payload) => {
      dispatch({ type: 'terminalManagement/SEND_ADVANCED_SEARCH', payload });
    },
  }),
)(injectIntl(EditUserForm));