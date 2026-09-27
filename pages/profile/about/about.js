const dm = require('../../utils/data-manager.js')

Page({
  data: {
    version: '1.0.0',
    club: {}
  },

  onShow() {
    this.setData({ club: dm.getClubInfo() })
  }
})
