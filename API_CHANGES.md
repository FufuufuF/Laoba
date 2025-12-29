# API 接口文档 - 新增与修改接口

> 本文档记录了帖子互动与用户社交功能相关的新增和修改接口。

---

## 通用说明

### 认证方式

- **登录用户**: 需在请求中携带 Cookie，后端通过 `get_current_user` 依赖验证
- **游客访问**: 部分接口支持游客访问，使用 `get_optional_user` 依赖，此时 `user_id` 为 `None`

### 响应格式

所有接口返回统一的 `APIResponse` 结构：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code: 0` 表示成功，其他值表示错误
- `message` 为操作结果描述
- `data` 为具体返回数据

---

## 一、帖子相关接口

### 1.1 获取帖子列表 (已修改)

| 属性     | 值                   |
| -------- | -------------------- |
| **路径** | `GET /api/v1/post/`  |
| **认证** | 可选（支持游客访问） |

#### 请求参数 (Query)

| 参数      | 类型     | 必填 | 默认值     | 描述                                |
| --------- | -------- | ---- | ---------- | ----------------------------------- |
| `sort_by` | `string` | 否   | `"latest"` | 排序方式: `latest`-最新, `hot`-热门 |

#### 响应示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "posts": [
      {
        "id": 1,
        "user_id": 123,
        "title": "帖子标题",
        "content": "帖子正文内容...",
        "media": [{ "url": "https://example.com/image.jpg", "type": "image" }],
        "tags": ["标签1", "标签2"],
        "created_at": "2025-12-27T10:00:00",
        "updated_at": "2025-12-27T10:00:00",
        "visibility": "public",
        "author": {
          "user_id": 123,
          "avatar": "https://example.com/avatar.jpg",
          "nickname": "用户昵称"
        },
        "status": {
          "view_count": 100,
          "like_count": 50,
          "comment_count": 10,
          "share_count": 5,
          "is_liked": false,
          "is_collected": false
        }
      }
    ]
  }
}
```

#### 修改内容

- 新增 `sort_by` 查询参数，支持按最新/热门排序
- 响应结构优化，包含嵌套的 `author` 和 `status` 对象
- 新增 `visibility` 字段
- 新增 `is_liked`、`is_collected` 状态（游客模式下为 `false`）

---

### 1.2 获取帖子详情 (已修改)

| 属性     | 值                           |
| -------- | ---------------------------- |
| **路径** | `GET /api/v1/post/{post_id}` |
| **认证** | 可选（支持游客访问）         |

#### 路径参数

| 参数      | 类型  | 描述    |
| --------- | ----- | ------- |
| `post_id` | `int` | 帖子 ID |

#### 响应示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "post": {
      "id": 1,
      "user_id": 123,
      "title": "帖子标题",
      "content": "帖子正文内容...",
      "media": [{ "url": "https://example.com/image.jpg", "type": "image" }],
      "tags": ["标签1", "标签2"],
      "created_at": "2025-12-27T10:00:00",
      "updated_at": "2025-12-27T10:00:00",
      "visibility": "public",
      "author": {
        "user_id": 123,
        "avatar": "https://example.com/avatar.jpg",
        "nickname": "用户昵称"
      },
      "status": {
        "view_count": 100,
        "like_count": 50,
        "comment_count": 10,
        "share_count": 5,
        "is_liked": true,
        "is_collected": false
      }
    }
  }
}
```

#### 修改内容

- 响应结构与列表接口一致，包含嵌套结构
- 新增 `visibility` 字段
- 新增 `is_liked`、`is_collected` 状态

---

### 1.3 创建帖子 (已修改)

| 属性     | 值                   |
| -------- | -------------------- |
| **路径** | `POST /api/v1/post/` |
| **认证** | 必须登录             |

#### 请求体 (JSON)

```json
{
  "title": "帖子标题",
  "content": "帖子正文内容",
  "media": [{ "url": "https://example.com/image.jpg", "type": "image" }],
  "tags": ["标签1", "标签2"],
  "visibility": "public"
}
```

| 字段           | 类型     | 必填 | 默认值     | 描述                                 |
| -------------- | -------- | ---- | ---------- | ------------------------------------ |
| `title`        | `string` | 是   | -          | 帖子标题                             |
| `content`      | `string` | 是   | -          | 帖子正文                             |
| `media`        | `array`  | 是   | -          | 媒体文件列表                         |
| `media[].url`  | `string` | 是   | -          | 媒体文件 URL                         |
| `media[].type` | `string` | 是   | -          | 类型: `image` 或 `video`             |
| `tags`         | `array`  | 是   | -          | 标签数组                             |
| `visibility`   | `string` | 否   | `"public"` | 可见性: `public`/`friends`/`private` |

#### 响应示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "post": { ... }
  }
}
```

#### 修改内容

- 新增 `visibility` 字段，支持设置帖子可见性

---

### 1.4 更新帖子状态 (新增)

| 属性     | 值                             |
| -------- | ------------------------------ |
| **路径** | `POST /api/v1/post/{post_id}/` |
| **认证** | 必须登录                       |

#### 路径参数

| 参数      | 类型  | 描述    |
| --------- | ----- | ------- |
| `post_id` | `int` | 帖子 ID |

#### 请求体 (JSON)

```json
{
  "action": "like"
}
```

| 字段     | 类型     | 必填 | 描述                                            |
| -------- | -------- | ---- | ----------------------------------------------- |
| `action` | `string` | 是   | 操作类型: `like`/`unlike`/`collect`/`uncollect` |

#### action 说明

| 值          | 描述     |
| ----------- | -------- |
| `like`      | 点赞帖子 |
| `unlike`    | 取消点赞 |
| `collect`   | 收藏帖子 |
| `uncollect` | 取消收藏 |

#### 响应示例

```json
{
  "code": 0,
  "message": "点赞成功",
  "data": {
    "id": 1,
    "user_id": 123,
    "title": "帖子标题",
    "content": "...",
    "media": [...],
    "tags": [...],
    "created_at": "2025-12-27T10:00:00",
    "updated_at": "2025-12-27T10:00:00",
    "visibility": "public",
    "author": {
      "user_id": 123,
      "avatar": "...",
      "nickname": "..."
    },
    "status": {
      "view_count": 100,
      "like_count": 51,
      "comment_count": 10,
      "share_count": 5,
      "is_liked": true,
      "is_collected": false
    }
  }
}
```

#### 操作结果消息

| action      | 成功消息       | 失败消息     |
| ----------- | -------------- | ------------ |
| `like`      | "点赞成功"     | "已经点赞过" |
| `unlike`    | "取消点赞成功" | "尚未点赞"   |
| `collect`   | "收藏成功"     | "已经收藏过" |
| `uncollect` | "取消收藏成功" | "尚未收藏"   |

---

### 1.5 添加评论 (新增)

| 属性     | 值                                     |
| -------- | -------------------------------------- |
| **路径** | `POST /api/v1/post/{post_id}/comments` |
| **认证** | 必须登录                               |

#### 路径参数

| 参数      | 类型  | 描述    |
| --------- | ----- | ------- |
| `post_id` | `int` | 帖子 ID |

#### 请求体 (JSON)

```json
{
  "content": "评论内容"
}
```

| 字段      | 类型     | 必填 | 描述     |
| --------- | -------- | ---- | -------- |
| `content` | `string` | 是   | 评论内容 |

#### 响应示例

```json
{
  "code": 0,
  "message": "评论成功",
  "data": {
    "comment": {
      "id": 1,
      "post_id": 1,
      "user_id": 123,
      "content": "评论内容",
      "created_at": "2025-12-27T10:00:00",
      "updated_at": "2025-12-27T10:00:00"
    }
  }
}
```

---

## 二、用户相关接口

### 2.1 获取用户详情 (已修改)

| 属性     | 值                                        |
| -------- | ----------------------------------------- |
| **路径** | `GET /api/v1/user/users/{target_user_id}` |
| **认证** | 可选（支持游客访问）                      |

#### 路径参数

| 参数             | 类型  | 描述        |
| ---------------- | ----- | ----------- |
| `target_user_id` | `int` | 目标用户 ID |

#### 响应示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 123,
    "student_id": "20210001",
    "username": "user123",
    "nickname": "用户昵称",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "个人简介",
    "tags": ["标签1", "标签2"],
    "role": "user",
    "is_forbidden": false,
    "created_at": "2025-01-01T00:00:00",
    "updated_at": "2025-12-27T10:00:00",
    "followers_count": 100,
    "following_count": 50,
    "is_following": true
  }
}
```

#### 修改内容

- 新增 `followers_count`: 粉丝数
- 新增 `following_count`: 关注数
- 新增 `is_following`: 当前用户是否已关注该用户（游客模式下为 `false`）

---

### 2.2 关注用户 (新增)

| 属性     | 值                                                |
| -------- | ------------------------------------------------- |
| **路径** | `POST /api/v1/user/users/{target_user_id}/follow` |
| **认证** | 必须登录                                          |

#### 路径参数

| 参数             | 类型  | 描述        |
| ---------------- | ----- | ----------- |
| `target_user_id` | `int` | 目标用户 ID |

#### 响应示例

**成功:**

```json
{
  "code": 0,
  "message": "关注成功",
  "data": {
    "is_following": true
  }
}
```

**失败:**

```json
{
  "code": 400,
  "message": "已关注该用户或无法关注自己",
  "data": {
    "is_following": true
  }
}
```

---

### 2.3 取消关注用户 (新增)

| 属性     | 值                                                  |
| -------- | --------------------------------------------------- |
| **路径** | `DELETE /api/v1/user/users/{target_user_id}/follow` |
| **认证** | 必须登录                                            |

#### 路径参数

| 参数             | 类型  | 描述        |
| ---------------- | ----- | ----------- |
| `target_user_id` | `int` | 目标用户 ID |

#### 响应示例

**成功:**

```json
{
  "code": 0,
  "message": "取消关注成功",
  "data": {
    "is_following": false
  }
}
```

**失败:**

```json
{
  "code": 400,
  "message": "尚未关注该用户",
  "data": {
    "is_following": false
  }
}
```

---

### 2.4 获取用户发布的帖子 (新增)

| 属性     | 值                                              |
| -------- | ----------------------------------------------- |
| **路径** | `GET /api/v1/user/users/{target_user_id}/posts` |
| **认证** | 可选（支持游客访问）                            |

#### 路径参数

| 参数             | 类型  | 描述        |
| ---------------- | ----- | ----------- |
| `target_user_id` | `int` | 目标用户 ID |

#### 响应示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "user_id": 123,
        "title": "帖子标题",
        "content": "...",
        "media": [...],
        "tags": [...],
        "created_at": "...",
        "updated_at": "...",
        "visibility": "public",
        "author": { ... },
        "status": { ... }
      }
    ],
    "total": 10
  }
}
```

---

### 2.5 获取用户收藏的帖子 (新增)

| 属性     | 值                                                  |
| -------- | --------------------------------------------------- |
| **路径** | `GET /api/v1/user/users/{target_user_id}/favorites` |
| **认证** | 可选（支持游客访问）                                |

#### 路径参数

| 参数             | 类型  | 描述        |
| ---------------- | ----- | ----------- |
| `target_user_id` | `int` | 目标用户 ID |

#### 响应示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "user_id": 456,
        "title": "收藏的帖子",
        "content": "...",
        "media": [...],
        "tags": [...],
        "created_at": "...",
        "updated_at": "...",
        "visibility": "public",
        "author": { ... },
        "status": { ... }
      }
    ],
    "total": 5
  }
}
```

---

## 三、数据类型定义

### PostResponse

```typescript
interface PostResponse {
  id: number;
  user_id: number;
  title: string;
  content: string | null;
  media: MediaItem[] | null;
  tags: string[] | null;
  created_at: string; // ISO 8601 格式
  updated_at: string; // ISO 8601 格式
  visibility: "public" | "friends" | "private";
  author: AuthorInfo;
  status: PostStatus;
}
```

### AuthorInfo

```typescript
interface AuthorInfo {
  user_id: number;
  avatar: string | null;
  nickname: string;
}
```

### PostStatus

```typescript
interface PostStatus {
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  is_liked: boolean; // 当前用户是否已点赞
  is_collected: boolean; // 当前用户是否已收藏
}
```

### MediaItem

```typescript
interface MediaItem {
  url: string;
  type: "image" | "video";
}
```

### UserDetailResponse

```typescript
interface UserDetailResponse {
  id: number;
  student_id: string;
  username: string;
  nickname: string | null;
  avatar: string | null;
  bio: string | null;
  tags: string[] | null;
  role: "user" | "admin";
  is_forbidden: boolean;
  created_at: string;
  updated_at: string;
  followers_count: number; // 新增
  following_count: number; // 新增
  is_following: boolean; // 新增
}
```

---

## 四、待完成数据库迁移

> [!WARNING]
> 在使用以上接口前，需要先执行数据库迁移，添加 `posts.visibility` 字段：

```sql
ALTER TABLE posts ADD COLUMN visibility VARCHAR(20) DEFAULT 'public' COMMENT '可见性: public-公开, friends-仅好友, private-私密';
```
