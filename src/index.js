import React from 'react';
import ReactDOM from 'react-dom';
import { message } from 'antd';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'normalize.css';
import './static/css/coverAnt.css';// 覆盖ant design默认样式

/**
 * 全局设置message消息提醒配置
 */
message.config({
  maxCount: 1,
  duration: 2,
});

ReactDOM.render(<App />, global.document.getElementById('root'));

serviceWorker.unregister();
