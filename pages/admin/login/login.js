const util = require('../../../utils/util.js')

// 默认管理员密码
const DEFAULT_PASSWORD = 'admin123'

Page({
  data: {
    password: '',
    errorMsg: '',
    loading: false
  },

  onLoad() {
    // 如果已经登录，直接跳过后台
    if (wx.getStorageSync('isAdmin')) {
      wx.redirectTo({ url: '/pages/admin/index/index' })
    }
  },

  onInput(e) {
    this.setData({ password: e.detail.value, errorMsg: '' })
  },

  handleLogin() {
    const { password, loading } = this.data
    if (loading) return
    if (!password.trim()) {
      this.setData({ errorMsg: '请输入管理密码' })
      return
    }

    this.setData({ loading: true })

    // 从存储中读取实际密码（支持后续修改），默认使用 DEFAULT_PASSWORD
    const storedPwd = wx.getStorageSync('adminPassword') || DEFAULT_PASSWORD

    // 模拟异步验证
    setTimeout(() => {
      if (password === storedPwd) {
        wx.setStorageSync('isAdmin', true)
        wx.setStorageSync('adminPassword', storedPwd)
        getApp().globalData.isAdmin = true
        util.showToast('验证成功', 'success')
        setTimeout(() => {
          wx.redirectTo({ url: '/pages/admin/index/index' })
        }, 800)
      } else {
        this.setData({
          errorMsg: '密码错误，请重试',
          loading: false
        })
      }
    }, 400)
  }
})
