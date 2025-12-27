# 未完成功能梳理文档 (Based on PRD Analysis)

本文档基于 `@[Laoba/PRD.md]` 与当前代码库的对比，整理了通过前端视角发现的未完成功能。

---

## 1. 全局布局与导航 (Global Layout)

**描述**:
目前的 `App.vue` 仅包含 `<RouterView />`，缺少统一的页面布局。PRD 要求顶部常驻导航栏 (Sticky Header)。
以及游客(Guest)访问权限的控制。

**未完成项**:

1.  **顶部导航栏 (Header)**: 包括 Logo, 搜索框, 导航菜单(首页/发现), 用户头像/登录注册按钮。
2.  **游客模式 (Guest Mode)**: 首页和详情页应该允许未登录访问，但互动时提示登录。

### 实现思路:

- **前端**:
  - 新建 `src/layout/MainLayout.vue`，实现 Header 和 `<RouterView />` 的布局。
  - 将 `src/pages/routes.ts` 中的路由配置进行调整，大部分页面作为 `MainLayout` 的子路由。
  - 调整路由守卫 (Router Guard)，允许 `Home` 和 `PostDetail` 在无 Token 时访问。
  - 实现 Header 组件：包含 Logo, 搜索入口, 菜单, 用户下拉菜单。
- **后端**:
  - 现有接口可能已支持 loose permission，需确认 `/posts` 和 `/post/{id}` 接口是否允许未鉴权请求（即 `user_id` 为空时仅返回公开数据）。

---

## 2. 首页功能增强 (Home Feed)

**描述**:
首页目前仅是一个简单的帖子列表。PRD 要求支持“最新”和“热门”切换，以及可选的搜索功能。

**未完成项**:

1.  **Tab 切换**: "最新发布" vs "热门推荐"。
2.  **搜索功能**: 搜索框及搜索通过页面。
3.  **骨架屏/加载态优化**: 虽然有 `v-loading`，但 PRD 建议更好的骨架屏体验。

### 实现思路:

- **前端**:
  - `src/pages/home/index.vue`: 添加 `el-tabs` 切换 Feed 类型。
  - 新增 `src/pages/search/index.vue` 或在 Header 实现搜索下拉结果。
  - 调用 API 时传递 `sort=latest` 或 `sort=hot`。
- **后端**:
  - `GET /posts`: 新增 `sort_by` 参数 (latest/hot)。实现热门排序逻辑 (如基于点赞数+评论数+时间衰减)。
  - 新增搜索接口 `GET /search?q=...`，支持对帖子内容 and 用户昵称的模糊搜索。

---

## 3. 用户互动与社交 (Interaction & Social)

**描述**:
用户主页目前缺乏核心的社交功能：关注/取消关注、粉丝列表、关注列表。
“收藏”功能也未见实现（仅有点赞）。

**未完成项**:

1.  **关注/取消关注**: 用户主页按钮点击无反应。
2.  **数据统计**: 关注数、粉丝数目前写死为 0。
3.  **内容 Tab**: 缺少 [TA 的动态]、[相册]、[收藏] 等 Tab 切换。目前仅展示“TA 的动态”。

### 实现思路:

- **前端**:
  - `src/pages/user/index.vue`:
    - 绑定关注按钮点击事件，调用关注/取关 API。
    - 从后端获取真实的 `followers_count` 和 `following_count`。
    - 添加 `el-tabs`，实现“收藏列表”视图（复用 `PostCard` 列表）。
  - 新增 `src/pages/follow/index.vue` (可选) 展示关注/粉丝列表。
- **后端**:
  - 新增接口 `POST /users/{id}/follow`.
  - 新增接口 `DELETE /users/{id}/follow`.
  - 用户详情接口 `GET /users/{id}` 需返回 `is_following` 状态及统计数据。
  - 新增接口 `GET /users/{id}/favorites` 获取用户收藏的帖子。

---

## 4. 管理员后台 (Admin Dashboard)

**描述**:
`src/pages/admin/index.vue` 全部代码被注释，功能未上线。

**未完成项**:

1.  **用户管理列表**: 查看所有用户，显示状态。
2.  **封禁/解封**: 管理员权限操作。
3.  **重置资料**: 强制重置用户违规信息。

### 实现思路:

- **前端**:
  - 恢复并完善 `src/pages/admin/index.vue`。
  - 实现表格展示，分页。
  - 对接管理 API。
- **后端**:
  - 完善管理接口 `GET /admin/users` (需鉴权且校验 Admin 角色)。
  - `POST /admin/users/{id}/ban`.
  - `POST /admin/users/{id}/reset`.

---

## 5. 发布功能完善 (Post Creation)

**描述**:
动态发布页面功能基础，缺少可见性设置。

**未完成项**:

1.  **可见性设置**: 公开/仅好友/私密。

### 实现思路:

- **前端**:
  - `src/pages/post-create/index.vue`: 表单新增 `el-select` 或 `el-radio-group` 选择 `visibility`。
  - API 调用时传输该字段。
- **后端**:
  - 数据库 `posts` 表需支持 `visibility` 字段。
  - Feed 流接口需过滤：
    - 私密：仅自己可见。
    - 好友：仅互关/关注者可见。

---

## 6. 其他扩展功能 (Misc)

**描述**:
PRD 中提到的一些增强体验的功能。

**未完成项**:

1.  **夜间模式 (Dark Mode)**: 全局主题切换。
2.  **个人资料编辑完善**: PRD 提到“兴趣标签 (Tag 选择器)”，目前编辑页情况需确认，但 User 页显示了 tags。
3.  **通知/消息中心**: 虽然 PRD 3.4 提到了[私信]，但通常社交应用需要一个消息中心查看“收到的赞/评论”。(可选)

### 实现思路:

- **前端**:
  - 引入 `useDark` (VueUse)。
  - Header 添加切换按钮。
  - 页面样式适配 Dark Mode (Element Plus 自带支持，需配置即可)。
- **后端**:
  - 无特殊需求。

---

## 总结与优先级建议

建议按照以下顺序进行开发：

1.  **P0**: 全局布局 (Header) + 路由修正。 (基础体验)
2.  **P0**: 关注/粉丝功能 + 用户主页数据真实化。 (社交核心)
3.  **P1**: 首页热门排序 + 搜索。 (内容发现)
4.  **P1**: 管理后台。 (运维需求)
5.  **P2**: 收藏、夜间模式、可见性设置。 (锦上添花)
