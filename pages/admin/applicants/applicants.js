const dm = require('../../../utils/data-manager.js')
const util = require('../../../utils/util.js')

Page({
  data: {
    applicants: []
  },

  onLoad() {
    if (!util.checkAdmin()) return
    this.loadList()
  },

  onShow() {
    if (wx.getStorageSync('isAdmin')) this.loadList()
  },

  loadList() {
    const registrations = dm.getAllRegistrations()
    this.setData({
      applicants: registrations.map(r => ({
        id: r.id,
        name: r.name,
        studentId: r.studentId,
        club: r.clubName,
        phone: r.phone,
        major: r.major,
        status: r.status,
        time: r.applyTime
      }))
    })
  },

  audit(e) {
    const { id } = e.currentTarget.dataset
    const registrations = dm.getAllRegistrations()
    const r = registrations.find(i => i.id === id)
    if (!r) return

    const nextStatus = r.status === 'approved' ? 'pending' : 'approved'
    dm.auditRegistration(id, nextStatus)
    dm.addLog(nextStatus === 'approved' ? '审核通过报名' : '驳回报名', `姓名：${r.name}，学号：${r.studentId}`)
    this.loadList()
    util.showToast('审核完成')
  },

  exportExcel() {
    const { applicants } = this.data
    if (applicants.length === 0) return util.showToast('暂无数据可导出')

    const header = ['姓名', '学号', '专业', '手机', '状态', '报名时间'].join('\t')
    const rows = applicants.map(a => [a.name, a.studentId, a.major, a.phone, a.status === 'approved' ? '已通过' : '待审核', a.time].join('\t'))
    const text = [header, ...rows].join('\n')

    wx.setClipboardData({
      data: text,
      success: () => {
        dm.addLog('导出报名名单', `共 ${applicants.length} 人`)
        util.showToast('名单已复制到剪贴板')
      }
    })
  },

  clear() {
    wx.showModal({
      title: '清空数据',
      content: '确定清空所有报名数据吗？该操作不可恢复。',
      confirmColor: '#ff7675',
      success: (res) => {
        if (res.confirm) {
          dm.clearAllRegistrations()
          dm.addLog('清空报名数据')
          this.setData({ applicants: [] })
          util.showToast('已清空所有报名数据')
        }
      }
    })
  }
})
