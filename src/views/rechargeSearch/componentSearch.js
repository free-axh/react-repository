import React, { Component } from 'react';
import {
  DatePicker,
  Select,
  Button,
  Form,
  Input,
} from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { injectIntl } from 'react-intl';
import {
  getToday,
} from '../../utils/function';
import 'moment/locale/zh-cn';
import styles from './index.module.less';
import DateExtraFooter from '../../common/dateExtraFooter';

const { Option } = Select;

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

class ComponentSearch extends Component {
  // 属性声明
  static propTypes ={
    form: PropTypes.object.isRequired,
    currLocale: PropTypes.string.isRequired,
    onSubmit: PropTypes.func,
    onExport: PropTypes.func,
    intl: PropTypes.object.isRequired,
  };

  static defaultProps={
    onSubmit: null,
    onExport: null,
  }

  constructor(props) {
    super(props);

    const today = getToday();
    this.state = {
      dateVisible: false,
      startDate: `${today} 00:00:00`,
      endDate: `${today} 23:59:59`,
      selectNumder: false,
      selectDate: false,
    };
  }

  componentDidMount() {
    const {
      currLocale,
    } = this.props;

    // 多语言切换
    if (currLocale === 'zh') {
      moment.locale('zh-cn');
    } else {
      moment.locale('en-US');
    }
  }

  // 查询(type:0查询，1导出)
  handleSubmit = (e, type) => {
    e.preventDefault();

    const {
      startDate,
      endDate,
    } = this.state;
    const { form } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        const {
          onSubmit,
          onExport,
        } = this.props;

        const params = {
          startTime: startDate,
          endTime: endDate,
          type: values.type ? values.type : '',
          order: values.number ? values.number : '',
        };
        if (type === 0 && onSubmit) {
          onSubmit(params);
        } else if (type === 1 && onExport) {
          onExport();
        }
      }
    });
  };

  // 日期改变
  onChangeDate=(dates, date) => {
    this.setState({
      startDate: date[0],
      endDate: date[1],
    });
  }

  // 日期确定按钮
  onOkDate=(value) => {
    this.setState({
      dateVisible: false,
      startDate: moment(value[0]).format(dateFormat),
      endDate: moment(value[1]).format(dateFormat),
    });
  }

  // 日历显示额外内容
  renderExtraFooter=() => (
    <DateExtraFooter
      type={2}
      callBackFun={this.searchHandler}
    />
  )

  searchHandler=(start, end) => {
    this.setState({
      startDate: `${start} 00:00:00`,
      endDate: `${end} 23:59:59`,
      dateVisible: false,
    });
  }

  showDate=(e) => {
    if (e.target.className === 'ant-calendar-range-picker-input') {
      this.setState({
        dateVisible: true,
      });
    }
  }

  // 查询方式选中
  selectChange=(value) => {
    this.setState({
      selectNumder: value === '1',
      selectDate: value === '2',
    });
  }

  // 重置
  resetHandler=() => {
    const { form } = this.props;
    form.resetFields();

    const today = getToday();
    this.setState({
      selectNumder: false,
      selectDate: false,
      startDate: `${today} 00:00:00`,
      endDate: `${today} 23:59:59`,
    });
  }

  render() {
    const {
      form,
      intl,
    } = this.props;

    const {
      startDate,
      endDate,
      dateVisible,
      selectNumder,
      selectDate,
    } = this.state;

    const { getFieldDecorator } = form;

    return (
      <Form
        layout="inline"
      >
        {/* input */}
        {/* 查询方式 */}
        <Form.Item>
          {getFieldDecorator('type', {
            rules: [
              {
                required: true,
                message: intl.messages.rechargeSearch_typeEmpty,
              },
            ],
          })(
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder={intl.messages.rechargeSearch_placehodler1}
              optionFilterProp="children"
              onChange={this.selectChange}
            >
              <Option value="1">{intl.messages.rechargeSearch_options1}</Option>
              <Option value="2">{intl.messages.rechargeSearch_options2}</Option>
            </Select>,
          )}
        </Form.Item>
        {/* 订单号 */}
        {
          selectNumder && (
          <Form.Item>
            {getFieldDecorator('number', {
              rules: [
                {
                  required: true,
                  message: intl.messages.rechargeSearch_numberEmpty,
                },
              ],
            })(
              <Input
                allowClear
                max={50}
                placeholder={intl.messages.rechargeSearch_placehodler2}
                autoComplete="off"
              />,
            )}
          </Form.Item>
          )
        }

        {/* 日期范围 */}
        {
          selectDate && (
          <Form.Item>
            <span
              style={{ cursor: 'pointer' }}
              onClick={e => this.showDate(e)}
            >
              <RangePicker
                open={dateVisible}
                showTime={{ format: 'HH:mm:ss' }}
                format="YYYY-MM-DD HH:mm:ss"
                placeholder={[
                  intl.messages.rechargeSearch_startTime,
                  intl.messages.rechargeSearch_endTime,
                ]}
                value={[moment(startDate, dateFormat), moment(endDate, dateFormat)]}
                onChange={this.onChangeDate}
                onOk={this.onOkDate}
                allowClear={false}
                renderExtraFooter={this.renderExtraFooter}
              />
            </span>
          </Form.Item>
          )
        }

        {/* btn */}
        <Form.Item>
          <Button
            type="primary"
            onClick={e => this.handleSubmit(e, 0)}
            className={styles.mr15}
          >
            {intl.messages.rechargeSearch_search}
          </Button>
          <Button
            type="primary"
            className={styles.mr15}
            onClick={e => this.handleSubmit(e, 1)}
          >
            {intl.messages.rechargeSearch_export}
          </Button>
          <Button
            className={styles.mr15}
            onClick={this.resetHandler}
          >
            {intl.messages.rechargeSearch_reset}
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const SearchComponent = Form.create({ name: 'recharge_search_from' })(ComponentSearch);
export default connect(
  state => ({
    currLocale: state.rootReducers.currLocale,
  }),
  null,
)(injectIntl(SearchComponent));