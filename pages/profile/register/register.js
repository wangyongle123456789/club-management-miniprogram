const dm = require('../../../utils/data-manager.js')
const util = require('../../../utils/util.js')

Page({
  data: {
    step: 1,
    form: {
      name: '',
      username: '',
      password: '',
      confirmPwd: '',
      major: '',
      phone: ''
    },
    showPwd: false,
    showConfirmPwd: false,
    submitting: false
  },

  onInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({ [`form.${field}`]: e.detail.value })
  },

  togglePwd() {
    this.setData({ showPwd: !this.data.showPwd })
  },

  toggleConfirmPwd() {
    this.setData({ showConfirmPwd: !this.data.showConfirmPwd })
  },

  nextStep() {
    const { form } = this.data
    // 第一步校验
    if (!form.name.trim()) return util.showToast('请输入姓名')
    if (!form.username.trim()) return util.showToast('请输入学号（作为登录账号）')
    if (!/^\d+$/.test(form.username.trim())) return util.showToast('学号只能包含数字')
    if (form.username.trim().length < 4) return util.showToast('学号至少4位')
    if (!form.password) return util.showToast('请设置密码')
    if (form.password.length < 6) return util.showToast('密码至少6位')
    if (form.password !== form.confirmPwd) return util.showToast('两次密码不一致')

    this.setData({ step: 2 })
  },

  prevStep() {
    this.setData({ step: 1 })
  },

  register() {
    if (this.data.submitting) return
    this.setData({ submitting: true })

    const { form } = this.data
    const result = dm.register({
      name: form.name.trim(),
      username: form.username.trim(),
      password: form.password,
      phone: form.phone.trim(),
      major: form.major.trim()
    })

    if (result.success) {
      dm.saveCurrentUser(result.user)
      util.showToast('注册成功')
      setTimeout(() => wx.switchTab({ url: '/pages/profile/profile' }), 800)
    } else {
      util.showToast(result.msg)
      this.setData({ submitting: false })
    }
  }
})
