// 云函数：club-data
// 提供社团内容的云端读写。所有集合统一以 _id='main' 的文档存储，payload 字段携带真实数据。
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const COLLECTIONS = [
  'clubInfo', 'announcements', 'activities',
  'trainings', 'honors', 'gallery', 'banners', 'sects'
]

exports.main = async (event) => {
  const { action, name, data } = event
  if (!COLLECTIONS.includes(name)) {
    return { success: false, msg: 'unknown collection: ' + name }
  }
  const col = db.collection(name)

  if (action === 'get') {
    const res = await col.doc('main').get().catch(() => null)
    return { success: true, payload: res ? res.data.payload : null }
  }

  if (action === 'set') {
    await col.doc('main').set({ data: { payload: data } })
    return { success: true }
  }

  return { success: false, msg: 'unknown action: ' + action }
}
