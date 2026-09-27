# 社团管理小程序 · 上线部署指南

## 当前状态

- 项目已按**本地模式**完成优化（`utils/data-manager.js` 中 `USE_CLOUD = false`）。
- 本地模式下所有数据存在用户手机 storage 中，**换设备数据会丢失，且无法多人共享**。
- 如需真实上线给社团使用，必须开通**微信云开发**，并将 `USE_CLOUD` 切换为 `true`。

## 上线前准备

1. 确认 `project.config.json` 中的 `appid` 是已注册的小程序 AppID（当前已配置）。
2. 登录[微信公众平台](https://mp.weixin.qq.com)，进入「开发 → 开发管理 → 云开发」，按提示开通。
3. 在微信开发者工具中点击工具栏「云开发」按钮，初始化云开发环境。

## 云数据库集合创建

在云开发控制台「数据库」中手动创建以下集合：

- `club`：社团信息（1 条文档）
- `announcements`、`activities`、`trainings`、`honors`、`gallery`、`banners`
- `enrollment_rules`：报名规则（1 条文档）
- `registrations`：报名记录
- `users`：用户账号
- `logs`：操作日志

## 云函数部署

项目已提供以下云函数骨架，位于 `cloud/functions/`：

| 云函数 | 职责 |
|---|---|
| `club` | 社团信息读写 |
| `content` | 公告/活动/培训/荣誉/相册/轮播图 CRUD |
| `registration` | 报名、审核、取消、清空、我的报名 |
| `user` | 登录、注册、用户列表、删除用户 |
| `log` | 操作日志写入、查询、清空 |

部署步骤：

1. 在微信开发者工具中，右键 `cloud/functions/club` →「创建并部署：云端安装依赖」。
2. 依次部署 `content`、`registration`、`user`、`log`。
3. 部署完成后，在 `utils/data-manager.js` 顶部将 `USE_CLOUD = false` 改为 `USE_CLOUD = true`。

## 数据初始化

首次部署后，建议通过云开发控制台导入初始数据：

1. 在 `utils/mock.js` 中提取 `clubInfo`、`announcements`、`banners`、`gallery` 等 JSON。
2. 在云数据库对应集合中导入这些 JSON（每条记录作为一个文档）。
3. 手动在 `enrollment_rules` 集合中添加一条默认规则文档。

## 切换为云模式后需完善的点

当前 `USE_CLOUD = true` 仅提供接口占位，尚未在 `data-manager.js` 中完整实现所有函数的云调用版本。切换后需按以下思路继续改造：

- 所有 `getXxx()` / `saveXxx()` 改为 `callCloud('content', { type, action })`。
- 用户登录注册改为 `callCloud('user', { action: 'login' | 'register' })`。
- 报名相关改为 `callCloud('registration', { action })`。
- 图片上传改用 `wx.cloud.uploadFile` 存到云存储，URL 使用 `cloud://` 协议。
- 管理员密码校验建议改为云函数校验，不再依赖本地 `adminPassword`。

## 真机预览

1. 在微信开发者工具中点击「真机调试」扫码预览。
2. 首次真机预览前，在「详情 → 本地设置」中关闭「不校验合法域名...」以模拟线上环境。
3. 确认图片能正常显示、tabBar 图标正常、报名流程完整。

## 上传发布

1. 点击微信开发者工具「上传」按钮。
2. 在公众平台「版本管理」中提交审核。
3. 审核通过后发布。
