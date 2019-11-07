import axios from 'axios';
import qs from 'qs';
import { message } from 'antd';
import { getStore, removeStore, getDispatch } from '../localStorage';
import { replace } from '../router/routeMethods';

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export default function dataRequest(url, method, data, timeout = 8000, responseType = 'data') {
  const params = {
    url,
    method,
    timeout,
    responseType,
  };
  if (method === 'POST' || method === 'PUT') {
    params.data = qs.stringify(data);
  } else if (method === 'GET' || method === 'DELETE') {
    params.params = data;
  }
  return new Promise((resolve, reject) => {
    axios(params).then(res => resolve(res)).catch(err => reject(err));
  });
}

/**
 * 请求失败错误处理
 */
const errorHandle = (response) => {
  switch (response.status) {
    case 401:
      if ((response.data.code === 401 && response.data.msg === '用户名密码不正确') || response.data.httpErrorCode === 400) {
        message.error('用户名密码不正确，请重新输入');
      } else {
        message.error('登录状态失效，请重新登录');
        removeStore('token');
        removeStore('historyRouters');
        removeStore('menuKeyPath');
        removeStore('expiration');
        removeStore('authorMenuList');
        removeStore('username');
        if (global.socket) {
          global.socket.close();
          global.socket = null;
        }
        replace('login');
      }
      break;
    case 400:
      message.error('请求参数错误，请检查代码');
      break;
    case 408:
      message.warn('请求超时，请稍后再试');
      break;
    case 500:
      message.error('服务异常，请稍后再试');
      break;
    default:
      break;
  }
};


function loading(state) {
  const dispatch = getDispatch();
  if (dispatch !== null && dispatch !== undefined) {
    dispatch({ type: 'root/LOADING_STATE', payload: state });
  }
}

/**
 * 请求拦截器
 */
axios.interceptors.request.use(
  (config) => {
    loading(true);
    const token = getStore('token');
    const newConfig = config;
    if (token) {
      newConfig.headers.Authorization = `Bearer ${token}`;
    }
    return newConfig;
  },
  (error) => {
    loading(false);
    return error;
  },
);

/**
 * 响应拦截器
 */
axios.interceptors.response.use(
  (res) => {
    loading(false);
    return res.status === 200 ? Promise.resolve(res) : Promise.reject(res);
  },
  (error) => {
    loading(false);
    const { response } = error;
    console.log('response', error);
    if (response) {
      errorHandle(response);
      return response;
    } if (response === undefined) {
      errorHandle({ status: 408 });
      return response;
    }
    return error;
  },
);
