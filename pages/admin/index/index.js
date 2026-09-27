const { adminMenu } = require('../../../utils/mock.js')
const util = require('../../../utils/util.js')
const dm = require('../../../utils/data-manager.js')

Page({
  data: {
    menu: []
  },

  onLoad() {
    // 权限校验：非管理员跳回登录页
    if (!util.checkAdmin()) return

    this.setData({ menu: adminMenu })
  },

  onShow() {
    // 二次校验：如果权限被清除，跳回
    util.checkAdmin()
  },

  goToPage(e) {
    const { url } = e.currentTarget.dataset
    if (!url) return
    util.navigate(url)
  },

  handleLogout() {
    wx.showModal({
      title: '退出管理',
      content: '确定要退出管理员模式吗？',
      confirmColor: '#6c5ce7',
      success: (res) => {
        if (res.confirm) {
          wx.setStorageSync('isAdmin', false)
          getApp().globalData.isAdmin = false
          util.showToast('已退出管理', 'success')
          setTimeout(() => {
            wx.switchTab({ url: '/pages/profile/profile' })
          }, 600)
        }
      }
    })
  },

  handleSyncCloud() {
    wx.showLoading({ title: '同步中...' })
    dm.saveAllToCloud().then(res => {
      wx.hideLoading()
      util.showToast(res && res.msg ? res.msg : '同步完成', res && res.success ? 'success' : 'none')
    })
  }
})
