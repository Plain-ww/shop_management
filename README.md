# 黑马后台管理的改进版
(2021-06)
本项目是在黑马课程2019版后台进行改进[点击查看改进点在哪里](https://github.com/Plain-ww/shop_management/blob/main/%E6%94%B9%E8%BF%9B%E7%82%B9%E5%B1%95%E7%A4%BA.md)

项目体验地址[(点击进行体验)](http://106.15.190.151/)

项目前端代码[点击下载](https://github.com/Plain-ww/shop_management/tree/main)

```
注意：前端代码下载之后如直接运行，则服务端使用的是我配置的远程接口
目前到期时间是 2022.6
```
## Project setup - 前端

```
前端部分首先下载对应依赖库然后运行即可
npm install
npm run serve
```
## Project setup - 后端
项目后端代码[点击下载](https://github.com/Plain-ww/shop_management_server)
```
如需要使用使用本地的接口，需要先本地开启后台服务器
本项目的后台数据库等完全和黑马2019视频课程一致，如已有可直接使用，也可在下面下载(启动后台服务器需要首先配置Mysql和node等)
```



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

注意：前端部分请求接口，要换到自己的IP地址 (全局搜索127.0.0.1修改)
```

前后端接口文档参考[电商管理后台API接口文档](https://github.com/Plain-ww/shop_management/blob/main/%E7%94%B5%E5%95%86%E7%AE%A1%E7%90%86%E5%90%8E%E5%8F%B0API%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3.md)
### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
