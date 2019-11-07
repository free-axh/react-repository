import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Modal } from 'antd';
import PropTypes from 'prop-types';
import TerminalInfoBulkChangesModal from './terminalInfoBulkChangesModal';
import QualifiedTableOperationSetting from './qualifiedTableOperationSetting';
import styles from './index.module.less';

const { confirm } = Modal;

class QualifiedTable extends Component {
  static propTypes = {
    qualifiedDataSearchConditions: PropTypes.object.isRequired,
    getQualifiedTableData: PropTypes.func.isRequired,
    onQualifiedCustom: PropTypes.func.isRequired,
    qualifiedTableData: PropTypes.object,
    qualifiedTableOperationSettingModalState: PropTypes.number.isRequired,
    qualifiedColums: PropTypes.array.isRequired,
    setQualifiedOperationSettingModalState: PropTypes.func.isRequired,
    saveQualifiedTableSelectionData: PropTypes.func.isRequired,
    qualifiedBatchDelete: PropTypes.func.isRequired,
    qualifiedTableSelectionData: PropTypes.array,
    tabsActiveKey: PropTypes.string.isRequired,
    setQulifiedTableSelectionState: PropTypes.func.isRequired,
    cancelQulifiedTableSelection: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    qualifiedTableData: null,
    qualifiedTableSelectionData: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: 'IMEI',
          key: 'imei',
          dataIndex: 'imei',
          width: 150,
          align: 'center',
        },
        {
          title: '所属组织',
          key: 'group',
          dataIndex: 'group',
          width: 150,
          align: 'center',
        },
        {
          title: '检测合格时间',
          key: 'qualifiedTime',
          dataIndex: 'qualifiedTime',
          width: 200,
          align: 'center',
        },
        {
          title: '检测人员',
          key: 'people',
          dataIndex: 'people',
          width: 150,
          align: 'center',
        },
      ],
      terminalInfoBulkChangesModalVisible: false,
      tabsActiveKey: '2',
      qualifiedData: null,
      qualifiedTableData: [],
      curtrentPage: 1,
      recordsTotal: 0,
      pageSize: 100,
      operationSettingVisible: false,
      operationSettingDetails: null,
      selectedRowKeys: [],
      rowActiveId: null,
    };
    this.qualifiedTableDataChange = this.qualifiedTableDataChange.bind(this);
    this.qualifiedDelete = this.qualifiedDelete.bind(this);
    this.terminalInfoBulkChangesModalCancel = this.terminalInfoBulkChangesModalCancel.bind(this);
    this.changePage = this.changePage.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
    this.qualifiedTableSelectHandler = this.qualifiedTableSelectHandler.bind(this);
    this.operationSettingModalCancel = this.operationSettingModalCancel.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.setRowClassName = this.setRowClassName.bind(this);
  }

  componentDidMount = () => {
    const { columns } = this.state;
    const { qualifiedDataSearchConditions, getQualifiedTableData, onQualifiedCustom } = this.props;
    getQualifiedTableData(qualifiedDataSearchConditions);
    if (onQualifiedCustom) {
      onQualifiedCustom(columns);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      qualifiedTableData,
      qualifiedTableOperationSettingModalState,
      qualifiedColums,
      qualifiedTableSelectionData,
      tabsActiveKey,
      cancelQulifiedTableSelection,
    } = nextProps;
    if (qualifiedTableData !== null) {
      const tableData = this.qualifiedTableDataHandler(qualifiedTableData.records);
      const { recordsTotal } = qualifiedTableData;
      this.setState({
        qualifiedTableData: tableData,
        recordsTotal,
        columns: qualifiedColums,
      });
    } else {
      this.setState({
        columns: qualifiedColums,
      });
    }

    if (qualifiedTableOperationSettingModalState === 1) {
      this.setState({
        operationSettingVisible: false,
      });
      const { setQualifiedOperationSettingModalState } = this.props;
      if (setQualifiedOperationSettingModalState) {
        setQualifiedOperationSettingModalState(0);
      }
    }

    if (qualifiedTableSelectionData === null) {
      this.setState({ selectedRowKeys: [] });
    }

    if (tabsActiveKey === '1' || cancelQulifiedTableSelection) {
      this.setState({ rowActiveId: null });
      const { setQulifiedTableSelectionState } = this.props;
      setQulifiedTableSelectionState(false);
    }
  }

  /**
   * 组装合格列表数据
   */
  qualifiedTableDataHandler(data) {
    const newData = [];
    if (data) {
      for (let i = 0; i < data.length; i += 1) {
        const list = data[i];
        newData.push({
          key: i,
          imei: list.internationalMobile,
          group: list.organizationName,
          qualifiedTime: list.checkQualifiedTime,
          people: list.checkQualifiedUser,
          id: list.id,
          groupId: list.organizationId,
        });
      }
      return newData;
    }
    return [];
  }

  /**
   * 点击合格列表中每列修复按钮事件
   */
  qualifiedTableDataChange = (infos) => {
    this.setState({
      operationSettingVisible: false,
      operationSettingDetails: null,
      terminalInfoBulkChangesModalVisible: true,
      qualifiedData: JSON.stringify(infos),
    });
  }

  /**
   * 点击合格列表中每列删除按钮事件
   */
  qualifiedDelete = (infos) => {
    confirm({
      title: '操作确认',
      content: '是否确认删除？',
      okText: '确定',
      cancelText: '取消',
      // centered: true,
      onOk: () => {
        // const newInfos = JSON.parse(infos);
        const params = {
          deviceIds: infos.id,
        };
        const { qualifiedBatchDelete } = this.props;
        qualifiedBatchDelete(params);
      },
      onCancel: () => {
        console.log('Cancel');
      },
    });
  }

  terminalInfoBulkChangesModalCancel = () => {
    const { operationSettingVisible } = this.state;
    this.setState({
      terminalInfoBulkChangesModalVisible: false,
      qualifiedData: null,
    });
    if (!operationSettingVisible) {
      const { setQulifiedTableSelectionState } = this.props;
      setQulifiedTableSelectionState(true);
    }
  }

  /**
   * table表选择页触发事件
   */
  changePage = (current) => {
    this.setState({
      curtrentPage: current,
      selectedRowKeys: [],
    });
    const {
      getQualifiedTableData,
      qualifiedDataSearchConditions,
    } = this.props;
    qualifiedDataSearchConditions.page = current;
    getQualifiedTableData(qualifiedDataSearchConditions);
  }

  /**
   * table表每页显示数量选择
   */
  changePageSize = (pageSize, current) => {
    this.setState({
      pageSize,
      curtrentPage: current,
      selectedRowKeys: [],
    });
    const {
      getQualifiedTableData,
      qualifiedDataSearchConditions,
    } = this.props;
    qualifiedDataSearchConditions.page = current;
    qualifiedDataSearchConditions.limit = pageSize;
    getQualifiedTableData(qualifiedDataSearchConditions);
  }

  /**
   * 合格列表选中事件
   */
  qualifiedTableSelectHandler = (data) => {
    this.setState({
      operationSettingDetails: data,
      operationSettingVisible: true,
      rowActiveId: data.id,
    });
  }

  /**
   * 操作设置modal框隐藏事件
   */
  operationSettingModalCancel = () => {
    const { terminalInfoBulkChangesModalVisible } = this.state;
    this.setState({
      operationSettingVisible: false,
      operationSettingDetails: null,
    });
    if (!terminalInfoBulkChangesModalVisible) {
      const { setQulifiedTableSelectionState } = this.props;
      setQulifiedTableSelectionState(true);
    }
  }

  /**
   * table表格勾选事件
   */
  onSelectChange = (selectedRowKeys, selectedRows) => {
    const { saveQualifiedTableSelectionData } = this.props;
    saveQualifiedTableSelectionData(selectedRows);
    this.setState({ selectedRowKeys });
  }

  /**
   * 设置表格行类名
   */
  setRowClassName = (record) => {
    const { rowActiveId } = this.state;
    return record.id === rowActiveId ? styles['table-row-active'] : '';
  }

  render() {
    const {
      columns,
      terminalInfoBulkChangesModalVisible,
      tabsActiveKey,
      qualifiedData,
      qualifiedTableData,
      curtrentPage,
      recordsTotal,
      pageSize,
      operationSettingDetails,
      operationSettingVisible,
      selectedRowKeys,
    } = this.state;

    const rowSelection = {
      onChange: this.onSelectChange,
      selectedRowKeys,
    };

    return (
      <div>
        <Table
          columns={columns}
          dataSource={qualifiedTableData}
          scroll={{ x: 650, y: 520 }}
          rowKey="key"
          rowSelection={rowSelection}
          locale={{
            filterConfirm: '确定',
            filterReset: '重置',
            emptyText: '暂无数据',
          }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: false,
            showTotal: () => `共${recordsTotal}条`,
            defaultPageSize: pageSize,
            pageSize,
            showLessItems: true,
            current: curtrentPage,
            total: recordsTotal,
            pageSizeOptions: ['10', '20', '50', '100', '200', '500', '1000'],
            onShowSizeChange: (current, size) => this.changePageSize(size, current),
            onChange: current => this.changePage(current),
          }}
          rowClassName={this.setRowClassName}
          onRow={record => ({
            onClick: () => {
              this.qualifiedTableSelectHandler(record);
            },
          })}
        />
        <TerminalInfoBulkChangesModal
          visible={terminalInfoBulkChangesModalVisible}
          terminalInfoBulkChangesModalCancel={this.terminalInfoBulkChangesModalCancel}
          qualifiedData={qualifiedData}
          tabsActiveKey={tabsActiveKey}
        />
        <QualifiedTableOperationSetting
          visible={operationSettingVisible}
          details={operationSettingDetails}
          onEdit={this.qualifiedTableDataChange}
          onDelete={this.qualifiedDelete}
          operationSettingModalCancel={this.operationSettingModalCancel}
        />
      </div>
    );
  }
}

export default connect(
  state => ({
    qualifiedDataSearchConditions: state.terminaDetectReducers.qualifiedDataSearchConditions,
    qualifiedTableData: state.terminaDetectReducers.qualifiedTableData,
    qualifiedTableOperationSettingModalState:
    state.terminaDetectReducers.qualifiedTableOperationSettingModalState,
    qualifiedTableSelectionData: state.terminaDetectReducers.qualifiedTableSelectionData,
    cancelQulifiedTableSelection: state.terminaDetectReducers.cancelQulifiedTableSelection,
  }),
  dispatch => ({
    saveQualifiedTableSelectionData: (data) => {
      dispatch({ type: 'terminaDetect/SAVE_QUALIFIED_TABLE_SELECTION_DATA', payload: data });
    },
    getQualifiedTableData: (data) => {
      dispatch({ type: 'terminaDetect/GET_QUALIFIED_TABLE_DATA', payload: data });
    },
    saveQualifiedTableChangeData: (data) => {
      dispatch({ type: 'terminaDetect/SAVE_QUALIFIED_TABLE_CHANGE_INFOS', payload: data });
    },
    qualifiedBatchDelete: (data) => {
      dispatch({ type: 'terminaDetect/QUALIFIED_BATCH_DELETE', payload: data });
    },
    setQualifiedOperationSettingModalState: (data) => {
      dispatch({ type: 'terminaDetect/SET_QUALIFIED_TABLE_OPERATION_SETTING', payload: data });
    },
    setQulifiedTableSelectionState: (data) => {
      dispatch({ type: 'terminaDetect/CANCEL_QUALIFIED_TABLE_SELECTION', payload: data });
    },
  }),
)(QualifiedTable);
