import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Drawer, Form, Input, Button, Tooltip, Icon, Checkbox, TreeSelect } from 'antd';
import PropTypes from 'prop-types';
import { getStore } from '../../utils/localStorage';

class terminalInfoBulkChangesModal extends Component {
  static propTypes = {
    getGroupTreeData: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    detectionTableSelectionData: PropTypes.array,
    qualifiedTableSelectionData: PropTypes.array,
    tabsActiveKey: PropTypes.string.isRequired,
    qualifiedData: PropTypes.string,
    detectionBatchEditModalState: PropTypes.number.isRequired,
    qualifiedEditModalState: PropTypes.number.isRequired,
    setDetectionBatchEditModalState: PropTypes.func.isRequired,
    setQualifiedEditModalState: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
    groupTreeData: PropTypes.array.isRequired,
    terminalInfoBulkChangesModalCancel: PropTypes.func.isRequired,
    detectionBatchEdit: PropTypes.func.isRequired,
    qualifiedBatchEdit: PropTypes.func.isRequired,
  }

  static defaultProps = {
    detectionTableSelectionData: null,
    qualifiedTableSelectionData: null,
    qualifiedData: null,
  }

  constructor(props) {
    super(props);
    const username = getStore('username');
    this.state = {
      visible: false,
      username,
      imeiText: '',
      tabsActiveKey: null,
      isThresholdValueInputDisabled: true,
      treeSelectValue: '',
      deviceIds: '',
      isChecked: false,
      thresholdValueInputValue: 200,
    };
    this.checkboxChange = this.checkboxChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.treeSelectChange = this.treeSelectChange.bind(this);
  }

  componentDidMount() {
    const { username } = this.state;
    const { getGroupTreeData } = this.props;
    if (username === 'admin') {
      getGroupTreeData();
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      visible,
      detectionTableSelectionData,
      qualifiedTableSelectionData,
      tabsActiveKey,
      qualifiedData,
      detectionBatchEditModalState,
      qualifiedEditModalState,
    } = nextProps;
    let imeiText;
    let treeSelectValue = '';
    let deviceIds = '';
    if (tabsActiveKey === '2' && qualifiedData) {
      const obj = JSON.parse(qualifiedData);
      imeiText = obj.imei;
      treeSelectValue = obj.groupId;
      deviceIds = obj.id;
    } else {
      imeiText = tabsActiveKey === '1' ? this.getImeiText(detectionTableSelectionData) : this.getImeiText(qualifiedTableSelectionData);
      deviceIds = tabsActiveKey === '1' ? '' : this.getDeviceIds(qualifiedTableSelectionData);
    }
    this.setState({
      visible,
      imeiText,
      tabsActiveKey,
      treeSelectValue,
      deviceIds,
    });
    /**
     * 关闭检测列表修改modal弹窗
     */
    if (detectionBatchEditModalState === 1) {
      const { setDetectionBatchEditModalState } = this.props;
      setDetectionBatchEditModalState(0);
      this.onClose();
    }

    /**
     * 关闭合格列表修改modal弹窗
     */
    if (qualifiedEditModalState === 1) {
      const { setQualifiedEditModalState } = this.props;
      setQualifiedEditModalState(0);
      this.onClose();
    }
  }

  /**
   * 组装IMEI数据
   */
  getImeiText = (data) => {
    if (data && data.length) {
      const text = [];
      for (let i = 0; i < data.length; i += 1) {
        text.push(data[i].imei);
      }
      return text.join(',');
    }
    return '';
  }

  /**
   * 组装终端id
   */
  getDeviceIds = (data) => {
    if (data && data.length) {
      const ids = [];
      for (let i = 0; i < data.length; i += 1) {
        ids.push(data[i].id);
      }
      return ids.join(',');
    }
    return '';
  }

  onClose = () => {
    this.setState({
      visible: false,
      isChecked: false,
      isThresholdValueInputDisabled: true,
    });
    const { terminalInfoBulkChangesModalCancel, form: { resetFields } } = this.props;
    resetFields();
    terminalInfoBulkChangesModalCancel();
  };

  /**
   * checkbox多选框状态变化事件
   */
  checkboxChange = (e) => {
    const { target: { checked } } = e;
    console.log('checkbox多选框状态变化事件', e);
    this.setState({ isThresholdValueInputDisabled: !checked, isChecked: checked });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { form: { validateFields }, detectionBatchEdit, qualifiedBatchEdit } = this.props;
    validateFields((err, values) => {
      if (!err) {
        const { thresholdValue } = values;
        const { treeSelectValue, imeiText, tabsActiveKey, deviceIds, isChecked } = this.state;
        if (tabsActiveKey === '1') {
          const params = {
            internationalMobiles: imeiText,
            groupId: treeSelectValue,
            onlineLocationIntervalThreshold: isChecked ? thresholdValue : '',
          };
          detectionBatchEdit(params);
        } else if (tabsActiveKey === '2') {
          const params = {
            organizationId: treeSelectValue,
            deviceIds,
          };
          qualifiedBatchEdit(params);
        }
      }
    });
  }

  /**
   * 组织树选中事件
   */
  treeSelectChange = (value) => {
    this.setState({ treeSelectValue: value });
  }

  render() {
    const {
      visible,
      username,
      imeiText,
      tabsActiveKey,
      isThresholdValueInputDisabled,
      treeSelectValue,
      isChecked,
      thresholdValueInputValue,
    } = this.state;

    const { form: { getFieldDecorator }, groupTreeData, qualifiedData } = this.props;

    return (
      <Drawer
        title={qualifiedData ? '修改终端信息' : '批量修改终端信息'}
        visible={visible}
        closable
        onClose={this.onClose}
        width={500}
      >
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="IMEI">
            <Input value={imeiText} disabled />
          </Form.Item>
          {
            (tabsActiveKey === '1' && username === 'admin') || tabsActiveKey === '2' ? (
              <Form.Item label="所属组织">
                <TreeSelect
                  showSearch
                  // style={{ width: 300 }}
                  value={treeSelectValue}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="Please select"
                  allowClear
                  treeDefaultExpandAll
                  onChange={this.treeSelectChange}
                  treeData={groupTreeData}
                />
              </Form.Item>
            ) : null
          }
          {/* 上线与定位时间间隔阈值 */}
          {
            tabsActiveKey === '1' ? (
              <Form.Item
                label={(
                  <span>
                    <Checkbox checked={isChecked} onChange={this.checkboxChange} />
                    &nbsp;
                    <Tooltip title="当上线时间与定位时间的间隔超过该阈值(秒)时，为异常状态">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                    &nbsp;
                    上线与定位时间间隔阈值
                  </span>
                )}
              >
                {getFieldDecorator('thresholdValue', {
                  initialValue: thresholdValueInputValue,
                  rules: [
                    {
                      type: 'number',
                      min: 0,
                      max: 999,
                      transform: (value) => {
                        if (value) {
                          return Number(value);
                        }
                        return value;
                      },
                      message: '请输入数字，输入范围为0-3位',
                    },
                  ],
                })(
                  <Input disabled={isThresholdValueInputDisabled} placeholder="请输入数字，单位秒" />,
                )}
              </Form.Item>
            ) : null
          }
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e8e8e8',
              padding: '10px 24px',
              textAlign: 'left',
              left: 0,
              background: '#fff',
              borderRadius: '0 0 4px 4px',
            }}
          >
            <Button type="primary" htmlType="submit">
              提交
            </Button>
            &nbsp;
            <Button
              style={{
                marginRight: 8,
              }}
              onClick={this.onClose}
            >
              关闭
            </Button>
          </div>
        </Form>
      </Drawer>
    );
  }
}

export default connect(
  state => ({
    detectionTableSelectionData: state.terminaDetectReducers.detectionTableSelectionData,
    qualifiedTableSelectionData: state.terminaDetectReducers.qualifiedTableSelectionData,
    groupTreeData: state.terminaDetectReducers.groupTreeData,
    detectionBatchEditModalState: state.terminaDetectReducers.detectionBatchEditModalState,
    qualifiedEditModalState: state.terminaDetectReducers.qualifiedEditModalState,
  }),
  dispatch => ({
    getGroupTreeData: () => {
      dispatch({ type: 'terminaDetect/GET_GROUP_TREE_DATA' });
    },
    detectionBatchEdit: (data) => {
      dispatch({ type: 'terminaDetect/DETECTION_BATCH_EDIT', payload: data });
    },
    qualifiedBatchEdit: (data) => {
      dispatch({ type: 'terminaDetect/QUALIFIED_BATCH_EDIT', payload: data });
    },
    setDetectionBatchEditModalState: (data) => {
      dispatch({ type: 'terminaDetect/SET_DETECTION_BATCH_EDIT_STATE', payload: data });
    },
    setQualifiedEditModalState: (data) => {
      dispatch({ type: 'terminaDetect/SET_QUALIFIED_EDIT_STATE', payload: data });
    },
  }),
)(Form.create({ name: 'form-batch-edit' })(terminalInfoBulkChangesModal));
