import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button, DatePicker, Popover, Icon, Input, Upload, message } from 'antd';
import PropTypes from 'prop-types';
import { getStore } from '../../utils/localStorage';
import styles from './index.module.less';

// const { confirm } = Modal;

const { RangePicker } = DatePicker;

class QualifiedSeniorSearchList extends Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    qualifiedDataSearchConditions: PropTypes.object.isRequired,
    getQualifiedTableData: PropTypes.func.isRequired,
    downloadImportSearchTemplate: PropTypes.func.isRequired,
    saveQualifiedTableSelectionData: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const token = getStore('token');
    this.state = {
      pickerEndTime: '',
      pickerStartTime: '',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      visible: false,
      importSearchPopoverVisible: false,
    };
    this.onPickerChange = this.onPickerChange.bind(this);
    this.downLoadImportTemplate = this.downLoadImportTemplate.bind(this);
    this.searchConditionsReset = this.searchConditionsReset.bind(this);
    this.importChange = this.importChange.bind(this);
    this.onVisibleChange = this.onVisibleChange.bind(this);
    this.searchIconClick = this.searchIconClick.bind(this);
    this.importSearchPopover = this.importSearchPopover.bind(this);
  }

  /**
   * 日期选择事件
   */
  onPickerChange = (dates, date) => {
    console.log('dates', dates);
    this.setState({
      pickerEndTime: date[1],
      pickerStartTime: date[0],
    });
  }

  /**
   * 合格列表查询
   */
  qualifiedTableDataSearch = (e) => {
    e.preventDefault();
    const { form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        this.setState({ visible: false });
        const { imei } = values;
        const { pickerStartTime, pickerEndTime } = this.state;
        const { qualifiedDataSearchConditions, getQualifiedTableData } = this.props;
        qualifiedDataSearchConditions.simpleQueryParam = imei || '';
        qualifiedDataSearchConditions.checkQualifiedStartTime = pickerStartTime;
        qualifiedDataSearchConditions.checkQualifiedEndTime = pickerEndTime;
        qualifiedDataSearchConditions.type = 0;
        getQualifiedTableData(qualifiedDataSearchConditions);
      }
    });
  }

  /**
   * 下载导入查询模板
   */
  downLoadImportTemplate = () => {
    const { downloadImportSearchTemplate } = this.props;
    downloadImportSearchTemplate();
    this.setState({ visible: false, importSearchPopoverVisible: false });
  }

  /**
   * 重置检测列表查询条件
   */
  searchConditionsReset = () => {
    const { form: { resetFields } } = this.props;
    resetFields();
    this.setState({
      pickerEndTime: '',
      pickerStartTime: '',
    });
  }

  /**
   * 导入文件状态改变事件
   */
  importChange = (info) => {
    this.setState({ visible: false, importSearchPopoverVisible: false });
    if (info.file.status === 'done') {
      message.success('导入查询成功');
      const {
        qualifiedDataSearchConditions,
        getQualifiedTableData,
        saveQualifiedTableSelectionData,
      } = this.props;
      saveQualifiedTableSelectionData(null);
      qualifiedDataSearchConditions.type = 1;
      getQualifiedTableData(qualifiedDataSearchConditions);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  /**
   * 搜索图标点击事件
   */
  searchIconClick = () => {
    const { visible } = this.state;
    this.setState({ visible: !visible });
  }

  /**
   * 显示隐藏的回调
   */
  onVisibleChange = (visible) => {
    this.setState({ visible });
  }

  /**
   * 导入查询气泡显示隐藏的回调
   */
  importSearchPopover = (visible) => {
    this.setState({ importSearchPopoverVisible: visible });
  }

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { headers, visible, importSearchPopoverVisible } = this.state;

    return (
      <Popover
        content={(
          <Form onSubmit={this.qualifiedTableDataSearch} style={{ width: '340px' }}>
            <Form.Item>
              <span><Icon type="search" />&nbsp;搜索</span>
            </Form.Item>
            <Form.Item label="IMEI">
              {
                getFieldDecorator('imei')(
                  <Input placeholder="请输入" allowClear autocomplete="off" />,
                )
              }
            </Form.Item>
            <Form.Item label="检测合格时间">
              {
                getFieldDecorator('date')(
                  <RangePicker
                    onChange={this.onPickerChange}
                  />,
                )
              }
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              &nbsp;
              <Popover
                content={(
                  <div>
                    <Button type="primary" onClick={this.downLoadImportTemplate}>下载模板</Button>
                      &nbsp;
                    <Upload
                      accept=".xls,.xlsx"
                      // name="file"
                      action="/api/device/qualified/importSearch"
                      onChange={this.importChange}
                      headers={headers}
                      showUploadList={false}
                    >
                      <Button type="primary">导入文件</Button>
                    </Upload>
                  </div>
                )}
                visible={importSearchPopoverVisible}
                onVisibleChange={this.importSearchPopover}
                autoAdjustOverflow={false}
              >
                <Button type="primary">导入查询</Button>
              </Popover>
              &nbsp;
              <Button onClick={this.searchConditionsReset}>
                清空
              </Button>
            </Form.Item>
          </Form>
      )}
        trigger="click"
        placement="bottomRight"
        visible={visible}
        onVisibleChange={this.onVisibleChange}
      >
        <Icon type="search" onClick={this.searchIconClick} className={styles['search-icon']} />
      </Popover>
    );
  }
}

export default connect(
  state => ({
    qualifiedDataSearchConditions: state.terminaDetectReducers.qualifiedDataSearchConditions,
  }),
  dispatch => ({
    getQualifiedTableData: (data) => {
      dispatch({ type: 'terminaDetect/GET_QUALIFIED_TABLE_DATA', payload: data });
    },
    downloadImportSearchTemplate: () => {
      dispatch({ type: 'terminaDetect/DOWNLOAD_IMPORT_SEARCH_TEMPLATE' });
    },
    saveQualifiedTableSelectionData: (data) => {
      dispatch({ type: 'terminaDetect/SAVE_QUALIFIED_TABLE_SELECTION_DATA', payload: data });
    },
  }),
)(Form.create({ name: 'qualified-senior-search-form' })(QualifiedSeniorSearchList));
