一、目录结构
=====
```
.
├── README.md
├── config
│   ├── env.js
│   ├── jest
│   │   ├── cssTransform.js
│   │   └── fileTransform.js
│   ├── paths.js
│   ├── webpack.config.js
│   └── webpackDevServer.config.js
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
├── scripts
│   ├── build.js
│   ├── start.js
│   └── test.js
├── server
│   └── server.js
├── src
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── Intl.js
│   ├── common
│   │   ├── loading
│   │   │   └── index.js
│   │   └── toast
│   │       ├── index.js
│   │       └── toast.modal.less
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   ├── redux
│   │   ├── index.js
│   │   ├── login.js
│   │   └── root.js
│   ├── server
│   │   ├── index.js
│   │   └── login.js
│   ├── serviceWorker.js
│   ├── store.js
│   ├── utils
│   │   ├── localStorage.js
│   │   ├── locale
│   │   │   ├── en_US
│   │   │   │   ├── home_US.js
│   │   │   │   └── index.js
│   │   │   └── zh_CN
│   │   │       ├── home_CN.js
│   │   │       └── index.js
│   │   ├── router
│   │   │   ├── renderLoadable.js
│   │   │   ├── renderRoutesMap.js
│   │   │   ├── routeMethods.js
│   │   │   ├── router.js
│   │   │   ├── routerConfig.js
│   │   │   └── routerGuard.js
│   │   ├── server
│   │   │   ├── axios.js
│   │   │   └── http.js
│   │   └── skin
│   │       ├── index.less
│   │       ├── skin.default.less
│   │       ├── skin.js
│   │       └── skin.red.less
│   └── views
│       ├── demo
│       │   └── index.js
│       ├── error
│       │   ├── page404.js
│       │   └── page404.module.less
│       ├── header
│       │   ├── index.js
│       │   └── index.module.less
│       ├── home
│       │   └── index.js
│       └── login
│           ├── antdTest.less
│           ├── index.js
│           ├── loginValidation.js
│           └── loginValidation.module.less
└── tree.txt
```

1、config
---------
create-react-app脚手架生成的项目，执行npm run eject命令生成的项目打包配置文件。

2、public
--------

3、scripts
----------

4、server
---------

5、src
-------------
###（1）、src/common
备注：项目公共组件位置

###（2）、src/redux
备注：redux用于统一管理state<br>
注意事项：<br>
1、Action、Reducer和redux-saga统一写在一个js文件下，方便管理；<br>
2、Reducer的命名规则为：xx + Reducers，saga的命名规则为：xx + Saga;<br>
3、Action的命名规则为：{ type: '标明js文件所属名称/action动作实际含义名称' }

###（3）、src/server
备注：项目数据请求接口<br>
注意事项：<br>
1、数据请求接口文件以每个页面为单位；<br>
2、每个js文件内部创建规范如下
```javascript
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
```

###（4）、src/utils
备注：项目工具文件<br>
1、utils/locale：多语言配置文件，具体使用方式参考react-intl官方API；<br>
参考文档：<br>
（1）、使用 react-intl 实现 React 组件国际化：https://www.jianshu.com/p/574f6cea4f26<br>
2、utils/router：项目路由配置文件<br>
（1）、routerConfig文件配置规则如下：
```javascript
const routes = [
  { path: '/login', key: 'login', component: 'views/login/index', common: false },
  { path: '/home', key: 'home', component: 'views/home/index', common: true },
  { path: '/demo', key: 'demo', component: 'views/demo/index', common: true },
  { path: '/', key: 'login', component: 'views/login/index', common: false },
];

export default routes;
```
其中common字段表示页面是否拥有顶部和左侧公共部分，true为拥有，false为不拥有；<br>
（2）、routerMethods文件为react-router路由跳转方法的统一封装，用于整个项目的路由跳转使用<br>
3、utils/server：项目的ip地址配置和对axios的再次封装，在封装中完善了数据请求的请求拦截器、响应拦截器和请求的错误处理<br>
（1）、ip地址配置（server/http.js）
```javascript
const defaultConfig = {
  /**
   * 数据访问ip + port
   */
  baseUrl: 'http://localhost:9023',
  /**
   * 音视频socket访问ip + port
   */
  videoBaseUrl: 'http://localhost:9023',
};

export default defaultConfig;
```
（2）、请求拦截器（server/axios.js）
```javascript
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
  error => error,
);
```
（3）、响应拦截器（server/axios.js）
```javascript
/**
 * 响应拦截器
 */
axios.interceptors.response.use(
  res => res.status === 200 ? Promise.resolve(res) : Promise.reject(res),
  (error) => {
    const { response } = error;
    console.log('response', response);
    if (response) {
      errorHandle(response.status);
      return response;
    }
    return error;
  },
);
```
（4）、错误处理（server/axios.js）
```javascript
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
```
4、utils/skin：项目换肤配置文件<br>
描述：每个主题色单独创建一个样式文件，在样式文件内部采用less的变量进行定义主题色的各个颜色值。使用过程中通过skin.js中如下代码改变root的类名，以达到主题色的更换。<br>
```javascript
export const switchSkin = (className) => {
  global.document.getElementById('root').className = className;
};
```
5、utils/localStorage.js：项目缓存处理函数封装<br>
（1）、setStore(key, value)：保存数据到localStorage中；<br>
（2）、getStore(key)：获取localStorage中key对应的数据；<br>
（3）、removeStore(key)：删除localStorage中key对应的数据。<br>

###（5）、src/view
备注：项目页面创建区域<br>
注意事项：<br>
1、css样式全部单独创建一个文件统一管理，创建位置在所属页面模块目录下；<br>
2、css样式采用less；<br>
3、create-react-app脚手架集成了css-module，需要混淆css类名以达到项目类名不重复的目的，css样式文件命名规范为xxx.module.less；<br>
4、建议：全局和局部state数据结构尽量简单，以便在shouldComponentUpdate中进行数据比较。

