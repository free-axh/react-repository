import React from 'react';
import { Provider } from 'react-redux';
// import { IntlProvider, addLocaleData } from 'react-intl';
// import en from 'react-intl/locale-data/en';
// import zh from 'react-intl/locale-data/zh';
// import zhCN from './utils/locale/zh_CN';
// import enUS from './utils/locale/en_US';
import store from './store';
// import Navigator from './utils/router/router';
import Intl from './Intl';

// addLocaleData([...en, ...zh]);

export default () => (
  <Provider store={store}>
    <Intl />
  </Provider>
);