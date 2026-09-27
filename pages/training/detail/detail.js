const dm = require('../../../utils/data-manager.js')
const util = require('../../../utils/util.js')

Page({
  data: {
    item: null
  },

  onLoad(options) {
    const id = parseInt(options.id || 0, 10)
    const item = dm.getTrainings().find(t => t.id === id)
    if (!item) {
      wx.navigateBack()
      return
    }
    wx.setNavigationBarTitle({ title: item.title })
    this.setData({ item })
  },

  goToApply() {
    util.switchTab('/pages/recruitment/list/list')
  },

  onShareAppMessage() {
    const item = this.data.item
    return {
      title: item ? item.title : '算软社培训',
      path: '/pages/training/training'
    }
  }
})
