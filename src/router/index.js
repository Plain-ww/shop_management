import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'

import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../components/welcome/Welcome.vue'
import Users from '../components/user/Users.vue'

// 权限管理
import RightList from '../components/power/Rights.vue'
import RolesList from '../components/power/Roles.vue'

// 商品管理
import Categories from '../components/goods/Categories.vue'
import Params from '../components/goods/Params.vue'
import List from '../components/goods/List.vue'
import AddGoods from '../components/goods/AddGoods.vue'

// 订单管理
import Order from '../components/order/Order.vue'

// 数据可视化
import Report from '../components/report/Report.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },

  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: RightList },
      { path: '/roles', component: RolesList },
      { path: '/categories', component: Categories },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: AddGoods },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]

  }

]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫,   to表示将要访问的路径，from表示从哪里来，next是下一个要做的操作
router.beforeEach((to, from, next) => {
  if (to.path === '/login') { return next() }

  // 获取token

  const tokenStr = window.sessionStorage.getItem('token')

  // const tokenStr = window.$cookies.get('token')

  if (!tokenStr) {
    Vue.prototype.$message({
      type: 'info',
      message: '小伙子,请登录'
    })
    return next('/login')
  }

  next()
})

export default router
