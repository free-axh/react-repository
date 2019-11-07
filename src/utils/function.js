import moment from 'moment';

// 日期全局变量
const date = new Date();
const curWeekDay = date.getDay();// 星期
const year = date.getFullYear();// 年
const month = date.getMonth();// 月
const curDay = date.getDate();// 日

/**
 * 获取查询天数日期(前1天，前3天，前7天)
 * @param {*} start:当前日期
 * @param {*} day: 查询天数
 */
export function searchDay(startDate, day) {
  const start = startDate.replace(/-/g, '/');
  const milliseconds = Date.parse(start) + day * 24 * 3600 * 1000;
  date.setTime(milliseconds);

  return moment(date).format('YYYY-MM-DD');
}

/**
 * 获取当前时间
 */
export function getToday() {
  return moment(new Date()).format('YYYY-MM-DD');
}

/**
 * 获取本周开始日期和结束日期
 * 返回:
 * weekStart: 本周开始日期
 * weekEnd: 本周结束日期
 */
export function getCurWeek() {
  let weekStart = new Date(year, month, curDay - curWeekDay);
  let weekEnd = new Date(year, month, curDay + (6 - curWeekDay));
  weekStart = moment(weekStart).format('YYYY-MM-DD');
  weekEnd = moment(weekEnd).format('YYYY-MM-DD');

  return {
    weekStart,
    weekEnd,
  };
}

/**
 * 获取本月开始日期和结束日期
 */
export function getCurMonth() {
  let monthStart = new Date(year, month, 1);
  let monthEnd = new Date(year, month + 1, 0);
  monthStart = moment(monthStart).format('YYYY-MM-DD');
  monthEnd = moment(monthEnd).format('YYYY-MM-DD');

  return {
    monthStart,
    monthEnd,
  };
}

/**
 * 获取上月的开始日期和结束日期
 */
export function getLastMonth() {
  let lastMonthStart = new Date(year, month - 1, 1);
  let lastMonthEnd = new Date(year, month, 0);
  lastMonthStart = moment(lastMonthStart).format('YYYY-MM-DD');
  lastMonthEnd = moment(lastMonthEnd).format('YYYY-MM-DD');

  return {
    lastMonthStart,
    lastMonthEnd,
  };
}