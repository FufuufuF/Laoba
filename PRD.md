# 校园生活交互平台 - 产品需求文档 (PRD)

| 项目名称     | 校园生活交互平台 (Campus Social Platform)                   |
| :----------- | :---------------------------------------------------------- |
| **版本号**   | V1.0                                                        |
| **文档状态** | 正式发布                                                    |
| **技术栈**   | Vue 3 (Composition API) + TypeScript + Pinia + Element Plus |
| **UI 参考**  | 微博、抖音、小红书风格                                      |

---

## 1. 项目概述

### 1.1 项目背景

本项目旨在参考主流社交媒体平台（如微博、小红书），设计并实现一个模拟的校内社交互动平台。核心目标是为大学生提供一个集内容发布、互动交流、个人展示为一体的 Web 应用。

### 1.2 用户角色

- **普通游客**：未登录用户，仅拥有浏览权限。
- **注册学生**：拥有完整权限，包括发帖、互动、关注、个人中心管理。
- **系统管理员**：拥有用户管理权限（封禁、重置资料）。

---

## 2. UI/UX 设计规范

由于采用 **Element Plus** 组件库，整体设计需遵循以下风格：

- **设计风格**：年轻化、扁平化、简洁大气。
- **主色调**：建议采用 _校园蓝_ (Primary) 或 _活力橙_ 作为强调色，配合 Element Plus 默认的白色/灰色背景。
- **布局模式**：
  - PC 端：经典三栏布局（左侧导航/用户信息，中间信息流，右侧推荐/热门）。
- **交互体验**：使用 Element Plus 的 `v-loading` 加载态、`ElMessage` 全局提示、`ElNotification` 通知。

---

## 3. 功能模块详情

### 3.1 首页与公共浏览 (Home & Guest View)

**页面结构：**

- **顶部导航栏 (Sticky Header)**：
  - 左侧：Logo + 平台名称。
  - 中间：搜索框（可选功能入口）、导航菜单（首页、发现）。
  - 右侧：登录/注册按钮（未登录态）或 头像+下拉菜单（登录态）。
- **内容区域**：
  - **信息流 (Feed)**：核心区域，展示动态列表。需支持“最新发布”和“热门推荐”（可选）切换。
  - **动态卡片 (Post Card)**：包含作者头像、昵称、发布时间、文本内容、图片九宫格、操作栏（点赞、评论、转发）。
- **动态交互特效 (可选)**：
  - 跑马灯/顶部公告栏：提示最新活动或系统通知。
  - 下拉刷新/骨架屏 (Skeleton) 加载效果。

**权限逻辑：**

- 游客可见所有设置为“公开”的动态。
- 游客点击点赞、评论时，弹出 `ElDialog` 提示引导登录。

### 3.2 用户认证系统 (Auth System)

**页面 UI：**

- 采用左右分栏设计或居中卡片式设计。
- **注册页**：
  - 表单字段：学号 (需正则校验)、密码、确认密码。
  - 交互：输入框失焦校验，错误时下方红字提示。
- **登录页**：
  - 表单字段：学号/昵称、密码。
  - 辅助功能：Checkbox "记住我"、Icon "密码可见/隐藏" 切换、Link "忘记密码"。
- **个人资料设置引导 (首次登录)**：
  - 上传头像 (支持 `ElUpload` 图片裁剪)、设置昵称、个人简介、选择兴趣标签 (Tag 选择器)。

### 3.3 动态发布与浏览 (Content Creation & Consumption)

**发布入口：**

- 首页顶部常驻“分享新鲜事”输入框，或右下角悬浮按钮 (Floating Action Button)。
- 点击后弹出 `ElDialog` 或跳转发布页。

**发布编辑器 UI：**

- **文本域**：支持多行输入，字数统计。
- **媒体上传**：图片上传墙（支持拖拽，显示上传进度），支持填写图片链接。
- **扩展选项 (可选)**：添加话题标签 (`#学习日常`)、设置可见范围 (公开/仅好友/仅自己)。

**动态详情页：**

- 展示完整的长文本、高清大图。
- **评论区**：
  - 评论列表：按时间排序。
  - 发表评论框：支持简单的表情插入 (Emoji)。

### 3.4 互动与社交 (Interaction & Social)

**用户主页 (Profile)：**

- **头部 (Header)**：大背景图、悬浮头像、昵称、UID、简介。
- **数据栏**：关注数、粉丝数、获赞数。
- **操作按钮**：
  - 如果是他人主页：[关注/取消关注]
  - 如果是自己主页：[编辑资料]。
- **内容 Tab**：[TA 的动态]

**关注机制：**

- 首页 Feed 流支持切换视图：[全站动态] vs [关注动态]。
- 交互：点击关注后，按钮状态即时变为“已关注” (前端乐观更新)。

### 3.5 管理员后台 (Admin Dashboard) - _独立/嵌入路由_

- **用户管理表格 (`ElTable`)**：
  - 列：头像、昵称、学号、状态 (正常/封禁)、注册时间、操作。
  - 操作列：[重置资料]、[封禁/解封]。
- **操作反馈**：所有敏感操作需 `ElMessageBox.confirm` 二次确认。

### 3.6 扩展/个性化模块 (Advanced/Optional)

- **夜间模式**：利用 VueUse 的 `useDark` 结合 Element Plus 自定义主题变量，实现一键切换黑夜/白天模式。
- **搜索功能**：支持对动态内容或用户昵称的模糊搜索。

---

## 4. 路由结构规划 (Vue Router)

| 路径 (Path) | 组件名称         | 说明          | 权限         |
| :---------- | :--------------- | :------------ | :----------- |
| `/`         | `HomeView`       | 首页/广场     | 公开         |
| `/login`    | `LoginView`      | 登录页        | 仅未登录     |
| `/register` | `RegisterView`   | 注册页        | 仅未登录     |
| `/post/:id` | `PostDetail`     | 动态详情页    | 公开         |
| `/user/:id` | `UserProfile`    | 用户个人主页  | 公开         |
| `/settings` | `SettingsView`   | 个人资料编辑  | 需登录       |
| `/admin`    | `AdminDashboard` | 管理员后台    | 需管理员权限 |
| `/follow`   | `FollowView`     | 关注/粉丝列表 | 需登录       |

---

## 5. 状态管理规划 (Pinia)

建议拆分为以下 Store 模块以保持代码清晰：

1.  **`useUserStore`**
    - State: `userInfo` (当前登录用户信息), `token` (鉴权), `isLogin`.
    - Actions: `login()`, `logout()`, `updateProfile()`.
2.  **`useFeedStore`**
    - State: `postList` (当前展示的动态列表), `filterType` (最新/热门/关注).
    - Actions: `fetchPosts()`, `toggleLike(postId)`, `deletePost(postId)`.
3.  **`useThemeStore` (可选)**
    - State: `isDarkMode`.
    - Actions: `toggleTheme()`.

---

## 6. 数据模型 (TypeScript Interfaces)

_仅做结构参考，无需具体实现_

```typescript
// 用户信息接口
interface User {
  id: string;
  studentId: string;
  nickname: string;
  avatar: string;
  bio?: string;
  tags?: string[];
  followingCount: number;
  followerCount: number;
}

// 动态内容接口
interface Post {
  id: string;
  author: User;
  content: string;
  images: string[]; // 图片URL数组
  publishTime: string; // ISO 格式
  likeCount: number;
  commentCount: number;
  isLiked: boolean; // 当前用户是否已点赞
  visibility: "public" | "private" | "friends";
}

// 评论接口
interface Comment {
  id: string;
  postId: string;
  user: User;
  content: string;
  createTime: string;
}
```
