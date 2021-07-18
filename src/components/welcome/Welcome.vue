<template>
  <div class="welcome">

    <!-- 四个卡片 -->
    <el-row :gutter="12">
      <el-col :span="6" v-for="(item, index) in cardData" :key="index">
        <el-card shadow="always" @mouseenter.native="change(item.color, index)" @mouseleave.native="currentIndex = null" @click.native="changeLine(index)">
          <div class="left" :style="[currentIndex == index ? bgColor : '']">
            <span :class="['iconfont', , item.icon]" :style="{ color: currentIndex == index ? '#FFF' : item.color }"></span>
          </div>
          <div class="right">
            <div class="title">{{ item.title }}</div>
            <div class="data">{{ item.data }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 折线图 -->
    <el-card id="line">
      <div ref="lineRef" style="height: 400px"></div>
    </el-card>
  </div>
</template>

<script>

import 'echarts/theme/macarons.js'

import { lineData, cardData } from '../../comment/welcome-data.js'
// require('assets/lib/theme/macarons.js') // echarts theme

export default {
  name: 'Welcome',
  components: {

  },
  data () {
    return {
      // 折线图实例
      chartInstance: null,
      // 折线图数据
      lineData: [],
      activeLine: 0,
      // 四个card的数据
      cardData: [],
      // 折线图信息
      lineInfo: null,
      // 用于设置鼠标悬停在card上的高亮
      currentIndex: null,
      // 高亮的背景色
      bgColor: {},
      // 高亮的字体色
      fontColor: {}
    }
  },
  destroyed () {
    this.chartInstance.dispose()
  },

  async created () {
    // 引入常量数据
    this.lineData = lineData
    this.cardData = cardData
  },
  mounted () {
    this.$nextTick(() => {
      // 初始化图表
      this.initChart()
    })
  },
  methods: {
    // 初始化图表的方法
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.lineRef, 'macarons')
      const currentData = this.lineData[this.activeLine]
      // 初始化图表的配置项
      const initOption = {
        title: {
          text: currentData.title,
          textStyle: {
            fontSize: '28'
          }
        },
        legend: {
          left: 'center',
          top: '5%',
          // data: ['真实访问量', '预估访问量'],
          data: currentData.legendData
        },
        grid: {
          top: '20%',
          left: '0%',
          right: '2%',
          bottom: '0%',
          // 把x轴和y轴纳入 grid
          containLabel: true
        },
        // 工具提示
        tooltip: {
          // 当鼠标移入坐标轴的显示提示
          trigger: 'axis',
          // 鼠标放上去十字交叉指示器
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: {
          type: 'category',
          // data: xDataArr,
          data: currentData.xData,
          // 紧挨边缘
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: currentData.legendData[0],
            smooth: true,
            type: 'line',
            animationDuration: 2800,
            data: currentData.realData,
            animationEasing: 'quadraticOut',
            markPoint: {
              // 最大最小值的相关配置
              label: {
                show: true,
                formatter: '{c}' + currentData.icon
              },
              data: [
                {
                  type: 'max',
                  name: '最大值'
                },
                {
                  type: 'min',
                  name: '最小值'
                }
              ],

              animationDuration: 2800,
              animationEasing: 'quadraticOut'
            },
            itemStyle: {
              normal: {
                color: '#3888fa',
                lineStyle: {
                  color: '#3888fa',
                  width: 2
                },
                areaStyle: {
                  color: '#f3f8ff'
                }
              }
            }
          },
          {
            name: currentData.legendData[1],
            smooth: true,
            type: 'line',
            animationDuration: 2800,
            data: currentData.guessData,
            animationEasing: 'cubicInOut',
            markPoint: {
              // 最大最小值的相关配置
              label: {
                show: true,
                formatter: '{c}' + currentData.icon
              },
              data: [
                {
                  type: 'max',
                  name: '最大值'
                },
                {
                  type: 'min',
                  name: '最小值'
                }
              ],
              animationDuration: 2800,
              animationEasing: 'quadraticOut'
            },
            itemStyle: {
              normal: {
                color: '#FF005A',
                lineStyle: {
                  color: '#FF005A',
                  width: 2
                }
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      // this.updateChart()
    },

    // 鼠标经过card该变对应样式
    change (color, index) {
      console.log(index)
      this.currentIndex = index
      this.bgColor = {
        backgroundColor: color
      }
    },
    // 改变图表显示的数据
    changeLine (index) {
      this.activeLine = index
      this.chartInstance.dispose()
      this.initChart()
    }
  }
}
</script>

<style lang="less" scope>

.welcome {
  margin-top: 10px;
  padding: 0 10px;

  .el-row {
    .el-card__body {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      .iconfont {
        font-family: element-icons!important;
        font-size: 48px;
      }
      div.left {
        padding: 10px;
        border-radius: 5px;
      }
      div.right {
        height: 68px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: flex-start;
      }
    }
    .el-card__body:hover {
      cursor: pointer;
    }
  }
  #line {
    margin-top: 15px;
  }
}
</style>
