/**
 * 终端列表table
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import styles from './index.module.less';
import './index.css';

// 获取本地存储
// import { getStore } from '../../utils/localStorage';

class TableCom extends Component {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    saveTableSelectionData: PropTypes.func.isRequired,
    // setOperationSetting: PropTypes.func.isRequired,
    massShow: PropTypes.func.isRequired,
    // operate: PropTypes.func.isRequired,
    selectedRowKeys: PropTypes.array.isRequired,
    operateDetail: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    advancedSearchData: PropTypes.object.isRequired,
    advancedSearch: PropTypes.func.isRequired,
    tableSelectionData: PropTypes.object.isRequired,
    tableCheckData: PropTypes.func.isRequired,
    toggleMass: PropTypes.func.isRequired,
    param: PropTypes.object.isRequired,
    setPages: PropTypes.func.isRequired,
  }

  // static defaultProps = {
  //   tableSelectionData: {},
  // }

  // constructor(props) {
  //   super(props);

  // const { columns } = this.props;
  // this.state = {
  // 查询条件
  // page: 1, // 当前页
  // limit: 10, // 每页容量
  // simpleQueryParam: '', // 模糊查询
  // messageStatus: null, // 短信状态 0发送中 1发送成功 8发送失败（全部时此字段为空）
  // isOnline: null, // 在线状态 1：在线 0：离线（全部时此字段为空）
  // servicePattern: null, // 服务模式 0 ：SIM卡到期模式 1：终端服务到期模式（全部时此字段为空）
  // serviceStatus: null, // 服务状态 0：异常 1：正常 2：即将停机 3：服务即将到期 4：已停机 5：服务已到期（全部时此字段为空）
  // startTime: '',
  // endTime: '',
  // searchType: 0, // 查询类型 0：正常查询  1：导入查询
  // param: {},
  // };
  // this.tableSelection = this.tableSelection.bind(this);
  // }

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

  // 勾选列表项
  onSelectColumn = (selectedRowKeys, selectedRows) => {
    console.log(selectedRowKeys, selectedRows);
    const { massShow,
      // saveTableSelectionData,
      tableCheckData } = this.props;
    // 操作是否显示多选按钮
    massShow(selectedRowKeys);
    // console.log(saveTableSelectionData);
    // // 存储勾选数据
    // saveTableSelectionData(selectedRows);
    // 存储勾选数据
    tableCheckData(selectedRows); // 勾选为数组，用于批量操作
    console.log(tableCheckData);
  }

  /**
   * table行点击事件
   */
  tableSelection = (record) => {
    // 存储点击数据
    const { saveTableSelectionData, operateDetail, toggleMass } = this.props;
    if (saveTableSelectionData) {
      saveTableSelectionData(record); // 点击的为对象，用于单个修改
      toggleMass(false);
    }
    // 详情展示or隐藏
    operateDetail(true);
  }

  changeNumber = (data, type) => {
    let c;
    if (type === 'messageStatus') {
      switch (data) {
        case 0:
          c = '发送中';
          break;
        case 1:
          c = '发送成功';
          break;
        case 8:
          c = '发送失败';
          break;
        default:
          // c = '-';
          c = null;
      }
    } else if (type === 'isOnline') {
      switch (data) {
        case 1:
          c = '在线';
          break;
        case 0:
          c = '离线';
          break;
        default:
          // c = '-';
          c = null;
      }
    } else if (type === 'servicePattern') {
      switch (data) {
        case 0:
          c = 'SIM卡到期模式';
          break;
        case 1:
          c = '终端服务到期模式';
          break;
        default:
          // c = '-';
          c = null;
      }
    } else if (type === 'serviceStatus') {
      switch (data) {
        case 0:
          c = '异常';
          break;
        case 1:
          c = '正常';
          break;
        case 2:
          c = '即将停机';
          break;
        case 3:
          c = '服务即将到期';
          break;
        case 4:
          c = '已停机';
          break;
        case 5:
          c = '服务已到期';
          break;
        default:
          // c = '-';
          c = null;
      }
    }
    return c;
  }

  // 每页条数改变回调
  pageSize = (current, size) => {
    const { setPages } = this.props;
    console.log(current, size);
    // const { param } = this.state;
    // this.setState({
    //   page: current,
    //   limit: size,
    // }, () => {
    //   this.search();
    // });
    // this.setState({
    //   param: {
    //     ...param,
    //     page: current,
    //     limit: size,
    //   },
    // }, () => {
    //   this.search();
    // });
    const { search } = this;
    setPages(current, size, search);
  }

  // 列表页码切换
  changePage=(current) => {
    // const { param } = this.state;
    // this.setState({
    //   param: {
    //     ...param,
    //     page: current,
    //   },
    // }, () => {
    //   this.search();
    // });

    const { setPages, param: { limit } } = this.props;
    console.log(current, '当前页是：');
    const { search } = this;
    setPages(current, limit, search);
  }

  // 搜索
  search = () => {
    const { advancedSearch, param } = this.props;
    console.log(param);

    // const { param } = this.state;
    if (advancedSearch) {
      advancedSearch({ ...param });
    }
  }

  // 表格选中行高亮
  setHighlightClassName = (record) => {
    const { tableSelectionData: { id } } = this.props;

    const { id: currentId } = record;
    return currentId === id ? `${styles['table-row-active']}` : '';
  }

  render() {
    // console.log(this.props.tableSelectionData);
    const self = this;
    // const { total } = this.state;
    const { selectedRowKeys, data, columns, advancedSearchData } = this.props;

    const { recordsTotal, page, pageSize } = advancedSearchData;
    // 数据转换
    const arr = [];
    if (data && data.records) {
      data.records.map((d, i) => {
        arr.push({
          ...d,
          key: i,
          messageStatus: self.changeNumber(d.messageStatus, 'messageStatus'),
          isOnline: self.changeNumber(d.isOnline, 'isOnline'),
          servicePattern: self.changeNumber(d.servicePattern, 'servicePattern'),
          serviceStatus: self.changeNumber(d.serviceStatus, 'serviceStatus'),
        });
        return arr;
      });
    }
    // 表格列选择配置项
    const rowSelection = {
      onChange: this.onSelectColumn,
      selectedRowKeys,
    };

    // 分页配置项
    const pagination = {
      showSizeChanger: true,
      // defaultCurrent: 3,
      total: recordsTotal, // 数据总数
      pageSize, // 每页条数
      defaultCurrent: page, // 默认的当前页数
      pageSizeOptions: ['10', '20', '50', '100', '200', '500', '1000'],
      // showTotal: (totals, range) => `第${range[0]}至${range[1]}条记录，共${totals}条`,
      showTotal: totals => `共${totals}条`,
      onShowSizeChange: this.pageSize,
      onChange: this.changePage,
    };

    // table配置项
    const tableSet = {
      rowSelection,
      columns,
      // dataSource: this.state.data,
      dataSource: arr,
      pagination,
      scroll: { x: 2300, y: 580 },
      // table行点击事件(存储列表数据)
      onRow: record => ({

        onClick: () => {
          console.log(record, '++++++');
          this.tableSelection(record);
        },
      }),
      rowClassName: this.setHighlightClassName, // 选中行高亮
    };
    return <Table {...tableSet} className={styles['table-style']} />;
  }
}

export default connect(
  state => ({
    advancedSearchData: state.terminalManagementReducers.advancedSearchData, // 高级查询
    tableSelectionData: state.terminalManagementReducers.tableSelectionData, // 列表点击数据
    // treeData: state.terminalManagementReducers.treeData,
  }),
  dispatch => ({
    // 存储点击列表数据
    saveTableSelectionData: (payload) => {
      dispatch({ type: 'terminalManagement/SEND_SAVE_TABLE_SELECTION_DATA', payload });
    },
    // 高级查询
    advancedSearch: (payload) => {
      dispatch({ type: 'terminalManagement/SEND_ADVANCED_SEARCH', payload });
    },
    // 存储列表勾选的数据
    tableCheckData: (payload) => {
      dispatch({ type: 'terminalManagement/GET_TABLE_CHECK_DATA', payload });
    },
  }),
)(injectIntl(TableCom));