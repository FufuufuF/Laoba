# 🚀 Laoba 后端 API 接口文档

本文档包含了 **Laoba** 项目后端的所有 API 接口说明。

- **OpenAPI 版本**: `3.1.0`
- **基础路径**: `/api/v1`
- **项目说明**: 基于 FastAPI 构建的高性能后端服务。

---

## 🔐 鉴权接口 (Auth)

### 1. 鉴权验证

- **接口地址**: `GET /api/v1/auth/`
- **功能说明**: 验证当前用户的 cookie 是否有效。
- **返回结果**:
  - `200 Success`:
    - `code`: 0
    - `data`: 包含 `user_id`
  - `401 Unauthorized`: 验证失败，cookie 无效或不存在。

---

### 2. 用户注册

- **接口地址**: `POST /api/v1/auth/register`
- **功能说明**: 新用户注册。
- **请求体 (JSON)**:
  | 字段 | 类型 | 必填 | 说明 | 约束 |
  | :--- | :--- | :---: | :--- | :--- |
  | `username` | string | 是 | 用户名 | 4-50 字符 |
  | `student_id` | string | 是 | 邮箱地址 | - |
  | `password` | string | 是 | 密码 | 至少 6 位 |
  | `nickname` | string | 是 | 昵称 | 最大 20 字符 |
  | `bio` | string | 否 | 自我介绍 | 最大 200 字符 |
  | `tags` | array[string] | 否 | 兴趣标签 | - |

- **返回结果**:
  - `200 Success`: code=0, 创建用户成功。
  - `400 Bad Request`: 用户已存在。

---

### 3. 用户登录

- **接口地址**: `POST /api/v1/auth/login`
- **功能说明**: 用户登录，并在响应中设置 `access_token` cookie。
- **请求体 (JSON)**:
  | 字段 | 类型 | 必填 | 说明 | 约束 |
  | :--- | :--- | :---: | :--- | :--- |
  | `student_id` | string | 是 | 邮箱地址 | - |
  | `password` | string | 是 | 密码 | 4-100 字符 |

- **返回结果**:
  - `200 Success`: code=0, 登录成功，Cookie 已设置。
  - `401 Unauthorized`: 用户名或密码错误。

---

### 4. 用户登出

- **接口地址**: `POST /api/v1/auth/logout`
- **功能说明**: 清除 `access_token` cookie，退出登录。
- **返回结果**:
  - `200 Success`: 登出成功。

---

## 📝 帖子接口 (Post)

### 1. 获取帖子列表

- **接口地址**: `GET /api/v1/post/`
- **功能说明**: 获取所有帖子。
- **返回结果**:
  - `200 Success`: 返回帖子数组。

---

### 2. 创建帖子

- **接口地址**: `POST /api/v1/post/`
- **功能说明**: 发布新帖子。
- **请求体 (JSON)**:
  | 字段 | 类型 | 必填 | 说明 |
  | :--- | :--- | :---: | :--- |
  | `title` | string | 是 | 标题 |
  | `content` | string | 是 | 内容 |
  | `media` | array[MediaItem] | 是 | 媒体资源列表 (见下方 Schema) |
  | `tags` | array[string] | 是 | 标签列表 |
  | `user_id` | integer | 是 | 发布者 ID |

- **返回结果**:
  - `200 Success`: 创建成功。

---

### 3. 获取帖子详情

- **接口地址**: `GET /api/v1/post/{post_id}`
- **功能说明**: 根据 ID 获取指定帖子的详细信息。
- **路径参数**:
  | 参数 | 类型 | 必填 | 说明 |
  | :--- | :--- | :---: | :--- |
  | `post_id` | integer | 是 | 帖子唯一标识符 |

- **返回结果**:
  - `200 Success`: 返回帖子详情。

---

## 📦 数据模型 (Schemas)

### MediaItem

用于描述帖子中的媒体资源（图片或视频）。
| 字段 | 类型 | 说明 | 枚举值 |
| :--- | :--- | :--- | :--- |
| `url` | string | 资源地址 | - |
| `type` | string | 资源类型 | `image`, `video` |

### UserRegister (注册模型)

| 字段         | 类型          | 说明                |
| :----------- | :------------ | :------------------ |
| `username`   | string        | 用户名 (4-50)       |
| `student_id` | string        | 邮箱地址            |
| `password`   | string        | 密码 (min: 6)       |
| `nickname`   | string        | 昵称 (max: 20)      |
| `bio`        | string        | 自我介绍 (max: 200) |
| `tags`       | array[string] | 兴趣标签            |

---

> 💡 **提示**:
>
> 1. 所有接口默认响应格式均为 `application/json`。
> 2. 鉴权相关的接口会通过 Cookie (`access_token`) 进行自动校验。
