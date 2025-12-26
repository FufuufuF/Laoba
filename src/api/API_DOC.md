# 🚀 Laoba 后端 API 接口文档

本文档包含了 **Laoba** 项目后端的所有 API 接口说明。

- **OpenAPI 版本**: `3.1.0`
- **基础路径**: `/api/v1`
- **项目说明**: 基于 FastAPI 构建的高性能后端服务。

---

## � 通用响应格式 (APIResponse)

所有接口统一返回以下 JSON 结构：

```typescript
interface APIResponse<T = any> {
  code: number; // 状态码: 0=成功, 非0=失败
  message: string; // 状态描述
  data: T | null; // 业务数据
}
```

| code 值 | 说明                        |
| :-----: | :-------------------------- |
|   `0`   | 请求成功                    |
|  `400`  | 请求参数错误 / 业务逻辑错误 |
|  `401`  | 未授权 / 认证失败           |
|  `403`  | 禁止访问 (如用户被封禁)     |
|  `500`  | 服务器内部错误              |

---

## �🔐 鉴权接口 (Auth)

### 1. 鉴权验证

- **接口地址**: `GET /api/v1/auth/`
- **功能说明**: 验证当前用户的 cookie 是否有效。

#### 返回结果

**成功 (200 OK)**:

```typescript
{
  code: 0,
  message: "success",
  data: {
    user_id: number  // 当前登录用户的 ID
  }
}
```

**失败 (401 Unauthorized)**:

```typescript
{
  code: 401,
  message: "Invalid token" | "Token expired" | "Token not provided",
  data: null
}
```

---

### 2. 用户注册

- **接口地址**: `POST /api/v1/auth/register`
- **功能说明**: 新用户注册。

#### 请求体 (JSON)

| 字段         | 类型     | 必填 | 说明     | 约束                   |
| :----------- | :------- | :--: | :------- | :--------------------- |
| `username`   | string   |  是  | 用户名   | 4-50 字符              |
| `student_id` | string   |  是  | 学号     | -                      |
| `password`   | string   |  是  | 密码     | 至少 6 位，最多 100 位 |
| `nickname`   | string   |  是  | 昵称     | 最大 20 字符           |
| `bio`        | string   |  否  | 自我介绍 | 最大 200 字符          |
| `tags`       | string[] |  否  | 兴趣标签 | -                      |

#### 返回结果

**成功 (200 OK)**:

```typescript
{
  code: 0,
  message: "User registered successfully",
  data: {
    id: number,           // 新用户 ID
    student_id: string,   // 学号
    username: string,     // 用户名
    nickname: string      // 昵称
  }
}
```

**失败 - 用户已存在 (400 Bad Request)**:

```typescript
{
  code: 400,
  message: "User with this student_id already exists",
  data: null
}
```

**失败 - 服务器错误 (500 Internal Server Error)**:

```typescript
{
  code: 500,
  message: "Registration failed: <error_detail>",
  data: null
}
```

---

### 3. 用户登录

- **接口地址**: `POST /api/v1/auth/login`
- **功能说明**: 用户登录，并在响应中设置 `access_token` cookie。

#### 请求体 (JSON)

| 字段         | 类型   | 必填 | 说明 | 约束       |
| :----------- | :----- | :--: | :--- | :--------- |
| `student_id` | string |  是  | 学号 | -          |
| `password`   | string |  是  | 密码 | 4-100 字符 |

#### 返回结果

**成功 (200 OK)**:

> **注意**: 成功登录后，响应会通过 `Set-Cookie` 头设置 `access_token` cookie (HttpOnly, SameSite=Lax)。

```typescript
{
  code: 0,
  message: "Login successful",
  data: {
    id: number,             // 用户 ID
    student_id: string,     // 学号
    username: string,       // 用户名
    nickname: string,       // 昵称
    role: "student" | "admin"  // 用户角色
  }
}
```

**失败 - 认证失败 (401 Unauthorized)**:

```typescript
{
  code: 401,
  message: "Invalid student_id or password",
  data: null
}
```

**失败 - 用户被封禁 (403 Forbidden)**:

```typescript
{
  code: 403,
  message: "User is forbidden",
  data: null
}
```

---

### 4. 用户登出

- **接口地址**: `POST /api/v1/auth/logout`
- **功能说明**: 清除 `access_token` cookie，退出登录。

#### 返回结果

**成功 (200 OK)**:

```typescript
{
  code: 0,
  message: "Logout successful",
  data: null
}
```

---

## 📝 帖子接口 (Post)

### 1. 获取帖子列表

- **接口地址**: `GET /api/v1/post/`
- **功能说明**: 获取所有帖子。

#### 返回结果

**成功 (200 OK)**:

```typescript
{
  code: 0,
  message: "success",
  data: {
    posts: PostResponse[]  // 帖子数组
  }
}
```

---

### 2. 创建帖子

- **接口地址**: `POST /api/v1/post/`
- **功能说明**: 发布新帖子。

#### 请求体 (JSON)

| 字段      | 类型        | 必填 | 说明         |
| :-------- | :---------- | :--: | :----------- |
| `title`   | string      |  是  | 标题         |
| `content` | string      |  是  | 内容         |
| `media`   | MediaItem[] |  是  | 媒体资源列表 |
| `tags`    | string[]    |  是  | 标签列表     |
| `user_id` | number      |  是  | 发布者 ID    |

#### 返回结果

**成功 (200 OK)**:

```typescript
{
  code: 0,
  message: "success",
  data: {
    post: PostResponse  // 新创建的帖子
  }
}
```

---

### 3. 获取帖子详情

- **接口地址**: `GET /api/v1/post/{post_id}`
- **功能说明**: 根据 ID 获取指定帖子的详细信息。

#### 路径参数

| 参数      | 类型   | 必填 | 说明           |
| :-------- | :----- | :--: | :------------- |
| `post_id` | number |  是  | 帖子唯一标识符 |

#### 返回结果

**成功 (200 OK)**:

```typescript
{
  code: 0,
  message: "success",
  data: {
    post: PostResponse | null  // 帖子详情，不存在时为 null
  }
}
```

---

## 📦 数据模型 (Schemas)

### APIResponse\<T\>

通用 API 响应包装器。

```typescript
interface APIResponse<T = any> {
  code: number;
  message: string;
  data: T | null;
}
```

---

### PostResponse

帖子详情响应模型。

```typescript
interface PostResponse {
  id: number; // 帖子 ID
  user_id: number; // 发布者 ID
  title: string; // 标题
  content: string | null; // 内容
  media: MediaItem[] | null; // 媒体资源列表
  tags: string[] | null; // 标签列表
  view_count: number; // 浏览次数
  like_count: number; // 点赞数
  comment_count: number; // 评论数
  share_count: number; // 分享数
  created_at: string; // 创建时间 (ISO 8601 格式)
  updated_at: string; // 更新时间 (ISO 8601 格式)
}
```

---

### MediaItem

用于描述帖子中的媒体资源（图片或视频）。

```typescript
interface MediaItem {
  url: string; // 资源地址
  type: "image" | "video"; // 资源类型
}
```

---

### UserRole

用户角色枚举。

```typescript
type UserRole = "student" | "admin";
```

---

### LoginResponse (data 字段)

登录成功后返回的用户信息。

```typescript
interface LoginResponse {
  id: number; // 用户 ID
  student_id: string; // 学号
  username: string; // 用户名
  nickname: string; // 昵称
  role: UserRole; // 用户角色
}
```

---

### RegisterResponse (data 字段)

注册成功后返回的用户信息。

```typescript
interface RegisterResponse {
  id: number; // 新用户 ID
  student_id: string; // 学号
  username: string; // 用户名
  nickname: string; // 昵称
}
```

---

### AuthResponse (data 字段)

鉴权验证成功后返回的信息。

```typescript
interface AuthResponse {
  user_id: number; // 当前登录用户 ID
}
```

---

## 💡 前端使用示例

### TypeScript 类型定义

```typescript
// types/api.ts

export interface APIResponse<T = any> {
  code: number;
  message: string;
  data: T | null;
}

export interface MediaItem {
  url: string;
  type: "image" | "video";
}

export type UserRole = "student" | "admin";

export interface PostResponse {
  id: number;
  user_id: number;
  title: string;
  content: string | null;
  media: MediaItem[] | null;
  tags: string[] | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  created_at: string;
  updated_at: string;
}

export interface LoginData {
  id: number;
  student_id: string;
  username: string;
  nickname: string;
  role: UserRole;
}

export interface RegisterData {
  id: number;
  student_id: string;
  username: string;
  nickname: string;
}

export interface AuthData {
  user_id: number;
}

export interface PostListData {
  posts: PostResponse[];
}

export interface PostDetailData {
  post: PostResponse | null;
}
```

### API 调用示例

```typescript
// api/auth.ts
import type {
  APIResponse,
  LoginData,
  RegisterData,
  AuthData,
} from "./types/api";

const BASE_URL = "/api/v1";

export async function login(
  student_id: string,
  password: string
): Promise<APIResponse<LoginData>> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // 重要：携带 cookie
    body: JSON.stringify({ student_id, password }),
  });
  return res.json();
}

export async function checkAuth(): Promise<APIResponse<AuthData>> {
  const res = await fetch(`${BASE_URL}/auth/`, {
    credentials: "include",
  });
  return res.json();
}

// api/post.ts
import type { APIResponse, PostListData, PostDetailData } from "./types/api";

export async function getPosts(): Promise<APIResponse<PostListData>> {
  const res = await fetch(`${BASE_URL}/post/`, {
    credentials: "include",
  });
  return res.json();
}

export async function getPost(
  postId: number
): Promise<APIResponse<PostDetailData>> {
  const res = await fetch(`${BASE_URL}/post/${postId}`, {
    credentials: "include",
  });
  return res.json();
}
```

---

> 💡 **提示**:
>
> 1. 所有接口默认响应格式均为 `application/json`。
> 2. 鉴权相关的接口会通过 Cookie (`access_token`) 进行自动校验。
> 3. 前端请求需要设置 `credentials: 'include'` 以携带 cookie。
> 4. 时间字段 (`created_at`, `updated_at`) 使用 ISO 8601 格式字符串。
