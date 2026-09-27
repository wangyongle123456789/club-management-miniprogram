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
    applied: false,
    favorited: false
  },

  onLoad() {
    const club = dm.getClubInfo()
    this.setData({ club })
    this.refreshStatus()
    dm.addHistory(club)
  },

  onShow() {
    this.refreshStatus()
  },

  refreshStatus() {
    const club = dm.getClubInfo()
    this.setData({
      club,
      applied: dm.isRegistered(club.id),
      favorited: dm.isFavorited(club.id)
    })
  },

  goToApply() {
    const { club, applied } = this.data
    if (club.status !== 'recruiting' || applied) return
    util.navigate(`/pages/recruitment/apply/apply?id=${club.id}`)
  },

  goToStory() {
    util.navigate('/pages/story/story')
  },

  goToSects() {
    util.navigate('/pages/sects/sects')
  },

  // 点某个部门 → 进门派页定位高亮对应宗门
  goToSectDetail(e) {
    const { dept } = e.currentTarget.dataset
    const id = DEPT_TO_SECT[dept]
    util.navigate(id ? '/pages/sects/sects?id=' + id : '/pages/sects/sects')
  },

  toggleFavorite() {
    const { club, favorited } = this.data
    const result = dm.toggleFavorite(club)
    this.setData({ favorited: result.favorited })
    util.showToast(result.favorited ? '已收藏' : '已取消收藏')
  },

  onShareAppMessage() {
    const { club } = this.data
    return {
      title: `一起加入${club.name}吧！`,
      path: '/pages/recruitment/detail/detail'
    }
  }
})
