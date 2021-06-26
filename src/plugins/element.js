import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

// 上面引入时可以一起引用 但是下面的use方法，只能一个一个的使用
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 挂载在Vue的实例对象中 这样使用时，只需要 .$message (这个名字可以自己随意取)
Vue.prototype.$message = Message
