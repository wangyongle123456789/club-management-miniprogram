const dm = require('../../../utils/data-manager.js')
const util = require('../../../utils/util.js')

// 每种内容类型的表单字段配置
const FIELD_CONFIG = {
  club: [
    { key: 'name', label: '社团名称', type: 'text', placeholder: '请输入社团名称' },
    { key: 'recruitCount', label: '招募人数', type: 'number', placeholder: '请输入招募人数' },
    { key: 'contact', label: '联系方式', type: 'text', placeholder: 'QQ群/微信/邮箱' },
    { key: 'schedule', label: '活动日程', type: 'textarea', placeholder: '每周三晚 19:00 培训...' },
    { key: 'intro', label: '社团简介', type: 'textarea', placeholder: '请输入社团简介' }
  ],
  announcement: [
    { key: 'title', label: '公告标题', type: 'text', placeholder: '请输入公告标题' },
    { key: 'time', label: '发布时间', type: 'text', placeholder: '如 2026-07-23' },
    { key: 'type', label: '公告类型', type: 'picker', options: ['notice', 'activity'], optionLabels: ['通知', '活动'] }
  ],
  honor: [
    { key: 'text', label: '荣誉内容', type: 'textarea', placeholder: '如 2025 ACM-ICPC 银奖' }
  ],
  activity: [
    { key: 'title', label: '活动名称', type: 'text', placeholder: '请输入活动名称' },
    { key: 'time', label: '活动时间', type: 'text', placeholder: '如 2026-09-10 14:00' },
    { key: 'location', label: '活动地点', type: 'text', placeholder: '如 实验楼A301' },
    { key: 'status', label: '活动状态', type: 'picker', options: ['即将开始', '进行中', '已结束', '未开始'], optionLabels: ['即将开始', '进行中', '已结束', '未开始'] }
  ],
  training: [
    { key: 'title', label: '培训名称', type: 'text', placeholder: '请输入培训名称' },
    { key: 'time', label: '培训时间', type: 'text', placeholder: '如 每周三 19:00-21:00' },
    { key: 'target', label: '目标人群', type: 'textarea', placeholder: '如 面向大一新生' }
  ],
  gallery: [
    { key: 'title', label: '图片标题', type: 'text', placeholder: '请输入活动标题' },
    { key: 'cover', label: '图片链接', type: 'text', placeholder: '请输入图片URL' },
    { key: 'count', label: '图片数量', type: 'number', placeholder: '请输入图片数量' }
  ],
  banner: [
    { key: 'title', label: '标题', type: 'text', placeholder: '请输入轮播图标题' },
    { key: 'cover', label: '图片链接', type: 'text', placeholder: '请输入图片URL，建议 750x320' }
  ]
}

Page({
  data: {
    contentType: '',
    configName: '',
    view: 'list', // list | edit
    items: [],
    editItem: null,
    editFields: [],
    isNew: true,
    confirmDeleteId: null
  },

  onLoad(options) {
    if (!util.checkAdmin()) return

    const type = options.type || 'club'
    let configName = ''

    switch (type) {
      case 'club': configName = '社团信息'; break
      case 'banner': configName = '轮播图'; break
      case 'announcement': configName = '公告'; break
      case 'honor': configName = '荣誉'; break
      case 'activity': configName = '活动'; break
      case 'training': configName = '培训'; break
      case 'gallery': configName = '风采'; break
    }

    wx.setNavigationBarTitle({ title: configName + '管理' })

    this.setData({ contentType: type, configName })

    if (type === 'club') {
      // 社团信息直接进编辑模式
      const club = dm.getClubInfo()
      this.setData({
        view: 'edit',
        editItem: { ...club },
        editFields: FIELD_CONFIG.club,
        isNew: false
      })
    } else {
      this.loadList()
    }
  },

  onShow() {
    // 从编辑页返回后刷新列表
    if (this.data.contentType && this.data.contentType !== 'club' && this.data.view === 'list') {
      this.loadList()
    }
  },

  // ========== 列表模式 ==========
  loadList() {
    const type = this.data.contentType
    let items = []
    switch (type) {
      case 'banner': items = dm.getBanners(); break
      case 'announcement': items = dm.getAnnouncements(); break
      case 'honor': items = dm.getHonors().map((t, i) => ({ id: i + 1, text: t })); break
      case 'activity': items = dm.getActivities(); break
      case 'training': items = dm.getTrainings(); break
      case 'gallery': items = dm.getGallery(); break
    }
    this.setData({ items, view: 'list' })
  },

  addItem() {
    const fields = FIELD_CONFIG[this.data.contentType]
    const empty = {}
    fields.forEach(f => { empty[f.key] = '' })
    this.setData({
      view: 'edit',
      editItem: empty,
      editFields: fields,
      isNew: true
    })
  },

  editItem(e) {
    const item = e.currentTarget.dataset.item
    const fields = FIELD_CONFIG[this.data.contentType]
    this.setData({
      view: 'edit',
      editItem: { ...item },
      editFields: fields,
      isNew: false
    })
  },

  confirmDelete(e) {
    this.setData({ confirmDeleteId: e.currentTarget.dataset.id })
  },

  cancelDelete() {
    this.setData({ confirmDeleteId: null })
  },

  doDelete() {
    const id = this.data.confirmDeleteId
    const type = this.data.contentType
    let list = []
    switch (type) {
      case 'banner': list = dm.getBanners(); break
      case 'announcement': list = dm.getAnnouncements(); break
      case 'honor': list = dm.getHonors().map((t, i) => ({ id: i + 1, text: t })); break
      case 'activity': list = dm.getActivities(); break
      case 'training': list = dm.getTrainings(); break
      case 'gallery': list = dm.getGallery(); break
    }

    list = list.filter(item => item.id !== id)

    switch (type) {
      case 'banner': dm.saveBanners(list); break
      case 'announcement': dm.saveAnnouncements(list); break
      case 'honor': dm.saveHonors(list.map(i => i.text)); break
      case 'activity': dm.saveActivities(list); break
      case 'training': dm.saveTrainings(list); break
      case 'gallery': dm.saveGallery(list); break
    }

    this.setData({ confirmDeleteId: null })
    dm.addLog('删除内容', `类型：${this.data.configName}，ID：${id}`)
    util.showToast('已删除', 'success')
    this.loadList()
  },

  // 阻止弹窗点击事件冒泡
  noop() {},

  // ========== 编辑模式 ==========
  onFieldInput(e) {
    const { field, value } = e.currentTarget.dataset
    if (!field) return
    // bindinput 用 e.detail.value；bindtap（picker 选项）用 dataset.value
    let val = e.detail.value !== undefined ? e.detail.value : value
    // number 类型做整型转换，避免 wxml 输出字符串且后续数值运算出错
    const type = this.data.editFields.find(f => f.key === field)?.type
    if (type === 'number' && val !== '') {
      const n = parseInt(val, 10)
      val = isNaN(n) ? '' : n
    }
    this.setData({ ['editItem.' + field]: val })
  },

  cancelEdit() {
    if (this.data.contentType === 'club') {
      wx.navigateBack()
    } else {
      this.loadList()
    }
  },

  saveEdit() {
    const type = this.data.contentType
    const item = this.data.editItem
    const fields = this.data.editFields

    // 验证必填
    for (const f of fields) {
      const val = item[f.key]
      if (val === '' || val === undefined || val === null) {
        util.showToast('请填写' + f.label)
        return
      }
    }

    if (type === 'club') {
      dm.saveClubInfo({ ...dm.getClubInfo(), ...item })
      util.showToast('社团信息已保存', 'success')
      setTimeout(() => wx.navigateBack(), 800)
      return
    }

    // 列表类数据：新增或更新
    let list = []
    switch (type) {
      case 'banner': list = dm.getBanners(); break
      case 'announcement': list = dm.getAnnouncements(); break
      case 'honor': list = dm.getHonors().map((t, i) => ({ id: i + 1, text: t })); break
      case 'activity': list = dm.getActivities(); break
      case 'training': list = dm.getTrainings(); break
      case 'gallery': list = dm.getGallery(); break
    }

    if (this.data.isNew) {
      item.id = dm.nextId(list)
      list.push({ ...item })
    } else {
      const idx = list.findIndex(i => i.id === item.id)
      if (idx >= 0) list[idx] = { ...item }
    }

    switch (type) {
      case 'banner': dm.saveBanners(list); break
      case 'announcement': dm.saveAnnouncements(list); break
      case 'honor': dm.saveHonors(list.map(i => i.text)); break
      case 'activity': dm.saveActivities(list); break
      case 'training': dm.saveTrainings(list); break
      case 'gallery': dm.saveGallery(list); break
    }

    dm.addLog(this.data.isNew ? '新增内容' : '修改内容', `类型：${this.data.configName}`)
    util.showToast('已保存', 'success')
    this.loadList()
  }
})
