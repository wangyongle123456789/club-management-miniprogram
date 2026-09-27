const dm = require('../../utils/data-manager.js')
const util = require('../../utils/util.js')

const CATEGORIES = [
  { key: '全部', label: '全部' },
  { key: '算法', label: '算法' },
  { key: '竞赛', label: '竞赛' },
  { key: 'AI科研', label: 'AI 科研' },
  { key: '工程协作', label: '工程协作' },
  { key: 'Web项目', label: 'Web 项目' },
  { key: '网络安全', label: '网络安全' },
  { key: '综合展示', label: '综合展示' }
]

Page({
  data: {
    categories: CATEGORIES,
    activeCat: '全部',
    list: [],
    all: []
  },

  onLoad() {
    const all = dm.getBlueprint()
    this.setData({ all, list: all })
  },

  onShow() {
    if (this.data.all.length === 0) {
      this.onLoad()
    }
  },

  onPullDownRefresh() {
    const all = dm.getBlueprint()
    const list = this.data.activeCat === '全部'
      ? all
      : all.filter(i => i.category === this.data.activeCat)
    this.setData({ all, list }, () => wx.stopPullDownRefresh())
  },

  switchCat(e) {
    const key = e.currentTarget.dataset.key
    const all = this.data.all
    const list = key === '全部' ? all : all.filter(i => i.category === key)
    this.setData({ activeCat: key, list })
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id
    if (!id) return
    util.navigate('/pages/blueprint/detail/detail?id=' + id)
  },

  goRecruit() {
    util.switchTab('/pages/recruitment/list/list')
  }
})
