const dm = require('../../../utils/data-manager.js')
const util = require('../../../utils/util.js')

const ADMIN_KEY = 'dm_admins'
const DEFAULT_ADMINS = [
  { id: 1, name: 'admin', role: '超级管理员' },
  { id: 2, name: 'editor', role: '内容管理员' }
]

Page({
  data: {
    admins: [],
    showAdd: false,
    form: { name: '', role: '' },
    submitting: false
  },

  onLoad() {
    if (!util.checkAdmin()) return
    this.loadAdmins()
  },

  onShow() {
    if (wx.getStorageSync('isAdmin')) this.loadAdmins()
  },

  loadAdmins() {
    const admins = wx.getStorageSync(ADMIN_KEY) || DEFAULT_ADMINS
    this.setData({ admins })
  },

  toggleAdd() {
    this.setData({ showAdd: !this.data.showAdd, form: { name: '', role: '' } })
  },

  onInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({ [`form.${field}`]: e.detail.value })
  },

  addAdmin() {
    if (this.data.submitting) return
    const { name, role } = this.data.form
    if (!name.trim()) return util.showToast('请输入管理员账号')
    if (!role.trim()) return util.showToast('请输入角色')

    this.setData({ submitting: true })
    const admins = this.data.admins
    admins.push({
      id: dm.nextId(admins),
      name: name.trim(),
      role: role.trim()
    })
    wx.setStorageSync(ADMIN_KEY, admins)
    dm.addLog('新增管理员', `账号：${name.trim()}`)
    this.setData({ admins, showAdd: false, submitting: false })
    util.showToast('已添加')
  },

  deleteAdmin(e) {
    const { id, name } = e.currentTarget.dataset
    wx.showModal({
      title: '确认删除',
      content: `确定删除管理员「${name}」吗？`,
      confirmColor: '#e74c3c',
      success: (res) => {
        if (res.confirm) {
          const admins = this.data.admins.filter(a => a.id !== id)
          wx.setStorageSync(ADMIN_KEY, admins)
          dm.addLog('删除管理员', `账号：${name}`)
          this.setData({ admins })
          util.showToast('已删除')
        }
      }
    })
  }
})
