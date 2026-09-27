const util = require('../../../utils/util.js')

Page({
  data: {
    sections: [
      { id: 'club', icon: '🏫', title: '社团信息', desc: '编辑社团名称、简介、联系方式等', url: '/pages/admin/content-edit/content-edit?type=club' },
      { id: 'banner', icon: '🖼️', title: '轮播图管理', desc: '首页顶部轮播 Banner 图片', url: '/pages/admin/content-edit/content-edit?type=banner' },
      { id: 'announcement', icon: '📢', title: '公告管理', desc: '新增、编辑、删除社团公告', url: '/pages/admin/content-edit/content-edit?type=announcement' },
      { id: 'honor', icon: '🏆', title: '荣誉管理', desc: '管理社团荣誉成就列表', url: '/pages/admin/content-edit/content-edit?type=honor' },
      { id: 'activity', icon: '📅', title: '活动管理', desc: '管理社团活动日程', url: '/pages/admin/content-edit/content-edit?type=activity' },
      { id: 'training', icon: '📚', title: '培训管理', desc: '管理算法培训课程', url: '/pages/admin/content-edit/content-edit?type=training' },
      { id: 'gallery', icon: '📷', title: '风采管理', desc: '管理社团风采展示图片', url: '/pages/admin/content-edit/content-edit?type=gallery' }
    ]
  },

  onLoad() {
    if (!util.checkAdmin()) return
  },

  goToEdit(e) {
    const { url } = e.currentTarget.dataset
    util.navigate(url)
  }
})
