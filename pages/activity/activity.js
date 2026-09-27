const dm = require('../../utils/data-manager.js')
const util = require('../../utils/util.js')

Page({
  data: {
    clubName: '',
    activities: []
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
      clubName: club.name,
      activities: dm.getActivities()
    }, () => {
      if (typeof done === 'function') done()
    })
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    util.navigate('/pages/activity/detail/detail?id=' + id)
  }
})
