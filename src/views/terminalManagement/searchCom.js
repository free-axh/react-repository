/**
 * 搜索+高级搜索模块
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Form, Row, Col, Button, Icon, Menu, Modal, Upload, Popover,
  Select, DatePicker, Dropdown, Input, message } from 'antd';
import moment from 'moment';

import PropTypes from 'prop-types';
import ColumnCustomForm from '../../common/columnCustom';// 自定义显示列
import { getStore } from '../../utils/localStorage';
import styles from './index.module.less';

const { RangePicker } = DatePicker;
const { confirm } = Modal;
const { Option } = Select;

class Searchs extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    massOperation: PropTypes.bool.isRequired,
    special: PropTypes.string.isRequired,
    checkLength: PropTypes.number.isRequired,
    massShow: PropTypes.func.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
    advancedSearch: PropTypes.func.isRequired,
    downloadImportTemplates: PropTypes.func.isRequired,
    terminalDownloadList: PropTypes.func.isRequired,
    importTemplate: PropTypes.func.isRequired,
    importTemplateError: PropTypes.func.isRequired,
    getUpdate: PropTypes.func.isRequired,
    tableSelectionDatas: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    updateStatus: PropTypes.object.isRequired,
    getDelate: PropTypes.func.isRequired,
    delateStatus: PropTypes.object.isRequired,
    columns: PropTypes.array.isRequired,
    setColumn: PropTypes.func.isRequired,
    toggleMass: PropTypes.func.isRequired,
    tCheckData: PropTypes.array.isRequired, // 列表勾选数据
    setClearTreeSelected: PropTypes.func.isRequired,
    param: PropTypes.object.isRequired,
    searchFun: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    const token = getStore('token');
    this.username = getStore('username'); // 当前用户名

    this.state = {
      expand: false, // 高级搜索栏是否展开
      headers: {
        Authorization: `Bearer ${token}`,
      },
      // visible: null,
      // 查询条件
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
      // param: {},
    };
  }

  // componentWillReceiveProps(nextProps) {
  //   // 更新搜索参数
  //   const { param } = nextProps;

  //   const { stateParam } = this.state;
  //   if (param !== stateParam) {
  //     this.setState({
  //       param,
  //     });
  //   }
  // }

  // 重置
  handleReset = () => {
    const { form: { resetFields }, searchFun: { updateLimit } } = this.props;
    // const
    resetFields();
    // this.setState({
    //   page: 1, // 当前页
    //   limit: 10, // 每页容量
    //   simpleQueryParam: '', // 模糊查询
    //   // deviceNumber: '', // 终端号
    //   messageStatus: null, // 短信状态 0发送中 1发送成功 8发送失败（全部时此字段为空）
    //   isOnline: null, // 在线状态 1：在线 0：离线（全部时此字段为空）
    //   servicePattern: null, // 服务模式 0 ：SIM卡到期模式 1：终端服务到期模式（全部时此字段为空）
    //   serviceStatus: null, // 服务状态 0：异常 1：正常 2：即将停机 3：服务即将到期 4：已停机 5：服务已到期（全部时此字段为空）
    //   startTime: '',
    //   endTime: '',
    //   searchType: 0, // 查询类型 0：正常查询  1：导入查询
    // });
    // 还原搜索条件
    updateLimit();
    // this.setState({
    //   param: {
    //     page: 1, // 当前页
    //     limit: 10, // 每页容量
    //     simpleQueryParam: '', // 模糊查询
    //     // deviceNumber: '', // 终端号
    //     messageStatus: null, // 短信状态 0发送中 1发送成功 8发送失败（全部时此字段为空）
    //     isOnline: null, // 在线状态 1：在线 0：离线（全部时此字段为空）
    //     servicePattern: null, // 服务模式 0 ：SIM卡到期模式 1：终端服务到期模式（全部时此字段为空）
    //     serviceStatus: null, // 服务状态 0：异常 1：正常 2：即将停机 3：服务即将到期 4：已停机 5：服务已到期（全部时此字段为空）
    //     startTime: '',
    //     endTime: '',
    //     searchType: 0, // 查询类型 0：正常查询  1：导入查询
    //   },
    // });
  };

  // 切换高级搜索框出现隐藏
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };

  // 生成option
  renderOption = data => data.map(d => (
    <Option
      value={d.key}
      title={d.value}
      key={d.key}
    >{d.value}
    </Option>
  ))

  // // 模糊查询值
  // setSimpleQueryParam = (e) => {
  //   this.setState({ simpleQueryParam: e.target.value });
  // }

  // // 短信状态
  // setMessageStatus = (e) => {
  //   let value = null;
  //   if (e.key !== 'all') {
  //     value = e.key;
  //   }
  //   this.setState({ messageStatus: value });
  // }

  // // 在线状态
  // setIsOnline = (e) => {
  //   let value = null;
  //   if (e.key !== 'all') {
  //     value = e.key;
  //   }
  //   console.log(e);
  //   this.setState({ isOnline: value });
  // }

  // // 服务模式
  // setServicePattern = (e) => {
  //   let value = null;
  //   if (e.key !== 'all') {
  //     value = e.key;
  //   }
  //   this.setState({ servicePattern: value });
  // }

  // // 服务状态
  // setServiceStatus =(e) => {
  //   let value = null;
  //   if (e.key !== 'all') {
  //     value = e.key;
  //   }
  //   this.setState({ serviceStatus: value });
  // }

  // 时间控制
  range = (start, end) => {
    const result = [];

    for (let i = start; i < end; i += 1) {
      result.push(i);
    }
    return result;
  }

  // 时间控制
  disabledRangeTime = (_, type) => {
    if (type === 'start') {
      return {
        disabledHours: () => this.range(0, 60).splice(4, 20),
        disabledMinutes: () => this.range(30, 60),
        disabledSeconds: () => [55, 56],
      };
    }
    return {
      disabledHours: () => this.range(0, 60).splice(20, 4),
      disabledMinutes: () => this.range(0, 31),
      disabledSeconds: () => [55, 56],
    };
  }

  // // 终端服务到期时间
  // setTime = (value, dateString) => {
  //   this.setState({
  //     startTime: dateString[0],
  //     endTime: dateString[1],
  //   });
  // }

  // 搜索
  search = () => {
    // const { param } = this.state;
    const { param } = this.props;
    this.props.form.validateFields((err) => {
      if (!err) {
        const { advancedSearch } = this.props;

        // const { expand, headers, visible, ...param } = this.state;
        // const { param } = this.state;

        if (advancedSearch) {
          advancedSearch({ ...param });

          this.toggle(); // 收起搜索框
          // this.handleReset(); // 清空搜索框
        }
      }
    });
  }

  // 下载导入查询模板
  download = () => {
    const { downloadImportTemplates } = this.props;
    if (downloadImportTemplates) {
      downloadImportTemplates();
    }
  }

  // 下载导入终端信息模板
  download2 = () => {
    const { importTemplate } = this.props;
    if (importTemplate) {
      importTemplate();
    }
  }

  // 导出取消
  cancel = (e) => {
    console.log(e);
    this.toggle(); // 收起搜索框
  }

  // 导出列表弹框
  showExport = () => {
    const { terminalDownloadList, checkLength, tableSelectionDatas } = this.props;
    // const { expand, headers, page, limit, ...param } = this.state;
    // const { param } = this.state;
    const { param } = this.props;

    if (checkLength <= 0) {
      // 没有勾选，弹框确认
      confirm({
        title: '操作确认',
        content: '是否导出所有记录',
        onOk() {
          if (terminalDownloadList) {
            terminalDownloadList({ deviceIds: null, ...param });
          }
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    } else {
      // 勾选 直接导出
      let deviceIds = '';
      tableSelectionDatas.forEach((d, i) => {
        if (i !== checkLength - 1) {
          deviceIds += `${d.id},`;
        } else {
          deviceIds += `${d.id}`;
        }
      });
      terminalDownloadList({ deviceIds, ...param });
    }
  }

  /**
   * 导入文件查询
   */
  importChange = (info) => {
    const self = this;
    const { searchFun: { setSearchType } } = self.props;
    if (info.file.status === 'done') {
      // message.success(`${info.file.name} file uploaded successfully`);
      if (info.file.response.data) {
        message.success('导入成功');
        // 改变查询状态为：导入查询
        // this.setState({
        //   param: {
        //     searchType: 1,
        //   },
        // }, () => {
        //   self.search();
        //   const { setClearTreeSelected } = this.props;
        //   setClearTreeSelected(true);
        // });
        const callback = () => {
          self.search();
          const { setClearTreeSelected } = this.props;
          setClearTreeSelected(true);
        };
        setSearchType(1, callback);
      } else {
        message.error('导入失败');
        self.search();
      }
    }
  }

  /**
   * 导入终端列表
   */
  importChange2 = (info) => {
    // const self = this;
    const { advancedSearch, importTemplateError, searchFun: { updateLimit } } = this.props;
    // const { limit } = this.state.param;
    const { param } = this.props;
    if (info.file.status === 'done') {
      console.log(info.file);
      if (info.file.response.data) {
        message.success('导入成功');
        // 列表更新
        // advancedSearch({
        //   page: 1, // 当前页
        //   limit, // 每页容量
        //   simpleQueryParam: '', // 模糊查询
        //   // deviceNumber: '', // 终端号
        //   messageStatus: null, // 短信状态 0发送中 1发送成功 8发送失败（全部时此字段为空）
        //   isOnline: null, // 在线状态 1：在线 0：离线（全部时此字段为空）
        //   servicePattern: null, // 服务模式 0 ：SIM卡到期模式 1：终端服务到期模式（全部时此字段为空）
        //   serviceStatus: null, // 服务状态 0：异常 1：正常 2：即将停机 3：服务即将到期 4：已停机 5：服务已到期（全部时此字段为空）
        //   startTime: '',
        //   endTime: '',
        //   searchType: 0, // 查询类型 0：正常查询  1：导入查询
        // });
        advancedSearch({ ...param });
        // 还原搜索条件
        updateLimit(param.limit);
      } else {
        message.error('导入失败');
        // const { importTemplateError } = this.props;
        confirm({
          title: '操作确认',
          content: '导入失败，请下载文件查看失败原因',
          okText: '下载',
          cancelText: '取消',
          centered: true,
          onOk: () => {
            // console.log('下载');
            importTemplateError();
          },
          onCancel: () => {
            // console.log('Cancel');
          },
        });
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  // 高级搜索弹框dom构造
  renderSearch = () => {
    // const { getFieldDecorator } = this.props.form;
    const { searchFun, form: { getFieldDecorator } } = this.props;
    const { headers } = this.state;
    const {
      setSimpleQueryParamFun,
      setMessageStatusFun,
      setIsOnlineFun,
      setServicePatternFun,
      setServiceStatusFun,
      setTimeFun,
    } = searchFun;
    // 短信状态
    const messageData = [
      { key: 0, value: '发送中' },
      { key: 1, value: '发送成功' },
      { key: 8, value: '发送失败' },
      { key: 'all', value: '全部' },
    ];
    // 在线状态
    const onlineData = [
      { key: 1, value: '在线' },
      { key: 0, value: '离线' },
      { key: 'all', value: '全部' },
    ];
    // 服务模式
    const serverData = [
      { key: 0, value: 'SIM卡到期模式' },
      { key: 1, value: '终端服务到期模式' },
      { key: 'all', value: '全部' },
    ];
    // 服务状态
    const statusData = [
      { key: 0, value: '异常' },
      { key: 1, value: '正常' },
      { key: 2, value: '即将停机' },
      { key: 3, value: '服务即将到期' },
      { key: 4, value: '已停机' },
      { key: 5, value: '服务已到期' },
      { key: 'all', value: '全部' },
    ];

    const identify = 'terminalManagement-search';
    return (
      <Menu>
        <div className={styles['dropdown-wrapper']}>
          <div className={styles['dropdown-header']}>
            <Icon type="search" /> 搜索
          </div>
          <Form layout="vertical" className={styles['dropdown-content']}>
            <Form.Item label="IMEI" className={styles['ant-row']}>
              {getFieldDecorator(`${identify}simpleQueryParam`)(<Input
                placeholder="请输入IMEI"
                autoComplete="off"
                allowClear
                type="telephone"
                initialvalue=""
                onChange={e => setSimpleQueryParamFun(e, 'simpleQueryParam')}
              />)}
            </Form.Item>
            <Form.Item label="终端号" className={styles['ant-row']}>
              {getFieldDecorator(`${identify}deviceNumber`, {
                rules: [
                  { message: '请输入终端号' },
                ],
              })(<Input
                placeholder="请输入终端号"
                maxLength={50}
                autoComplete="off"
                allowClear
                onChange={e => setSimpleQueryParamFun(e, 'simpleQueryParam')}
              />)}
            </Form.Item>
            <Form.Item label="短信状态" className={styles['ant-row']}>
              {getFieldDecorator(`${identify}messageStatus`,
                { initialValue: { key: 'all' } })(
                  <Select
                    labelInValue
                    // value={{ key: 'all' }}
                    onChange={setMessageStatusFun}
                  >
                    {this.renderOption(messageData)}
                  </Select>,
              )}
            </Form.Item>
            <Form.Item label="在线状态" className={styles['ant-row']}>
              {getFieldDecorator(`${identify}isOnline`, { initialValue: { key: 'all' } })(
                <Select
                  labelInValue
                  onChange={setIsOnlineFun}
                >
                  {this.renderOption(onlineData)}
                </Select>,
              )}

            </Form.Item>
            <Form.Item label="服务模式" className={styles['ant-row']}>
              {getFieldDecorator(`${identify}servicePattern`, { initialValue: { key: 'all' } })(
                <Select
                  labelInValue
                  onChange={setServicePatternFun}
                >
                  {this.renderOption(serverData)}
                </Select>,
              )}

            </Form.Item>
            <Form.Item label="服务状态" className={styles['ant-row']}>
              {getFieldDecorator(`${identify}serviceStatus`, { initialValue: { key: 'all' } })(
                <Select
                  labelInValue
                  onChange={setServiceStatusFun}
                >
                  {this.renderOption(statusData)}
                </Select>,
              )}
            </Form.Item>
            <Form.Item label="终端服务到期时间" className={styles['ant-row2']}>
              {getFieldDecorator(`${identify}deviceServiceExpireTime`)(
                <RangePicker
                  // disabledDate={current => current && current > moment().endOf('day')}
                  // disabledTime={this.disabledRangeTime}
                  showTime={{
                    // hideDisabledOptions: true,
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                  }}
                  onChange={setTimeFun}
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: '100%' }}
                />,
              )}
            </Form.Item>
            <Form.Item className={styles['ant-row2']}>
              <Popover
                content={(
                  <div>
                    <Button type="primary" onClick={this.download}>下载模板</Button>
                      &nbsp;
                    <Upload
                      accept=".xls,.xlsx"
                      // name="file"
                      action="/api/device/management/importSearch"
                      onChange={this.importChange}
                      headers={headers}
                    >
                      <Button type="primary">导入文件</Button>
                    </Upload>
                  </div>
                  )}
              >
                <Button type="primary">导入查询</Button>
              </Popover>
            </Form.Item>
            <Form.Item className={styles['ant-row']}>
              <Button type="primary" className={styles['ant-btn']} onClick={this.search}>搜索</Button>
              <Button className={styles['ant-btn']} onClick={this.cancel}>取消</Button>
              <Button type="link" onClick={this.handleReset} style={{ paddingLeft: 0 }}>清空</Button>
            </Form.Item>
          </Form>
        </div>
      </Menu>
    );
  };

  // 批量更新操作
  updates = () => {
    const { getUpdate, tCheckData } = this.props;

    // 当前是批量操作，使用勾选对象
    let ids = '';
    const len = tCheckData.length;
    tCheckData.forEach((d, i) => {
      if ((len - 1) === i) {
        ids += d.id;
      } else {
        ids += `${d.id},`;
      }
    });

    if (getUpdate) {
      getUpdate({
        ids,
        type: 1,
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

  // 批量删除
  delate = () => {
    // 使用勾选数据
    const { getDelate, tCheckData } = this.props;
    let ids = '';
    const len = tCheckData.length;
    tCheckData.forEach((d, i) => {
      if ((len - 1) === i) {
        ids += d.id;
      } else {
        ids += `${d.id},`;
      }
    });

    Modal.confirm({
      title: '操作确认',
      content: '删掉就没了,请谨慎下手!',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        if (getDelate) {
          getDelate({
            ids, // 此处我用了imei
            callBack: this.testDelate,
          });
        }
      },
    });
  }

  // 检测批量删除成功与否
  testDelate = () => {
    const { delateStatus, toggleDrawer, advancedSearch, searchFun: { updateLimit } } = this.props;
    // const { limit } = this.state.param;
    const { param } = this.props;
    if (delateStatus.msg === 'success') {
      message.success('删除成功');
      // 关闭抽屉
      toggleDrawer('clear');
      // 列表更新
      // advancedSearch({
      //   page: 1, // 当前页
      //   limit, // 每页容量
      //   simpleQueryParam: '', // 模糊查询
      //   // deviceNumber: '', // 终端号
      //   messageStatus: null, // 短信状态 0发送中 1发送成功 8发送失败（全部时此字段为空）
      //   isOnline: null, // 在线状态 1：在线 0：离线（全部时此字段为空）
      //   servicePattern: null, // 服务模式 0 ：SIM卡到期模式 1：终端服务到期模式（全部时此字段为空）
      //   serviceStatus: null, // 服务状态 0：异常 1：正常 2：即将停机 3：服务即将到期 4：已停机 5：服务已到期（全部时此字段为空）
      //   startTime: '',
      //   endTime: '',
      //   searchType: 0, // 查询类型 0：正常查询  1：导入查询
      // });
      advancedSearch({ ...param });
      // 还原搜索条件
      updateLimit(param.limit);
    } else {
      message.error(`删除失败：${delateStatus.msg}`);
    }
  }

  // 批量修改
  massEdit = () => {
    const { toggleDrawer, toggleMass } = this.props;
    // 打开弹窗
    toggleDrawer('edit');
    // 修改isMass状态，当前是批量操作
    toggleMass(true);
  }

  // 批量短信
  sendSms = () => {
    const { toggleDrawer, toggleMass } = this.props;
    // 打开弹窗
    toggleDrawer('sendSms');
    // 修改isMass状态，当前是批量操作
    toggleMass(true);
  }

  render() {
    const {
      headers,
      expand,
      // currentColumns,
    } = this.state;
    const { massOperation,
      special,
      checkLength,
      massShow,
      setColumn, columns,
    } = this.props;
    console.log(this.state, '???render');

    return (
      <>
        {/* <Form onSubmit={this.handleSearch}> */}
        <Form>
          <Row className={styles['basic-search']}>
            <Col span={18} style={{ textAlign: 'left' }}>
              {
                massOperation && (
                  <div className={styles['batch-handle-info']}>
                    <Icon
                      type="close-circle"
                      title="清除勾选项"
                      onClick={() => massShow([])}
                    />
                      已选择 <span>{checkLength}</span> 项
                  </div>
                )
              }
              {/* 导出列表 */}
              <Button onClick={this.showExport} className={styles['button-group']} type="primary">导出</Button>
              { /** 是否显示导入（admin） */
                this.username === special
                  ? (
                  //   <Popover
                  //     content={(
                  //       <div>
                  //         <Button type="primary" onClick={this.download2}>下载模板</Button>
                  //     &nbsp;
                  //         <Upload
                  //           accept=".xls,.xlsx"
                  //           // name="file"
                  //           action="/api/device/management/importDevice"
                  //           onChange={this.importChange2}
                  //           headers={headers}
                  //         >
                  //           <Button type="primary">导入文件</Button>
                  //         </Upload>
                  //       </div>
                  // )}
                  //     trigger="click"
                  //     className={styles['button-group']}
                  //   >
                  //     <Button type="primary">导入</Button>
                  //   </Popover>
                    <Dropdown
                      // trigger={['click']}
                      overlay={(
                        <Menu>
                          <Menu.Item onClick={this.download2}>
                            下载模板
                          </Menu.Item>
                          <Menu.Item>
                            <Upload
                              accept=".xls,.xlsx"
                              action="/api/device/management/importDevice"
                              onChange={this.importChange2}
                              headers={headers}
                              showUploadList={false}
                            >
                              导入文件
                            </Upload>
                          </Menu.Item>
                        </Menu>
                  )}
                    >
                      <Button type="primary" className={styles['button-group']}>导入</Button>
                    </Dropdown>
                  )
                  : null
              }
              {this.props.massOperation && (
                <span>
                  <Button
                    type="primary"
                    className={styles['button-group']}
                    // onClick={() => toggleDrawer('edit')}
                    onClick={this.massEdit}
                  >批量修改
                  </Button>
                  <Button
                    type="primary"
                    className={styles['button-group']}
                    onClick={this.updates}
                  >批量更新
                  </Button>
                  <Button type="primary" className={styles['button-group']} onClick={this.sendSms}>批量短信</Button>
                  {
                    this.username === special
                      ? (<Button type="primary" className={styles['button-group']} onClick={this.delate}>批量删除</Button>)
                      : null
                  }
                </span>
              )}
            </Col>
            <Col span={6} style={{ textAlign: 'right' }}>
              {/* 高级搜索 */}
              <Dropdown
                overlay={this.renderSearch}
                visible={expand}
                // onClick={this.toggle}
                placement="bottomRight"
                trigger={['click']}
                onVisibleChange={(visible) => {
                  console.log(visible);
                  if (!visible) {
                    this.setState({ expand: visible });
                  }
                }}
              >
                <a href="true" className={styles['list-search-button']} onClick={this.toggle}>
                  <Icon type="search" />
                </a>
              </Dropdown>
              {/* 表格定制 */}
              {/* 自定义显示列 */}
              <ColumnCustomForm
                customFun={setColumn}
                columns={columns}
              />
              {/* <Dropdown
                overlay={this.renderSearch}
                placement="bottomRight"
                trigger={['click']}
              >
                <a href="true" className={styles['list-custom-button']}>
                  <Icon type="setting" />
                </a>
              </Dropdown> */}
            </Col>
          </Row>
        </Form>

      </>
    );
  }
}
const SearchForm = Form.create({ name: 'terminalManagement_search' })(Searchs);

export default connect(
  state => ({
    special: state.rootReducers.special, // 特殊权限用户
    // 列表点击数据
    tableSelectionDatas: state.terminalManagementReducers.tableSelectionData,
    tCheckData: state.terminalManagementReducers.tableCheckData, // 列表勾选数据
    updateStatus: state.terminalManagementReducers.updateStatus, // 更新状态
    delateStatus: state.terminalManagementReducers.delateStatus, // 删除操作后的返回
  }),
  dispatch => ({
    // 高级查询
    advancedSearch: (payload) => {
      dispatch({ type: 'terminalManagement/SEND_ADVANCED_SEARCH', payload });
    },
    // 下载导入查询模板
    downloadImportTemplates: () => {
      dispatch({ type: 'terminalManagement/SEND_DOWNLOADIMPORT_TEMPLATE' });
    },
    // // 下载导入查询失败信息
    // terminalSearchErr: () => {
    //   dispatch({ type: 'terminalManagement/SEND_TERMINAL_SEARCH_ERR_TEMPLATE' });
    // },
    terminalDownloadList: (param) => {
      dispatch({ type: 'terminalManagement/SEND_TERMINAL_DOWNLOAD_LIST', param });
    },
    // 下载导入终端信息模板
    importTemplate: () => {
      dispatch({ type: 'terminalManagement/SEND_IMPORTANT_TEMPLATE' });
    },
    // 下载导入终端错误信息
    importTemplateError: () => {
      dispatch({ type: 'terminalManagement/SEND_IMPORTANT_TEMPLATE_ERROR' });
    },
    // 更新+批量更新
    getUpdate: (param) => {
      dispatch({ type: 'terminalManagement/SEND_UPDATE', param });
    },
    // 删除+批量删除
    getDelate: (param) => {
      dispatch({ type: 'terminalManagement/SEND_DELATE', param });
    },
  }),
)(injectIntl(SearchForm));
