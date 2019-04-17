import axios from 'axios';
import qs from 'qs';
import { getStore, removeStore } from '../localStorage';
import { replace } from '../router/routeMethods';
// import http from './http';

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export default function dataRequest(url, method, data, timeout = 8000) {
  const params = {
    url,
    // baseURL: http.baseUrl,
    method,
    timeout,
  };
  if (method === 'POST') {
    params.data = qs.stringify(data);
  } else if (method === 'GET') {
    params.params = data;
  }
  console.log('params', params);
  return new Promise((resolve, reject) => {
    axios(params).then(res => resolve(res)).catch(err => reject(err));
  });
}

/**
 * 请求失败错误处理
 */
const errorHandle = (status) => {
  switch (status) {
    // 401: 未登录状态
    case 401:
      replace('login');
      break;
      // 403: token 过期
    case 403:
      removeStore('token');
      break;
      // 404： 请求不存在
    case 404:
      break;
    default:
      break;
  }
};

/**
 * 请求拦截器
 */
axios.interceptors.request.use(
  (config) => {
    const token = getStore('token');
    const newConfig = config;
    if (token) {
      newConfig.headers.Authorization = token;
    }
    return newConfig;
  },
  error => Promise.error(error),
);

/**
 * 响应拦截器
 */
axios.interceptors.response.use(
  res => res.status === 200 ? Promise.resolve(res) : Promise.reject(res),
  (error) => {
    const { response } = error;
    console.log('ccccccc', response);
    if (response) {
      errorHandle(response.status);
      return Promise.reject(response);
    }
    return Promise.reject(error);
  },
);
