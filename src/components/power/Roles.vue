<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRole">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 设置为展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row :class="[i1===0 ?'bd-top':'','bd-bottom','v-center']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5" :class="['']">
                <el-tag  closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套来渲染二级权限 -->
                <el-row :class="[i2===0 ? '':'bd-top','v-center']" v-for="(item2,i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success"  closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!-- 三级 -->
                  <el-col :span="18">
                    <el-tag closable @close="removeRightById(scope.row,item3.id)" type="warning" v-for="item3 in item2.children" :key="item3.id">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
              <el-button size="small" type="primary" icon="el-icon-edit" @click="editRole(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" icon="el-icon-delete" @click="delteRole(scope.row)">删除</el-button>
              <el-button size="small" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" @close="setRightDialogClose" :visible.sync="setRightDialogVisible" width="40%">
      <!-- 树形控件 -->
      <el-tree ref="treeRef" :data="rihgtsList" :props="treeProps" show-checkbox highlight-current
        node-key="id" :default-expand-all="true" :default-checked-keys="activeKeys"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" @close="addRoleDialogClose" :visible.sync="addRoleDialogVisible" width="40%">
      <el-form :model="addForm" :rules="FormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" @close="editRoleDialogClose" :visible.sync="editRoleDialogVisible" width="40%">
      <el-form :model="editForm" :rules="FormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      // 所有角色列表数据
      roleList: [],
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 分配权限时，所有权限的数据
      rihgtsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 树节点默认选中的id节点数组
      activeKeys: [],
      // 当前即将分配权限的角色id
      roleId: '',
      // 控制添加角色对话框的显示与隐藏
      addRoleDialogVisible: false,
      // 保存添加角色时的信息
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色和编辑角色的的验证规则
      FormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 控制编辑角色对话框的显示与隐藏
      editRoleDialogVisible: false,
      // 保存编辑角色时的信息
      editForm: {}
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色列表数据
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error({
          message: res.meta.msg,
          duration: 1500
        })
      }
      this.roleList = res.data
    },
    // 根据ID删除对应的权限
    async removeRightById (role, rightId) {
      // 弹框提示是否删除

      // cancel confirm
      const result = await this.$confirm('此操作将永久该权限, 是否继续?', '提示', {
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

      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error({
          message: res.meta.msg,
          duration: 1500
        })
      }

      this.$message.success({
        message: '删除成功!',
        duration: 1500
      })
      // this.getRolesList()

      // 由于返回的data, 是当前角色下最新的权限数据，可以不重新获取数据列表，避免table表格刷新
      // role是传进来的scope.row,由于是双向绑定所以页面也会同步。
      role.children = res.data
    },
    // 展示分配权限对话框
    async showSetRightDialog (roles) {
      // 保存当前角色ID
      this.roleId = roles.id
      // 获取当前所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')

      // 获取权限失败
      if (res.meta.status !== 200) {
        return this.$message.error({
          message: res.meta.msg,
          duration: 1500
        })
      }
      // 把获取到的权限数据保存到 data中
      this.rihgtsList = res.data

      // 递归获取三级节点的id
      this.getActiveKeys(roles, this.activeKeys)
      // 显示对话框
      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取所有三级权限的id，并保存到数组中 activeKeys
    getActiveKeys (node, arr) {
      // 如果当前node节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getActiveKeys(item, arr)
      })
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClose () {
      this.activeKeys = []
    },
    // 点击按钮分配权限
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(), // 返回目前被选中的节点的 key 所组成的数组
        ...this.$refs.treeRef.getHalfCheckedKeys()// 则返回目前半选中的节点的 key 所组成的数组
      ]
      // 指定一个字符串来分隔数组的每个元素。返回分割后的字符串
      const idStr = keys.join(',')

      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      // 分配权限失败
      if (res.meta.status !== 200) {
        return this.$message.error({
          message: res.meta.msg,
          duration: 1500
        })
      }

      this.$message.success({
        message: '分配权限成功',
        duration: 1000
      })
      // 刷新列表
      this.getRolesList()
      // 隐藏对话框
      this.setRightDialogVisible = false
    },
    // 监听添加角色按钮的点击事件
    addRole () {
      this.addRoleDialogVisible = true
    },
    // 确定添加角色按钮的点击事件
    addRoleInfo () {
      this.$refs.addFormRef.validate(async (valid, field) => {
        // 未验证通过
        if (!valid) {
          const arr = Object.keys(field)
          return this.$message.error({
            message: field[arr[0]][0].message,
            duration: 1500
          })
        }

        const { data: res } = await this.$http.post('roles', this.addForm)
        // 添加失败
        if (res.meta.status !== 201) {
          return this.$message.error({
            message: res.meta.msg,
            duration: 1500
          })
        }

        this.$message.success({
          message: '添加角色成功!',
          duration: 1500
        })
        this.getRolesList()
        this.addRoleDialogVisible = false
      })
    },
    // 添加用户对话框关闭时清空验证规则和数据
    addRoleDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 编辑角色按钮点击
    async editRole (roleInfo) {
      const { data: res } = await this.$http.get('roles/' + roleInfo.id)
      if (res.meta.status !== 200) {
        return this.$message.error({
          message: res.meta.msg,
          duration: 1500
        })
      }

      this.editForm = res.data
      this.editRoleDialogVisible = true
    },
    // 确认编辑角色信息
    async editRoleInfo () {
      this.$refs.editFormRef.validate(async (valid, field) => {
        // 未验证通过
        if (!valid) {
          const arr = Object.keys(field)
          return this.$message.error({
            message: field[arr[0]][0].message,
            duration: 1500
          })
        }

        const { data: res } = await this.$http.put('roles/' + this.editForm.roleId, this.editForm)
        // 编辑失败
        if (res.meta.status !== 200) {
          return this.$message.error({
            message: res.meta.msg,
            duration: 1500
          })
        }

        this.$message.success({
          message: '编辑角色信息成功!',
          duration: 1500
        })
        this.editRoleDialogVisible = false
        this.getRolesList()
      })
    },
    // 编辑角色对话框关闭
    editRoleDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    // 根据角色id删除角色
    async delteRole (roleInfo) {
      console.log(roleInfo)
      // cancel confirm
      const result = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(reason => reason)

      // 取消删除
      if (result === 'cancel') {
        return this.$message({
          message: '已取消删除',
          duration: 1500
        })
      }

      const { data: res } = await this.$http.delete('roles/' + roleInfo.id)
      // 删除失败
      if (res.meta.status !== 200) {
        return this.$message.error({
          message: res.meta.msg,
          duration: 1500
        })
      }

      this.$message.success({
        message: '删除角色成功！',
        duration: 1500
      })
      this.getRolesList()
    }
  }

}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
.el-table  {
  margin-top: 15px;
}
.bd-top{
  border-top: 1px solid #eee;
}
.bd-bottom{
  border-bottom: 1px solid #eee;
}
.v-center{
  display: flex;
  align-items: center;
}

</style>
