# PC-JQ 多页面模板

![version](https://img.shields.io/github/package-json/v/zengxue158/pc_jq_template2.svg)
![commit](https://img.shields.io/github/last-commit/zengxue158/pc_jq_template2.svg)
![new feature](https://img.shields.io/badge/author-zengxue158-orange)

### 开发

```html
<!-- 添加cms_id，「0001」频道ID依据创建项目时的频道名,「xxxx」为发布器对应频道新建专题名，需要发布到发布器的项目，该项必填 -->
<meta name="cms_id" content="0001xxxx" />
<!-- 公共导航头 -->
<!--#include virtual="/special/ntes_common_model/nte_commonnav2019.html" -->
<!-- 频道导航头 -->
<!--#include virtual="/special/sp/post_1603_header.html" -->
```

### 本地访问地址

- 多页面只需在 src/pages/新建文件夹，_内部文件依然保留 index 命名_。
- 默认 localhost:8080 访问的是 index
- 其他页面路径格式为 `localhost:8080/文件夹名称.html`
  例如：localhost:8080/login.html

```
http://localhost:8080/index.html
```

### 安装

```bash
$ npx ne-build pc-jq-multi
# node版本大于5.2
# 参数可在命令行输入，也可以输入命令后按交互提示输入

# 参数⬇️
-n or --name
# 项目名称，必须
# 用于替换模板项目中package.json的{name}

-c or --channel
# 频道名称，必须
# 用于替换模板项目内上传路径中的频道路径

-t or --template
# 项目模版，必须

-d or --desc
# 项目描述，可选
# 用于替换模板项目中package.json的{description}

```

### 上传

在 script/upload-tools.js 中配置 openID 路径

```
const account = require('../openID')

```

### 命令

```bash
# 安装依赖
$ npm i

# 开启本地服务
$ npm run dev

# 初始化openid（只需执行一次）
$ npm run initopenid

# 打包（上传前需先打包）
$ npm run build

# 上传静态资源
$ npm run upload

# 发布cms
$ npm run publish

# 打包+上传+发布+git提交
npm run submit
```

### 目录结构

```
pc_jq_template2
├─CHANGELOG.md
├─README.md
├─babel.config.js       # babel配置文件
├─openID.json           # 上传账号密码文件
├─package-lock.json
├─package.json
├─postcss.config.js     # postcss配置文件
├─static                # 静态资源文件夹
|   └share-icon.png
├─src
|  ├─pages
|  |   ├─login
|  |   |   ├─index.html
|  |   |   ├─index.js     # js文件
|  |   |   └index.less    # 样式文件
|  |   ├─index
|  |   |   ├─index.html
|  |   |   ├─index.js     # js文件
|  |   |   └index.less    # 样式文件
|  ├─js
|  | ├─common.js          # 通用js
|  | ├─utils              # 工具js文件夹
|  | |   ├─helper.js      # eruda、统计js
|  | |   ├─track.js       # 统计方法
|  | |   └utils.js        # 工具函数
|  ├─css
|  |  └common.less        # 公用reset css
|  ├─assets               # 图片等资源文件夹
|  |   └banner.jpg
├─scritp                  # webpck配置、上传发布脚本、初始化openID脚本
|   ├─init-openid.js
|   ├─publish.js
|   ├─upload-tools.js
|   ├─upload.js
|   ├─webpack.base.config.js
|   ├─webpack.dev.config.js
|   ├─webpack.prod.config.js
|   └webpack.router.config.js
├─config
|   ├─agent.js
|   └channel.json
```

### 简介

- 项目使用 webpack 打包，webpack-dev-server 开启本地服务
- html 默认使用.html，可按照[html-webpack-plugin 文档](https://github.com/jantimon/html-webpack-plugin)根据需求自行配置模板文件。
- css 默认使用[less](http://lesscss.org/)以及[postcss](https://postcss.org/)
- js 使用[babel7.5](https://babeljs.io/)进行编译，按照 package.json 中的 browserslist 自动增加 polyfill
- eslint 使用默认标准，[规则](https://eslint.org/docs/rules/)
- 统计 ID 位于`package.json`的`projectId`字段
- 已内置`jQuery`，版本`v3.4.1`index.html 中引入 js，webpack.externals 进行排除）
- npm run dev 开启本地服务后，可以使用 localhost:8080 或{ip}:8080 或 dev.f2e.163.com:8080（需配置 hosts）调试
- 打包时静态资源默认添加 hash，上传后进行缓存，无修改不再重复上传
- 如需引用频道 include，需要再 webpack.dev.config.js 中 59 行修改频道域名
