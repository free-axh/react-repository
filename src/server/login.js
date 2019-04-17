import axios from '../utils/server/axios';

const login = {
  /**
   * 登录请求
   */
  login: () => axios('/data', 'GET', { username: 'xiaoli', password: '123456' }),
  /**
   * 验证token是否过期
   */
  validationToken: data => axios('/token', 'POST', data),
};

export default login;