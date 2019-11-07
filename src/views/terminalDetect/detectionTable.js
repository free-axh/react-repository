import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Table } from 'antd';

class DetectionTable extends Component {
  static propTypes = {
    getDetectionTableData: PropTypes.func.isRequired,
    detectionDataSearchConditions: PropTypes.object.isRequired,
    onDetectionCustom: PropTypes.func.isRequired,
    setDetectionTableSelectionData: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: 'IMEI',
          key: 'imei',
          dataIndex: 'imei',
          width: 200,
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
          title: '状态',
          key: 'state',
          dataIndex: 'state',
          width: 150,
          align: 'center',
          render: (text) => {
            if (text !== null && text !== undefined && text !== '') {
              if (text === 0) {
                return (
                  <span style={{ color: 'red' }}>异常</span>
                );
              } if (text === 1) {
                return (
                  <span style={{ color: 'green' }}>正常</span>
                );
              }
            }
            return '-';
          },
        },
        {
          title: '是否在线',
          key: 'isOnLine',
          dataIndex: 'isOnLine',
          width: 150,
          align: 'center',
          render: (text) => {
            if (text !== null && text !== undefined && text !== '') {
              if (text === 0) {
                return '否';
              } if (text === 1) {
                return '是';
              }
            }
            return '-';
          },
        },
        {
          title: '上线时间',
          key: 'onLineTime',
          dataIndex: 'onLineTime',
          width: 200,
          align: 'center',
        },
        {
          title: '是否定位',
          key: 'isLocation',
          dataIndex: 'isLocation',
          width: 150,
          align: 'center',
          render: (text) => {
            if (text !== null && text !== undefined && text !== '') {
              if (text === 0) {
                return '否';
              } if (text === 1) {
                return '是';
              }
            }
            return '-';
          },
        },
        {
          title: '服务器时间',
          key: 'serverTime',
          dataIndex: 'serverTime',
          width: 200,
          align: 'center',
        },
        {
          title: '定位时间',
          key: 'locationTime',
          dataIndex: 'locationTime',
          width: 200,
          align: 'center',
        },
        {
          title: '上线与定位时间间隔阈值',
          key: 'thresholdValue',
          dataIndex: 'thresholdValue',
          width: 300,
          align: 'center',
        },
      ],
      tableData: [],
      curtrentPage: 1,
      recordsTotal: 0,
      pageSize: 100,
      selectedRowKeys: [],
    };
    this.changePage = this.changePage.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
  }

  componentDidMount = () => {
    const { columns } = this.state;
    const { getDetectionTableData, detectionDataSearchConditions, onDetectionCustom } = this.props;
    getDetectionTableData(detectionDataSearchConditions);
    onDetectionCustom(columns);
  }

  componentWillReceiveProps = (nextProps) => {
    const { detectionTableData, detectionColums, detectionTableSelectionData } = nextProps;
    if (detectionTableData !== null) {
      const tableData = this.detectionTableDataHandler(detectionTableData.records);
      const { recordsTotal } = detectionTableData;
      this.setState({
        tableData,
        recordsTotal,
        columns: detectionColums,
      });
    } else {
      this.setState({
        columns: detectionColums,
      });
    }
    if (detectionTableSelectionData === null) {
      this.setState({ selectedRowKeys: [] });
    }
  }

  /**
   * 组装检测列表数据
   */
  detectionTableDataHandler = (data) => {
    const newData = [];
    if (data) {
      for (let i = 0; i < data.length; i += 1) {
        const list = data[i];
        newData.push({
          key: i,
          imei: list.internationalMobile,
          group: list.groupName,
          state: list.state,
          isOnLine: list.isOnline,
          onLineTime: list.onlineTime,
          isLocation: list.isLocation,
          serverTime: list.serverTime,
          locationTime: list.locationTime,
          thresholdValue: list.onlineLocationIntervalThreshold,
          id: list.id,
        });
      }
      return newData;
    }
    return [];
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
      getDetectionTableData,
      detectionDataSearchConditions,
    } = this.props;
    detectionDataSearchConditions.page = current;
    getDetectionTableData(detectionDataSearchConditions);
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
      getDetectionTableData,
      detectionDataSearchConditions,
    } = this.props;
    detectionDataSearchConditions.page = current;
    detectionDataSearchConditions.limit = pageSize;
    getDetectionTableData(detectionDataSearchConditions);
  }

  /**
   * table表格勾选事件
   */
  onSelectChange = (selectedRowKeys, selectedRows) => {
    const { setDetectionTableSelectionData } = this.props;
    setDetectionTableSelectionData(selectedRows);
    this.setState({ selectedRowKeys });
  }

  render() {
    const {
      columns,
      tableData,
      curtrentPage,
      recordsTotal,
      pageSize,
      selectedRowKeys,
    } = this.state;

    const rowSelection = {
      onChange: this.onSelectChange,
      selectedRowKeys,
    };

    return (
      <Table
        columns={columns}
        dataSource={tableData}
        scroll={{ x: 1700, y: 520 }}
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
      />
    );
  }
}

export default connect(
  state => ({
    detectionDataSearchConditions: state.terminaDetectReducers.detectionDataSearchConditions,
    detectionTableData: state.terminaDetectReducers.detectionTableData,
    detectionTableSelectionData: state.terminaDetectReducers.detectionTableSelectionData,
  }),
  dispatch => ({
    getDetectionTableData: (data) => {
      dispatch({ type: 'terminaDetect/GET_DETECTION_TABLE_DATA', payload: data });
    },
    setDetectionTableSelectionData: (data) => {
      dispatch({ type: 'terminaDetect/DETECTION_TABLE_SELECTION_DATA', payload: data });
    },
  }),
)(DetectionTable);
