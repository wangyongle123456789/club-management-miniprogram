const dm = require('../../../utils/data-manager.js')
const util = require('../../../utils/util.js')

Page({
  data: {
    rules: {},
    isEditing: false,
    canAddImage: true,
    hasIntroImages: false,
    hasQRCode: false,
    submitting: false
  },

  onLoad() {
    if (!util.checkAdmin()) return
    this.loadRules()
  },

  loadRules() {
    const rules = dm.getEnrollmentRules()
    this.setData({ rules, isEditing: false })
    this.updateComputedFlags()
  },

  updateComputedFlags() {
    const images = this.data.rules.introImages || []
    this.setData({
      canAddImage: images.length < 9,
      hasIntroImages: images.length > 0,
      hasQRCode: !!this.data.rules.qrCode
    })
  },

  toggleEdit() {
    if (this.data.isEditing) {
      this.loadRules()
    } else {
      this.setData({ isEditing: true })
    }
  },

  onInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({ [`rules.${field}`]: e.detail.value })
  },

  onSwitch(e) {
    const { field } = e.currentTarget.dataset
    this.setData({ [`rules.${field}`]: e.detail.value })
  },

  chooseImages() {
    const remain = 9 - (this.data.rules.introImages || []).length
    if (remain <= 0) {
      util.showToast('最多添加9张介绍图')
      return
    }
    wx.chooseImage({
      count: remain,
      sizeType: ['compressed'],
      success: (res) => {
        const images = (this.data.rules.introImages || []).concat(res.tempFilePaths)
        this.setData({ 'rules.introImages': images })
        this.updateComputedFlags()
      }
    })
  },

  removeImage(e) {
    const { index } = e.currentTarget.dataset
    const images = [...this.data.rules.introImages]
    images.splice(index, 1)
    this.setData({ 'rules.introImages': images })
    this.updateComputedFlags()
  },

  chooseQRCode() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: (res) => {
        this.setData({ 'rules.qrCode': res.tempFilePaths[0] })
        this.updateComputedFlags()
      }
    })
  },

  saveRules() {
    if (this.data.submitting) return
    const rules = this.data.rules
    if (!rules.startTime || !rules.endTime) {
      return util.showToast('请填写报名起止时间')
    }
    if (!rules.limit || parseInt(rules.limit) <= 0) {
      return util.showToast('人数限定必须大于0')
    }

    this.setData({ submitting: true })
    dm.saveEnrollmentRules({
      ...rules,
      limit: parseInt(rules.limit, 10)
    })
    dm.addLog('修改报名规则')
    this.setData({ isEditing: false, submitting: false })
    util.showToast('报名规则已保存', 'success')
  },

  resetRules() {
    wx.showModal({
      title: '重置确认',
      content: '将报名规则恢复为默认值，确定继续？',
      confirmColor: '#6c5ce7',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('dm_enrollment_rules')
          this.loadRules()
          dm.addLog('重置报名规则')
          util.showToast('已重置为默认值', 'success')
        }
      }
    })
  }
})
