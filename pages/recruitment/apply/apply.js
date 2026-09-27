const dm = require('../../../utils/data-manager.js')
const util = require('../../../utils/util.js')

Page({
  data: {
    club: {},
    sects: [],
    submitting: false,
    form: {
      name: '',
      studentId: '',
      phone: '',
      major: '',
      direction: '',
      qq: '',
      reason: ''
    }
  },

  onShow() {
    this.setData({
      club: dm.getClubInfo(),
      sects: dm.getSects()
    })
  },

  onInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({ [`form.${field}`]: e.detail.value })
  },

  onSelectDirection(e) {
    const { name } = e.currentTarget.dataset
    this.setData({ 'form.direction': name })
  },

  submit() {
    if (this.data.submitting) return
    this.setData({ submitting: true })

    const result = dm.applyRegistration({
      club: this.data.club,
      form: this.data.form
    })

    if (!result.success) {
      util.showToast(result.msg)
      this.setData({ submitting: false })
      return
    }

    util.showToast(result.msg)
    setTimeout(() => {
      wx.navigateBack({ delta: 1 })
    }, 1500)
  }
})
