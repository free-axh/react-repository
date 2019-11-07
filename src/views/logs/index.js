import React, { Component } from 'react';
import {
  Modal,
  // Breadcrumb,
  Typography,
  Table,
} from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import 'moment/locale/zh-cn';
import { injectIntl } from 'react-intl';
import styles from './index.module.less';
import SearchComponent from './componentSearch';
import ColumnCustomForm from '../../common/columnCustom';// 自定义显示列
import BreadcrumbComponent from '../../common/Breadcrumb/BreadcrumbComponent';

const { Title } = Typography;

class Index extends Component {
  // 属性声明
  static propTypes ={
    getLogsLists: PropTypes.func.isRequired,
    logLists: PropTypes.object.isRequired,
    logsStatus: PropTypes.string,
    listExport: PropTypes.func,
    intl: PropTypes.object.isRequired,
  };

  static defaultProps = {
    logsStatus: null,
    listExport: null,
  }

  constructor(props) {
    super(props);

    const { intl } = this.props;
    const columns = this.setTableColumns();
    this.state = {
      breadcrumb: [
        { title: intl.messages.logs_crumb1 },
        { title: intl.messages.logs_crumb2 },
        { title: intl.messages.logs_title },
      ],
      modalVisible: false,
      tableColumns: columns,
      dataSource: [],
      currentPage: 1, // 当前页
      pageSize: 10, // 每页条数
      totalRecords: 0,
      formData: null,
      modalContent: [],
    };
  }

  componentDidMount() {
    this.getLogsData();
  }

  componentWillReceiveProps(nextProps) {
    const {
      logLists,
      logsStatus,
    } = nextProps;

    if (logsStatus === 'success') {
      this.setState({
        dataSource: logLists.dataSource,
        totalRecords: logLists.totalRecords,
      });
    }
  }

  // 设置table列数据
  setTableColumns=() => {
    const { intl } = this.props;

    return [
      {
        title: intl.messages.logs_th1,
        dataIndex: 'inx',
        key: 'no',
        width: 80,
        align: 'center',
        render: (text, record, index) => index + 1,
      },
      {
        title: intl.messages.logs_th2,
        dataIndex: 'eventDate',
        key: 'date',
        align: 'center',
        sorter: (a, b) => a.eventDate < b.eventDate,
      },
      {
        title: intl.messages.logs_th3,
        dataIndex: 'ipAddress',
        key: 'IP',
        align: 'center',
      },
      {
        title: intl.messages.logs_th4,
        dataIndex: 'username',
        key: 'person',
        align: 'center',
      },
      {
        title: intl.messages.logs_th5,
        dataIndex: 'internationalMobile',
        key: 'IMEI',
        align: 'center',
      },
      {
        title: intl.messages.logs_th6,
        dataIndex: 'message',
        key: 'content',
        align: 'center',
        render: (value, record) => {
          if (record.showType === 1) {
            return (
              <span onClick={() => this.showModal(record)} style={{ cursor: 'pointer', color: '#1890ff' }}>
                {record.monitoringOperation.replace(/<\/br>/g, ' ')}
              </span>
            );
          }

          return value.replace(/<\/br>/g, ' ');
        },
      },
      {
        title: intl.messages.logs_th7,
        dataIndex: 'logSource',
        key: 'source',
        align: 'center',
        render: (value) => {
          if (value === '1') {
            return intl.messages.logs_source1;
          } if (value === '2') {
            return intl.messages.logs_source2;
          } if (value === '3') {
            return intl.messages.logs_source3;
          } if (value === '4') {
            return intl.messages.logs_source4;
          }
          return '';
        },
      },
    ];
  }

  // 定制显示列
  setCustomFun=(currentShowColumns) => {
    this.setState({
      tableColumns: currentShowColumns,
    });
  }

  // 显示弹层
  showModal=(record) => {
    this.setState({
      modalVisible: true,
      modalContent: record.message.split('</br>'),
    });
  }

  hideModal=() => {
    this.setState({
      modalVisible: false,
    });
  }

  // 页码改变
  pageChange=(page) => {
    this.setState({
      currentPage: page,
    }, this.getLogsData);
  }

  // 每页条数改变
  onShowSizeChange=(current, size) => {
    this.setState({
      currentPage: current,
      pageSize: size,
    }, this.getLogsData);
  }

  // 获取表单数据
  getFormData=(param) => {
    this.setState({
      formData: param,
    }, this.getLogsData);
  }

  // 请求日志查询数据
  getLogsData=() => {
    const {
      currentPage,
      pageSize,
      formData,
    } = this.state;
    const {
      getLogsLists,
    } = this.props;

    const params = {
      start: (currentPage - 1) * pageSize,
      length: pageSize,
      ...formData,
    };
    getLogsLists(params);
  }

  // 报表导出
  exportList=(params) => {
    const {
      listExport,
    } = this.props;

    listExport(params);
  }

  render() {
    const {
      modalVisible,
      tableColumns,
      currentPage,
      pageSize,
      dataSource,
      totalRecords,
      modalContent,
      breadcrumb,
    } = this.state;
    const { intl } = this.props;

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
          <Title
            className={styles['panel-title']}
          >
            {intl.messages.logs_panelTit2}
          </Title>

          <div
            className={styles['search-box']}
          >
            {/* 查询条件 */}
            <div
              className={styles['pull-left']}
            >
              <SearchComponent
                onSubmit={this.getFormData}
              />
            </div>

            {/* 自定义显示列 */}
            <div
              className={styles['pull-right']}
            >
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
            {/* table */}
            <Table
              dataSource={dataSource}
              columns={tableColumns}
              rowKey={record => record.id}
              local={intl.messages.logs_noData}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: () => `${intl.messages.logs_total}${totalRecords}${intl.messages.logs_unit}`,
                total: totalRecords,
                defaultPageSize: pageSize,
                current: currentPage,
                showLessItems: true,
                pageSizeOptions: ['10', '20', '50', '100', '200', '500', '1000'],
                position: 'bottom',
                onChange: this.pageChange,
                onShowSizeChange: this.onShowSizeChange,
              }}
            />
          </div>
        </div>

        {/* 操作弹框 */}
        <Modal
          title={intl.messages.logs_modalTitle}
          visible={modalVisible}
          footer={null}
          onOk={this.hideModal}
          onCancel={this.hideModal}
          bodyStyle={{ maxHeight: '500px', overflow: 'auto' }}
        >
          {modalContent.map(item => (
            <div>{item}</div>
          ))}
        </Modal>
      </div>
    );
  }
}

export default connect(
  state => ({
    logLists: state.logsReducers.logLists, // 查询日志列表
    logsStatus: state.logsReducers.logsStatus, // 查询日志请求状态
  }),
  dispatch => ({
    getLogsLists: (data) => { // 获取日志列表
      dispatch({ type: 'logs/GET_LOGLIST_ACTION', data });
    },
  }),
)(injectIntl(Index));
