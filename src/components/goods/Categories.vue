<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

       <el-table :data="cateList" border stripe
        row-key="cat_id"
        :default-expand-all='false'
        :tree-props="{children: 'children'}"
       >
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="cat_name" label="分类名称"></el-table-column>
        <el-table-column label="是否有效">
          <template  v-slot="scope">
            <i v-if="scope.row.cat_deleted === false" class="el-icon-success" style="color: lightgreen; font-size: 22px"></i>
            <i v-else class="el-icon-error" style="color: red; font-size: 22px"></i>
          </template>
        </el-table-column>
        <el-table-column label="级别">
          <template v-slot="scope">
            <el-tag effect="dark" v-if="scope.row.cat_level === 0" type="primaruy" >一级</el-tag>
            <el-tag effect="dark" v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
            <el-tag effect="dark" v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDiealog(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeCateByID(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 表格 -->
      <!-- columns 表格各列的配置 -->
      <!-- selection-type 是否为多选类型表格 -->
      <!-- expand-type 是否为展开行类型-->

      <!-- <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" :show-row-hover="false" border> -->
        <!-- 是否有效 -->
        <!-- <template slot="isok" slot-scope="scope">
          <i v-if="scope.row.cat_deleted === false" class="el-icon-success" style="color: lightgreen; font-size: 22px"></i>
          <i v-else class="el-icon-error" style="color: red; font-size: 22px"></i>
        </template> -->

        <!-- 排序 -->
        <!-- <template slot="order" slot-scope="scope">
          <el-tag effect="dark" v-if="scope.row.cat_level === 0" type="primaruy" >一级</el-tag>
          <el-tag effect="dark" v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag effect="dark" v-else type="warning">三级</el-tag>
        </template> -->

        <!-- 操作 -->
        <!-- <template slot="opt" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDiealog(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeCateByID(scope.row)">删除</el-button>
        </template> -->
      <!-- </tree-table> -->

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 7, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" @close="addCateDialogClose" width="40%">
      <!-- 添加分类的表单 -->
      <el-form :model="AddCateForm" :rules="formRules" ref="addCateFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="AddCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options 用来指定数据源 -->
          <!-- props 用来指定配置对象 -->
           <el-cascader placeholder="默认添加至一级分类" change-on-select v-model="selectedKeys" :options="ParentCateList" :props="cascaderProps" @change="cateParentChange" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类对话框" :visible.sync="editDialogVisible" width="40%" @close="editFormDialogClose">
      <el-form :model="editForm" :rules="formRules" ref="editFormRef" label-width="80px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFormConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Categories',
  data () {
    return {
      // 商品分类的数据列表，默认为空
      cateList: [],
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1, // 页码
        pagesize: 5 // 每页显示多少条数据
      },
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      // columns: [
      //   {
      //     label: '分类名称',
      //     prop: 'cat_name'
      //   },
      //   {
      //     label: '是否有效',
      //     // 表示当前列定义为模板列
      //     type: 'template',
      //     // 定义模板名称
      //     template: 'isok'
      //   },
      //   {
      //     label: '级别',
      //     type: 'template',
      //     template: 'order'
      //   },
      //   {
      //     label: '操作',
      //     type: 'template',
      //     template: 'opt',
      //     width: '200px'
      //   }
      // ],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      AddCateForm: {
        // 分类的名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级 默认是一级分类
        cat_level: 0
      },
      // 添加分类的验证规则
      formRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
        ]
      },
      // 父级分类的数据列表
      ParentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id', // 真实选中的是什么
        label: 'cat_name', // 看到的是什么
        children: 'children' // 父子嵌套的属性
      },
      // 级联选择器中选中的id值
      selectedKeys: [],
      // 控制编辑分类对话框的显示与隐藏
      editDialogVisible: false,
      // 保存正在编辑状态下的数据
      editForm: {}
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败：' + res.meta.msg)
      }
      // console.log(res);

      // 把数据列表赋值为cateList
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 监听 pagesize(一页多少条记录) 该变的事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 pagenum 页码的改变
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击添加分类按钮，显示对话框
    showAddCateDialog () {
      // 先获取父级分类的数据列表，再展示对话框
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })

      if (res.meta.status !== 200) {
        return this.$message.error({
          message: res.meta.msg,
          druation: 1000
        })
      }
      this.ParentCateList = res.data
    },
    // 选择项发生变化，触发这个函数
    cateParentChange () {
      console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        // 拿到选中项最子级的id
        this.AddCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.AddCateForm.cat_level = this.selectedKeys.length
      } else {
        this.AddCateForm.cat_pid = 0
        this.AddCateForm.cat_level = 0
      }
    },
    // 点击按钮添加新的分类
    addCate () {
      console.log(this.AddCateForm)
      this.$refs.addCateFormRef.validate(async (valid, field) => {
        if (!valid) {
          const arr = Object.keys(field)
          return this.$message.error({
            message: field[arr[0]][0].message,
            druation: 1500
          })
        }
        console.log('验证通过')

        console.log(this.AddCateForm)
        const { data: res } = await this.$http.post('categories', this.AddCateForm)
        // 添加分类失败
        if (res.meta.status !== 201) {
          return this.$message.error({
            message: res.meta.msg,
            druation: 1500
          })
        }

        this.$message.success('添加分类成功')
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 监听对话框的关闭事件，重置表单数据
    addCateDialogClose () {
      // 重置表单
      this.$refs.addCateFormRef.resetFields()
      // 重置选中的id数组
      this.selectedKeys = []
      // 重置分类的等级
      this.AddCateForm.cat_level = 0
      this.AddCateForm.cat_pid = 0
    },
    // 点击按钮显示编辑分类对话框
    async showEditDiealog (cateInfo) {
      console.log(cateInfo)
      const { data: res } = await this.$http.get('categories/' + cateInfo.cat_id)
      console.log(res)
      // 根据id获取数据失败
      if (res.meta.status !== 200) {
        return this.$message.error({
          message: res.meta.msg,
          druation: 1500
        })
      }
      // 把根据id查询到的数据赋值到 表单绑定的 editForm中
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 确认编辑分类信息
    async editFormConfirm () {
      const { data: res } = await this.$http.put('categories/' + this.editForm.cat_id, {
        cat_name: this.editForm.cat_name
      })
      // 编辑失败
      if (res.meta.status !== 200) {
        return this.$message.error({
          message: res.meta.msg,
          druation: 1500
        })
      }

      this.$message.success({
        message: '编辑成功~',
        druation: 1500
      })

      // 刷新数据
      this.getCateList()
      this.editDialogVisible = false
    },
    // 编辑分类信息对话框关闭
    editFormDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    // 点击了删除按钮
    async removeCateByID (cateInfo) {
      const result = await this.$confirm(`此操作将永久删除 <span style="color:red;font-weight:bold;">${cateInfo.cat_name} </span>分类, 是否继续?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).catch(reason => reason)

      // 取消删除
      if (result === 'cancel') {
        return this.$message.info({
          message: '已取消删除!',
          druation: 1500
        })
      }

      const { data: res } = await this.$http.delete('categories/' + cateInfo.cat_id)
      // 删除失败
      if (res.meta.status !== 200) {
        return this.$message.error({
          message: res.meta.msg,
          druation: 1500
        })
      }

      this.$message.success({
        message: '删除成功!',
        druation: 1000
      })
      this.getCateList()
    }
  }
}
</script>

<style lang="less" scoped>

.el-cascader{
  width: 100%;
}

</style>
