const dm = require('../../../utils/data-manager.js')
const util = require('../../../utils/util.js')

Page({
  data: {
    item: null
  },

  onLoad(options) {
    const id = parseInt(options.id || 0, 10)
    const item = dm.getBlueprint().find(a => a.id === id)
    if (!item) {
      wx.navigateBack()
      return
    }
    wx.setNavigationBarTitle({ title: item.title })
    this.setData({ item })
  },

  goRecruit() {
    util.switchTab('/pages/recruitment/list/list')
  }
})
