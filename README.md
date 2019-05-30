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
>>create-react-app脚手架生成的项目，执行npm run eject命令生成的项目打包配置文件。
2、public
--------
3、scripts
----------
4、server
---------
