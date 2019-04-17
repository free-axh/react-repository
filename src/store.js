import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducers from './redux/index';

const sagaMiddleware = createSagaMiddleware();

const allReducers = [];

const keys = Object.keys(reducers);
for (let i = 0; i < keys.length; i += 1) {
  const modal = reducers[keys[i]];
  const reducerReg = /(.*)Reducers$/;
  const ms = Object.keys(modal);
  for (let j = 0; j < ms.length; j += 1) {
    const m = ms[j];
    if (reducerReg.test(m)) {
      allReducers[m] = modal[m];
    }
  }
}

const store = createStore(
  combineReducers(allReducers),
  applyMiddleware(sagaMiddleware),
);

const sagaKeys = Object.keys(reducers);
for (let i = 0; i < sagaKeys.length; i += 1) {
  const modal = reducers[sagaKeys[i]];
  const sagaReg = /(.*)Saga$/;
  const ms = Object.keys(modal);
  for (let j = 0; j < ms.length; j += 1) {
    const m = ms[j];
    if (sagaReg.test(m)) {
      sagaMiddleware.run(modal[m]);
    }
  }
}

export default store;