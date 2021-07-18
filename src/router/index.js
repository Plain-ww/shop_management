import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'

import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Welcome from '../components/welcome/Welcome.vue'
import Users from '../components/user/Users.vue'

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
      { path: '/users', component: Users }
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
