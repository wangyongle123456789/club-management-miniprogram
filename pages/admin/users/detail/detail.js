const dm = require('../../../../utils/data-manager.js')
const util = require('../../../../utils/util.js')

Page({
  data: {
    user: null
  },

  onLoad(options) {
    if (!util.checkAdmin()) return
    const users = dm.getUsers()
    const user = users.find(u => u.id === Number(options.id))
    this.setData({ user: user || null })
  },

  onShow() {
    if (!this.data.user) return
    const users = dm.getUsers()
    const user = users.find(u => u.id === this.data.user.id)
    // 用户已被删除，返回列表页
    if (!user) {
      util.showToast('该用户已被删除')
      setTimeout(() => wx.navigateBack(), 1500)
      return
    }
    this.setData({ user })
  },

  deleteUser() {
    const { user } = this.data
    if (!user) return
    wx.showModal({
      title: '确认删除',
      content: `确定要删除用户「${user.name}」吗？\n删除后数据无法恢复。`,
      confirmText: '删除',
      confirmColor: '#e74c3c',
      success: (res) => {
        if (res.confirm) {
          dm.deleteUser(user.id)
          util.showToast('已删除')
          setTimeout(() => wx.navigateBack(), 1000)
        }
      }
    })
  }
})
