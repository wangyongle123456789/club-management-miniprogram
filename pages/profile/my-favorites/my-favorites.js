const dm = require('../../../utils/data-manager.js')
const util = require('../../../utils/util.js')

Page({
  data: {
    favorites: []
  },

  onShow() {
    this.setData({ favorites: dm.getMyFavorites() })
  },

  goToDetail(e) {
    const { id } = e.currentTarget.dataset
    util.navigate(`/pages/recruitment/detail/detail?id=${id}`)
  },

  remove(e) {
    const { id } = e.currentTarget.dataset
    const list = dm.removeMyFavorite(id)
    this.setData({ favorites: list })
    util.showToast('已取消收藏')
  }
})
