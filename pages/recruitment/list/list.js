const dm = require('../../../utils/data-manager.js')
const util = require('../../../utils/util.js')

// 部门名 → 门派 id 映射（深链定位用）
const DEPT_TO_SECT = {
  '算法组': 'algo',
  '软件组': 'software',
  '硬件组': 'hardware',
  '人工智能组': 'ai'
}

Page({
  data: {
    club: {},
    tab: 'intro'
  },

  onShow() {
    this.loadData()
  },

  onPullDownRefresh() {
    this.loadData(() => wx.stopPullDownRefresh())
  },

  loadData(done) {
    this.setData({ club: dm.getClubInfo() }, () => {
      if (typeof done === 'function') done()
    })
  },

  switchTab(e) {
    const { tab } = e.currentTarget.dataset
    this.setData({ tab })
  },

  goToApply() {
    const { club } = this.data
    if (club.status !== 'recruiting') return
    util.navigate(`/pages/recruitment/apply/apply?id=${club.id}`)
  },

  goToDetail() {
    const { club } = this.data
    util.navigate(`/pages/recruitment/detail/detail?id=${club.id}`)
  },

  goToSects() {
    util.navigate('/pages/sects/sects')
  },

  // 点某个方向 → 进门派页定位高亮对应宗门
  goToSectDetail(e) {
    const { dept } = e.currentTarget.dataset
    const id = DEPT_TO_SECT[dept]
    util.navigate(id ? '/pages/sects/sects?id=' + id : '/pages/sects/sects')
  }
})
