const dm = require('../../utils/data-manager.js')

Page({
  data: {
    story: {}
  },

  onLoad() {
    this.setData({ story: dm.getStory() })
    wx.setNavigationBarTitle({ title: '社团故事' })
  }
})
