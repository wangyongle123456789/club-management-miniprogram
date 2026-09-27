const dm = require('../../../utils/data-manager.js')
const util = require('../../../utils/util.js')

Page({
  data: {
    history: []
  },

  onShow() {
    this.setData({ history: dm.getMyHistory() })
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    util.navigate(`/pages/recruitment/detail/detail?id=${id}`)
  },

  clear() {
    wx.showModal({
      title: '清空历史',
      content: '确定清空所有历史浏览记录吗？',
      confirmColor: '#ff7675',
      success: (res) => {
        if (res.confirm) {
          dm.clearMyHistory()
          this.setData({ history: [] })
          util.showToast('已清空')
        }
      }
    })
  }
})
