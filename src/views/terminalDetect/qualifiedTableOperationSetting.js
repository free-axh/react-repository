import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Drawer, Form, Tabs, Row, Col, Typography, Button } from 'antd';
import PropTypes from 'prop-types';
import styles from './index.module.less';
import { getStore } from '../../utils/localStorage';

const { TabPane } = Tabs;
const { Title } = Typography;

class QualifiedTableOperationSetting extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    details: PropTypes.object,
    operationSettingModalCancel: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  }

  static defaultProps = {
    details: null,
  }

  data = {
    details: {
      imei: '',
      group: '',
      qualifiedTime: '',
      people: '',
    },
  }

  constructor(props) {
    super(props);
    const username = getStore('username');
    this.state = {
      visible: false,
      details: this.data.details,
      username,
    };
    this.onClose = this.onClose.bind(this);
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { visible, details } = nextProps;
    this.setState({
      visible,
      details: details === null ? this.data.details : details,
    });
  }

  onClose = () => {
    const { operationSettingModalCancel } = this.props;
    if (operationSettingModalCancel) {
      operationSettingModalCancel();
    }
  }

  edit = () => {
    const { onEdit } = this.props;
    const { details } = this.state;
    if (onEdit) {
      onEdit(details);
    }
  }

  delete = () => {
    const { onDelete } = this.props;
    const { details } = this.state;
    if (onDelete) {
      onDelete(details);
    }
  }

  render() {
    const { visible, details, username } = this.state;

    return (
      <Drawer
        title="合格终端详情"
        visible={visible}
        closable
        onClose={this.onClose}
        width={username === 'admin' ? 700 : 500}
        mask={false}
      >
        <div className={styles['operation-setting-details']} style={{ padding: username === 'admin' ? '0 200px 0 0' : '0' }}>
          <Tabs defaultActiveKey="1" className={styles['detail-tabs']}>
            <TabPane tab="基本信息" key="1">
              <Row>
                <Col span={8} className={styles.col}>
                  <span className={styles.title}>IMEI</span>
                  <span className={styles.value}>{details.imei}</span>
                </Col>
                <Col span={8} className={styles.col}>
                  <span className={styles.title}>所属组织</span>
                  <span className={styles.value}>{details.group}</span>
                </Col>
                <Col span={8} className={styles.col}>
                  <span className={styles.title}>检测合格时间</span>
                  <span className={styles.value}>{details.qualifiedTime}</span>
                </Col>
                <Col span={8} className={styles.col}>
                  <span className={styles.title}>检测人员</span>
                  <span className={styles.value}>{details.people}</span>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </div>
        {
          username === 'admin' ? (
            <div className={styles['operation-setting-btn']}>
              <Title className={styles.title}>操作</Title>
              <div className={styles.btn}>
                <Button onClick={this.edit}>修改</Button>
              </div>
              <div className={styles.btn}>
                <Button onClick={this.delete}>删除</Button>
              </div>
            </div>
          ) : null
        }
      </Drawer>
    );
  }
}

export default connect(
  null,
  null,
)(Form.create({ name: 'form-operation-setting' })(QualifiedTableOperationSetting));
