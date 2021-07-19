import Vue from 'vue'
import axios from 'axios'
import Qs from 'qs'
// 导入 Nprogress 对应的JS和CSS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// axios.defaults.baseURL = 'http://106.15.190.151:8888/api/private/v1/'

// 添加 请求头 和 进度条 NProgress.start()

// 用qs解析，jsonToForm
axios.interceptors.request.use(config => {
  // 添加 进度条
  NProgress.start()

  config.headers.Authorization = window.sessionStorage.getItem('token')
  // config.headers.Authorization = window.$cookies.get('token')
  if (config.type === 'formData' || config.method !== 'post') {
    // console.log(config)
    return config
  }
  config.data = Qs.stringify(config.data)
  return config
},
(err) => {
  Vue.prototype.$message.error({
    message: '加载超时'
  })
  return Promise.reject(err)
})

axios.interceptors.response.use(config => {
  // 隐藏 进度条
  NProgress.done()
  return config
})

Vue.prototype.$http = axios
