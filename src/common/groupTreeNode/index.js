// 组织树
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Tree, Input, message,
} from 'antd';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import styles from './index.module.less';

import GroupHandle from './groupHandle';// 组织树操作按钮
import PublicDrawer from './publicDrawer';// 公共抽屉(新增、修改、详情、插入共用）

class GroupTreeNode extends Component {
  static propTypes = {
    treeSlectCallBack: PropTypes.func.isRequired, // 节点选中后的回调方法
    treeRefreshCallBack: PropTypes.func, // 组织树更新后的回调方法
    showDrawerCallBack: PropTypes.func, // 组织树显示操作弹窗后的回调方法
    showTreeHandle: PropTypes.bool, // 是否显示组织树操作按钮
    clearTreeSelected: PropTypes.bool, // 清除组织树勾选项
    getTreeData: PropTypes.func.isRequired,
    handleBackData: PropTypes.object,
    handleType: PropTypes.string,
    changeSelectTreeId: PropTypes.func.isRequired,
    slectTreeId: PropTypes.string,
    getTreeDataById: PropTypes.func.isRequired,
    changeVisibleKey: PropTypes.func.isRequired,
    deleteGroup: PropTypes.func.isRequired,
    treeData: PropTypes.array.isRequired,
    intl: PropTypes.object.isRequired,
  }

  static defaultProps={
    treeRefreshCallBack: null,
    showDrawerCallBack: null,
    showTreeHandle: null,
    handleBackData: null,
    handleType: null,
    slectTreeId: null,
    clearTreeSelected: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      treeHandleDisabled: true,
      selectedKeys: '',
    };
  }

  componentDidMount() {
    const { getTreeData } = this.props;
    getTreeData();
  }

  // props改变时触发
  componentWillReceiveProps(nextProps) {
    const { handleBackData, handleType, clearTreeSelected } = nextProps;
    if (clearTreeSelected) {
      this.setState({
        selectedKeys: '',
      });
    }
    if (handleType) { // 用户操作
      if (handleType === '判断组织是否可删除') {
        if (handleBackData.status !== 200) {
          message.warning('删除组织失败!');
        } else if (handleBackData.data.data) {
          message.warning(handleBackData.data.data);
        }
        return;
      }
      if (handleBackData.status !== 200 || handleBackData.data.code !== 1) {
        message.warning(`${handleType}失败!`);
      } else if (handleBackData.status === 200) {
        // 用户操作成功,刷新组织树
        if (handleBackData.data.code === 1) {
          const {
            getTreeData, changeSelectTreeId,
            treeSlectCallBack, treeRefreshCallBack,
            slectTreeId, getTreeDataById, changeVisibleKey,
          } = this.props;
          changeVisibleKey();// 关闭抽屉
          getTreeDataById({
            id: slectTreeId,
          });
          getTreeData();
          if (typeof treeRefreshCallBack === 'function') {
            treeRefreshCallBack();
          }
          if (handleType === '删除组织') {
            if (typeof treeSlectCallBack === 'function') {
              treeSlectCallBack();
            }
            changeSelectTreeId({
              id: null,
            });
            this.setState({
              treeHandleDisabled: true,
            });
          }
          message.success(`${handleType}成功!`);
        } else {
          message.warning(handleBackData.data.msg);
        }
      } else {
        const { intl: { messages } } = this.props;
        message.error(messages.groupTree_interface_error);
      }
    }
  }

  // 组织树模糊搜索
  searchTreeData=(keyward) => {
    const { getTreeData } = this.props;
    getTreeData({ query: keyward });
    this.setState({
      treeHandleDisabled: true,
    });
  }

  // 点击树节点
  onTreeSelect=(selectedKeys, e) => {
    const {
      treeSlectCallBack, changeSelectTreeId, getTreeDataById,
      showTreeHandle,
    } = this.props;
    if (typeof treeSlectCallBack === 'function') {
      treeSlectCallBack(selectedKeys, e);
    }
    changeSelectTreeId({
      id: selectedKeys[0],
    });
    if (e.selected && showTreeHandle) {
      getTreeDataById({
        id: selectedKeys[0],
      });
    }
    console.log('选择', e && e.selected ? selectedKeys[0] : '');
    this.setState({
      selectedKeys,
      treeHandleDisabled: !e.selected,
    });
  }

  // 删除组织
  deleteGroupFun=() => {
    const { slectTreeId, deleteGroup } = this.props;
    deleteGroup({
      id: slectTreeId,
    });
  }

  render() {
    const { treeData, showDrawerCallBack, showTreeHandle, intl: { messages } } = this.props;
    const { treeHandleDisabled, selectedKeys } = this.state;
    console.log('selectedKeys', selectedKeys);

    return (
      <div>
        <div className={styles['slider-tree-wrapper']}>
          <Input
            placeholder={messages.groupTree_input_groupname}
            allowClear
            onChange={e => this.searchTreeData(e.target.value)}
          />
          <Tree
            className={showTreeHandle ? styles['slider-handletree-box'] : styles['slider-tree-box']}
            showLine
            treeData={treeData}
            autoExpandParent
            defaultExpandParent
            defaultExpandAll
            defaultSelectedKeys=""
            selectedKeys={selectedKeys}
            key={treeData.length === 0 ? Math.random() : '1'}
            onSelect={this.onTreeSelect}
          />
          {/* 组织树操作按钮 */}
          {
            showTreeHandle
              ? (
                <GroupHandle
                  treeHandleDisabled={treeHandleDisabled}
                  showDrawerCallBack={() => {
                    if (typeof showDrawerCallBack === 'function') {
                      showDrawerCallBack();
                    }
                  }}
                />
              ) : null
          }
        </div>
        {/* 组织树操作抽屉 */}
        <PublicDrawer />
      </div>
    );
  }
}
export default connect(
  state => ({
    treeData: state.groupTreeReducers.treeData,
    slectTreeId: state.groupTreeReducers.slectTreeId,
    handleBackData: state.groupTreeReducers.handleBackData,
    handleType: state.groupTreeReducers.handleType,
    visibleKey: state.groupTreeReducers.visibleKey,
  }),
  dispatch => ({
    getTreeData: (data) => {
      dispatch({ type: 'tree/TREEDATA_ACTION', data });
    },
    changeVisibleKey: (data) => {
      dispatch({ type: 'tree/CHANGE_VISIBLEkEY_ACTION', payload: data });
    },
    changeSelectTreeId: (data) => {
      dispatch({ type: 'tree/CHANGE_TREEID_ACTION', payload: data });
    },
    getTreeDataById: (data) => {
      dispatch({ type: 'tree/DETAIL_TREE_ACTION', payload: data });
    },
    deleteGroup: (data) => {
      dispatch({ type: 'tree/DELETE_TREE_ACTION', payload: data });
    },
  }),
)(injectIntl(GroupTreeNode));
