const dm = require('../../utils/data-manager.js')
const util = require('../../utils/util.js')

Page({
  data: {
    list: []
  },

  onShow() {
    this.loadData()
  },

  onPullDownRefresh() {
    this.loadData(() => wx.stopPullDownRefresh())
  },

  loadData(done) {
    this.setData({ list: dm.getAnnouncements() }, () => {
      if (typeof done === 'function') done()
    })
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    util.navigate('/pages/announcement/detail/detail?id=' + id)
  }
})
