export const lineData = [
  {
    title: '2020年访问量一览',
    legendData: ['真实访问量', '预估访问量'],
    xData: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    // 真实数据
    realData: [1500, 2800, 900, 1000, 800, 700, 1400, 1300, 900, 1000, 800, 600],
    // 推测数据
    guessData: [1200, 1400, 1800, 2500, 800, 700, 900, 1000, 800, 600, 2000, 2400],
    icon: ''
  },
  {
    title: '2020年总成交量',
    legendData: ['真实成交量', '预估成交量'],
    xData: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    // 真实数据
    realData: [85418, 95123, 58203, 48415, 48502, 54312, 48561, 18432, 105210, 91062, 104813, 84510],
    // 推测数据
    guessData: [75418, 85123, 68203, 68415, 38502, 64312, 41561, 11432, 85210, 71062, 114813, 89510],
    // icon
    icon: '￥'
  },
  {
    title: '昨日访问量一览',
    legendData: ['真实访问量', '预估访问量'],
    xData: ['0:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00'],
    // 真实数据
    realData: [150, 280, 90, 100, 80, 70, 140, 130, 90, 100, 420, 60, 120],
    // 推测数据
    guessData: [120, 140, 180, 250, 80, 70, 90, 100, 80, 60, 200, 240, 140],
    icon: ''
  },
  {
    title: '昨日成交量',
    legendData: ['真实成交量', '预估成交量'],
    xData: ['0:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00'],
    // 真实数据
    realData: [2418, 3023, 4823, 5815, 6502, 7312, 4525, 8432, 5010, 3106, 8510, 6500],
    // 推测数据
    guessData: [1418, 2023, 3823, 6815, 7502, 6312, 4500, 5532, 6610, 4106, 8910, 7483],
    // icon
    icon: '￥'
  }
]

export const cardData = [
  {
    icon: 'el-icon-s-shop',
    title: '总访问量',
    data: '4018153次',
    color: '#40C9C6'
  },
  {
    icon: 'el-icon-shopping-cart-1',
    title: '总成交量',
    data: '1025018￥',
    // color: '#40C9C6'
    color: '#F4516C'
  },
  {
    icon: 'el-icon-user-solid',
    title: '昨日访问量',
    data: '21523次',
    color: '#36A3F7'
  },

  {
    icon: 'el-icon-s-marketing',
    title: '昨日成交量',
    data: '2253￥',
    color: '#34BFA3'
  }
]
