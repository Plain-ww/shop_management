<template >

  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="图标" style="height:65px;width:65px">
        <span>购物街-电商后台管理系统</span>
      </div>
      <div>
        <a href="https://github.com/Plain-ww">
        <el-button type="primary">github<i class="el-icon-link"></i></el-button>
        </a>
        <el-button type="info" @click="logout">退出</el-button>
      </div>

      </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse" >|||</div>
        <!-- 左侧菜单区域 -->
        <!--    background-color="#333744" //背景颜色
                text-color="#fff"  //字体颜色
                active-text-color="#ffd04b" //点击文字之后改变的颜色
                :unique-opened="true" // 左侧菜单栏 设置同时只能打开一个二级菜单，其他的会自动关闭
                :collapse="isCollapse" // 设置点击按钮左侧菜单栏折叠相关
                :collapse-transition="false" // 取消菜单折叠的动画 --防止出现折叠时卡顿的问题
                router  //开启路由模式 ，这样就可以根据不同的index(绑定不同的path)值 改变不同 hash 值
                :default-active="activePath"  //保证每次path地址切换时 字体的颜色为被选中的状态
                -->
            <el-menu
                background-color="#333744"
                text-color="#fff"
                active-text-color="#ffd04b"
                :unique-opened="true"
                :collapse="isCollapse"
                :collapse-transition="false"
                router
                :default-active="activePath">

                <el-menu-item index="/welcome">
                  <i class="el-icon-s-platform"></i>
                  <span slot="title">主页概览</span>
                </el-menu-item>

                <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">    <!--  //这里item.id 后面加一个空格 则代表把数值转换为了字符串  -->
                  <!-- 一级菜单 -->
                  <template #title>
                    <!-- 图标 -->
                    <i :class="iconsObj[item.id]"></i>
                    <!-- 文本 -->
                    <span>{{item.authName}}</span>
                  </template>

                  <!-- 二级菜单 -->
                  <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id">
                        <template #title>
                          <!-- 图标 -->
                          <i class="el-icon-menu"></i>
                          <!-- 文本 -->
                          <span>{{subitem.authName}}</span>
                        </template>
                  </el-menu-item>
                </el-submenu>
            </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 菜单默认不折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    // this.activePath = window.sessionStorage.getItem('activePath')
    this.setCurrentRoute()
  },
  watch: {
    // 监听路由变化，路由只要变化就刷新当前地址，这样可以解决直接地址栏输入route时的高亮问题
    $route () {
      this.setCurrentRoute()
    }
  },
  methods: {
    setCurrentRoute () {
      this.activePath = this.$route.path
    },
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.console.error(res.meta.msg)
      this.menuList = res.data
      console.log(res)
    },
    // 点击按钮 切换 菜单的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
    // 保存链接的激活状态 ---为了完成左侧菜单 点击之后文字颜色会改变
    // saveNavState (activePath) {
    //   window.sessionStorage.setItem('activePath', activePath)
    //   // 保证每次点击的时候 给activePath 重新赋一下值
    //   this.activePath = activePath
    // }
  }
}
</script>

<style lang="less" scoped>
.home-container{
  height: 100%;
}
.el-header{
  background-color: #373D41;
  display: flex;
  justify-content: space-between;
  // padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 22px;
  font-weight: bold;
  > div {
    display: flex;
    align-items: center;
    > a {
      margin-right: 5px;
    }
    > span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main{
  background-color: #eaedfa;
}
// 让一级菜单前的小图标和文字之间有间隔
.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
