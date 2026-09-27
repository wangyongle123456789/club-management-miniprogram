const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${[year, month, day].map(formatNumber).join('-')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

const showToast = (title, icon = 'none') => {
  wx.showToast({ title, icon, duration: 2000 })
}

const navigate = (url) => {
  wx.navigateTo({ url })
}

const switchTab = (url) => {
  wx.switchTab({ url })
}

const checkAdmin = () => {
  if (!wx.getStorageSync('isAdmin')) {
    wx.redirectTo({ url: '/pages/admin/login/login' })
    return false
  }
  return true
}

module.exports = {
  formatTime,
  formatDate,
  showToast,
  navigate,
  switchTab,
  checkAdmin
}
