const dm = require('../../../utils/data-manager.js')
const util = require('../../../utils/util.js')

Page({
  data: {
    item: null
  },

  onLoad(options) {
    const id = parseInt(options.id || 0, 10)
    const item = dm.getAnnouncements().find(a => a.id === id)
    if (!item) {
      wx.navigateBack()
      return
    }
    wx.setNavigationBarTitle({ title: item.type === 'notice' ? '通知详情' : '活动详情' })
    this.setData({ item })
  },

  goToApply() {
    util.switchTab('/pages/recruitment/list/list')
  },

  onShareAppMessage() {
    const item = this.data.item
    return {
      title: item ? item.title : '算软社公告',
      path: '/pages/announcement/announcement'
    }
  }
})
