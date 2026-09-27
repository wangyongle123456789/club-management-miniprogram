// 数据管理器：本地 storage + 云开发抽象层
// 真实上线前，将 USE_CLOUD 设为 true，并在微信开发者工具中开通云开发环境
const mock = require('./mock.js')

const USE_CLOUD = false

// 微信云开发环境配置（开通云开发后填入环境 ID）
const cloudConfig = require('./cloud-config.js')

// 门派数据版本号
const SECTS_VERSION = mock.SECTS_VERSION

// ========== Storage Keys ==========
const STORAGE_KEY = {
  clubInfo: 'dm_clubInfo',
  announcements: 'dm_announcements',
  activities: 'dm_activities',
  trainings: 'dm_trainings',
  honors: 'dm_honors',
  gallery: 'dm_gallery',
  users: 'dm_users',
  banners: 'dm_banners',
  enrollmentRules: 'dm_enrollment_rules',
  sects: 'dm_sects',
  blueprint: 'dm_blueprint'
}

const VERSION_KEY = {
  clubInfo: 'dm_clubInfo_version',
  banners: 'dm_banners_version',
  gallery: 'dm_gallery_version',
  announcements: 'dm_announcements_version',
  activities: 'dm_activities_version',
  trainings: 'dm_trainings_version',
  sects: 'dm_sects_version',
  blueprint: 'dm_blueprint_version'
}

// 旧 key，用于一次性数据迁移
const LEGACY_KEYS = ['registrations', 'favorites', 'history']

// 默认用户数据（含密码字段，仅本地认证使用；上线后应走云函数）
const DEFAULT_USERS = [
  { id: 1, name: '张三', username: '2025001', password: '123456', phone: '13800138000', major: '计算机科学', status: '正常' },
  { id: 2, name: '李四', username: '2025002', password: '123456', phone: '13800138001', major: '软件工程', status: '正常' },
  { id: 3, name: '王五', username: '2025003', password: '123456', phone: '13800138002', major: '人工智能', status: '禁用' }
]

// 活动数据版本号（与社团活动开展计划保持一致，修改后请递增）
const ACTIVITIES_VERSION = '20260826-03'

const DEFAULT_ACTIVITIES = [
  {
    id: 1,
    title: '算法筑基·核心算法编程对抗赛',
    time: '2026-10-15 19:00',
    location: '综合楼 M304',
    status: '即将开始',
    desc: '以赛促学、以练强技，在代码对决中打磨算法功底。',
    host: '算法组',
    agenda: ['19:00 签到 & 分组', '19:15 现场公布赛题', '19:30-21:00 限时编程', '21:10 现场讲题 & 排名公示'],
    detail: [
      '「算法筑基」是算软社面向新生的第一场正式对抗赛。赛题覆盖 C 语言语法、数组与字符串处理、简单模拟与基础算法，既能让新手找到成就感，也能让有经验的同学挑战速度极限。',
      '比赛采用个人赛形式，在 M304 实验室现场出题、限时提交、实时排名。赛后算法组学长会逐题讲解思路，并把标准代码与常见错误整理成文档共享到活动群。',
      '表现优异者将获得蓝桥杯校内选拔推荐资格，并进入算法组重点培养名单。'
    ]
  },
  {
    id: 2,
    title: '代码赋能·软件项目开发实战赛',
    time: '2026-11-05 19:00',
    location: '综合楼 M304',
    status: '即将开始',
    desc: '从需求分析到上线全流程，做出能跑起来的真实项目。',
    host: '软件组',
    agenda: ['19:00 需求发布 & 组队', '19:30 原型设计与任务拆分', '20:00-22:00 冲刺开发', '22:10 项目演示 & 互评'],
    detail: [
      '软件项目开发实战赛模拟真实工作流：接到需求文档后，团队需要在有限时间内完成需求分析、原型设计、前后端开发（或小程序页面）和最终演示。',
      '比赛强调“能跑起来”的工程标准：代码结构清晰、接口可用、界面完整、答辩流畅。软件组导师和学长会扮演“产品经理”角色，现场提出变更需求，考验团队应变能力。',
      '优秀作品将有机会进入社团项目工作室，继续打磨成可上线的校园信息化系统或便民小程序。'
    ]
  },
  {
    id: 3,
    title: '数绘牡丹·牡丹文化主题编程设计活动',
    time: '2026-11-20 14:00',
    location: '艺术楼展厅',
    status: '即将开始',
    desc: '用代码诠释菏泽牡丹文化，科技与人文的碰撞。',
    host: '软件组 + AI 组',
    agenda: ['14:00 牡丹文化讲解', '14:30 技术方案分享', '15:00-17:00 创作时间', '17:10 作品展示 & 投票'],
    detail: [
      '菏泽是“中国牡丹之都”，算软社把家乡文化搬进代码，用生成式图形、数据可视化、小程序交互等方式呈现牡丹之美。',
      '活动中，软件组负责页面与交互实现，AI 组尝试用图像生成与风格迁移技术创作数字牡丹，算法组则用数学曲线模拟花瓣形态。',
      '最终作品将在艺术楼展厅展出，并择优发布到社团公众号，让更多人看到技术与传统文化碰撞出的火花。'
    ]
  },
  {
    id: 4,
    title: '智助乡韵·菏泽民间艺术数字化编程实践',
    time: '2026-12-03 14:00',
    location: '校团委活动室',
    status: '即将开始',
    desc: '把家乡民间艺术搬上屏幕，做有温度的数字化作品。',
    host: '软件组',
    agenda: ['14:00 民间艺术素材采集', '14:40 数字化方案讨论', '15:00-17:00 编程实践', '17:10 成果分享'],
    detail: [
      '菏泽拥有丰富的非物质文化遗产，本次活动鼓励社员选择一项民间艺术（如面塑、剪纸、鲁锦、山东梆子等），用数字化手段进行记录与再创作。',
      '作品形式不限：可以是用小程序做的非遗百科，可以是用 Processing/p5.js 生成的动态艺术，也可以是用数据库整理的传承人档案。',
      '活动旨在培养社员“技术服务地方文化”的意识，优秀作品将推荐参加“挑战杯”等创新创业竞赛。'
    ]
  },
  {
    id: 5,
    title: '科创进社区·居民智能软件操作公益指导',
    time: '2026-12-18 09:00',
    location: '社区服务中心',
    status: '即将开始',
    desc: '走出校园，用技术服务社区、帮扶居民。',
    host: '软件组 + 人工智能组',
    agenda: ['09:00 社区集合 & 需求调研', '09:30 智能手机与常用 App 讲解', '10:30 一对一操作指导', '11:30 反馈收集 & 合影'],
    detail: [
      '很多社区长辈对智能手机、健康码、线上挂号、防诈骗 App 等操作不熟悉。算软社成员走进社区，用耐心和专业知识帮他们跨越“数字鸿沟”。',
      '活动前，软件组会整理常见问题的图文教程；人工智能组则准备 AI 换脸、语音克隆等案例，提醒居民识别新型网络诈骗。',
      '这既是志愿服务的实践，也是把课堂所学转化为社会价值的真实场景。'
    ]
  },
  {
    id: 6,
    title: '致敬劳作者·办公软件高效运用志愿帮扶',
    time: '2027-01-08 09:00',
    location: '校工会',
    status: '未开始',
    desc: '教长辈用好办公软件，让技术更有温度。',
    host: '软件组',
    agenda: ['09:00 常用办公软件痛点收集', '09:30 Excel / Word 高效技巧讲解', '10:30 现场答疑与实操', '11:30 资料包发放'],
    detail: [
      '面向学校后勤、行政岗位的劳动者，算软社开展办公软件高效运用志愿帮扶，教大家批量处理表格、快速排版文档、制作简单演示文稿。',
      '活动摒弃“照本宣科”，先收集大家的实际工作痛点，再针对性地准备案例与练习素材，确保学完就能用。',
      '活动结束后，所有教程视频与模板资料将打包分享到微信群，方便长期复习。'
    ]
  },
  {
    id: 7,
    title: '端午传新韵·传统节日主题小程序开发赛',
    time: '2027-05-28 14:00',
    location: '综合楼 M304',
    status: '未开始',
    desc: '以端午为主题，开发有趣实用的小程序。',
    host: '软件组',
    agenda: ['14:00 赛题发布', '14:30 设计冲刺', '14:30-17:30 开发实现', '17:40 演示评审'],
    detail: [
      '端午节主题小程序开发赛要求参赛团队围绕端午文化，设计并开发一款小程序：可以是端午习俗科普、粽子口味投票、龙舟小游戏，也可以是家人祝福贺卡。',
      '比赛考察创意、交互设计与代码实现能力，鼓励使用微信小程序原生能力（如 canvas、动画、云存储）增加趣味性。',
      '优胜作品将在端午节前发布到社团公众号，供全校师生使用体验。'
    ]
  },
  {
    id: 8,
    title: '师技辅学·师范生教学辅助小程序设计',
    time: '2027-06-10 14:00',
    location: '师范生实训中心',
    status: '未开始',
    desc: '为师范生打造教学辅助工具，技术反哺教育。',
    host: '软件组',
    agenda: ['14:00 师范生需求访谈', '14:30 功能原型设计', '15:00-17:00 开发迭代', '17:10 课堂模拟试用'],
    detail: [
      '面向师范类专业同学，算软社邀请未来教师提出课堂痛点（如随机点名、课堂小测、作业收集、学情统计等），并用小程序快速实现教学辅助工具。',
      '活动中，师范生负责提出真实教学场景，算软社成员负责技术实现，双方在协作中理解“技术如何服务于教育”。',
      '优秀作品将推荐到校内师范生技能大赛，并作为社团项目工作室的真实案例持续维护。'
    ]
  },
  {
    id: 9,
    title: 'GitHub 达人挑战赛（校队选拔）',
    time: '每周三 19:00',
    location: '综合楼 M304',
    status: '进行中',
    desc: '版本控制与分支协作实战，选拔优秀者组建校队。',
    host: '软件组',
    agenda: ['19:00 本周任务发布', '19:10 分组协作开发', '20:30 代码审查 & PR 互评', '21:00 总结与下周预告'],
    detail: [
      'GitHub 达人挑战赛是算软社常规训练活动，以真实开源协作流程为核心，训练成员的分支管理、代码审查、冲突解决与文档写作能力。',
      '每期任务会模拟一个真实项目需求（如社团管理后台、活动报名系统），参与者需要 fork 仓库、创建分支、提交 PR、参与 code review，最终合并到主分支。',
      '表现稳定、协作规范的同学将进入校队/项目工作室候选名单，参与更高级别的竞赛与真实项目。'
    ]
  },
  {
    id: 10,
    title: '「指尖竞技，算法为锋」程序设计大赛',
    time: '2026-09-25 19:00',
    location: '计算中心',
    status: '即将开始',
    desc: '社团招牌赛事，从校内模拟赛直通蓝桥杯赛场。',
    host: '算法组',
    agenda: ['18:30 选手入场', '19:00 正式开赛', '19:00-22:00 限时解题', '22:10 颁奖典礼 & 经验分享'],
    detail: [
      '「指尖竞技，算法为锋」是算软社的招牌赛事，也是蓝桥杯校内选拔赛的重要环节。比赛采用 OI/IOI 混合赛制，题目难度覆盖入门到提高。',
      '比赛不仅为算法爱好者提供切磋舞台，更重要的是通过“以赛促学”帮助新生快速进入算法训练状态，也让高年级同学检验阶段性学习成果。',
      '获奖选手将获得蓝桥杯省赛推荐名额、算法组专题研讨席位，以及社团定制的纪念周边。'
    ]
  }
]

// 培训数据版本号（与报道第三章培养体系保持一致，修改后请递增）
const TRAININGS_VERSION = '20260826-03'

const DEFAULT_TRAININGS = [
  {
    id: 1,
    title: '算法基础训练',
    time: '每周三 19:00-21:00',
    target: '面向大一新生及算法初学者：C 语言到动态规划、图论，每日 OJ 打卡 + 每周专题研讨',
    mentor: '算法组学长 + 历届省一',
    outline: ['C 语言语法与输入输出', '数组、字符串与基础模拟', '排序、查找与递归', '基础数据结构入门', '简单贪心与动态规划'],
    detail: [
      '算法基础训练是算软社的“入门必修课”。我们坚信：扎实的基本功是后续竞赛与项目实战的根基。',
      '训练采用“每日 OJ 打卡 + 每周专题研讨”的模式。社员每天至少完成 2-3 道基础题，周末由学长统一讲评高频错误与经典模型。',
      '完成基础训练的同学可以参加「指尖竞技」程序设计大赛，表现优异者进入数据结构与算法进阶班。'
    ]
  },
  {
    id: 2,
    title: '数据结构与算法进阶',
    time: '每周五 19:00-21:00',
    target: '面向有一定编程基础的同学：从校内外模拟赛到蓝桥杯赛场的系统进阶',
    mentor: '算法组核心成员',
    outline: ['链表、栈、队列与并查集', '树与图的基础遍历', '二分、贪心与分治', '动态规划专题', '蓝桥杯真题演练'],
    detail: [
      '进阶班面向已完成基础训练或有一定编程基础的同学，系统讲解竞赛中常用的数据结构与算法思想。',
      '课程不讲“空中楼阁”，每一章都配套蓝桥杯、天梯赛等真实真题，让同学在实战中理解算法应用场景。',
      '进阶班结束后，学员可报名参加蓝桥杯校内选拔赛，获得省赛推荐机会。'
    ]
  },
  {
    id: 3,
    title: 'ACM / 蓝桥杯竞赛集训',
    time: '每周六 09:00-17:00',
    target: '面向竞赛队员及有意参赛同学：高强度模拟赛 + 校队选拔',
    mentor: '指导老师 + 校队老队员',
    outline: ['上午：限时模拟赛（5 题 / 3 小时）', '下午：题解讲解与代码复盘', '专题突破：图论、DP、数论、字符串', '赛前心态调整与应试技巧'],
    detail: [
      '竞赛集训是算软社的“高强度训练场”。每周六全天投入：上午模拟赛，下午讲题复盘，晚上自由补题。',
      '集训不仅锻炼解题能力，更注重比赛策略：如何快速读题、合理分配时间、选择得分最高的做题顺序、调试与查错。',
      '经过集训选拔出的优秀队员将代表学校参加蓝桥杯、ACM-ICPC、CCPC 等高水平竞赛。'
    ]
  },
  {
    id: 4,
    title: 'Python AI 入门',
    time: '双周日下午 14:00-17:00',
    target: '面向想学人工智能的同学：机器学习 / 深度学习 / 计算机视觉 / 大模型应用',
    mentor: '人工智能组',
    outline: ['Python 数据处理与可视化', '机器学习经典模型', '深度学习框架入门', '计算机视觉基础项目', '大模型应用实践'],
    detail: [
      'Python AI 入门课程从数据处理开始，逐步过渡到机器学习、深度学习与大模型应用，帮助同学建立完整的人工智能知识框架。',
      '课程采用“理论讲解 + 代码实践 + 项目展示”三位一体模式：先讲清楚模型原理，再手把手跑通代码，最后用一个小项目收尾。',
      '往期项目包括：手写数字识别、垃圾分类图像分类、简单情感分析、基于大模型的问答机器人等。'
    ]
  },
  {
    id: 5,
    title: '项目实战开发',
    time: '每月第 3 个周末',
    target: '团队合作完成校园信息化系统、便民小程序等真实项目（软件组 / 项目工作室）',
    mentor: '软件组导师 + 项目工作室负责人',
    outline: ['需求调研与用户访谈', '产品原型与数据库设计', '前后端开发与接口联调', '测试、部署与上线', '项目复盘与文档沉淀'],
    detail: [
      '项目实战开发是算软社培养工程能力的重要环节。每月第三周，项目工作室会启动一个真实项目，从需求到上线全流程实战。',
      '项目类型包括校园信息化系统、便民小程序、社团管理工具、教学辅助应用等。成员按前后端、UI、测试等角色分工协作。',
      '完成的项目会部署到服务器或提交到学校相关部门评审，优秀项目还有机会参加“互联网+”、挑战杯等创新创业竞赛。'
    ]
  },
  {
    id: 6,
    title: '考研帮扶链',
    time: '全年持续',
    target: '面向考研同学：笔记真题 / 择校规划 / 复试模拟，形成完整传承链',
    mentor: '已上岸学长学姐',
    outline: ['择校与专业方向分析', '公共课复习规划', '专业课资料共享', '复试技巧与模拟面试', '心态调整与信息互通'],
    detail: [
      '考研帮扶链是算软社最温暖的传统之一。已经上岸的学长学姐会把复习资料、择校经验、复试心得毫无保留地传给下一届。',
      'M304 实验室设有考研资料共享区，历年真题、笔记、院校信息按科目整理归档；每月还会组织一次集中答疑，邀请 2-3 位上岸学长分享。',
      '2025 届计算机学院考研上岸者中，80% 以上都有在算软社训练与参赛的经历。下一个上岸的，为什么不能是你？'
    ]
  }
]

// 注意：getBanners() 已直接使用 mock.banners，此处保留仅为代码兼容
const DEFAULT_BANNERS = [
  { id: 1, title: '算软社·我们的全家福', cover: '/images/banners/real-banner-home.jpg', url: '/pages/gallery/detail/detail?index=0' },
  { id: 2, title: 'M304 实验室·集训剪影', cover: '/images/banners/real-banner-lab.jpg', url: '/pages/gallery/detail/detail?index=1' },
  { id: 3, title: '蓝桥杯·全国总决赛', cover: '/images/banners/real-banner-honor.jpg', url: '/pages/gallery/detail/detail?index=2' }
]

const DEFAULT_RULES = {
  startTime: '2026-09-01',
  endTime: '2026-09-30',
  limit: 40,
  requireAudit: true,
  allowCancel: true,
  cancelRule: '报名截止前可自行取消，截止后请联系管理员',
  introImages: [],
  qrCode: '',
  recommended: false,
  recommendTop: false
}

// ========== 云开发占位 ==========
function cloud() {
  if (!wx.cloud) {
    throw new Error('当前基础库不支持云开发，请升级微信版本')
  }
  return wx.cloud
}

function callCloud(name, data = {}) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name,
      data,
      success: res => resolve(res.result),
      fail: err => reject(err)
    })
  })
}

// ========== 云开发数据适配层 ==========
// 集合映射：storage key -> 云数据库集合名（统一以 _id='main' 的文档存储 payload）
const CLOUD_MAP = [
  { key: 'clubInfo', name: 'clubInfo' },
  { key: 'announcements', name: 'announcements' },
  { key: 'activities', name: 'activities' },
  { key: 'trainings', name: 'trainings' },
  { key: 'honors', name: 'honors' },
  { key: 'gallery', name: 'gallery' },
  { key: 'banners', name: 'banners' },
  { key: 'sects', name: 'sects' }
]

function initCloud() {
  if (!wx.cloud) {
    console.warn('[cloud] 当前基础库不支持云开发')
    return false
  }
  try {
    wx.cloud.init({ env: cloudConfig.env || undefined, traceUser: true })
    return true
  } catch (e) {
    console.warn('[cloud] init failed:', e)
    return false
  }
}

function saveToCloud(name, data) {
  if (!USE_CLOUD) return Promise.resolve()
  return callCloud('club-data', { action: 'set', name, data })
    .catch(err => console.warn('[cloud] saveToCloud failed:', name, err))
}

// 启动时把云端数据拉回本地缓存（页面仍走同步读取，无需改动）
function syncFromCloud() {
  if (!USE_CLOUD) return Promise.resolve()
  return Promise.all(CLOUD_MAP.map(async ({ key, name }) => {
    try {
      const res = await callCloud('club-data', { action: 'get', name })
      if (res && res.payload !== null && res.payload !== undefined) {
        wx.setStorageSync(STORAGE_KEY[key], res.payload)
      }
    } catch (e) {
      console.warn('[cloud] sync failed:', name, e)
    }
  }))
}

// 管理员「一键同步到云端」：把当前本地数据全量写入云端
function saveAllToCloud() {
  if (!USE_CLOUD) return Promise.resolve({ success: false, msg: '未开启云开发' })
  const tasks = CLOUD_MAP.map(({ key, name }) => {
    const local = wx.getStorageSync(STORAGE_KEY[key])
    if (local === '' || local === undefined) return Promise.resolve()
    return saveToCloud(name, local)
  })
  return Promise.all(tasks).then(() => ({ success: true, msg: '已同步到云端' }))
}

// ========== 通用工具 ==========
function nextId(list) {
  if (!list || list.length === 0) return 1
  return Math.max(...list.map(i => i.id || 0)) + 1
}

function sanitizeUser(user) {
  const { password, ...safe } = user
  return safe
}

// ========== 当前用户标识 ==========
function getCurrentUser() {
  return wx.getStorageSync('currentUser') || null
}

function getCurrentUserId() {
  const user = getCurrentUser()
  return user ? `u_${user.username}` : 'anon'
}

function userKey(base) {
  return `${base}_${getCurrentUserId()}`
}

// 一次性迁移旧版全局数据到当前用户（仅在本地模式）
function migrateLegacyUserData() {
  if (USE_CLOUD) return
  const map = {
    registrations: 'my_registrations',
    favorites: 'my_favorites',
    history: 'my_history'
  }
  Object.entries(map).forEach(([legacy, base]) => {
    const newKey = userKey(base)
    if (wx.getStorageSync(newKey) === '' && wx.getStorageSync(legacy) !== '') {
      wx.setStorageSync(newKey, wx.getStorageSync(legacy))
    }
  })
}

// ========== 用户认证系统 ==========
function getUsers() {
  return wx.getStorageSync(STORAGE_KEY.users) || DEFAULT_USERS
}

function saveUsers(list) {
  wx.setStorageSync(STORAGE_KEY.users, list)
}

function deleteUser(userId) {
  const users = getUsers()
  const filtered = users.filter(u => u.id !== userId)
  saveUsers(filtered)
  return filtered
}

function register(data) {
  const users = getUsers()
  if (users.find(u => u.username === data.username)) {
    return { success: false, msg: '该学号已注册' }
  }
  const newUser = {
    id: nextId(users),
    name: data.name,
    username: data.username,
    password: data.password,
    phone: data.phone || '',
    major: data.major || '',
    status: '正常'
  }
  users.push(newUser)
  saveUsers(users)
  return { success: true, user: sanitizeUser(newUser), msg: '注册成功' }
}

function login(username, password) {
  const users = getUsers()
  const user = users.find(u => u.username === username)
  if (!user) return { success: false, msg: '账号不存在' }
  if (user.status === '禁用') return { success: false, msg: '该账号已被禁用，请联系管理员' }
  if (user.password !== password) return { success: false, msg: '密码错误' }
  return { success: true, user: sanitizeUser(user), msg: '登录成功' }
}

function saveCurrentUser(user) {
  wx.setStorageSync('currentUser', user)
  const app = getApp()
  if (app) app.globalData.currentUser = user
  migrateLegacyUserData()
}

function logout() {
  wx.removeStorageSync('currentUser')
  const app = getApp()
  if (app) app.globalData.currentUser = null
}

function isLoggedIn() {
  return !!getCurrentUser()
}

function changePassword(userId, oldPwd, newPwd) {
  const users = getUsers()
  const user = users.find(u => u.id === userId)
  if (!user) return { success: false, msg: '用户不存在' }
  if (user.password !== oldPwd) return { success: false, msg: '原密码错误' }
  user.password = newPwd
  saveUsers(users)
  return { success: true, msg: '密码修改成功' }
}

// ========== 全局内容数据 ==========
function ensureVersion(key, defaultValue, version) {
  const cachedVersion = wx.getStorageSync(VERSION_KEY[key])
  if (cachedVersion !== version) {
    wx.setStorageSync(STORAGE_KEY[key], defaultValue)
    wx.setStorageSync(VERSION_KEY[key], version)
    return defaultValue
  }
  return wx.getStorageSync(STORAGE_KEY[key]) || defaultValue
}

function getClubInfo() {
  return ensureVersion('clubInfo', mock.clubInfo, mock.CLUBINFO_VERSION)
}

function saveClubInfo(data) {
  wx.setStorageSync(STORAGE_KEY.clubInfo, data)
  if (USE_CLOUD) saveToCloud('clubInfo', data)
}

function getBanners() {
  return ensureVersion('banners', mock.banners, mock.BANNERS_VERSION)
}

function saveBanners(list) {
  wx.setStorageSync(STORAGE_KEY.banners, list)
  if (USE_CLOUD) saveToCloud('banners', list)
}

function getAnnouncements() {
  return ensureVersion('announcements', mock.announcements, mock.ANNOUNCEMENT_VERSION)
}

function saveAnnouncements(list) {
  wx.setStorageSync(STORAGE_KEY.announcements, list)
  if (USE_CLOUD) saveToCloud('announcements', list)
}

function getActivities() {
  return ensureVersion('activities', DEFAULT_ACTIVITIES, ACTIVITIES_VERSION)
}

function saveActivities(list) {
  wx.setStorageSync(STORAGE_KEY.activities, list)
  if (USE_CLOUD) saveToCloud('activities', list)
}

function getTrainings() {
  return ensureVersion('trainings', DEFAULT_TRAININGS, TRAININGS_VERSION)
}

function saveTrainings(list) {
  wx.setStorageSync(STORAGE_KEY.trainings, list)
  if (USE_CLOUD) saveToCloud('trainings', list)
}

function getHonors() {
  return wx.getStorageSync(STORAGE_KEY.honors) || mock.clubInfo.honors
}

function saveHonors(list) {
  wx.setStorageSync(STORAGE_KEY.honors, list)
  if (USE_CLOUD) saveToCloud('honors', list)
}

// 结构化荣誉（报道章节一/四）
function getHonorList() {
  return mock.honorList
}

// 社团报道（成长诗篇）
function getStory() {
  return mock.story
}

const BLUEPRINT_VERSION = mock.BLUEPRINT_VERSION

// 社团活动全景（招新展示）
function getBlueprint() {
  return ensureVersion('blueprint', mock.blueprint, BLUEPRINT_VERSION)
}

function getSects() {
  return ensureVersion('sects', mock.sects, SECTS_VERSION)
}

function getGallery() {
  const cachedVersion = wx.getStorageSync(VERSION_KEY.gallery)
  if (cachedVersion !== mock.GALLERY_VERSION) {
    saveGallery(mock.gallery)
    wx.setStorageSync(VERSION_KEY.gallery, mock.GALLERY_VERSION)
    return mock.gallery
  }
  return wx.getStorageSync(STORAGE_KEY.gallery) || mock.gallery
}

function saveGallery(list) {
  wx.setStorageSync(STORAGE_KEY.gallery, list)
  if (USE_CLOUD) saveToCloud('gallery', list)
}

function getEnrollmentRules() {
  return wx.getStorageSync(STORAGE_KEY.enrollmentRules) || DEFAULT_RULES
}

function saveEnrollmentRules(rules) {
  wx.setStorageSync(STORAGE_KEY.enrollmentRules, rules)
}

// ========== 报名数据（按当前用户隔离） ==========
function getAllRegistrations() {
  return wx.getStorageSync('all_registrations') || []
}

function saveAllRegistrations(list) {
  wx.setStorageSync('all_registrations', list)
}

function getMyRegistrations() {
  migrateLegacyUserData()
  return wx.getStorageSync(userKey('my_registrations')) || []
}

function saveMyRegistrations(list) {
  wx.setStorageSync(userKey('my_registrations'), list)
}

function isRegistered(clubId) {
  return getMyRegistrations().some(r => r.clubId === clubId)
}

function applyRegistration({ club, form }) {
  if (!form.name.trim()) return { success: false, msg: '请输入姓名' }
  if (!form.studentId.trim()) return { success: false, msg: '请输入学号' }
  if (!/^\d+$/.test(form.studentId.trim())) return { success: false, msg: '学号只能包含数字' }
  if (!form.phone.trim()) return { success: false, msg: '请输入手机号' }
  if (!/^1[3-9]\d{9}$/.test(form.phone.trim())) return { success: false, msg: '手机号格式不正确' }
  if (!form.direction) return { success: false, msg: '请选择意向方向' }
  if (!form.reason.trim()) return { success: false, msg: '请输入申请理由' }

  const rules = getEnrollmentRules()
  const now = new Date().getTime()
  if (rules.startTime && new Date(rules.startTime).getTime() > now) {
    return { success: false, msg: '报名尚未开始' }
  }
  if (rules.endTime && new Date(rules.endTime).getTime() < now) {
    return { success: false, msg: '报名已结束' }
  }

  const all = getAllRegistrations()
  if (rules.limit && all.length >= Number(rules.limit)) {
    return { success: false, msg: '报名人数已满' }
  }

  const mine = getMyRegistrations()
  if (mine.some(r => r.clubId === club.id)) {
    return { success: false, msg: '你已报名本社团' }
  }

  const user = getCurrentUser()
  const record = {
    id: nextId(all),
    clubId: club.id,
    clubName: club.name,
    userId: user ? user.username : form.studentId.trim(),
    name: form.name.trim(),
    studentId: form.studentId.trim(),
    phone: form.phone.trim(),
    major: (form.major || '').trim(),
    direction: form.direction || '',
    qq: (form.qq || '').trim(),
    reason: form.reason.trim(),
    status: rules.requireAudit ? 'pending' : 'approved',
    applyTime: formatTime(new Date())
  }

  all.unshift(record)
  saveAllRegistrations(all)
  mine.unshift(record)
  saveMyRegistrations(mine)

  // 同步更新已报名人数
  const clubInfo = getClubInfo()
  clubInfo.recruitedCount = all.length
  saveClubInfo(clubInfo)

  return { success: true, msg: rules.requireAudit ? '报名成功，等待审核' : '报名成功' }
}

function cancelMyRegistration(id) {
  const all = getAllRegistrations().filter(r => r.id !== id)
  saveAllRegistrations(all)
  const mine = getMyRegistrations().filter(r => r.id !== id)
  saveMyRegistrations(mine)

  const clubInfo = getClubInfo()
  clubInfo.recruitedCount = all.length
  saveClubInfo(clubInfo)
  return mine
}

function auditRegistration(id, status) {
  const all = getAllRegistrations()
  const r = all.find(i => i.id === id)
  if (!r) return null
  r.status = status
  r.auditTime = formatTime(new Date())
  saveAllRegistrations(all)
  return all
}

function clearAllRegistrations() {
  saveAllRegistrations([])
  wx.removeStorageSync(userKey('my_registrations'))
  const clubInfo = getClubInfo()
  clubInfo.recruitedCount = 0
  saveClubInfo(clubInfo)
}

// ========== 收藏数据（按当前用户隔离） ==========
function getMyFavorites() {
  migrateLegacyUserData()
  return wx.getStorageSync(userKey('my_favorites')) || []
}

function saveMyFavorites(list) {
  wx.setStorageSync(userKey('my_favorites'), list)
}

function isFavorited(clubId) {
  return getMyFavorites().some(f => f.id === clubId)
}

function toggleFavorite(club) {
  const list = getMyFavorites()
  const idx = list.findIndex(f => f.id === club.id)
  let favorited
  if (idx >= 0) {
    list.splice(idx, 1)
    favorited = false
  } else {
    list.unshift({ id: club.id, name: club.name, cover: club.cover, time: formatTime(new Date()) })
    favorited = true
  }
  saveMyFavorites(list)
  return { favorited, list }
}

function removeMyFavorite(id) {
  const list = getMyFavorites().filter(f => f.id !== id)
  saveMyFavorites(list)
  return list
}

// ========== 浏览历史（按当前用户隔离） ==========
function getMyHistory() {
  migrateLegacyUserData()
  return wx.getStorageSync(userKey('my_history')) || []
}

function saveMyHistory(list) {
  wx.setStorageSync(userKey('my_history'), list)
}

function addHistory(club) {
  let list = getMyHistory().filter(h => h.id !== club.id)
  list.unshift({ id: club.id, name: club.name, cover: club.cover, time: formatTime(new Date()) })
  saveMyHistory(list.slice(0, 50))
  return list.slice(0, 50)
}

function clearMyHistory() {
  saveMyHistory([])
}

// ========== 日志 ==========
function getLogs() {
  return wx.getStorageSync('admin_logs') || []
}

function saveLogs(list) {
  wx.setStorageSync('admin_logs', list)
}

function addLog(action, detail = '') {
  const logs = getLogs()
  logs.unshift({
    id: nextId(logs),
    time: formatTime(new Date()),
    action,
    detail,
    operator: getCurrentUser() ? getCurrentUser().name : '管理员'
  })
  saveLogs(logs.slice(0, 200))
}

// ========== 重置 ==========
function resetAll() {
  Object.values(STORAGE_KEY).forEach(key => {
    try { wx.removeStorageSync(key) } catch (_) {}
  })
  Object.values(VERSION_KEY).forEach(key => {
    try { wx.removeStorageSync(key) } catch (_) {}
  })
  LEGACY_KEYS.forEach(key => {
    try { wx.removeStorageSync(key) } catch (_) {}
  })
  try { wx.removeStorageSync('all_registrations') } catch (_) {}
  try { wx.removeStorageSync('admin_logs') } catch (_) {}
  try { wx.removeStorageSync('currentUser') } catch (_) {}
  try { wx.removeStorageSync('isAdmin') } catch (_) {}
}

// 简单时间格式化（避免循环引用 util.js）
function formatTime(date) {
  const pad = n => n < 10 ? '0' + n : n
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

module.exports = {
  // 配置
  USE_CLOUD,

  // 全局内容
  getClubInfo, saveClubInfo, getSects, getBlueprint,
  getAnnouncements, saveAnnouncements,
  getActivities, saveActivities,
  getTrainings, saveTrainings,
  getHonors, saveHonors,
  getHonorList,
  getStory,
  getGallery, saveGallery,
  getBanners, saveBanners,

  // 报名规则
  getEnrollmentRules, saveEnrollmentRules,

  // 用户认证
  getUsers, saveUsers, deleteUser,
  register, login, getCurrentUser, saveCurrentUser, logout, isLoggedIn, changePassword,
  getCurrentUserId,

  // 报名数据
  getAllRegistrations, saveAllRegistrations, auditRegistration, clearAllRegistrations,
  getMyRegistrations, saveMyRegistrations, isRegistered, applyRegistration, cancelMyRegistration,

  // 收藏与历史
  getMyFavorites, saveMyFavorites, isFavorited, toggleFavorite, removeMyFavorite,
  getMyHistory, saveMyHistory, addHistory, clearMyHistory,

  // 日志
  getLogs, saveLogs, addLog,

  // 工具
  nextId, resetAll,

  // 云开发
  initCloud, syncFromCloud, saveAllToCloud
}
