import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Table, Layout, Tag, message,
  Icon, Button, Typography, Modal,
} from 'antd';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { getStore } from '../../utils/localStorage';
import styles from './index.module.less';
import BreadcrumbComponent from '../../common/Breadcrumb/BreadcrumbComponent';
import GroupTreeNode from '../../common/groupTreeNode';// 组织架构树
import SearchForm from './searchForm';// 用户搜索
import ColumnCustomForm from '../../common/columnCustom';// 自定义显示列
import AllDrawer from './allDrawer';// 所有抽屉

const { Sider, Content } = Layout;
const { Title } = Typography;

class Index extends Component {
  static propTypes = {
    getUserRoles: PropTypes.func.isRequired,
    getTreeData: PropTypes.func.isRequired,
    handleBackData: PropTypes.object,
    handleType: PropTypes.string,
    getUserDataList: PropTypes.func.isRequired,
    changeVisibleKey: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired,
    changeSelectRow: PropTypes.func.isRequired,
    selectRowData: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  }

  static defaultProps = {
    handleBackData: null,
    handleType: null,
  }

  constructor(props) {
    super(props);
    // const { intl: { messages } } = this.props;
    const defColumns = [
      // {
      //   title: <FormattedMessage id="organizationAndUser_table_serialnumber" />,
      //   dataIndex: 'no',
      //   key: 'no',
      //   width: 100,
      //   align: 'center',
      //   // fixed: 'left',
      //   render: (text, record, index) => index + 1,
      // },
      {
        title: <FormattedMessage id="organizationAndUser_table_username" />,
        dataIndex: 'username',
        key: 'username',
        width: 240,
        align: 'center',
        // fixed: 'left',
      },
      {
        title: <FormattedMessage id="organizationAndUser_table_organizationname" />,
        dataIndex: 'organizationName',
        key: 'organizationName',
        width: 240,
        align: 'center',
      },
      {
        title: <FormattedMessage id="organizationAndUser_table_isactive" />,
        key: 'isActive',
        dataIndex: 'isActive',
        width: 200,
        align: 'center',
        filters: [
          {
            text: <FormattedMessage id="organizationAndUser_table_enable" />,
            value: true,
          },
          {
            text: <FormattedMessage id="organizationAndUser_table_disable" />,
            value: false,
          },
        ],
        onFilter: (value, record) => value ? record.isActive === 1 : record.isActive === 0,
        render: (value) => {
          if (value) {
            return (
              <Tag color="green">
                <FormattedMessage id="organizationAndUser_table_enable" />
              </Tag>
            );
          }
          return (
            <Tag color="volcano">
              <FormattedMessage id="organizationAndUser_table_disable" />
            </Tag>
          );
        },
      },
      {
        title: <FormattedMessage id="organizationAndUser_table_authorizationdatestr" />,
        dataIndex: 'authorizationDateStr',
        key: 'authorizationDateStr',
        align: 'center',
        width: 160,
        // defaultSortOrder: 'descend',
        sorter: (a, b) => a.authorizationDateStr > b.authorizationDateStr,
      },
      {
        title: <FormattedMessage id="organizationAndUser_table_realname" />,
        dataIndex: 'realName',
        key: 'realName',
        width: 200,
        align: 'center',
      },
      {
        title: <FormattedMessage id="organizationAndUser_table_gender" />,
        dataIndex: 'gender',
        key: 'gender',
        width: 100,
        align: 'center',
        render: (value) => {
          if (value === '1') return <FormattedMessage id="organizationAndUser_table_man" />;
          return <FormattedMessage id="organizationAndUser_table_woman" />;
        },
      },
      {
        title: <FormattedMessage id="organizationAndUser_table_mobile" />,
        dataIndex: 'mobile',
        key: 'mobile',
        width: 160,
        align: 'center',
      },
      {
        title: <FormattedMessage id="organizationAndUser_table_mail" />,
        dataIndex: 'mail',
        key: 'mail',
        width: 300,
        align: 'center',
      },
    ];

    this.state = {
      columns: defColumns,
      userData: {}, // 用户列表数据
      currentPage: 1,
      pageSize: 10,
      currentGroupId: '', // 当前组织树组织id
      selectedRowKeys: null, // 列表勾选行key
      checkUserNumArr: [], // 选中用户
      searchParamObj: {},
    };

    this.getUserData();
  }

  componentDidMount() {
    const { getUserRoles, getTreeData } = this.props;
    // 获取组织树节点数据
    getTreeData();
    // 获取当前用户可分配角色
    getUserRoles();
  }

  // props改变时触发
  componentWillReceiveProps(nextProps) {
    const { handleBackData, handleType } = nextProps;
    if (handleType && handleBackData) { // 用户操作
      if (handleBackData.status !== 200 || handleBackData.data.code !== 1) {
        message.warning(`${handleType}失败!`);
      } else {
        switch (handleType) {
          case '获取组织树节点数据':
          case '获取用户可分配角色':
            break;
          case '获取用户列表数据':
            this.setState({
              userData: handleBackData.data || {},
            });
            this.clearRowSelect();
            break;
          default:
            if (handleBackData.status === 200) {
              // 用户操作成功,刷新表格数据
              if (handleBackData.data.code === 1) {
                this.drawerShowChangeFun();
                this.clearRowSelect();
                if (handleType === '新增用户') {
                  this.setState({
                    currentPage: 1,
                  });
                }
                this.getUserData();
                message.success(`${handleType}成功!`);
              } else {
                message.warning(handleBackData.data.msg);
              }
            } else {
              message.warning('请求接口异常');
            }
            break;
        }
      }
    }
  }

  // 获取用户列表
  getUserData=(searchParam) => {
    const { getUserDataList } = this.props;
    const { currentPage, pageSize, currentGroupId, searchParamObj } = this.state;
    let param = {
      start: (currentPage - 1) * pageSize,
      length: 1000,
      organizationId: currentGroupId,
    };
    if (searchParam) { // 模糊搜索
      this.setState({
        searchParamObj: searchParam,
      });
      param = Object.assign({}, param, searchParam);
    } else {
      param = Object.assign({}, param, searchParamObj);
    }
    getUserDataList(param);
  }

  // 列表每页显示数量切换
  changePageSize=(pageSize, current) => {
    this.setState({
      currentPage: current,
      pageSize,
    }, () => {
      this.getUserData();
    });
  }

  // 列表页码切换
  changePage=(current) => {
    this.setState({
      currentPage: current,
    }, () => {
      this.getUserData();
    });
  }

  // 定制显示列
  setCustomFun=(currentShowColumns) => {
    this.setState({
      columns: currentShowColumns,
    });
  }

  // 组织树刷新回调
  treeRefreshCallBack=() => {
    const { getTreeData } = this.props;
    getTreeData();
  }

  // 组织树勾选回调
  treeSlectCallBack=(selectedKeys, e) => {
    this.setState({
      currentGroupId: e && e.selected ? selectedKeys[0] : '',
    }, () => {
      this.getUserData();
    });
  }

  // 抽屉显示切换
  drawerShowChangeFun=(key) => {
    const { changeVisibleKey } = this.props;
    changeVisibleKey(key);
  }

  // 批量删除用户
  deleteMoreUser=() => {
    const { intl: { messages } } = this.props;
    Modal.confirm({
      title: messages.organizationAndUser_confirm_title,
      content: messages.organizationAndUser_confirm_content,
      okText: messages.organizationAndUser_confirm_oktxt,
      cancelText: messages.organizationAndUser_cancel,
      onOk: () => {
        const { deleteUser } = this.props;
        const { checkUserNumArr } = this.state;
        const userIds = [];
        checkUserNumArr.map((value) => {
          userIds.push(value.id);
          return value;
        });
        deleteUser({
          userIds: userIds.join(','),
        });
      },
    });
  }

  // 列表行点击
  selectRow=(record) => {
    const { changeSelectRow } = this.props;
    changeSelectRow(record);
    this.drawerShowChangeFun('userDetail');
  }

  // 列表数据勾选
  onSelectChange=(selectedRowKeys, selectedRows) => {
    this.setState({
      checkUserNumArr: selectedRows,
      selectedRowKeys,
    });
  }

  // 清除列表勾选项
  clearRowSelect=() => {
    this.setState({
      checkUserNumArr: [],
      selectedRowKeys: null,
    });
    const { changeVisibleKey } = this.props;
    changeVisibleKey('clear');
  }

  // 表格选中行高亮
  setHighlightClassName=(record) => {
    const { selectRowData: { id } } = this.props;
    const { id: currentId } = record;
    return currentId === id ? `${styles['table-row-active']}` : '';
  }

  render() {
    const {
      columns, userData, currentPage,
      checkUserNumArr, pageSize, selectedRowKeys,
    } = this.state;
    const { selectRowData, intl: { messages } } = this.props;

    // 表格第一列显示复选框
    const rowSelection = {
      onChange: this.onSelectChange,
      getCheckboxProps: record => (
        {
          disabled: record.username === 'admin' || record.username === getStore('username'),
        }),
      selectedRowKeys,
    };

    const breadcrumb = [
      { title: (
        <FormattedMessage id="organizationAndUser_dashboard" />
      ) },
      { title: (
        <FormattedMessage id="organizationAndUser_group_manager" />
      ) },
      { title: (
        <FormattedMessage id="organizationAndUser_title" />
      ) },
    ];

    return (
      <div className={styles['bg-wrapper']}>
        {/* 面包屑导航 */}
        <BreadcrumbComponent breadcrumbMessage={breadcrumb} />
        <Layout className={styles['layout-wrapper']}>
          <Sider className={styles['layout-slider']} width={300}>
            <Title className={styles['panel-title']}>
              <FormattedMessage id="organizationAndUser_group_architecture" />
            </Title>
            <GroupTreeNode
              treeSlectCallBack={this.treeSlectCallBack}
              treeRefreshCallBack={this.treeRefreshCallBack}
              showDrawerCallBack={this.drawerShowChangeFun}
              showTreeHandle
            />
          </Sider>
          <Content className={styles['layout-content']}>
            <Title className={styles['panel-title']}>
              <FormattedMessage id="organizationAndUser_user_list" />({userData.totalRecords || 0})
            </Title>
            <div className={styles['list-wrapper']}>
              <div className={styles['list-handle-box']}>
                <div className="handleBox">
                  <div className={checkUserNumArr.length === 0 ? '' : styles['hide-handle']}>
                    <Button type="primary" onClick={() => this.drawerShowChangeFun('addUser')}>
                      <Icon type="plus" /><FormattedMessage id="organizationAndUser_add_title" />
                    </Button>
                  </div>
                  {/* 批量操作 */}
                  <div className={checkUserNumArr.length !== 0 ? '' : styles['hide-handle']}>
                    <div className={styles['batch-handle-info']}>
                      <Icon
                        type="close-circle"
                        title={messages.organizationAndUser_clear_checkitem}
                        onClick={this.clearRowSelect}
                      />
                      <FormattedMessage id="organizationAndUser_already_check" />
                      <Button type="link" className={styles['check-user-num']}>{checkUserNumArr.length}</Button>
                      <FormattedMessage id="organizationAndUser_item" />
                    </div>
                    <Button onClick={this.deleteMoreUser} type="primary">
                      <FormattedMessage id="organizationAndUser_batch_delete" />
                    </Button>
                  </div>
                </div>
                <div>
                  {/* 列表搜索 */}
                  <SearchForm
                    searchFun={this.getUserData}
                  />
                  {/* 自定义显示列 */}
                  <ColumnCustomForm
                    customFun={this.setCustomFun}
                    columns={columns}
                  />
                </div>
              </div>
              <Table
                columns={columns}
                dataSource={userData.records}
                scroll={{ x: 1660, y: 567 }}
                rowKey={record => record.id}
                style={{ height: 580 }}
                rowSelection={rowSelection}
                locale={{
                  filterConfirm: <FormattedMessage id="organizationAndUser_confirm" />,
                  filterReset: <FormattedMessage id="organizationAndUser_reset" />,
                  emptyText: <FormattedMessage id="organizationAndUser_empty_text" />,
                }}
                className={selectRowData ? '' : styles['active-table']}
                rowClassName={this.setHighlightClassName}
                onRow={record => ({
                  onClick: () => {
                    this.selectRow(record);
                  }, // 点击行
                })}
                pagination={{
                  size: 'small',
                  showSizeChanger: true,
                  showQuickJumper: false,
                  showTotal: () => <FormattedMessage id="organizationAndUser_table_totals" values={{ totalRecords: userData.totalRecords }} />,
                  defaultPageSize: pageSize,
                  showLessItems: true,
                  current: currentPage,
                  total: userData.totalRecords,
                  pageSizeOptions: ['10', '20', '50', '100', '200', '500', '1000'],
                  onShowSizeChange: (current, newPageSize) => {
                    this.changePageSize(newPageSize, current);
                  },
                  onChange: this.changePage,
                }}
              />
            </div>
            {/* 所有抽屉 */}
            <AllDrawer />
          </Content>
        </Layout>
      </div>
    );
  }
}

export default connect(
  state => ({
    selectRowData: state.organizationAndUserReducers.selectRowData,
    handleBackData: state.organizationAndUserReducers.handleBackData,
    handleType: state.organizationAndUserReducers.handleType,
  }),
  dispatch => ({
    getUserDataList: (data) => {
      dispatch({ type: 'user/USERDATA_ACTION', data });
    },
    changeSelectRow: (data) => {
      dispatch({ type: 'user/CHANGE_SELECTROW_ACTION', payload: data });
    },
    changeVisibleKey: (data) => {
      dispatch({ type: 'user/CHANGE_VISIBLEkEY_ACTION', payload: data });
    },
    getTreeData: () => {
      dispatch({ type: 'usertree/TREEDATA_ACTION' });
    },
    getUserRoles: () => {
      dispatch({ type: 'user/ROLEDATA_ACTION' });
    },
    deleteUser: (payload) => {
      dispatch({ type: 'user/DELETE_USER_ACTION', payload });
    },
  }),
)(injectIntl(Index));
