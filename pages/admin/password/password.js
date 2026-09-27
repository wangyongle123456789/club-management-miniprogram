const dm = require('../../../utils/data-manager.js')
const util = require('../../../utils/util.js')

const DEFAULT_PASSWORD = 'admin123'
const ADMIN_PWD_KEY = 'adminPassword'

Page({
  data: {
    form: { oldPwd: '', newPwd: '', confirmPwd: '' },
    submitting: false
  },

  onLoad() {
    if (!util.checkAdmin()) return
  },

  onInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({ [`form.${field}`]: e.detail.value })
  },

  submit() {
    if (this.data.submitting) return
    const { oldPwd, newPwd, confirmPwd } = this.data.form
    const storedPwd = wx.getStorageSync(ADMIN_PWD_KEY) || DEFAULT_PASSWORD

    if (!oldPwd) return util.showToast('请输入旧密码')
    if (!newPwd) return util.showToast('请输入新密码')
    if (!confirmPwd) return util.showToast('请确认新密码')
    if (newPwd !== confirmPwd) return util.showToast('两次密码不一致')
    if (newPwd.length < 6) return util.showToast('密码长度不能少于6位')
    if (oldPwd !== storedPwd) return util.showToast('旧密码错误')

    this.setData({ submitting: true })
    wx.setStorageSync(ADMIN_PWD_KEY, newPwd)
    dm.addLog('修改管理员密码')
    util.showToast('密码修改成功', 'success')
    setTimeout(() => wx.navigateBack(), 1000)
  }
})
