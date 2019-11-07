// 用户列表自定义显示列公共组件
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Popover, Checkbox, Form,
  Button, Icon, message,
  // Radio
} from 'antd';
import { injectIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import styles from './index.module.less';

class ColumnCustomForm extends Component {
  static propTypes = {
    customFun: PropTypes.func.isRequired, // // 提交方法(返回参数:newColumnArr:为表格新的显示列数组)
    columns: PropTypes.array.isRequired, // 所需列参数:columns
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      allColumn: [],
      curShowColumn: { fixedNum: 0 },
      checkAll: true,
      indeterminate: false,
      visible: false,
    };
  }

  componentDidMount() {
    const { columns } = this.props;
    this.renderColumns(columns);
  }

  componentWillReceiveProps = (nextProps) => {
    const { columns } = nextProps;
    const { allColumn } = this.state;
    if (allColumn.length === 0) {
      this.renderColumns(columns);
    }
  }

  // 列赋值
  renderColumns=(columns) => {
    const curShowColumn = { fixedNum: 0 };
    columns.map((value) => {
      curShowColumn[value.key] = true;
      return value;
    });
    this.setState({
      allColumn: columns,
      curShowColumn,
    });
  }

  // 显示隐藏自定义显示列窗口
  hideMenu=(value) => {
    this.setState({
      visible: value,
    });
  }

  // 获取列表当前显示列
  getCurrentShowColumn=() => {
    const { curShowColumn, allColumn } = this.state;
    const newColumns = [];
    allColumn.map((value) => {
      if (curShowColumn[value.key]) {
        newColumns.push(value);
      }
      return value;
    });
    return newColumns;
  }

  // 提交
  handleSubmit=(e) => {
    e.preventDefault();
    const { curShowColumn } = this.state;
    let checkNum = 0;
    Object.keys(curShowColumn).map((value) => {
      if (value !== 'no' && curShowColumn[value] === true) {
        checkNum += 1;
      }
      return value;
    });
    if (checkNum < 1) {
      const { intl: { messages } } = this.props;
      message.warning(messages.columnCustom_least_item);
      return;
    }

    const { customFun } = this.props;
    const newColumnArr = this.getCurrentShowColumn();
    customFun(newColumnArr);
    this.hideMenu(false);
  }

  // 全选显示列
  checkAllFun=(e) => {
    const checkFlag = e.target.checked;
    const { curShowColumn } = this.state;
    Object.keys(curShowColumn).map((value) => {
      if (value !== 'fixedNum' && value !== 'no') {
        curShowColumn[value] = checkFlag;
      }
      return value;
    });
    this.setState({
      checkAll: checkFlag,
      indeterminate: false,
      curShowColumn,
    });
  }

  // 列显示勾选变化
  checkChange=(key, e) => {
    const { curShowColumn } = this.state;
    let checkNum = 0;
    let checkAllFlag = false;
    Object.keys(curShowColumn).map((value) => {
      if (value !== 'no' && curShowColumn[value] === true) {
        checkNum += 1;
      }
      return value;
    });
    const checkFlag = e.target.checked;
    if (!checkFlag && checkNum <= 1) {
      const { intl: { messages } } = this.props;
      message.warning(messages.columnCustom_least_item);
      return;
    }
    let num = 2;
    if (curShowColumn.no !== undefined) {
      num = 3;
    }
    if (checkFlag && checkNum === Object.keys(curShowColumn).length - num) {
      checkAllFlag = true;
    }
    curShowColumn[key] = checkFlag;
    this.setState({
      curShowColumn,
      indeterminate: !checkAllFlag,
      checkAll: checkAllFlag,
    });
  }

  // 固定列勾选变化
  onRadioChange=(e) => {
    const { curShowColumn } = this.state;
    curShowColumn.fixedNum = e.target.value;
    this.setState({
      curShowColumn,
    });
  }

  render() {
    // curShowColumn: { fixedNum }
    const { allColumn, checkAll, indeterminate, visible } = this.state;
    return (
      <Popover
        content={(
          <div className={styles['dropdown-wrapper']}>
            <div className={styles['dropdown-header']}>
              <Icon type="setting" /> <FormattedMessage id="columnCustom_setting" />
            </div>
            <div className={styles['show-sort-header']}>
              <FormattedMessage id="columnCustom_show_sort" />
            </div>
            <Checkbox
              indeterminate={indeterminate}
              onChange={this.checkAllFun}
              checked={checkAll}
              style={{ margin: '6px 0 0 13px' }}
            >
              <FormattedMessage id="columnCustom_all_show" />
            </Checkbox>
            <Form>
              <div className={styles['dropdown-sort-wrapper']}>
                {allColumn.map(item => (
                  item.key !== 'no'
                    ? (
                      <Checkbox
                        key={item.key}
                        style={{ width: '100%', marginLeft: 8 }}
                        checked={this.state.curShowColumn[item.key]}
                        onChange={(e) => {
                          this.checkChange(item.key, e);
                        }}
                      >{item.title}
                      </Checkbox>
                    )
                    : null
                ))}
              </div>
              {/* <div className={styles['show-sort-header']}>
                <FormattedMessage id="organizationAndUser_table_isactive" />
              </div>
              <Radio.Group
                value={fixedNum}
                onChange={this.onRadioChange}
                className={styles['dropdown-sort-radio']}
              >
                <Radio value={1}>
                  <FormattedMessage id="columnCustom_few_columns" values={{ num: 1 }} />
                </Radio>
                <Radio value={2}>
                  <FormattedMessage id="columnCustom_few_columns" values={{ num: 2 }} />
                </Radio>
                <Radio value={3}>
                  <FormattedMessage id="columnCustom_few_columns" values={{ num: 3 }} />
                </Radio>
                <Radio value={0}>
                  <FormattedMessage id="columnCustom_few_columns" values={{ num: 4 }} />
                </Radio>
              </Radio.Group> */}
              <Form.Item>
                <Button type="primary" onClick={this.handleSubmit}>
                  <FormattedMessage id="organizationAndUser_confirm" />
                </Button>
                <Button onClick={() => { this.hideMenu(false); }}>
                  <FormattedMessage id="organizationAndUser_cancel" />
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}
        trigger="click"
        placement="bottomRight"
        visible={visible}
        onVisibleChange={(modalvisible) => {
          if (!modalvisible) {
            this.hideMenu(false);
          }
        }}
      >
        <Button type="link" className={styles['list-custom-button']} onClick={() => { this.hideMenu(true); }}>
          <Icon type="setting" />
        </Button>
      </Popover>
    );
  }
}
export default connect()(injectIntl(ColumnCustomForm));
