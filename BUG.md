## 登录页密码

登录页密码没有 mask
登录页密码需要提供 可见/不可见 两种模式
目前'记住密码' 和 '找回密码' 都没有实现, 我只需要实现'记住密码'

## SideBar ✅ 已修复

- ~~SideBar 个人介绍部分没有和用户的 BIO 同步~~ - 已确认代码中使用了 `userStore.userInfo?.bio`，BIO 已同步
- ~~关注/粉丝 切换时, 不会重新像后端请求数据~~ - 已修复，现在使用 `watch` 监听 listType 变化，切换时会重新请求数据

## 头像上传问题 ✅ 已修复

- ~~目前前端直接上传 base64,但是后端数据库储存 Avatar 时的长度限制为 50~~
- 已将后端 `User` 模型的 `avatar` 字段从 `String(512)` 改为 `Text` 类型，支持存储大型 base64 数据
- **需要执行数据库迁移**：`ALTER TABLE users MODIFY COLUMN avatar TEXT;`
