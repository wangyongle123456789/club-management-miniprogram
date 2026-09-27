const dm = require('../../utils/data-manager.js')
const util = require('../../utils/util.js')

Page({
  data: {
    honors: [],
    clubName: ''
  },

  onShow() {
    this.loadData()
  },

  onPullDownRefresh() {
    this.loadData(() => wx.stopPullDownRefresh())
  },

  loadData(done) {
    const club = dm.getClubInfo()
    this.setData({
      honors: dm.getHonorList(),
      clubName: club.name
    }, () => {
      if (typeof done === 'function') done()
    })
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    util.navigate('/pages/honor/detail/detail?id=' + id)
  }
})
