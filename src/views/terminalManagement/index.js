/**
 * 终端管理入口js
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import {
  Layout, Typography,
  // LocaleProvider,
} from 'antd';

// 国际化
// import zh_CN from 'antd/es/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import PropTypes from 'prop-types';

// less样式
import styles from './index.module.less';

// 组件
import SearchCom from './searchCom';
import TableCom from './tableCom';
import BreadcrumbComponent from '../../common/Breadcrumb/BreadcrumbComponent'; // 面包屑导航
import GroupTreeNode from '../../common/groupTreeNode';// 组织架构树
import OperationSettingModal from './operationSettingModal'; // 操作设置弹窗

// 国际化
moment.locale('zh-cn');

const { Sider, Content } = Layout;
const { Title } = Typography;

class TerminalManagement extends Component {
  static propTypes = {
    // intl: PropTypes.object.isRequired,
    advancedSearch: PropTypes.func.isRequired,
    advancedSearchData: PropTypes.object.isRequired,
    advancedSearchStatus: PropTypes.bool.isRequired,
    saveTableSelectionData: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    changeOrganizationId: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      // 表格列配置项
      columns: [
        { title: 'IMEI',
          dataIndex: 'internationalMobile',
          key: 'internationalMobile',
          width: 200 },
        { title: '所属组织',
          dataIndex: 'organizationName',
          key: 'organizationName',
          width: 200 },
        { title: '终端号',
          dataIndex: 'deviceNumber',
          key: 'deviceNumber',
          width: 200 },
        { title: '短信状态',
          dataIndex: 'messageStatus',
          key: 'messageStatus',
          width: 200 },
        { title: '下发时间',
          dataIndex: 'sendTime',
          key: 'sendTime',
          width: 200 },
        { title: '在线状态',
          dataIndex: 'isOnline',
          key: 'isOnline',
          width: 200 },
        { title: '服务模式',
          dataIndex: 'servicePattern',
          key: 'servicePattern',
          width: 200 },
        { title: '服务状态',
          dataIndex: 'serviceStatus',
          key: 'serviceStatus',
          width: 200 },
        { title: '更新时间',
          dataIndex: 'updatedSimCardTime',
          key: 'updatedSimCardTime',
          width: 200 }, // ????
        { title: '终端服务到期时间',
          dataIndex: 'deviceServiceExpireTime',
          key: 'deviceServiceExpireTime',
          width: 200 },
        { title: '终端到期提前提醒时间',
          dataIndex: 'deviceExpireRemindTime',
          key: 'deviceExpireRemindTime',
          width: 200 },
        { title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          width: 100 },
      ],
      // 批量操作按钮显示隐藏
      massOperation: false,
      // 列表选择行key集合
      selectedRowKeys: [],
      // 操作列表选中行回调
      massShow: (selectedRowKeys) => {
        const len = selectedRowKeys.length;
        // 选中行数多于1，展示批量按钮
        if (len >= 1) {
          this.setState({
            massOperation: true,
            selectedRowKeys,
          });
        } else {
          this.setState({
            massOperation: false,
            selectedRowKeys,
          });
        }
      },
      isMass: false, // 当前点击按钮是否是批量按钮
      toggleMass: (bool) => { // 切换isMass状态
        this.setState({
          isMass: bool,
        });
      },
      // 详情弹框显示、隐藏
      visible: false,
      // 展示哪个操作弹框
      visibleKey: '',
      // 详情展示or隐藏
      operateDetail: (isShow) => {
        const { visible } = this.state;
        if (isShow) {
          this.setState({
            visible: isShow,
          });
        } else {
          this.setState({
            visible: !visible,
          });
        }
      },
      // 操作抽屉展示or隐藏
      toggleDrawer: (key) => {
        const { visible, visibleKey, operateDetail } = this.state;

        this.setState({
          visibleKey: visibleKey !== key && key ? key : 'clear',
        });
        if (key !== 'edit' && key !== 'detail' && key !== 'sendSms') {
          this.clearClickData();
        }
        if (visible) {
          operateDetail();
        }
      },
      // 请求参数
      param: {
        page: 1, // 当前页
        limit: 10, // 每页容量
        simpleQueryParam: '', // 模糊查询
        // deviceNumber: '', // 终端号
        messageStatus: null, // 短信状态 0发送中 1发送成功 8发送失败（全部时此字段为空）
        isOnline: null, // 在线状态 1：在线 0：离线（全部时此字段为空）
        servicePattern: null, // 服务模式 0 ：SIM卡到期模式 1：终端服务到期模式（全部时此字段为空）
        serviceStatus: null, // 服务状态 0：异常 1：正常 2：即将停机 3：服务即将到期 4：已停机 5：服务已到期（全部时此字段为空）
        startTime: '',
        endTime: '',
        searchType: 0, // 查询类型 0：正常查询  1：导入查询
      },
      oldServiceStatus: null, // 服务状态类型
      clearTreeSelected: false, // 是否清空组织树勾选状态
      // 定制列方法
      setColumn: (data) => {
        console.log(data, 'HHHsawfew');
        this.setState({
          columns: data,
        });
      },
      searchFun: {
        setSimpleQueryParamFun: this.setSimpleQueryParam,
        setMessageStatusFun: this.setMessageStatus,
        setIsOnlineFun: this.setIsOnline,
        setServicePatternFun: this.setServicePattern,
        setServiceStatusFun: this.setServiceStatus,
        setTimeFun: this.setTime,
        updateLimit: this.updateLimit,
        setSearchType: this.setSearchType,
      },
    };
  }

  componentDidMount() {
    const { advancedSearch } = this.props;
    const { param } = this.state;
    if (advancedSearch) {
      advancedSearch({ ...param });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { advancedSearchStatus, history: { location: { state } } } = nextProps;
    const { massShow, oldServiceStatus } = this.state;
    // 列表数据刷新时,清空列表勾选状态
    if (advancedSearchStatus) {
      massShow([]);
    }
    // msgType!==null,代表是点击顶部消息提醒跳转
    if (state) {
      const { msgType } = state;
      if (msgType && oldServiceStatus !== msgType) {
        this.msgJumpSearch(msgType);
      }
    }
  }

  // -----------------------------------
   // 模糊查询值
   setSimpleQueryParam = (e) => {
     const { param } = this.state;
     this.setState({
       param: {
         ...param,
         simpleQueryParam: e.target.value,
       },
     });
   }

  // 短信状态
  setMessageStatus = (e) => {
    const { param } = this.state;
    let value = null;
    if (e.key !== 'all') {
      value = e.key;
    }
    this.setState({
      param: {
        ...param,
        messageStatus: value,
      },
    });
  }

  // 在线状态
  setIsOnline = (e) => {
    const { param } = this.state;
    let value = null;
    if (e.key !== 'all') {
      value = e.key;
    }
    console.log(e);
    this.setState({
      param: {
        ...param,
        isOnline: value,
      },
    });
  }

  // 服务模式
  setServicePattern = (e) => {
    const { param } = this.state;

    let value = null;
    if (e.key !== 'all') {
      value = e.key;
    }
    this.setState({
      param: {
        ...param,
        servicePattern: value,
      },
    });
  }

  // 服务状态
  setServiceStatus =(e) => {
    const { param } = this.state;

    let value = null;
    if (e.key !== 'all') {
      value = e.key;
    }
    this.setState({
      param: {
        ...param,
        serviceStatus: value,
      },
    });
  }

  // 终端服务到期时间
  setTime = (value, dateString) => {
    const { param } = this.state;

    this.setState({
      param: {
        ...param,
        startTime: dateString[0],
        endTime: dateString[1],
      },
    });
  }

  // 还原搜索条件
  updateLimit = (pageSize) => {
    const { page, limit } = this.state.param;

    const pages = pageSize || (limit || 10);

    this.setState({
      param: {
        page, // 当前页
        limit: pages, // 每页容量
        simpleQueryParam: '', // 模糊查询
        // deviceNumber: '', // 终端号
        messageStatus: null, // 短信状态 0发送中 1发送成功 8发送失败（全部时此字段为空）
        isOnline: null, // 在线状态 1：在线 0：离线（全部时此字段为空）
        servicePattern: null, // 服务模式 0 ：SIM卡到期模式 1：终端服务到期模式（全部时此字段为空）
        serviceStatus: null, // 服务状态 0：异常 1：正常 2：即将停机 3：服务即将到期 4：已停机 5：服务已到期（全部时此字段为空）
        startTime: '',
        endTime: '',
        searchType: 0, // 查询类型 0：正常查询  1：导入查询
      },
    });
  }

  // 分页更新
  setPages = (page, limit, callback) => {
    const { param } = this.state;
    console.log(param, '{{{{{');
    this.setState({
      param: {
        ...param,
        page,
        limit,
      },
    }, () => {
      callback();
    });
  }

  // 查询类型更新：高级搜索 or 导入查询
  setSearchType = (type, callback) => {
    const { param } = this.state;
    this.setState({
      param: {
        ...param,
        searchType: type,
      },
    }, () => {
      callback();
    });
  }

  // -------------------------------------------------------
  // 点击顶部消息提醒跳转后,筛选相关终端列表
  msgJumpSearch=(msgType) => {
    const { advancedSearch } = this.props;
    const { param } = this.state;
    this.setState({
      oldServiceStatus: msgType,
    }, () => {
      param.serviceStatus = msgType;
      advancedSearch({ ...param });
    });
  }


  // 清空点击数据
  clearClickData = () => {
    const { visible } = this.state;
    const { saveTableSelectionData } = this.props;
    if (!visible) {
      saveTableSelectionData({}); // 点击的为对象，用于单个修改}
    }
  }

  // 是否清空组织树勾选状态
  setClearTreeSelected=(value) => {
    this.setState({
      clearTreeSelected: value,
    });
  }

  // 组织树勾选回调
  treeSlectCallBack=(selectedKeys, e) => {
    const { changeOrganizationId, advancedSearch } = this.props;
    const { clearTreeSelected, toggleDrawer } = this.state;
    changeOrganizationId(e && e.selected ? selectedKeys[0] : '');
    if (clearTreeSelected) {
      this.setClearTreeSelected(false);
    }
    toggleDrawer('clear');
    const { param } = this.state;
    if (advancedSearch) {
      advancedSearch({ ...param });
    }
  }

  render() {
    console.log(this.state.param, '当前index参数');
    const { columns,
      selectedRowKeys,
      toggleDrawer,
      visible,
      visibleKey,
      massShow,
      massOperation,
      operateDetail,
      setColumn,
      isMass,
      toggleMass,
      clearTreeSelected,
      param,
      searchFun,
    } = this.state;
    console.log(selectedRowKeys, 'LLLL');
    const breadcrumb = [
      { title: '工作台', key: 0 },
      { title: '设备管理', key: 1 },
      { title: '终端管理', key: 2 },
    ];
    const { advancedSearchData } = this.props;


    return (
    // <LocaleProvider locale={zh_CN}>
      <div className={styles['bg-wrapper']}>
        <BreadcrumbComponent breadcrumbMessage={breadcrumb} />
        <Layout className={styles['layout-wrapper']}>
          <Sider className={styles['layout-slider']} width={300}>
            <Title className={styles['panel-title']}>组织架构</Title>
            {/* 组织树 */}
            <GroupTreeNode
              clearTreeSelected={clearTreeSelected}
              treeSlectCallBack={this.treeSlectCallBack} // 节点选中后的回调方法
            />
          </Sider>
          <Content className={styles['layout-content']}>
            <Title className={styles['panel-title']}>终端列表</Title>
            {/* 搜索模块 */}
            <SearchCom
              columns={columns}
              massOperation={massOperation}
              checkLength={selectedRowKeys.length}
              selectRow={selectedRowKeys}
              massShow={massShow}
              toggleDrawer={toggleDrawer}
              setColumn={setColumn}
              toggleMass={toggleMass}
              visible={visible}
              setClearTreeSelected={this.setClearTreeSelected}
              param={param}
              searchFun={searchFun}
            />
            {/* 列表模块 */}
            <TableCom
              columns={columns}
              massShow={massShow}
              selectedRowKeys={selectedRowKeys} // 列表选择key集合
              operateDetail={operateDetail} // 详情展示or隐藏操作
              data={advancedSearchData}
              toggleMass={toggleMass}
              param={param}
              setPages={this.setPages}
            />
          </Content>
        </Layout>
        <OperationSettingModal
          toggleDrawer={toggleDrawer}
          visible={visible}
          visibleKey={visibleKey}
          operateDetail={operateDetail}
          isMass={isMass}
          toggleMass={toggleMass}
          param={param}
        />
      </div>
    // </LocaleProvider>
    );
  }
}

export default connect(
  state => ({
    currLocale: state.rootReducers.currLocale,
    advancedSearchData: state.terminalManagementReducers.advancedSearchData, // 高级查询
    advancedSearchStatus: state.terminalManagementReducers.advancedSearchStatus, // 高级查询
    // treeData: state.terminalManagementReducers.treeData,
  }),
  dispatch => ({
    switchLocale: (payload) => {
      dispatch({ type: 'root/SWITCH_LOCALEN', payload });
    },
    // 高级查询
    advancedSearch: (payload) => {
      dispatch({ type: 'terminalManagement/SEND_ADVANCED_SEARCH', payload });
    },
    changeOrganizationId: (data) => {
      dispatch({ type: 'terminalManagement/CHANGE_ORGANIZATIONID', payload: data });
    },
    // // 组织树
    // getTreeData: (data) => {
    //   dispatch({ type: 'terminalManagement/ORGANIZATION_TREE_ACTION', data });
    // },
    // 存储点击列表数据
    saveTableSelectionData: (payload) => {
      dispatch({ type: 'terminalManagement/SEND_SAVE_TABLE_SELECTION_DATA', payload });
    },
  }),
)(injectIntl(TerminalManagement));
