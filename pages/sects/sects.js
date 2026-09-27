const dm = require('../../utils/data-manager.js')

Page({
  data: {
    sects: [],
    activeId: ''
  },

  onLoad(options) {
    const sects = dm.getSects()
    const activeId = options && options.id ? options.id : ''
    this.setData({ sects, activeId }, () => {
      if (activeId) this.scrollToSect(activeId)
    })
  },

  // 从首页门派卡片深链进来：滚动到对应宗门卡片
  scrollToSect(id) {
    const query = wx.createSelectorQuery()
    query.select('#sect-' + id).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec((res) => {
      if (res && res[0] && res[1]) {
        wx.pageScrollTo({
          scrollTop: res[0].top + res[1].scrollTop - 24,
          duration: 300
        })
      }
    })
  },

  goToRecruit() {
    wx.switchTab({ url: '/pages/recruitment/list/list' })
  },

  onShareAppMessage() {
    return {
      title: '算软社四大门派，你 pick 哪一脉？',
      path: '/pages/sects/sects'
    }
  }
})
