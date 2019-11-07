// 组织树操作按钮
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Col, Button } from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import styles from './index.module.less';
import addSvg from '../../static/image/add.svg';
import addActiveSvg from '../../static/image/addActive.svg';
import editSvg from '../../static/image/edit.svg';
import editActiveSvg from '../../static/image/editActive.svg';
import detailSvg from '../../static/image/detail.svg';
import detailActiveSvg from '../../static/image/detailActive.svg';
import insertSvg from '../../static/image/insert.svg';
import insertActiveSvg from '../../static/image/insertActive.svg';
import deleteSvg from '../../static/image/delete.svg';
import deleteActiveSvg from '../../static/image/deleteActive.svg';


class GroupHandle extends Component {
  static propTypes = {
    showDrawerCallBack: PropTypes.func.isRequired, // 组织树显示操作弹窗后的回调方法
    changeVisibleKey: PropTypes.func.isRequired,
    slectTreeId: PropTypes.string,
    deleteGroup: PropTypes.func.isRequired,
    treeHandleDisabled: PropTypes.bool.isRequired,
    intl: PropTypes.object.isRequired,
  }

  static defaultProps={
    slectTreeId: null,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 抽屉显示切换
  drawerShowChangeFun=(key) => {
    const { changeVisibleKey, showDrawerCallBack } = this.props;
    changeVisibleKey(key);
    showDrawerCallBack();
  }

  // 删除组织
  deleteGroupFun=() => {
    const { intl: { messages } } = this.props;
    Modal.confirm({
      title: messages.groupTree_confirm_title,
      content: messages.groupTree_confirm_content,
      okText: messages.groupTree_confirm_oktxt,
      cancelText: messages.groupTree_cancel,
      onOk: () => {
        const { slectTreeId, deleteGroup } = this.props;
        deleteGroup({
          id: slectTreeId,
        });
      },
    });
  }

  render() {
    const { treeHandleDisabled, intl: { messages } } = this.props;
    return (
      <div className={styles['group-buttons']}>
        {
            treeHandleDisabled
              ? (
                <div className={styles['group-disabled-buttons']}>
                  <Row gutter={20}>
                    <Col span={8}>
                      <Button type="link" title={messages.groupTree_select_group}>
                        <img alt={messages.groupTree_add} src={addSvg} /> <FormattedMessage id="groupTree_add" />
                      </Button>
                    </Col>
                    <Col span={8}>
                      <Button type="link" title={messages.groupTree_select_group}>
                        <img alt={messages.groupTree_edit} src={editSvg} /> <FormattedMessage id="groupTree_edit" />
                      </Button>
                    </Col>
                    <Col span={8}>
                      <Button type="link" title={messages.groupTree_select_group}>
                        <img alt={messages.groupTree_detail} src={detailSvg} /> <FormattedMessage id="groupTree_detail" />
                      </Button>
                    </Col>
                  </Row>
                  <Row gutter={20}>
                    <Col span={8}>
                      <Button type="link" title={messages.groupTree_select_group}>
                        <img alt={messages.groupTree_insert} src={insertSvg} /> <FormattedMessage id="groupTree_insert" />
                      </Button>
                    </Col>
                    <Col span={8}>
                      <Button type="link" title={messages.groupTree_select_group}>
                        <img alt={messages.groupTree_delete} src={deleteSvg} /> <FormattedMessage id="groupTree_delete" />
                      </Button>
                    </Col>
                  </Row>
                </div>
              )
              : (
                <div>
                  <Row gutter={20}>
                    <Col span={8}>
                      <Button type="link" className={styles['group-add-button']} onClick={() => { this.drawerShowChangeFun('add'); }}>
                        <img alt={messages.groupTree_add} src={addActiveSvg} /> <FormattedMessage id="groupTree_add" />
                      </Button>
                    </Col>
                    <Col span={8}>
                      <Button type="link" className={styles['group-edit-button']} onClick={() => { this.drawerShowChangeFun('edit'); }}>
                        <img alt={messages.groupTree_edit} src={editActiveSvg} /> <FormattedMessage id="groupTree_edit" />
                      </Button>
                    </Col>
                    <Col span={8}>
                      <Button type="link" className={styles['group-detail-button']} onClick={() => { this.drawerShowChangeFun('detail'); }}>
                        <img alt={messages.groupTree_detail} src={detailActiveSvg} /> <FormattedMessage id="groupTree_detail" />
                      </Button>
                    </Col>
                  </Row>
                  <Row gutter={20}>
                    <Col span={8}>
                      <Button type="link" className={styles['group-insert-button']} onClick={() => { this.drawerShowChangeFun('insert'); }}>
                        <img alt={messages.groupTree_insert} src={insertActiveSvg} /> <FormattedMessage id="groupTree_insert" />
                      </Button>
                    </Col>
                    <Col span={8}>
                      <Button type="link" className={styles['group-delete-button']} onClick={this.deleteGroupFun}>
                        <img alt={messages.groupTree_delete} src={deleteActiveSvg} /> <FormattedMessage id="groupTree_delete" />
                      </Button>
                    </Col>
                  </Row>
                </div>
              )
          }
      </div>
    );
  }
}
export default connect(
  state => ({
    slectTreeId: state.groupTreeReducers.slectTreeId,
  }),
  dispatch => ({
    changeVisibleKey: (data) => {
      dispatch({ type: 'tree/CHANGE_VISIBLEkEY_ACTION', payload: data });
    },
    deleteGroup: (data) => {
      dispatch({ type: 'tree/DELETE_TREE_ACTION', payload: data });
    },
  }),
)(injectIntl(GroupHandle));
