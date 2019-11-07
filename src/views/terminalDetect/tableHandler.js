import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button, Icon, Modal, message, Upload, Dropdown, Menu } from 'antd';
import PropTypes from 'prop-types';
import { getStore } from '../../utils/localStorage';
import TerminalInfoBulkChangesModal from './terminalInfoBulkChangesModal';

const { confirm } = Modal;

class TableHandler extends Component {
  static propTypes = {
    tabsActiveKey: PropTypes.string.isRequired,
    detectionTableSelectionData: PropTypes.array,
    qualifiedTableSelectionData: PropTypes.array,
    setQualifiedOperationSettingModalState: PropTypes.func.isRequired,
    detectionBatchUpdate: PropTypes.func.isRequired,
    detectionBatchQualified: PropTypes.func.isRequired,
    detectionBatchDelete: PropTypes.func.isRequired,
    qualifiedBatchDelete: PropTypes.func.isRequired,
    detectionTableDataExportAction: PropTypes.func.isRequired,
    detectionDataSearchConditions: PropTypes.object.isRequired,
    qualifiedTableDataExport: PropTypes.func.isRequired,
    qualifiedDataSearchConditions: PropTypes.object.isRequired,
    downLoadImportTemplateHandler: PropTypes.func.isRequired,
    downloadDetectionImportErr: PropTypes.func.isRequired,
    setDetectionTableSelectionData: PropTypes.func.isRequired,
    saveQualifiedTableSelectionData: PropTypes.func.isRequired,
    getDetectionTableData: PropTypes.func.isRequired,
    setQulifiedTableSelectionState: PropTypes.func.isRequired,
  }

  static defaultProps = {
    detectionTableSelectionData: null,
    qualifiedTableSelectionData: null,
  }

  constructor(props) {
    super(props);
    const username = getStore('username');
    const token = getStore('token');
    const { tabsActiveKey } = this.props;
    this.state = {
      num: 0,
      status: false,
      username,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      tabsActiveKey,
      defaultDetectionMenuList: [
        {
          key: 1,
          title: '导出',
          show: true,
        },
        {
          key: 2,
          title: '批量修改',
          show: false,
        },
        {
          key: 3,
          title: '批量更新',
          show: false,
        },
        {
          key: 4,
          title: '批量合格',
          show: false,
        },
        {
          key: 5,
          title: '批量删除',
          show: false,
        },
      ],
      defaultQualifiedMenuList: [
        {
          key: 1,
          title: '导出',
          show: true,
        },
        {
          key: 2,
          title: '批量修改',
          show: false,
        },
        {
          key: 5,
          title: '批量删除',
          show: false,
        },
      ],
      handleList: null,
      terminalInfoBulkChangesModalVisible: false,
    };
    this.onClick = this.onClick.bind(this);
    this.terminaImportModalCancel = this.terminaImportModalCancel.bind(this);
    this.terminalInfoBulkChangesModalCancel = this.terminalInfoBulkChangesModalCancel.bind(this);
    this.downLoadImportTemplate = this.downLoadImportTemplate.bind(this);
    this.importChange = this.importChange.bind(this);
    this.cancelSelection = this.cancelSelection.bind(this);
  }

  componentWillMount = () => {
    const { defaultDetectionMenuList } = this.state;
    this.setState({ handleList: defaultDetectionMenuList });
  }

  componentWillReceiveProps = (nextProps) => {
    const { tabsActiveKey, detectionTableSelectionData, qualifiedTableSelectionData } = nextProps;
    this.getHandleList(tabsActiveKey, detectionTableSelectionData, qualifiedTableSelectionData);
  }

  /**
   * 操作菜单点击事件
   */
  onClick = (key) => {
    console.log(key);
    // const { key } = e;
    switch (key) {
      case 1:
        this.tableDataExport();
        break;
      case 2:
        this.bulkChanges();
        break;
      case 3:
        this.batchUpdate();
        break;
      case 4:
        this.batchQualified();
        break;
      case 5:
        this.batchDelete();
        break;
      case 6:
        this.tableDataImport();
        break;
      default:
        break;
    }
  }

  /**
   * 导出
   */
  tableDataExport = () => {
    const {
      detectionTableSelectionData,
      detectionTableDataExportAction,
      detectionDataSearchConditions,
      qualifiedTableSelectionData,
      qualifiedTableDataExport,
      qualifiedDataSearchConditions,
    } = this.props;
    const { tabsActiveKey } = this.state;
    if ((tabsActiveKey === '1' && detectionTableSelectionData && detectionTableSelectionData.length)
    || (tabsActiveKey === '2' && qualifiedTableSelectionData && qualifiedTableSelectionData.length)) {
      if (tabsActiveKey === '1') {
        const ids = this.getIdsText(detectionTableSelectionData);
        const data = {
          ids,
          conditions: detectionDataSearchConditions,
        };
        detectionTableDataExportAction(data);
      } else if (tabsActiveKey === '2') {
        const ids = this.getIdsText(qualifiedTableSelectionData);
        const data = {
          ids,
          conditions: qualifiedDataSearchConditions,
        };
        qualifiedTableDataExport(data);
      }
    } else {
      confirm({
        title: '操作确认',
        content: '是否导出所有记录？',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          if (tabsActiveKey === '1') {
            const data = {
              ids: '',
              conditions: detectionDataSearchConditions,
            };
            detectionTableDataExportAction(data);
          } else if (tabsActiveKey === '2') {
            const data = {
              ids: '',
              conditions: qualifiedDataSearchConditions,
            };
            qualifiedTableDataExport(data);
          }
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  }

  /**
   * 批量修改
   */
  bulkChanges = () => {
    const {
      detectionTableSelectionData,
      qualifiedTableSelectionData,
      setQualifiedOperationSettingModalState,
      setQulifiedTableSelectionState,
    } = this.props;
    const { tabsActiveKey } = this.state;
    if ((tabsActiveKey === '1' && detectionTableSelectionData && detectionTableSelectionData.length)
    || (tabsActiveKey === '2' && qualifiedTableSelectionData && qualifiedTableSelectionData.length)) {
      this.setState({ terminalInfoBulkChangesModalVisible: true });
    }
    if (tabsActiveKey === '2') {
      setQulifiedTableSelectionState(true);
      setQualifiedOperationSettingModalState(1);
    }
  }

  /**
   * 批量更新
   */
  batchUpdate = () => {
    const { detectionTableSelectionData, detectionBatchUpdate } = this.props;
    if (detectionTableSelectionData && detectionTableSelectionData.length) {
      const text = this.getImeiText(detectionTableSelectionData);
      const params = {
        internationalMobiles: text,
      };
      detectionBatchUpdate(params);
    }
  }

  /**
   * 获取选择数据的IMEI text
   */
  getImeiText = (data) => {
    const text = [];
    for (let i = 0; i < data.length; i += 1) {
      text.push(data[i].imei);
    }
    return text.join(',');
  }

  /**
   * 批量合格
   */
  batchQualified = () => {
    const { detectionTableSelectionData, detectionBatchQualified } = this.props;
    if (detectionTableSelectionData && detectionTableSelectionData.length) {
      confirm({
        title: '操作确认',
        content: '是否确认检测通过并合格？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          const ids = this.getIdsText(detectionTableSelectionData);
          const params = {
            ids,
          };
          detectionBatchQualified(params);
        },
        onCancel: () => {
          console.log('Cancel');
        },
      });
    }
  }

  /**
   * 获取勾选检测列表数据的终端id text
   */
  getIdsText = (data) => {
    const ids = [];
    for (let i = 0; i < data.length; i += 1) {
      ids.push(data[i].id);
    }
    return ids.join(',');
  }

  /**
   * 批量删除
   */
  batchDelete = () => {
    const {
      detectionTableSelectionData,
      detectionBatchDelete,
      qualifiedTableSelectionData,
      qualifiedBatchDelete,
    } = this.props;
    const { tabsActiveKey } = this.state;
    if ((tabsActiveKey === '1' && detectionTableSelectionData && detectionTableSelectionData.length)
    || (tabsActiveKey === '2' && qualifiedTableSelectionData && qualifiedTableSelectionData.length)) {
      confirm({
        title: '操作确认',
        content: '是否确认删除？',
        okText: '确定',
        cancelText: '取消',
        // centered: true,
        onOk: () => {
          if (tabsActiveKey === '1') {
            const ids = this.getIdsText(detectionTableSelectionData);
            const params = {
              ids,
            };
            detectionBatchDelete(params);
          } else if (tabsActiveKey === '2') {
            const ids = this.getIdsText(qualifiedTableSelectionData);
            const params = {
              deviceIds: ids,
            };
            qualifiedBatchDelete(params);
          }
        },
        onCancel: () => {
          console.log('Cancel');
        },
      });
    } else {
      message.warning('请至少勾选一项');
    }
  }

  /**
   * 导入
   */
  tableDataImport = () => {
    // this.setState({ terminalImportModalVisible: true });
  }


  /**
   * 重新组装handleList数据
   */
  getHandleList = (key, detectionData, qualifiedData) => {
    const { defaultDetectionMenuList, defaultQualifiedMenuList, username } = this.state;
    const status = (key === '1' && (detectionData && detectionData.length)) || (key === '2' && (qualifiedData && qualifiedData.length));
    let num;
    let newHandleList;
    if (key === '1') {
      num = detectionData ? detectionData.length : 0;
      console.log(11111);
      newHandleList = defaultDetectionMenuList.map((item) => {
        const newItem = item;
        if (newItem.key !== 1 && newItem.key !== 6) {
          if (newItem.key === 5) {
            newItem.show = username === 'admin' && status;
          } else {
            newItem.show = status;
          }
        }
        return newItem;
      });
    } else if (key === '2') {
      num = qualifiedData ? qualifiedData.length : 0;
      newHandleList = defaultQualifiedMenuList.map((item) => {
        const newItem = item;
        if (newItem.key !== 1) {
          newItem.show = username === 'admin' && status;
        }
        return newItem;
      });
    }
    this.setState({
      tabsActiveKey: key,
      handleList: newHandleList,
      status,
      num,
    });
  }

  /**
   * 导入抽屉弹窗关闭事件
   */
  terminaImportModalCancel = () => {
    // this.setState({ terminalImportModalVisible: false });
  }

  /**
   * 批量修改抽屉弹窗关闭事件
   */
  terminalInfoBulkChangesModalCancel = () => {
    this.setState({ terminalInfoBulkChangesModalVisible: false });
  }

  /**
   * 下载导入模板
   */
  downLoadImportTemplate = () => {
    const { downLoadImportTemplateHandler } = this.props;
    downLoadImportTemplateHandler();
  }

  /**
   * 导入文件状态改变事件
   */
  importChange = (info) => {
    if (info.file.status === 'done') {
      if (info.file.response.data) {
        message.success('导入成功');
        const { getDetectionTableData, detectionDataSearchConditions } = this.props;
        getDetectionTableData(detectionDataSearchConditions);
      } else {
        const { tabsActiveKey } = this.state;
        const { downloadDetectionImportErr } = this.props;
        confirm({
          title: '操作确认',
          content: '导入失败，请下载文件查看失败原因',
          okText: '下载',
          cancelText: '取消',
          centered: true,
          onOk: () => {
            console.log('OK');
            if (tabsActiveKey === '1') {
              downloadDetectionImportErr();
            }
          },
          onCancel: () => {
            console.log('Cancel');
          },
        });
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  /**
   * 取消列表选择
   */
  cancelSelection = () => {
    const { setDetectionTableSelectionData, saveQualifiedTableSelectionData } = this.props;
    const { tabsActiveKey } = this.state;
    if (tabsActiveKey === '1') {
      setDetectionTableSelectionData(null);
    } else if (tabsActiveKey === '2') {
      saveQualifiedTableSelectionData(null);
    }
  }

  render() {
    const {
      handleList,
      status,
      num,
      // terminalImportModalVisible,
      terminalInfoBulkChangesModalVisible,
      username,
      headers,
      tabsActiveKey,
    } = this.state;
    return handleList ? (
      <div>
        <Form layout="inline">
          {
            status
              ? (
                <Form.Item>
                  <span>
                    <Icon onClick={this.cancelSelection} style={{ color: 'red', cursor: 'pointer' }} type="close-circle" />
                  &nbsp;
                  已选择{num}项
                  </span>
                </Form.Item>
              ) : null
          }
          {
            handleList.map(item => (
              item.show ? (
                <Form.Item key={item.key}>
                  <Button type="primary" onClick={() => this.onClick(item.key)}>
                    {item.title}
                  </Button>
                </Form.Item>
              ) : null
            ))
          }
          {
            username === 'admin' && tabsActiveKey === '1' ? (
              <Form.Item>
                <Dropdown
                  // trigger={['click']}
                  overlay={(
                    <Menu>
                      <Menu.Item onClick={this.downLoadImportTemplate}>
                        下载模板
                      </Menu.Item>
                      <Menu.Item>
                        <Upload
                          accept=".xls,.xlsx"
                          action="/api/detectionList/import"
                          onChange={this.importChange}
                          headers={headers}
                          showUploadList={false}
                        >
                          导入文件
                        </Upload>
                      </Menu.Item>
                    </Menu>
                  )}
                >
                  <Button type="primary">导入</Button>
                </Dropdown>
              </Form.Item>
            ) : null
          }
        </Form>
        <TerminalInfoBulkChangesModal
          visible={terminalInfoBulkChangesModalVisible}
          terminalInfoBulkChangesModalCancel={this.terminalInfoBulkChangesModalCancel}
          tabsActiveKey={tabsActiveKey}
        />
      </div>
    ) : null;
  }
}

export default connect(
  state => ({
    detectionTableSelectionData: state.terminaDetectReducers.detectionTableSelectionData,
    qualifiedTableSelectionData: state.terminaDetectReducers.qualifiedTableSelectionData,
    detectionDataSearchConditions: state.terminaDetectReducers.detectionDataSearchConditions,
    qualifiedDataSearchConditions: state.terminaDetectReducers.qualifiedDataSearchConditions,
  }),
  dispatch => ({
    detectionTableDataExportAction: (data) => {
      dispatch({ type: 'terminaDetect/DETECTION_TABLE_SELECTION_DATA_EXPORT', payload: data });
    },
    downLoadImportTemplateHandler: () => {
      dispatch({ type: 'terminaDetect/DOWNLOAD_IMPORT_TEMPLATE' });
    },
    detectionBatchUpdate: (data) => {
      dispatch({ type: 'terminaDetect/DETECTION_BATCH_UPDATE', payload: data });
    },
    detectionBatchQualified: (data) => {
      dispatch({ type: 'terminaDetect/DETECTION_BATCH_QUALIFIED', payload: data });
    },
    detectionBatchDelete: (data) => {
      dispatch({ type: 'terminaDetect/DETECTION_BATCH_DELETE', payload: data });
    },
    qualifiedBatchDelete: (data) => {
      dispatch({ type: 'terminaDetect/QUALIFIED_BATCH_DELETE', payload: data });
    },
    qualifiedTableDataExport: (data) => {
      dispatch({ type: 'terminaDetect/QUALIFIED_TABLE_DATA_EXPORT', payload: data });
    },
    downloadDetectionImportErr: (data) => {
      dispatch({ type: 'terminaDetect/DOWNLOAD_DETECTION_IMPORT_ERR', payload: data });
    },
    setQualifiedOperationSettingModalState: (data) => {
      dispatch({ type: 'terminaDetect/SET_QUALIFIED_TABLE_OPERATION_SETTING', payload: data });
    },
    setDetectionTableSelectionData: (data) => {
      dispatch({ type: 'terminaDetect/DETECTION_TABLE_SELECTION_DATA', payload: data });
    },
    saveQualifiedTableSelectionData: (data) => {
      dispatch({ type: 'terminaDetect/SAVE_QUALIFIED_TABLE_SELECTION_DATA', payload: data });
    },
    getDetectionTableData: (data) => {
      dispatch({ type: 'terminaDetect/GET_DETECTION_TABLE_DATA', payload: data });
    },
    setQulifiedTableSelectionState: (data) => {
      dispatch({ type: 'terminaDetect/CANCEL_QUALIFIED_TABLE_SELECTION', payload: data });
    },
  }),
)(Form.create({ name: 'table-handler-form' })(TableHandler));
