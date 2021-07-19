<template>
    <div>
       <!-- 面包屑导航区 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索框 and 添加区域 -->
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList" @keyup.native.enter="getUserList">
                <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>

        <!-- 用户列表区域 - boder加边框线 - stripe斑马纹          -->
          <el-table
            :data="userlist"
            border
            stripe
          >
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="username" label="姓名" ></el-table-column>
            <el-table-column prop="email" label="邮箱" ></el-table-column>
            <el-table-column prop="mobile" label="电话" ></el-table-column>
            <el-table-column prop="role_name" label="角色" ></el-table-column>
            <el-table-column prop="mg_state" label="状态" >
                <template slot-scope="scope">
                  <!-- scope.row 能接收到这一行的数据 -->
                  <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180px">
              <template v-slot="scope">
                <!-- 修改按钮 -->
                <el-button size="mini" round type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
                <!-- 删除按钮 -->
                <el-button size="mini" round type="danger" icon="el-icon-delete" @click="removUserById(scope.row.id)"></el-button>
                <!-- 分配角色按钮 -->
                <el-tooltip effect="dark" content="分配角色" :enterable="false" placement="top">
                  <el-button size="mini" round type="warning" icon="el-icon-setting" @click="setRole(scope.row)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
        </el-table>

        <!-- 分页区域 -->
        <!--
          size-change 每页显示多少发生变化
          current-change 页码发生变化
          current-page 当前显示的是第几页
          layout 需要展示的功能组件
        -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[2, 5, 10, 15]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>

        <!-- 添加用户的对话框 -->
        <el-dialog @close="addDialogClose" title="添加用户" :visible.sync="addDialogVisible" width="40%">
          <!-- 内容主题区域 -->
          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
          </span>
        </el-dialog>

      <!-- 修改用户的对话框 -->
        <el-dialog @close="editDialogClose" title="修改用户信息" :visible.sync="editDialogVisible" width="40%">
          <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
            <el-form-item label="用户名">
              <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo">确 定</el-button>
          </span>
        </el-dialog>

    </el-card>
    </div>
</template>

<script>
export default {
  data () {
    // 验证手机号码的规则
    const checkMobile = (rule, value, callback) => {
      const RegExpMobile = /^[1]([3-9])[0-9]{9}$/
      if (RegExpMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入中国大陆11位手机号码'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '', // 查询参数
        pagenum: 1, // 当前页码
        pagesize: 15 // 每页显示多少数据
      },
      userlist: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: null,
        email: '',
        mobile: null
      },
      // 添加用户的表单验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制修改用户信息的对话框
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 修改用户信息的验证规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },

  // 默认请求
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.userlist = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    // 监听pagesize改变 --- 即每个显示多少个数据
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
      console.log(this.queryInfo.pagesize)
    },
    // 监听页码值改变的事件，即我点击了第二页
    handleCurrentChange (newpage) {
      this.queryInfo.pagenum = newpage
      this.getUserList()
    },
    // 监听switch开关的变化
    async userStateChanged (userInfo) {
      console.log(userInfo)
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error({
          message: res.meta.msg,
          duration: 1000
        })
      }
      this.$message.success({
        message: '更新状态成功！',
        duration: 1000
      })
    },
    // 监听添加用户对话框的关闭事件
    addDialogClose () {
      // 重置表单
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户
    addUser () {
      this.$refs.addFormRef.validate(async (valid, field) => {
        // 有未校验通过的字段
        if (!valid) {
          const arr = Object.keys(field)
          return this.$message.error({
            message: field[arr[0]][0].message,
            duration: 1500
          })
        }
        const { data: res } = await this.$http.post('users', this.addForm)
        // 添加用户失败
        if (res.meta.status !== 201) {
          return this.$message.error({
            message: res.meta.msg,
            duration: 1500
          })
        }
        this.$message.success({
          message: '添加用户成功！',
          duration: 1500
        })
        // this.$notify({
        //   type: 'success',
        //   title: '添加成功',
        //   message: '注意当您添加成功后：<br/>1.需要开启该用户 <br/>2.请为该用户分配角色(默认角色无效)',
        //   dangerouslyUseHTMLString: true,
        //   duration: 0
        // })
        // 隐藏 dialog对话框
        this.addDialogVisible = false
        // 重新获取列表数据
        this.getUserList()
      })
    },

    // 显示编辑用户的对话框
    async showEditDialog (id) {
      this.editDialogVisible = !this.editDialogVisible

      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error({
          message: res.meta.msg,
          duration: 1000
        })
      }
      this.editForm = res.data
    },
    // 编辑用户对话框的关闭事件
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo () {
      this.$refs.editFormRef.validate(async (valid, field) => {
        // 有未校验通过的字段
        if (!valid) {
          const arr = Object.keys(field)
          return this.$message.error({
            message: field[arr[0]][0].message,
            duration: 1500
          })
        }

        const { data: res } = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })

        // 修改失败
        if (res.meta.status !== 200) {
          return this.$message.error({
            message: res.meta.msg,
            duration: 1500
          })
        }

        this.$message.success({
          message: '修改用户数据成功',
          duration: 1500
        })
        // 隐藏对话框
        this.editDialogVisible = !this.editDialogVisible
        // 更新数据列表
        this.getUserList()
      })
    },
    // 根据id删除用户
    async removUserById (id) {
      // cancel confirm
      const result = await this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 取消删除
      if (result === 'cancel') {
        return this.$message.info({
          message: '已取消删除',
          duration: 1500
        })
      }
      const { data: res } = await this.$http.delete('users/' + id)
      // 删除失败
      if (res.meta.status !== 200) {
        return this.$message.error({
          message: '删除失败',
          duration: 1500
        })
      }
      this.$message.success({
        message: '删除成功!',
        duration: 1500
      })
      // 更新数据列表
      this.getUserList()
    }
  }

}
</script>

<style lang="less" scoped>

.el-table {
  margin-top: 15px;
}
</style>
