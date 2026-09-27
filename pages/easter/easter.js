Page({
  data: {
    perk: '加群即领《蓝桥杯算法模板合集》+ 学长学姐 0 基础带你打第一场比赛，期末不挂科攻略也管够。',
    secret: '算软社 + 你的姓名'
  },

  onLoad() {
    wx.setNavigationBarTitle({ title: '🎁 隐藏福利' })
  },

  copySecret() {
    wx.setClipboardData({
      data: this.data.secret,
      success: () => wx.showToast({ title: '暗号已复制', icon: 'success' })
    })
  },

  goRecruit() {
    wx.switchTab({ url: '/pages/recruitment/list/list' })
  },

  onShareAppMessage() {
    return {
      title: '我在算软社发现了隐藏福利，一起来解锁！',
      path: '/pages/index/index'
    }
  }
})
