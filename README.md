
#黑马后台管理的改进版
本项目是在黑马课程2019版后台进行改进[点击查看改进点在哪里](##)
项目体验地址[(点击进行体验)](http://www.baidu.com)

项目前端代码[点击下载](https://github.com/Plain-ww/shop_management/tree/main)
```
注意：前端代码下载之后不能直接运行，需要先开启后台服务器，
本项目的后台数据库等完全和黑马2019视频课程一致，如已有可直接使用，也可在下面下载(启动后台服务器需要首先配置Mysql和node等)
```
项目后端代码[点击下载](##)

## Project setup - 后端

在进行项目构建之前，需要再本地新建一个对应的数据库
具体步骤如下:[查看步骤](https://www.bilibili.com/video/BV1xy4y1r7E8?p=8)
```
如上述视频地址过期，可以在b站搜索--电商后台管理系统项目实战-- 找到‘08.后台项目的环境安装配置’ 这1p进行观看
或者数据库文件在后端项目文件中的\vue_api_server\db\mydb.sql 下载后直接导入到本地的Mysql数据库中即可
同时根据自己数据库的名字，注意修改后端代码中，有关连接数据库部分的代码
```
数据库配置完成后,可进行下步
```
首先进入对应的文件目录，下载对应依赖库 然后运行即可
npm install 
node .\app.js
```
## Project setup - 前端

```
前端部分首先下载对应依赖库然后运行即可
npm install
npm run serve
```

前后端接口文档参考[电商管理后台API接口文档](##)
### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
