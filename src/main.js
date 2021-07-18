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
// import echarts from 'echarts'
const echarts = require('echarts')

// 把echarts挂载到 Vue原型上，以便在全局访问
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

new Vue({
  router,
  // echarts,
  render: h => h(App)
}).$mount('#app')
