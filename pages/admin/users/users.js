const dm = require('../../../utils/data-manager.js')
const util = require('../../../utils/util.js')

Page({
  data: {
    users: [],
    filtered: [],
    keyword: ''
  },

  onLoad() {
    if (!util.checkAdmin()) return
    this.loadUsers()
  },

  onShow() {
    if (wx.getStorageSync('isAdmin')) this.loadUsers()
  },

  loadUsers() {
    const users = dm.getUsers()
    this.setData({ users, filtered: users, keyword: '' })
  },

  onSearch(e) {
    const keyword = e.detail.value.trim().toLowerCase()
    const filtered = this.data.users.filter(u =>
      u.name.toLowerCase().includes(keyword) ||
      u.username.includes(keyword) ||
      (u.major && u.major.toLowerCase().includes(keyword))
    )
    this.setData({ keyword, filtered })
  },

  clearSearch() {
    this.setData({ keyword: '', filtered: this.data.users })
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    util.navigate(`/pages/admin/users/detail/detail?id=${id}`)
  },

  deleteUser(e) {
    const { id, name } = e.currentTarget.dataset
    wx.showModal({
      title: '确认删除',
      content: `确定要删除用户「${name}」吗？\n删除后数据无法恢复。`,
      confirmText: '删除',
      confirmColor: '#e74c3c',
      success: (res) => {
        if (res.confirm) {
          const updated = dm.deleteUser(id)
          dm.addLog('删除用户', `姓名：${name}`)
          this.setData({ users: updated, filtered: updated.filter(u => this.match(u, this.data.keyword)) })
          util.showToast('已删除')
        }
      }
    })
  },

  match(user, keyword) {
    if (!keyword) return true
    const k = keyword.toLowerCase()
    return user.name.toLowerCase().includes(k) ||
      user.username.includes(k) ||
      (user.major && user.major.toLowerCase().includes(k))
  }
})
