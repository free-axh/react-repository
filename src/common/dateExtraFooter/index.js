import React, { Component } from 'react';
import {
  Button,
} from 'antd';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import {
  searchDay,
  getToday,
  getCurWeek,
  getLastMonth,
  getCurMonth,
} from '../../utils/function';
import 'moment/locale/zh-cn';
import styles from './index.module.less';

// import dateExtraFooter_CN from '../../utils/locale/zh_CN/dateExtraFooter_CN';

class Index extends Component {
  // 属性声明
  static propTypes ={
    type: PropTypes.number, // 1:前一天，前三天，前七天；2：本周，本月，上月
    callBackFun: PropTypes.func, // 按钮点击回调函数,callBack(start:string开始日期,end:string结束日期)
    startDate: PropTypes.string, // 当type为1，需传入当前选中日期,在此基础上的前一天或前3天...
    intl: PropTypes.object.isRequired,
  };

  static defaultProps={
    startDate: getToday(),
    type: 1,
    callBackFun: null,
  }

  constructor(props) {
    super(props);

    this.state = {
      btnLists: this.getBtnList(),
    };
  }

  // 获取btn列表
  getBtnList=() => {
    const {
      type,
      intl,
    } = this.props;
    let btnList = [
      {
        text: intl.messages.dateExtraFooter_today, // 今天
        type: 'today',
      },
      {
        text: intl.messages.dateExtraFooter_one, // 前一天
        type: 'first',
      },
      {
        text: intl.messages.dateExtraFooter_three, // 前三天
        type: 'three',
      },
      {
        text: intl.messages.dateExtraFooter_seven, // 前七天
        type: 'seven',
      },
    ];

    if (type === 2) {
      btnList = [
        {
          text: intl.messages.dateExtraFooter_today, // 今天
          type: 'today',
        },
        {
          text: intl.messages.dateExtraFooter_week, // 本周
          type: 'curWeek',
        },
        {
          text: intl.messages.dateExtraFooter_month, // 本月
          type: 'curMonth',
        },
        {
          text: intl.messages.dateExtraFooter_lastMonth, // 上月
          type: 'lastMonth',
        },
      ];
    }

    return btnList;
  }

  // 查询
  searchHandler=(type) => {
    const {
      callBackFun,
      startDate,
    } = this.props;

    let start = '';
    let end = '';

    switch (type) {
      case 'today':// 今天
        start = getToday();
        end = getToday();
        break;
      case 'first':// 前1天
        start = searchDay(startDate, -1);
        break;
      case 'three':// 前3天
        start = searchDay(startDate, -3);
        break;
      case 'seven':// 前7天
        start = searchDay(startDate, -7);
        break;
      case 'curWeek':// 本周
        start = getCurWeek().weekStart;
        end = getCurWeek().weekEnd;
        break;
      case 'curMonth':// 本月
        start = getCurMonth().monthStart;
        end = getCurMonth().monthEnd;
        break;
      case 'lastMonth':// 上个月
        start = getLastMonth().lastMonthStart;
        end = getLastMonth().lastMonthEnd;
        break;
      default:
        break;
    }

    end = type === 'first' || type === 'three' || type === 'seven' ? searchDay(startDate, -1) : end;

    if (callBackFun) {
      callBackFun(start, end);
    }
  }

  render() {
    const { btnLists } = this.state;

    return (
      <div>
        {
          btnLists.map(item => (
            <Button
              key={item.text}
              type="primary"
              htmlType="submit"
              size="small"
              className={styles['date-extra-btn']}
              onClick={() => this.searchHandler(item.type)}
            >
              {item.text}
            </Button>
          ))
      }
      </div>
    );
  }
}

export default injectIntl(Index);