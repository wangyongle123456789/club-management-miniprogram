// 云函数：社团信息
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const COLLECTION = 'club'

exports.main = async (event, context) => {
  const { action, data } = event
  try {
    if (action === 'get') {
      const res = await db.collection(COLLECTION).limit(1).get()
      return { success: true, data: res.data[0] || null }
    }
    if (action === 'save') {
      const exist = await db.collection(COLLECTION).limit(1).get()
      if (exist.data.length > 0) {
        await db.collection(COLLECTION).doc(exist.data[0]._id).update({ data })
      } else {
        await db.collection(COLLECTION).add({ data })
      }
      return { success: true }
    }
    return { success: false, msg: '未知操作' }
  } catch (err) {
    return { success: false, msg: err.message }
  }
}
