// 分配用户角色
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Button, Drawer, Checkbox, Alert,
} from 'antd';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import styles from './index.module.less';

class AssignRoles extends Component {
  static propTypes = {
    selectRowData: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
    currentUserRoles: PropTypes.array.isRequired,
    updateUserRoles: PropTypes.func.isRequired,
    changeVisibleKey: PropTypes.func.isRequired,
    visibleKey: PropTypes.string,
  }

  static defaultProps = {
    visibleKey: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      currentUserRoles: [],
      hasRoles: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    const { selectRowData, currentUserRoles: newcurrentUserRoles } = nextProps;
    const { hasRoles, currentUserRoles } = this.state;
    if (currentUserRoles && currentUserRoles.length === 0) {
      this.setState({
        currentUserRoles: newcurrentUserRoles,
      });
    }
    if (selectRowData.roleIds) {
      if (hasRoles !== selectRowData.roleIds.split(',')) {
        const newRoles = selectRowData.roleIds.split(',');
        const newHasRoles = {};
        newRoles.map((value) => {
          newHasRoles[value] = true;
          return value;
        });
        this.setState({
          hasRoles: newHasRoles,
        });
      }
    } else {
      this.setState({
        hasRoles: {},
      });
    }
  }

  // 表单提交
  handleSubmit = () => {
    const { updateUserRoles, currentUserRoles, selectRowData: { username } } = this.props;
    const { hasRoles } = this.state;
    const param = {
      username,
      rolesStr: [],
    };
    currentUserRoles.map((value) => {
      if (hasRoles[value.id]) {
        param.rolesStr.push(value);
      }
      return value;
    });
    param.rolesStr = JSON.stringify(param.rolesStr);
    updateUserRoles(param);
  };

  // 角色勾选变化
  checkChange=(key, e) => {
    const { hasRoles } = this.state;
    const checkFlag = e.target.checked;
    hasRoles[key] = checkFlag;
    this.setState({
      hasRoles,
    });
  }

  // 关闭抽屉
  drawerCloseFun=() => {
    const { changeVisibleKey } = this.props;
    changeVisibleKey('clear');
  }

  render() {
    const { visibleKey, intl: { messages } } = this.props;
    const { currentUserRoles } = this.state;

    return (
      <Drawer
        title={<FormattedMessage id="organizationAndUser_assign_roles" />}
        width={500}
        onClose={this.drawerCloseFun}
        visible={visibleKey === 'assignRoles'}
      >
        {
          currentUserRoles && currentUserRoles.length !== 0
            ? (
              <div>
                {currentUserRoles.map(item => (
                  <Checkbox
                    key={item.id}
                    style={{ width: '100%', marginLeft: 8, marginBottom: 15 }}
                    checked={this.state.hasRoles[item.id]}
                    onChange={(e) => {
                      this.checkChange(item.id, e);
                    }}
                  >{item.name}
                  </Checkbox>
                ))}
              </div>
            )
            : <Alert message={messages.organizationAndUser_no_roles} type="error" className={styles['alert-message']} />
        }
        <div className={styles['drawer-footerBtns']}>
          <Button onClick={this.handleSubmit} type="primary">
            <FormattedMessage id="organizationAndUser_confirm" />
          </Button>
          <Button onClick={this.drawerCloseFun}>
            <FormattedMessage id="organizationAndUser_cancel" />
          </Button>
        </div>
      </Drawer>
    );
  }
}
export default connect(
  state => ({
    currentUserRoles: state.organizationAndUserReducers.currentUserRoles,
    selectRowData: state.organizationAndUserReducers.selectRowData,
    visibleKey: state.organizationAndUserReducers.visibleKey,
  }),
  dispatch => ({
    updateUserRoles: (payload) => {
      dispatch({ type: 'user/UPDATE_USERROLE_ACTION', payload });
    },
    changeVisibleKey: (data) => {
      dispatch({ type: 'user/CHANGE_VISIBLEkEY_ACTION', payload: data });
    },
  }),
)(injectIntl(AssignRoles));
