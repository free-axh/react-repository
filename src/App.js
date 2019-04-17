import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import Navigator from './utils/router/router';

export default () => (
  <Provider store={store}>
    <Navigator />
  </Provider>
);