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
### （1）、src/common
备注：项目公共组件位置

### （2）、src/redux
备注：redux用于统一管理state<br>
注意事项：<br>
1、Action、Reducer和redux-saga统一写在一个js文件下，方便管理；<br>
2、Reducer的命名规则为：xx + Reducers，saga的命名规则为：xx + Saga;<br>
3、Action的命名规则为：{ type: '标明js文件所属名称/action动作实际含义名称' }

### （3）、src/server
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

### （4）、src/utils
备注：项目工具文件<br>
1、utils/locale：多语言配置文件，具体使用方式参考react-intl官方API；<br>
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
3、utils/server：项目的ip地址配置和对axios的再次封装，在封装中完善了数据请求的请求拦截器、相应拦截器和请求的错误处理<br>
4、utils/skin：项目换肤配置文件<br>
5、utils/localStorage.js：项目缓存处理函数封装

### （5）、src/view
备注：项目页面创建区域

