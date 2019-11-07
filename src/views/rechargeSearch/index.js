import React, { Component } from 'react';
import {
  // Breadcrumb,
  Typography,
  Table,
  Button,
  message,
} from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import 'moment/locale/zh-cn';
import { injectIntl } from 'react-intl';
import styles from './index.module.less';
import SearchComponent from './componentSearch';
import ColumnCustomForm from '../../common/columnCustom';// 自定义显示列
import SearchForm from './searchForm';// 用户搜索
import BreadcrumbComponent from '../../common/Breadcrumb/BreadcrumbComponent';

const { Title } = Typography;

class Index extends Component {
  // 属性声明
  static propTypes ={
    lists: PropTypes.object.isRequired,
    listStatus: PropTypes.string,
    getList: PropTypes.func.isRequired,
    listExport: PropTypes.func,
    updateList: PropTypes.func,
    updateStatus: PropTypes.string,
    intl: PropTypes.object.isRequired,
  };

  static defaultProps = {
    updateStatus: null,
    listStatus: null,
    listExport: null,
    updateList: null,
  }

  constructor(props) {
    super(props);
    const {
      intl,
    } = this.props;

    const columns = this.setTableColumns();
    this.state = {
      breadcrumb: [
        { title: intl.messages.rechargeSearch_crumb1 },
        { title: intl.messages.rechargeSearch_crumb2 },
      ],
      tableColumns: columns, // 定制列
      dataSource: [],
      formData: null,
      searchData: null,
      pageSize: 10,
      currentPage: 1,
      totalRecords: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      lists,
      listStatus,
      updateStatus,
    } = nextProps;
    const { intl } = this.props;

    // 获取列表
    if (listStatus === 'success') {
      this.setState({
        dataSource: lists.dataSource,
        totalRecords: lists.totalRecords,
      });
    }

    // 更新列表
    if (updateStatus === 'success') {
      this.getRechargeData();
      message.success(intl.messages.rechargeSearch_updateSuc);
    } else if (updateStatus === 'failed') {
      message.warning(intl.messages.rechargeSearch_updateFail);
    }
  }

  // table列
  setTableColumns = () => {
    const {
      intl,
    } = this.props;

    return [
      {
        title: intl.messages.rechargeSearch_th1,
        dataIndex: 'inx',
        key: 'no',
        width: 80,
        align: 'center',
        render: (value, records, index) => index + 1,
      },
      {
        title: intl.messages.rechargeSearch_opera,
        dataIndex: 'opera',
        key: 'opera',
        width: 80,
        render: (value, record) => (
          <Button
            type="primary"
            size="small"
            onClick={() => this.updateListHandler(record)}
          >
            {intl.messages.rechargeSearch_update}
          </Button>
        ),
      },
      {// IMEI
        title: intl.messages.rechargeSearch_th2,
        dataIndex: 'internationalMobile',
        key: 'IMEI',
        align: 'center',
      },
      {// 所属组织
        title: intl.messages.rechargeSearch_th3,
        dataIndex: 'organizationName',
        key: 'group',
        align: 'center',
      },
      {// ICCID
        title: intl.messages.rechargeSearch_th4,
        dataIndex: 'iccid',
        key: 'ICCID',
        align: 'center',
      },
      {// SIM卡号
        title: intl.messages.rechargeSearch_th5,
        dataIndex: 'simcardNumber',
        key: 'SIM',
        align: 'center',
      },
      {// 充值金额(元)
        title: intl.messages.rechargeSearch_th6,
        dataIndex: 'money',
        key: 'money',
        align: 'center',
      },
      {// 充值状态
        title: intl.messages.rechargeSearch_th7,
        dataIndex: 'desc',
        key: 'result',
        align: 'center',
      },
      {// 订单号
        title: intl.messages.rechargeSearch_th8,
        dataIndex: 'orderNo',
        key: 'orderNum',
        align: 'center',
      },
      {// 订单生成时间
        title: intl.messages.rechargeSearch_th9,
        dataIndex: 'createOrderTime',
        key: 'dateTime',
        align: 'center',
      },
      // {// 描述
      //   title: intl.messages.rechargeSearch_th10,
      //   dataIndex: 'desc',
      //   key: 'desc',
      //   align: 'center',
      // },
    ];
  }

  // 请求列表数据
  getRechargeData=() => {
    const {
      pageSize,
      currentPage,
      formData,
      searchData,
    } = this.state;

    const {
      getList,
    } = this.props;

    const params = {
      limit: pageSize,
      page: currentPage,
      ...formData,
      ...searchData,
    };

    getList(params);
  }

  // 查询
  getFormData=(param) => {
    this.setState({
      formData: param,
    }, this.getRechargeData);
  }

  // 更新
  updateListHandler = (records) => {
    const { updateList } = this.props;
    console.log(records);

    const param = {
      orderNo: records.orderNo,
    };

    updateList(param);
  }

  // 导出
  exportList=() => {
    const {
      searchData,
      formData,
    } = this.state;
    const {
      listExport,
    } = this.props;

    const params = {
      ...formData,
      ...searchData,
    };
    listExport(params);
  }

  // 页码改变
  pageChange=(page) => {
    this.setState({
      currentPage: page,
    }, this.getRechargeData);
  }

  // 每页条数改变
  onShowSizeChange=(current, size) => {
    // console.log(current, size);
    this.setState({
      currentPage: current,
      pageSize: size,
    }, this.getRechargeData);
  }

  // 控制定制显示列下拉框显示
  setCustomDropDown = (value) => {
    const { showColumnVisible } = this.state;
    this.setState({
      showColumnVisible: value !== undefined ? value : !showColumnVisible,
    });
  };

  // 定制显示列
  setCustomFun=(currentShowColumns) => {
    this.setState({
      tableColumns: currentShowColumns,
    });
  }

  // 获取模糊查询参数
  getSearchData=(searchData) => {
    const {
      pageSize,
      currentPage,
      formData,
    } = this.state;

    const {
      getList,
    } = this.props;

    const param = {
      limit: pageSize,
      page: currentPage,
      ...formData,
      ...searchData,
    };

    getList(param);

    this.setState({
      searchData,
    });
  }

  render() {
    const {
      intl,
    } = this.props;
    const {
      tableColumns,
      dataSource,
      totalRecords,
      breadcrumb,
    } = this.state;

    return (
      <div>
        {/* 导航/标题 */}
        <BreadcrumbComponent
          breadcrumbMessage={breadcrumb}
        />

        {/* 日志列表 */}
        <div
          className={styles.content}
        >
          {/* title */}
          <Title
            className={styles['panel-title']}
          >
            {intl.messages.rechargeSearch_title}
          </Title>

          <div
            className={styles['search-box']}
          >
            <div
              className={styles['pull-left']}
            >
              <SearchComponent
                onSubmit={this.getFormData}
                onExport={this.exportList}
              />
            </div>

            <div
              className={styles['pull-right']}
            >
              {/* 列表搜索 */}
              <SearchForm
                searchFun={this.getSearchData}
              />

              {/* 自定义显示列 */}
              <ColumnCustomForm
                customFun={this.setCustomFun}
                columns={tableColumns}
              />
            </div>
          </div>

          {/* table */}
          <div
            className={styles['table-box']}
          >
            <Table
              // bordered
              dataSource={dataSource}
              columns={tableColumns}
              rowKey={record => record.orderNo}
              locale={{
                emptyText: intl.messages.rechargeSearch_noData,
              }}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: false,
                showTotal: () => `${intl.messages.rechargeSearch_total}${totalRecords}${intl.messages.rechargeSearch_unit}`,
                defaultPageSize: 10,
                showLessItems: true,
                total: totalRecords,
                pageSizeOptions: ['10', '20', '50', '100', '200', '500', '1000'],
                onChange: this.pageChange,
                onShowSizeChange: this.onShowSizeChange,
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    lists: state.rechargeSearchReducers.lists, // 列表数据
    listStatus: state.rechargeSearchReducers.listStatus, // 列表获取状态
    updateStatus: state.rechargeSearchReducers.updateStatus, // 更新状态
  }),
  dispatch => ({
    getList: (data) => { // 获取日志查询列表
      dispatch({ type: 'rechargeSearch/GET_LIST_ACTION', data });
    },
    listExport: (data) => { // 报表导出
      dispatch({ type: 'rechargeSearch/LIST_EXPORT_ACTION', data });
    },
    updateList: (data) => { // 更新报表
      dispatch({ type: 'rechargeSearch/UPDATE_LIST_ACTION', data });
    },
  }),
)(injectIntl(Index));
