const dm = require('../../../utils/data-manager.js')
const util = require('../../../utils/util.js')

Page({
  data: {
    logs: []
  },

  onLoad() {
    if (!util.checkAdmin()) return
    this.loadLogs()
  },

  onShow() {
    if (wx.getStorageSync('isAdmin')) this.loadLogs()
  },

  loadLogs() {
    this.setData({ logs: dm.getLogs() })
  },

  clear() {
    wx.showModal({
      title: '清空日志',
      content: '确定清空所有操作日志吗？',
      confirmColor: '#e74c3c',
      success: (res) => {
        if (res.confirm) {
          dm.saveLogs([])
          this.setData({ logs: [] })
          util.showToast('已清空')
        }
      }
    })
  }
})
