const dm = require('../../utils/data-manager.js')
const util = require('../../utils/util.js')

Page({
  data: {
    clubName: '',
    trainings: []
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
      trainings: dm.getTrainings()
    }, () => {
      if (typeof done === 'function') done()
    })
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    util.navigate('/pages/training/detail/detail?id=' + id)
  }
})
