// app.js
const dm = require('./utils/data-manager.js')

App({
  onLaunch() {
    // 初始化本地存储
    this.initStorage()
    // 同步登录态
    this.syncAuth()

    // 云开发：开启后自动初始化并从云端同步数据
    if (dm.USE_CLOUD) {
      dm.initCloud()
      dm.syncFromCloud()
    }

    wx.login({
      success: res => {
        console.log('login code:', res.code)
      }
    })
  },

  initStorage() {
    // 旧版全局 key（favorites/history/registrations）会在用户登录/使用时迁移到 user_xxx 隔离 key
    const keys = ['currentUser', 'isAdmin']
    keys.forEach(key => {
      if (wx.getStorageSync(key) === '') {
        wx.setStorageSync(key, key === 'isAdmin' ? false : null)
      }
    })
  },

  syncAuth() {
    this.globalData.currentUser = wx.getStorageSync('currentUser') || null
    this.globalData.isAdmin = wx.getStorageSync('isAdmin') || false
  },

  globalData: {
    currentUser: null,
    isAdmin: false
  }
})
