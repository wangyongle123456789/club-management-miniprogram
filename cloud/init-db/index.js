// 云函数：init-db
// 首次初始化云端数据库。在「云开发控制台 → 云函数 init-db → 测试」中传入：
//   { "data": { "clubInfo": {...}, "announcements": [...], "activities": [...], ... } }
// 即可把对应数据写入云端。日常迁移请直接用小程序后台的「同步到云端」按钮。
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const COLLECTIONS = [
  'clubInfo', 'announcements', 'activities',
  'trainings', 'honors', 'gallery', 'banners', 'sects'
]

exports.main = async (event) => {
  const payload = event.data || {}
  const seeded = []
  for (const name of COLLECTIONS) {
    if (payload[name] === undefined) continue
    await db.collection(name).doc('main').set({ data: { payload: payload[name] } })
    seeded.push(name)
  }
  return { success: true, seeded }
}
