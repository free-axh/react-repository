// 用户详情
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Row, Col, Button, Typography,
  Comment, Drawer, Avatar, Tabs, Modal,
} from 'antd';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { getStore } from '../../utils/localStorage';
import styles from './index.module.less';

const { Title } = Typography;
const { TabPane } = Tabs;

class UserDetailForm extends Component {
  static propTypes = {
    changeVisibleKey: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired,
    selectRowData: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    visibleKey: PropTypes.string,
  }

  static defaultProps = {
    visibleKey: null,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  // 关闭详情抽屉
  closeDetailDrawer = () => {
    const { changeVisibleKey } = this.props;
    changeVisibleKey('clear');
  };

  // 打开修改用户抽屉
  editUser=() => {
    const { changeVisibleKey } = this.props;
    changeVisibleKey('editUser');
  }

  // 打开分配角色抽屉
  assignRoles=() => {
    const { changeVisibleKey } = this.props;
    changeVisibleKey('assignRoles');
  }

  // 删除用户
  deleteUserFun=() => {
    const { deleteUser, selectRowData: { id }, intl: { messages } } = this.props;
    Modal.confirm({
      title: messages.organizationAndUser_confirm_title,
      content: messages.organizationAndUser_confirm_content,
      okText: messages.organizationAndUser_confirm_oktxt,
      cancelText: messages.organizationAndUser_cancel,
      onOk: () => {
        deleteUser({
          userIds: id,
        });
      },
    });
  }

  render() {
    const { visibleKey, selectRowData } = this.props;
    const { username, organizationName, isActive, authorizationDateStr,
      realName, gender, mobile, mail,
    } = selectRowData;

    const buttonDisabled = (selectRowData.username === 'admin' || selectRowData.username === getStore('username'));

    return (
      <Drawer
        title={<FormattedMessage id="organizationAndUser_user_detail" />}
        width={700}
        mask={false}
        onClose={this.closeDetailDrawer}
        visible={visibleKey === 'userDetail'}
      >
        <div className={styles['detail-wrapper']}>
          <Comment
            author={<div className={styles['detail-user-name']}>{username}</div>}
            style={{ margin: 0, padding: 0 }}
            avatar={(
              <Avatar
                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                alt="Han Solo"
              />
              )}
            content={(
              <p className={styles['detail-group-name']}>
                {organizationName}
              </p>
             )}
          />
          <Tabs defaultActiveKey="1" className={styles['detail-tabs']}>
            <TabPane tab={<FormattedMessage id="organizationAndUser_basic_info" />} key="1">
              <Row className={styles['detail-info-row']} gutter={16}>
                <Col span={8}>
                  <div className={styles['detail-info-head']}>
                    <FormattedMessage id="organizationAndUser_table_username" />
                  </div>
                  <div className={styles['detail-info-text']}>{username}</div>
                </Col>
                <Col span={8}>
                  <div className={styles['detail-info-head']}>
                    <FormattedMessage id="organizationAndUser_table_organizationname" />
                  </div>
                  <div className={styles['detail-info-text']}>{organizationName}</div>
                </Col>
                <Col span={8}>
                  <div className={styles['detail-info-head']}>
                    <FormattedMessage id="organizationAndUser_table_isactive" />
                  </div>
                  <div className={styles['detail-info-text']}>
                    {isActive
                      ? <FormattedMessage id="organizationAndUser_table_enable" />
                      : <FormattedMessage id="organizationAndUser_table_disable" />
                    }
                  </div>
                </Col>
              </Row>
              <Row className={styles['detail-info-row']} gutter={16}>
                <Col span={8}>
                  <div className={styles['detail-info-head']}>
                    <FormattedMessage id="organizationAndUser_table_authorizationdatestr" />
                  </div>
                  <div className={styles['detail-info-text']}>{authorizationDateStr}</div>
                </Col>
                <Col span={8}>
                  <div className={styles['detail-info-head']}>
                    <FormattedMessage id="organizationAndUser_table_realname" />
                  </div>
                  <div className={styles['detail-info-text']}>{realName}</div>
                </Col>
                <Col span={8}>
                  <div className={styles['detail-info-head']}>
                    <FormattedMessage id="organizationAndUser_table_gender" />
                  </div>
                  <div className={styles['detail-info-text']}>
                    {gender === '1'
                      ? <FormattedMessage id="organizationAndUser_table_man" />
                      : <FormattedMessage id="organizationAndUser_table_woman" />
                      }
                  </div>
                </Col>
              </Row>
              <Row className={styles['detail-info-row']} gutter={16}>
                <Col span={8}>
                  <div className={styles['detail-info-head']}>
                    <FormattedMessage id="organizationAndUser_table_mobile" />
                  </div>
                  <div className={styles['detail-info-text']}>{mobile}</div>
                </Col>
                <Col span={8}>
                  <div className={styles['detail-info-head']}>
                    <FormattedMessage id="organizationAndUser_table_mail" />
                  </div>
                  <div className={styles['detail-info-text']}>{mail}</div>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </div>
        <div className={styles['detail-right-box']}>
          <Title className={styles['panel-title']}>
            <FormattedMessage id="organizationAndUser_user_handle" />
          </Title>
          <Button onClick={this.editUser}>
            <FormattedMessage id="organizationAndUser_edit_user" />
          </Button>
          <Button onClick={this.assignRoles} disabled={buttonDisabled}>
            <FormattedMessage id="organizationAndUser_assign_roles" />
          </Button>
          <Button onClick={this.deleteUserFun} disabled={buttonDisabled}>
            <FormattedMessage id="organizationAndUser_delete_user" />
          </Button>
        </div>
      </Drawer>
    );
  }
}
export default connect(
  state => ({
    selectRowData: state.organizationAndUserReducers.selectRowData,
    visibleKey: state.organizationAndUserReducers.visibleKey,
  }),
  dispatch => ({
    deleteUser: (payload) => {
      dispatch({ type: 'user/DELETE_USER_ACTION', payload });
    },
    changeVisibleKey: (data) => {
      dispatch({ type: 'user/CHANGE_VISIBLEkEY_ACTION', payload: data });
    },
  }),
)(injectIntl(UserDetailForm));
