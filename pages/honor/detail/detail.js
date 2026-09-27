const dm = require('../../../utils/data-manager.js')
const util = require('../../../utils/util.js')

Page({
  data: {
    honor: null
  },

  onLoad(options) {
    const id = parseInt(options.id || 0, 10)
    const honor = dm.getHonorList().find(item => item.id === id)
    if (!honor) {
      wx.navigateBack()
      return
    }
    wx.setNavigationBarTitle({ title: honor.title })
    this.setData({ honor })
  },

  previewPhoto() {
    const photo = this.data.honor.photo
    if (photo) {
      wx.previewImage({ urls: [photo], current: photo })
    }
  },

  goToGallery() {
    const related = this.data.honor.relatedAlbum
    if (related) {
      util.navigate('/pages/gallery/detail/detail?index=' + (related - 1))
    } else {
      util.navigate('/pages/gallery/gallery')
    }
  },

  goToApply() {
    util.switchTab('/pages/recruitment/list/list')
  },

  onShareAppMessage() {
    const honor = this.data.honor
    return {
      title: honor ? honor.title : '算软社荣誉成就',
      path: '/pages/honor/honor'
    }
  }
})
