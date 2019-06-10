import axios from 'axios';
import qs from 'qs';
// import React from 'react';
// import Loadable from 'react-loadable';
// import { toast } from 'react-toastify';
import { getStore, removeStore, getDispatch } from '../localStorage';
import { replace } from '../router/routeMethods';
import 'react-toastify/dist/ReactToastify.css';
// import http from './http';
// import Loading from '../../common/loading';

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
      replace('login');
      break;
      // 404： 请求不存在
    case 404:
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
      newConfig.headers.Authorization = token;
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
    setTimeout(() => {
      loading(false);
    }, 500);
    return res.status === 200 ? Promise.resolve(res) : Promise.reject(res);
  },
  (error) => {
    loading(false);
    const { response } = error;
    if (response) {
      errorHandle(response.status);
      return response;
    }
    return error;
  },
);
