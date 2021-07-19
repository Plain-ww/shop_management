<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input placeholder="请输入内容" @keyup.enter.native="getGoodsList" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区域 -->
      <el-table :data="goodsList" border stripe style="width: 100%">
        <!-- 展开行 -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <!-- {{scope.row}} -->
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="商品名称">
                <span>{{ props.row.goods_name }}</span>
              </el-form-item>
              <el-form-item label="价格">
                <span>{{ props.row.goods_price + '.00' }}</span>
              </el-form-item>
              <el-form-item label="库存">
                <span>{{ props.row.goods_number }}</span>
              </el-form-item>
              <el-form-item label="重量">
                <span>{{ props.row.goods_weight }}</span>
              </el-form-item>
              <el-form-item label="商品状态">
                <!-- <span>{{ props.row.goods_state }}</span> -->
                <span>已审核</span>
              </el-form-item>
              <el-form-item label="添加时间">
                <span>{{ props.row.add_time | dateFormat }}</span>
              </el-form-item>
              <el-form-item label="更新时间">
                <span>{{ props.row.upd_time | dateFormat }}</span>
              </el-form-item>
              <el-form-item label="是否是热销品">
                <i style="color:green;font-size:18px;" v-if="props.row.is_promote" class="el-icon-success"></i>
                <i style="color:red;font-size:18px;" v-else class="el-icon-error"></i>
              </el-form-item>
              <el-form-item label="热销品数量">
                <span>{{ props.row.hot_mumber }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="105px"></el-table-column>
        <el-table-column label="商品重量(克)" prop="goods_weight" width="105px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="165px">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180px">
          <template slot-scope="scope">
            <el-button size="small" type="primary" icon="el-icon-edit" @click="editGoods(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" icon="el-icon-delete" @click="removeById(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <!-- size-change 每页显示条数发生变化 -->
      <!-- current-change 页码发生变化 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
        >
      </el-pagination>
    </el-card>

    <!-- 编辑商品对话框 -->
    <el-dialog title="编辑商品信息" :visible.sync="editGoodsDialogVisible" width="40%"  @close="editDialogClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="goods_number">
          <el-input v-model="editForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editGoodsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoodsInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'List',
  data () {
    return {
      // 查询参数
      queryInfo: {
        query: '', // 查询参数
        pagenum: 1, // 页码
        pagesize: 5 // 每页显示条数
      },
      // 商品列表
      goodsList: [],
      // 总数据条数
      total: 0,
      // 控制编辑商品对话框是否显示
      editGoodsDialogVisible: false,
      // 正在编辑状态下的商品数据
      editForm: {},
      // 编辑对话框的表单验证规则
      editFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入库存', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 根据分页获取对应的数据
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })
      // 获取失败
      if (res.meta.status !== 200) {
        return this.$message.error({
          message: res.meta.msg,
          duration: 1500
        })
      }
      this.$message.success('获取商品列表成功！')
      this.total = res.data.total
      this.goodsList = res.data.goods
      console.log(res.data)
    },
    // 每页显示条数发生变化
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 页码发生变化
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 点击删除按钮根据id删除商品
    async removeById (goodsInfo) {
      const result = await this.$confirm(`此操作将永久删除 <strong style="color:red;">${goodsInfo.goods_name}</strong>, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).catch(reason => reason)

      // 取消删除
      if (result === 'cancel') {
        return this.$message.info({
          message: '已取消删除',
          duration: 1500
        })
      }

      const { data: res } = await this.$http.delete('goods/' + goodsInfo.goods_id)
      // 删除失败
      if (res.meta.status !== 200) {
        return this.$message.error({
          message: res.meta.msg,
          duration: 1500
        })
      }

      this.$message.success({
        message: '删除成功！',
        duration: 1500
      })
      this.getGoodsList()
    },
    // 点击添加商品按钮,跳转到添加商品页面
    goAddPage () {
      this.$router.push('/goods/add')
    },
    // 点击编辑商品按钮
    async editGoods (goodsInfo) {
      const { data: res } = await this.$http.get('goods/' + goodsInfo.goods_id)
      // 查询数据失败
      if (res.meta.status !== 200) {
        return this.$message.error({
          message: res.meta.msg,
          duration: 1500
        })
      }

      this.editForm = res.data
      console.log(res.data)
      this.editGoodsDialogVisible = true
    },
    // 编辑对话框关闭
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    // 确定编辑商品信息
    editGoodsInfo () {
      this.$refs.editFormRef.validate(async (valid, options) => {
        // 表单验证未通过
        if (!valid) {
          const arr = Object.keys(options)
          return this.$message.error({
            message: options[arr[0]][0].message,
            duration: 1500
          })
        }
        console.log(this.editForm)
        const { data: res } = await this.$http.put('goods/' + this.editForm.goods_id, this.editForm)
        // 修改失败
        if (res.meta.status !== 200) {
          return this.$message.error({
            message: res.meta.msg,
            duration: 1500
          })
        }

        this.$message.success({
          message: '修改成功！',
          duration: 1500
        })
        this.getGoodsList()
        this.editGoodsDialogVisible = false
      })
    }
  }
}
</script>

<style lang="less">
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 120px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 80%;
}
</style>
