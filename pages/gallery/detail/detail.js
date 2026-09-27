const dm = require('../../../utils/data-manager.js')
const util = require('../../../utils/util.js')

Page({
  data: {
    album: null,
    current: 0
  },

  onLoad(options) {
    const index = parseInt(options.index || 0, 10)
    const album = dm.getGallery()[index]
    if (!album) {
      wx.navigateBack()
      return
    }
    wx.setNavigationBarTitle({ title: album.title })
    this.setData({ album })
  },

  previewImage(e) {
    const { idx } = e.currentTarget.dataset
    const urls = this.data.album.images
    wx.previewImage({ urls, current: urls[idx] })
  },

  goToHonor() {
    util.navigate('/pages/honor/honor')
  },

  goToApply() {
    util.switchTab('/pages/recruitment/list/list')
  },

  onShareAppMessage() {
    const album = this.data.album
    return {
      title: album ? album.title : '算软社风采',
      path: '/pages/gallery/gallery'
    }
  }
})
