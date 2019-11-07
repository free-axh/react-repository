import React, { Component } from 'react';
import { connect } from 'react-redux';
import Proptypes from 'prop-types';
import { IntlProvider, addLocaleData } from 'react-intl';
import { ConfigProvider } from 'antd';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
import zhCN_antd from 'antd/es/locale/zh_CN';
import enUS_antd from 'antd/es/locale/en_US';
import moment from 'moment';
import 'moment/locale/zh-cn';
import zhCN from './utils/locale/zh_CN/index';
import enUS from './utils/locale/en_US/index';
import Navigator from './utils/router/router';

addLocaleData([...en, ...zh]);

class Intl extends Component {
  static propTypes = {
    currLocale: Proptypes.string.isRequired,
  }

  messagesLocale = () => {
    const { currLocale } = this.props;
    switch (currLocale) {
      case 'zh':
        return zhCN;
      case 'en':
        return enUS;
      default:
        return zhCN;
    }
  }

  antdLocale = () => {
    const { currLocale } = this.props;
    moment.locale(currLocale);
    switch (currLocale) {
      case 'zh':
        return zhCN_antd;
      case 'en':
        return enUS_antd;
      default:
        return zhCN_antd;
    }
  }

  render() {
    const { currLocale } = this.props;
    return (
      <ConfigProvider locale={this.antdLocale()}>
        <IntlProvider locale={currLocale} messages={this.messagesLocale()}>
          <Navigator />
        </IntlProvider>
      </ConfigProvider>
    );
  }
}

export default connect(
  state => ({
    currLocale: state.rootReducers.currLocale,
  }),
  null,
)(Intl);
