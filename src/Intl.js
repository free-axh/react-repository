import React, { Component } from 'react';
import { connect } from 'react-redux';
import Proptypes from 'prop-types';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import zh from 'react-intl/locale-data/zh';
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
        return enUS;
    }
  }

  render() {
    const { currLocale } = this.props;
    return (
      <IntlProvider locale={currLocale} messages={this.messagesLocale()}>
        <Navigator />
      </IntlProvider>
    );
  }
}

export default connect(
  state => ({
    currLocale: state.rootReducers.currLocale,
  }),
  null,
)(Intl);
