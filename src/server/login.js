import axios from '../utils/server/axios';

const login = {
  /**
   * 登录请求
   */
  // login: () => axios('', 'GET', { username: 'xiaoli', password: '123456' }),
  // login: data => axios(`/oauth/token?client_id=mobile_1&client_secret=secret_1
  // &username=${data.username}&password=${data.password}
  // &grant_type=password&scope=read`, 'POST', {}),
  login: data => axios('/oauth/token', 'POST', data),
  /**
   * 获取登录账号基础信息
   */
  getUserBasic: () => axios('/api/login/basic', 'GET', {}),
};

export default login;