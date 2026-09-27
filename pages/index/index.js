const dm = require('../../utils/data-manager.js')
const util = require('../../utils/util.js')

Page({
  data: {
    banners: [],
    currentBanner: 0,
    announcements: [],
    navs: [
      { icon: '📢', text: '社团公告', url: '/pages/announcement/announcement', iconClass: 'nav-icon-1' },
      { icon: '🖼️', text: '社团风采', url: '/pages/gallery/gallery', iconClass: 'nav-icon-2' },
      { icon: '📖', text: '社团故事', url: '/pages/story/story', iconClass: 'nav-icon-3' },
      { icon: '📅', text: '活动日程', url: '/pages/activity/activity', iconClass: 'nav-icon-4' },
      { icon: '🏆', text: '荣誉成就', url: '/pages/honor/honor', iconClass: 'nav-icon-5' },
      { icon: '✅', text: '立即报名', url: '/pages/recruitment/list/list', iconClass: 'nav-icon-6' },
      { icon: '⚔️', text: '四大门派', url: '/pages/sects/sects', iconClass: 'nav-icon-7' },
      { icon: '🚀', text: '活动全景', url: '/pages/blueprint/blueprint', iconClass: 'nav-icon-8' }
    ],
    club: {},
    eggCount: 0,
    stats: [],
    sects: [],
    recruitPercent: 0
  },

  onShow() {
    this.loadData()
  },

  onPullDownRefresh() {
    this.loadData(() => wx.stopPullDownRefresh())
  },

  loadData(done) {
    const club = dm.getClubInfo()
    const blueprint = dm.getBlueprint()
    const stats = [
      { num: club.founderYear, label: '社团成立于', url: '/pages/story/story' },
      { num: (club.honors ? club.honors.length : 0) + '+', label: '省级以上荣誉', url: '/pages/honor/honor' },
      { num: club.directions, label: '技术方向', url: '/pages/sects/sects' },
      { num: blueprint.length, label: '年度硬核活动', url: '/pages/blueprint/blueprint' }
    ]
    const percent = club.recruitCount > 0
      ? Math.round(club.recruitedCount / club.recruitCount * 100)
      : 0
    this.setData({
      banners: dm.getBanners(),
      club: club,
      announcements: dm.getAnnouncements().slice(0, 4),
      blueprint: blueprint.slice(0, 4),
      sects: dm.getSects(),
      stats: stats,
      recruitPercent: percent
    }, () => {
      if (typeof done === 'function') done()
    })
  },

  // 数据说服带：点哪个数字，跳对应的说明页
  onStatTap(e) {
    const { url } = e.currentTarget.dataset
    if (url) util.navigate(url)
  },

  goToSects() {
    util.navigate('/pages/sects/sects')
  },

  // 门派卡片：点哪张，进门派页定位高亮那一宗
  goToSectDetail(e) {
    const { id } = e.currentTarget.dataset
    util.navigate(id ? '/pages/sects/sects?id=' + id : '/pages/sects/sects')
  },

  onNavTap(e) {
    const { url } = e.currentTarget.dataset
    if (!url) return
    const tabBarPages = ['/pages/index/index', '/pages/recruitment/list/list', '/pages/gallery/gallery', '/pages/profile/profile']
    if (tabBarPages.includes(url)) {
      util.switchTab(url)
    } else {
      util.navigate(url)
    }
  },

  goToAnnouncement() {
    util.navigate('/pages/announcement/announcement')
  },

  // 首页公告卡片（announcement-item 组件 triggerEvent('tap')）点击 → 跳公告详情
  goToAnnouncementDetail(e) {
    const id = e.detail && e.detail.id
    if (id === undefined || id === null) return
    util.navigate('/pages/announcement/detail/detail?id=' + id)
  },

  onBannerChange(e) {
    this.setData({ currentBanner: e.detail.current })
  },

  goToBannerDetail(e) {
    const { index } = e.currentTarget.dataset
    const bannerIndex = index !== undefined ? index : this.data.currentBanner
    const banner = this.data.banners[bannerIndex]
    if (banner && banner.url) {
      util.navigate(banner.url)
    } else {
      util.navigate('/pages/gallery/gallery')
    }
  },

  goToRecruitDetail() {
    util.switchTab('/pages/recruitment/list/list')
  },

  goToBlueprint() {
    util.navigate('/pages/blueprint/blueprint')
  },

  goToBlueprintDetail(e) {
    const id = e.currentTarget.dataset.id
    if (id === undefined || id === null) return
    util.navigate('/pages/blueprint/detail/detail?id=' + id)
  },

  // 隐藏彩蛋：连续点击社名 5 次进入「秘密基地」
  eggTap() {
    const c = this.data.eggCount + 1
    this.setData({ eggCount: c })
    if (c === 3) {
      util.showToast('🐱 再点两下试试…')
    }
    if (c >= 5) {
      this.setData({ eggCount: 0 })
      wx.navigateTo({ url: '/pages/easter/easter' })
    }
  }
})
