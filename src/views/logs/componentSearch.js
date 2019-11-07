import React, { Component } from 'react';
import {
  DatePicker,
  Input,
  Button,
  Form,
} from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import moment from 'moment';
import {
  getToday,
} from '../../utils/function';
import 'moment/locale/zh-cn';
import styles from './index.module.less';
import DateExtraFooter from '../../common/dateExtraFooter';

// const { Panel } = Collapse;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

class ComponentSearch extends Component {
  // 属性声明
  static propTypes ={
    form: PropTypes.object.isRequired,
    currLocale: PropTypes.string.isRequired,
    onSubmit: PropTypes.func,
    listExport: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
  };

  static defaultProps={
    onSubmit: null,
    // onExport: null,
  }

  constructor(props) {
    super(props);

    const today = getToday();
    this.state = {
      dateVisible: false,
      startDate: `${today} 00:00:00`,
      endDate: `${today} 23:59:59`,
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
  renderExtraFooter=() => {
    const { startDate } = this.state;

    return (
      <DateExtraFooter
        startDate={startDate}
        callBackFun={this.searchHandler}
      />
    );
  }

  // 日期快捷按钮回调
  searchHandler=(start, end) => {
    this.setState({
      startDate: `${start} 00:00:00`,
      endDate: `${end} 23:59:59`,
      dateVisible: false,
    });
  }

  // 显示日历
  showDate=(e) => {
    if (e.target.className === 'ant-calendar-range-picker-input') {
      this.setState({
        dateVisible: true,
      });
    }
  }

  // 查询提交
  handleSubmit = (e, type) => {
    e.preventDefault();
    const { form } = this.props;
    const {
      startDate,
      endDate,
    } = this.state;

    form.validateFields((err, values) => {
      // console.log('表单数据', values);
      if (!err) {
        const {
          onSubmit,
          listExport,
        } = this.props;

        const params = {
          startTime: startDate,
          endTime: endDate,
          username: values.userName ? values.userName : '',
          message: values.message ? values.message : '',
        };

        if (type === 0 && onSubmit) { // 查询
          onSubmit(params);
        } else if (type === 1 && listExport) { // 导出
          listExport(params);
        }
      }
    });
  };

  render() {
    const {
      form,
      intl,
    } = this.props;

    const {
      startDate,
      endDate,
      dateVisible,
    } = this.state;

    const { getFieldDecorator } = form;

    return (
      <Form
        layout="inline"
      >
        {/* input */}
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
                <FormattedMessage
                  id="logs_startTime"
                />,
                <FormattedMessage
                  id="logs_endTime"
                />,
              ]}
              value={[moment(startDate, dateFormat), moment(endDate, dateFormat)]}
              onChange={this.onChangeDate}
              onOk={this.onOkDate}
              allowClear={false}
              // locale={{
              //   lang: {
              //     ok: '确定',
              //     timeSelect: '选择时间',
              //     month: '月',
              //     year: '年',
              //   },
              // }}
              renderExtraFooter={this.renderExtraFooter}
            />
          </span>

        </Form.Item>

        <Form.Item>
          {getFieldDecorator('userName', {
            // rules: [
            //   {
            //     required: true,
            //     message: Logs_CN.logs_userNameEmpty,
            //   },
            // ],
          })(
            <Input
              className="form-input"
              allowClear
              placeholder={intl.messages.logs_userNamePlaceholder}
              autoComplete="off"
            />,
          )}
        </Form.Item>

        <Form.Item>
          {getFieldDecorator('message')(<Input
            className="form-input"
            allowClear
            placeholder={intl.messages.logs_contentPlaceholder}
            autoComplete="off"
          />)}
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            // htmlType="submit"
            className={styles.mr15}
            onClick={e => this.handleSubmit(e, 0)}
          >
            {<FormattedMessage
              id="logs_search"
            />}
          </Button>
          <Button
            type="primary"
            className={styles.mr15}
            onClick={e => this.handleSubmit(e, 1)}
          >
            {
              <FormattedMessage
                id="logs_export"
              />}
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const searchCon = Form.create({ name: 'log_search_from' })(ComponentSearch);
export default connect(
  state => ({
    currLocale: state.rootReducers.currLocale,
  }),
  dispatch => ({
    listExport: (data) => { // 报表导出
      dispatch({ type: 'logs/LIST_EXPORT_ACTION', data });
    },
  }),
)(injectIntl(searchCon));