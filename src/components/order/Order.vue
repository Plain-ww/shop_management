<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表数据 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="props">
            <el-tag v-if="props.row.pay_status == '1'" type="success">已付款</el-tag>
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="props">{{props.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template>
            <el-tooltip content="修改地址" :enterable="false" placement="top">
              <el-button size="small" round type="primary" icon="el-icon-edit" @click="showBox"></el-button>
            </el-tooltip>
            <el-tooltip content="物流状态" :enterable="false" placement="top">
              <el-button size="small" round type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3,5,10,20]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 修改地址的对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="40%" @close="addressDialogClose">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1" :props="{expandTrigger: 'hover'}"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressBoxVisible" width="50%">
      <!-- 时间线 -->
       <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
import progressInfo from './progressInfo.json'
export default {
  name: 'Order',
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      // 订单数据列表
      orderList: [],
      // 控制编辑地址的对话框状态
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      cityData,
      // 物流进度对话框
      progressBoxVisible: false,
      // 物流信息
      progressInfo: progressInfo.data
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error({
          message: '获取订单列表失败',
          duration: 1500
        })
      }
      this.total = res.data.total
      this.orderList = res.data.goods
      console.log(res.data)
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 展示修改地址的对话框
    showBox () {
      this.addressVisible = true
    },
    addressDialogClose () {
      this.$refs.addressFormRef.resetFields()
    },
    showProgressBox () {
      this.progressBoxVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%}
</style>
