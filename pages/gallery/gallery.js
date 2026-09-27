const dm = require('../../utils/data-manager.js')
const util = require('../../utils/util.js')

Page({
  data: {
    gallery: []
  },

  onShow() {
    this.loadData()
  },

  onPullDownRefresh() {
    this.loadData(() => wx.stopPullDownRefresh())
  },

  loadData(done) {
    const gallery = dm.getGallery()
    this.setData({ gallery }, () => {
      if (typeof done === 'function') done()
    })
  },

  preview(e) {
    const { index } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/gallery/detail/detail?index=' + index
    })
  }
})
