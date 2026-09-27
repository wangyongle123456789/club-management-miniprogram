// 云函数：用户登录注册
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const COLLECTION = 'users'

exports.main = async (event, context) => {
  const { action, username, password, data } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    if (action === 'login') {
      const res = await db.collection(COLLECTION).where({ username }).limit(1).get()
      const user = res.data[0]
      if (!user) return { success: false, msg: '账号不存在' }
      if (user.status === '禁用') return { success: false, msg: '该账号已被禁用' }
      if (user.password !== password) return { success: false, msg: '密码错误' }
      // 绑定 openid
      await db.collection(COLLECTION).doc(user._id).update({ data: { openid } })
      const { password: _, ...safe } = user
      return { success: true, user: safe }
    }

    if (action === 'register') {
      const exist = await db.collection(COLLECTION).where({ username }).count()
      if (exist.total > 0) return { success: false, msg: '该学号已注册' }
      const allRes = await db.collection(COLLECTION).orderBy('id', 'desc').limit(1).get()
      const newUser = {
        id: allRes.data.length > 0 ? allRes.data[0].id + 1 : 1,
        openid,
        ...data,
        status: '正常'
      }
      await db.collection(COLLECTION).add({ data: newUser })
      const { password: _, ...safe } = newUser
      return { success: true, user: safe }
    }

    if (action === 'get') {
      const res = await db.collection(COLLECTION).orderBy('id', 'asc').get()
      return { success: true, data: res.data.map(u => {
        const { password, ...safe } = u
        return safe
      })}
    }

    if (action === 'delete') {
      await db.collection(COLLECTION).doc(data._id).remove()
      return { success: true }
    }

    return { success: false, msg: '未知操作' }
  } catch (err) {
    return { success: false, msg: err.message }
  }
}
