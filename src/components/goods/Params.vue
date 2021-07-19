<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-alert title="注意: 只允许为第三级分类设置相关参数!" type="warning" show-icon :closable="false">
      </el-alert>

      <!-- 选择商品分类 -->
      <el-row class="mt-5">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <!-- options 指定数据源 -->
          <!-- props 用来配置级联选择框 -->
          <el-cascader v-model="selectedCateKeys" :options="cateList" :props="cateProps" @change="handleChange"></el-cascader>
        </el-col>
      </el-row>

      <!-- Tabs页签区域 -->
      <!-- v-model 指定默认选中，和保存当前选中的是谁(跟踪el-tab-pane的name属性) -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button size="small" type="primary" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTabData" border stripe>
            <!-- 展开行 -->
            <el-table-column type='expand'>
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag class="el-tag-params" v-for="(item,index) in scope.row.attr_vals" :key="item.attr_id" closable @close="handleClose(scope.row,index)">{{item}}</el-tag>

                <!-- 创建输入tag标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type='index' label="#"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template  slot-scope="scope">
                <el-button size="small" round type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="small" round type="danger" icon="el-icon-delete" @click="removeParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button size="small" type="primary" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTabData" border stripe>
            <!-- 展开行 -->
            <el-table-column type='expand'>
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag class="el-tag-params" v-for="(item,index) in scope.row.attr_vals" :key="item.attr_id" closable @close="handleClose(scope.row,index)">{{item}}</el-tag>

                <!-- 创建输入tag标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type='index' label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template  slot-scope="scope">
                <el-button size="small" round type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="small" round type="danger" icon="el-icon-delete" @click="removeParams(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" width="40%" @close="addDialogClose">
      <!-- 添加参数的对话框 -->
      <el-form :model="addForm" :rules="FormRules" ref="addFormRef" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数的对话框 -->
    <el-dialog :title="'修改'+titleText" :visible.sync="editDialogVisible" width="40%" @close="editDialogClose">
      <!-- 添加参数的对话框 -->
      <el-form :model="editForm" :rules="FormRules" ref="editFormRef" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data () {
    return {
      // 商品分类列表
      cateList: [],
      // 级联选择框配置对象
      cateProps: {
        expandTrigger: 'hover',
        value: 'cat_id', // 指定真实选中的值
        label: 'cat_name', // 指定看见的值
        children: 'children'// 父子节点的嵌套属性
      },
      // 级联选择框双向绑定到的数组
      selectedCateKeys: [],
      // 被激活的页签的名称
      activeName: 'many',
      // 动态参数的数据
      manyTabData: [],
      // 静态属性的数据
      onlyTabData: [],
      // 控制添加参数对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {
        attr_name: ''
      },
      // 添加参数和修改参数的表单验证规则对象
      FormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      // 修改对话框的表单数据对象
      editForm: {}
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取所有的商品分类列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error({
          message: res.meta.msg,
          duration: 1500
        })
      }
      this.cateList = res.data
    },
    // 级联选择框选中项变化会触发该函数
    async handleChange () {
      // 选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.$message.warning('只能设置三级分类！')
        this.manyTabData = []
        this.onlyTabData = []
        this.selectedCateKeys = []
        return
      }
      this.getParamsData()
    },
    // tab 页签点击事件的处理函数
    handleTabClick () {
      // 没有选择分类
      if (this.selectedCateKeys.length === 0) {
        this.$message.warning('请选择商品分类！')
        this.selectedCateKeys = []
        return this.selectedCateKeys
      }
      this.getParamsData()
    },
    // 获取参数的列表数据
    async getParamsData () {
      // 根据所选分类的id和当前所处的面板获取对用的参数
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message.error({
          message: res.meta.msg,
          duration: 1500
        })
      }

      res.data.forEach(item => {
        if (item.attr_vals) {
          item.attr_vals = item.attr_vals.split(',')
          // 新增一个属性，控制文本框(New Tag)的显示与隐藏
          item.inputVisible = false
          // 文本框中输入的值
          item.inputValue = ''
        } else {
          // 新增一个属性，控制文本框(New Tag)的显示与隐藏
          item.inputVisible = false
          // 文本框中输入的值
          item.inputValue = ''
          item.attr_vals = []
        }
      })
      if (this.activeName === 'many') {
        this.manyTabData = res.data
      } else {
        this.onlyTabData = res.data
      }
    },
    // 添加参数对话框的关闭事件
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮 添加参数
    addParams () {
      this.$refs.addFormRef.validate(async (valid, options) => {
        // 未通过表单验证
        if (!valid) {
          const arr = Object.keys(options)
          return this.$message.error({
            message: options[arr[0]][0].message,
            duration: 1500
          })
        }

        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })

        // 添加参数失败
        if (res.meta.status !== 201) {
          return this.$message.error({
            message: res.meta.msg,
            duration: 1500
          })
        }
        this.$message.success({
          message: '添加参数成功'
        })
        this.getParamsData()
        this.addDialogVisible = false
      })
    },
    // 点击按钮 展示修改参数对话框
    async showEditDialog (attrId) {
      // 根据分类id和属性id查询当前需要编辑的数据
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`, {
        params: {
          attr_sel: this.activeName
        }
      })
      // 查询数据失败
      if (res.meta.status !== 200) {
        return this.$message.error({
          message: res.meta.msg,
          duration: 1500
        })
      }

      this.editForm = res.data
      console.log(this.editForm)

      this.editDialogVisible = true
    },
    // 关闭修改参数对话框，重置表单
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮 确认修改参数信息
    editParams () {
      this.$refs.editFormRef.validate(async (valid, options) => {
        // 未通过表单验证
        if (!valid) {
          const arr = Object.keys(options)
          return this.$message.error({
            message: options[arr[0]][0].message,
            duration: 1500
          })
        }
        // 发起请求修改数据
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })

        // 修改参数失败
        if (res.meta.status !== 200) {
          return this.$message.error({
            message: res.meta.msg,
            duration: 1500
          })
        }

        this.$message.success({
          message: '修改参数成功!',
          duration: 1500
        })
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // 根据分类id和参数id 删除对应的参数
    async removeParams (attrInfo) {
      const result = await this.$confirm(`此操作将永久删除 <strong style="color:red;">${attrInfo.attr_name}</strong> 参数, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true, // 开启html支持
        type: 'warning'
      }).catch(reason => reason)

      // 取消删除
      if (result === 'cancel') {
        return this.$message({
          message: '已取消删除!',
          duration: 1500
        })
      }

      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attrInfo.attr_id}`)
      // 删除失败
      if (res.meta.status !== 200) {
        return this.$message.error({
          message: res.meta.msg,
          duration: 1500
        })
      }

      this.$message.success({
        message: '删除成功',
        duration: 1500
      })
      this.getParamsData()
    },
    // 文本框失去焦点或按下回车都会触发该函数
    async handleInputConfirm (rowInfo) {
      // 未输入 或是 空字符串
      if (rowInfo.inputValue.trim().length === 0) {
        rowInfo.inputValue = ''
        rowInfo.inputVisible = false
        return
      }
      console.log(rowInfo.attr_vals)

      rowInfo.attr_vals.push(rowInfo.inputValue.trim())
      rowInfo.inputValue = ''
      rowInfo.inputVisible = false

      // 发起网络请求保存数据
      this.saveAttrVals(rowInfo)
    },
    // 点击按钮，显示文本输入框
    showInput (rowInfo) {
      rowInfo.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick 就是当页面上元素被重新渲染之后，才会执行回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 将对 attr_vals的操作保存到数据库
    async saveAttrVals (rowInfo) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${rowInfo.attr_id}`, {
        attr_name: rowInfo.attr_name,
        attr_sel: rowInfo.attr_sel,
        attr_vals: rowInfo.attr_vals.join(',')
      })

      if (res.meta.status !== 200) {
        return this.$notify({
          title: '失败',
          message: '更新数据失败！',
          type: 'error',
          duration: 1500
        })
      }

      this.$notify({
        title: '成功',
        message: '更新数据成功！',
        type: 'success',
        duration: 1500
      })
    },
    // 点击tag标签删除对应属性
    async handleClose (rowInfo, index) {
      const result = await this.$confirm(`此操作将永久删除该 <strong style="color:red;">${rowInfo.attr_vals[index]}</strong> 属性, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).catch(reason => reason)

      // 取消删除
      if (result === 'cancel') {
        return this.$notify.info({
          title: '取消',
          message: '已取消删除',
          duration: 1500
        })
      }

      rowInfo.attr_vals.splice(index, 1)
      // 将操作后的数据保存到数据库
      this.saveAttrVals(rowInfo)
    }
  },
  computed: {
    // 根据级联选择框是否选中三级分类返回 true | false,用于控制Button按钮是否禁用
    isBtnDisabled () {
      if (this.selectedCateKeys.length !== 3) return true
      return false
    },
    // 当前选中的三级分类的id
    cateId () {
      if (this.selectedCateKeys.length === 3) return this.selectedCateKeys[2]
      return null
    },
    // 动态计算对话框的标题文本
    titleText () {
      if (this.activeName === 'many') return '动态参数'
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.mt-5 {
  margin: 15px 0;
}
.el-tag-params{
  margin-right: 15px;
}
.input-new-tag{
  width:120px
}
</style>
