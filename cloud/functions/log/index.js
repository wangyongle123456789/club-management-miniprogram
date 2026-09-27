// 云函数：操作日志
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const COLLECTION = 'logs'

exports.main = async (event, context) => {
  const { action, data } = event
  try {
    if (action === 'add') {
      const allRes = await db.collection(COLLECTION).orderBy('id', 'desc').limit(1).get()
      await db.collection(COLLECTION).add({
        data: {
          id: allRes.data.length > 0 ? allRes.data[0].id + 1 : 1,
          ...data,
          time: new Date().toISOString()
        }
      })
      return { success: true }
    }
    if (action === 'list') {
      const res = await db.collection(COLLECTION).orderBy('id', 'desc').limit(200).get()
      return { success: true, data: res.data }
    }
    if (action === 'clear') {
      const res = await db.collection(COLLECTION).limit(200).get()
      for (const item of res.data) {
        await db.collection(COLLECTION).doc(item._id).remove()
      }
      return { success: true }
    }
    return { success: false, msg: '未知操作' }
  } catch (err) {
    return { success: false, msg: err.message }
  }
}
