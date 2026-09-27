// 云函数：报名管理
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

const CLUB_ID = 1

exports.main = async (event, context) => {
  const { action, data } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    if (action === 'apply') {
      const { club, form } = data
      const rulesRes = await db.collection('enrollment_rules').limit(1).get()
      const rules = rulesRes.data[0] || { limit: 9999, requireAudit: true }

      const now = new Date().getTime()
      if (rules.startTime && new Date(rules.startTime).getTime() > now) {
        return { success: false, msg: '报名尚未开始' }
      }
      if (rules.endTime && new Date(rules.endTime).getTime() < now) {
        return { success: false, msg: '报名已结束' }
      }

      const countRes = await db.collection('registrations').count()
      if (countRes.total >= rules.limit) {
        return { success: false, msg: '报名人数已满' }
      }

      const exist = await db.collection('registrations')
        .where({ openid, clubId: club.id })
        .count()
      if (exist.total > 0) {
        return { success: false, msg: '你已报名本社团' }
      }

      const allRes = await db.collection('registrations').orderBy('id', 'desc').limit(1).get()
      const nextId = allRes.data.length > 0 ? allRes.data[0].id + 1 : 1

      const record = {
        id: nextId,
        openid,
        clubId: club.id,
        clubName: club.name,
        name: form.name.trim(),
        studentId: form.studentId.trim(),
        phone: form.phone.trim(),
        major: (form.major || '').trim(),
        reason: form.reason.trim(),
        status: rules.requireAudit ? 'pending' : 'approved',
        applyTime: new Date().toISOString()
      }
      await db.collection('registrations').add({ data: record })

      const total = await db.collection('registrations').count()
      await db.collection('club').doc('main').update({
        data: { recruitedCount: total.total }
      })

      return { success: true, msg: rules.requireAudit ? '报名成功，等待审核' : '报名成功' }
    }

    if (action === 'list') {
      const res = await db.collection('registrations').orderBy('id', 'desc').get()
      return { success: true, data: res.data }
    }

    if (action === 'my') {
      const res = await db.collection('registrations')
        .where({ openid, clubId: CLUB_ID })
        .orderBy('id', 'desc')
        .get()
      return { success: true, data: res.data }
    }

    if (action === 'audit') {
      const { _id, status } = data
      await db.collection('registrations').doc(_id).update({
        data: { status, auditTime: new Date().toISOString() }
      })
      return { success: true }
    }

    if (action === 'cancel') {
      const { _id } = data
      await db.collection('registrations').doc(_id).remove()
      const total = await db.collection('registrations').count()
      await db.collection('club').doc('main').update({
        data: { recruitedCount: total.total }
      })
      return { success: true }
    }

    if (action === 'clear') {
      // 小程序云开发一次性最多删除 100 条，这里简单遍历
      const res = await db.collection('registrations').limit(100).get()
      for (const item of res.data) {
        await db.collection('registrations').doc(item._id).remove()
      }
      await db.collection('club').doc('main').update({ data: { recruitedCount: 0 } })
      return { success: true }
    }

    return { success: false, msg: '未知操作' }
  } catch (err) {
    return { success: false, msg: err.message }
  }
}
