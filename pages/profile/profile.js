const dm = require('../../utils/data-manager.js')
const util = require('../../utils/util.js')

Page({
  data: {
    currentUser: null,
    isAdmin: false,
    isLoggingIn: false,
    showLogin: false,
    loginForm: {
      username: '',
      password: ''
    },
    loginError: '',
    stats: {
      registrations: 0,
      favorites: 0,
      history: 0
    },
    menuList: [
      { icon: '👤', title: '个人资料', url: '/pages/profile/register/register', needLogin: true },
      { icon: '📝', title: '我的报名', url: '/pages/profile/my-registrations/my-registrations', needLogin: true },
      { icon: '⭐', title: '我的收藏', url: '/pages/profile/my-favorites/my-favorites', needLogin: true },
      { icon: '🕐', title: '历史浏览', url: '/pages/profile/history/history', needLogin: false },
      { icon: 'ℹ️', title: '关于我们', url: '/pages/profile/about/about', needLogin: false }
    ]
  },

  onShow() {
    const user = dm.getCurrentUser()

    this.setData({
      currentUser: user,
      isAdmin: wx.getStorageSync('isAdmin'),
      stats: {
        registrations: dm.getMyRegistrations().length,
        favorites: dm.getMyFavorites().length,
        history: dm.getMyHistory().length
      }
    })
  },

  // 切换登录面板
  toggleLogin() {
    this.setData({
      showLogin: !this.data.showLogin,
      loginForm: { username: '', password: '' },
      loginError: ''
    })
  },

  // 登录表单输入
  onLoginInput(e) {
    const { field } = e.currentTarget.dataset
    this.setData({ [`loginForm.${field}`]: e.detail.value, loginError: '' })
  },

  // 执行登录
  handleLogin() {
    const { loginForm, isLoggingIn } = this.data
    if (isLoggingIn) return

    const username = loginForm.username.trim()
    const password = loginForm.password

    if (!username) return this.setData({ loginError: '请输入学号' })
    if (!password) return this.setData({ loginError: '请输入密码' })

    this.setData({ isLoggingIn: true, loginError: '' })

    setTimeout(() => {
      const result = dm.login(username, password)
      if (result.success) {
        dm.saveCurrentUser(result.user)
        this.setData({
          currentUser: result.user,
          showLogin: false,
          isLoggingIn: false
        })
        util.showToast('登录成功')
      } else {
        this.setData({
          loginError: result.msg,
          isLoggingIn: false
        })
      }
    }, 300)
  },

  // 退出登录
  handleLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出当前账号吗？',
      success: (res) => {
        if (res.confirm) {
          dm.logout()
          this.setData({ currentUser: null })
          util.showToast('已退出')
        }
      }
    })
  },

  goToPage(e) {
    const { url, needlogin } = e.currentTarget.dataset
    // 需要登录的页面，检查登录态
    if (needlogin && !this.data.currentUser) {
      util.showToast('请先登录')
      this.setData({ showLogin: true })
      return
    }
    util.navigate(url)
  },

  goToRegister() {
    this.setData({ showLogin: false })
    util.navigate('/pages/profile/register/register')
  },

  goToPrivacy() {
    util.navigate('/pages/privacy/privacy')
  },

  goToAdmin() {
    if (this.data.isAdmin) {
      util.navigate('/pages/admin/index/index')
    } else {
      util.navigate('/pages/admin/login/login')
    }
  }
})
