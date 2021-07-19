import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 导入已配置好的依赖 axios
import './network/axios.js'
// 导入字体图标
import './assets/fonts/iconfont.css'

// 导入全局样式表
import './assets/css/global.css'

// 导入富文本编辑器 -- 添加商品页使用的
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// import echarts from 'echarts'
const echarts = require('echarts')

// 把echarts挂载到 Vue原型上，以便在全局访问
Vue.prototype.$echarts = echarts

// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)

// 定义全局时间过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal * 1000)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getMilliseconds() + '').padStart(2, '0')

  const DateStr = `${y}-${m}-${d} ${hh}:${mm}:${ss}`

  return DateStr
})

Vue.config.productionTip = false

new Vue({
  router,
  // echarts,
  render: h => h(App)
}).$mount('#app')
