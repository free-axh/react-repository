import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import Intl from './Intl';

export default () => (
  <Provider store={store}>
    <Intl />
  </Provider>
);