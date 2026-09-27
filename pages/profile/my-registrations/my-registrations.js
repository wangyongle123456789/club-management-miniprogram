const dm = require('../../../utils/data-manager.js')
const util = require('../../../utils/util.js')

Page({
  data: {
    registrations: []
  },

  onShow() {
    this.setData({ registrations: dm.getMyRegistrations() })
  },

  cancel(e) {
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '取消报名',
      content: '确定取消这条报名记录吗？',
      confirmColor: '#ff7675',
      success: (res) => {
        if (res.confirm) {
          const list = dm.cancelMyRegistration(id)
          this.setData({ registrations: list })
          util.showToast('已取消报名')
        }
      }
    })
  }
})
