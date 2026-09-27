// 云函数：内容管理（公告/活动/培训/荣誉/相册/轮播）
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

const COLLECTION_MAP = {
  announcement: 'announcements',
  activity: 'activities',
  training: 'trainings',
  honor: 'honors',
  gallery: 'gallery',
  banner: 'banners'
}

exports.main = async (event, context) => {
  const { type, action, data } = event
  const collection = COLLECTION_MAP[type]
  if (!collection) return { success: false, msg: '未知内容类型' }

  try {
    if (action === 'list') {
      const res = await db.collection(collection).orderBy('id', 'asc').get()
      return { success: true, data: res.data }
    }
    if (action === 'save') {
      if (data._id) {
        const id = data._id
        delete data._id
        await db.collection(collection).doc(id).update({ data })
      } else {
        await db.collection(collection).add({ data })
      }
      return { success: true }
    }
    if (action === 'delete') {
      await db.collection(collection).doc(data._id).remove()
      return { success: true }
    }
    return { success: false, msg: '未知操作' }
  } catch (err) {
    return { success: false, msg: err.message }
  }
}
