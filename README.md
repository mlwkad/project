## 数据库设计

### 用户表 (users)

存储用户信息：

- id: 自增主键
- userID: 用户ID (字符串)
- userName: 用户名 (字符串+数字)
- passWord: 密码 (加密存储)
- release: 用户发布的内容ID列表 (TEXT格式存储JSON字符串)
- liked: 用户喜欢的内容ID列表 (TEXT格式存储JSON字符串)
- follow: 关注的用户ID列表（TEXT格式存储JSON字符串）
- avatar: 用户头像URL
- createdAt: 创建时间
- updatedAt: 更新时间

### 发布内容表 (releases)

存储发布的旅游信息：

- id: 自增主键
- releaseID: 发布内容ID (字符串)
- userID: 发布用户ID (外键关联用户表)
- title: 标题 (字符串)
- playTime: 游玩时间 (分钟)
- money: 费用
- personNum: 人数
- content: 内容描述
- pictures: 图片URL列表 (TEXT格式存储JSON字符串)
- videos: 视频URL列表 (TEXT格式存储JSON字符串)
- cover: 视频封面URL (字符串)
- location: 位置
- state: 审核状态 (wait-待审核, resolve-通过, reject-拒绝)
- reason: 状态原因（reject状态必填）
- createdAt: 创建时间
- updatedAt: 更新时间
- delete: 逻辑删除状态

### 用户相关

#### 登录

- URL: `/api/checkLogin`
- 方法: `POST`
- 请求参数:
  - userName: 用户名
  - passWord: 密码
- 返回数据: 用户信息（不包含密码）

#### 注册

- URL: `/api/signUp`
- 方法: `POST`
- 请求参数:
  - userName: 用户名
  - passWord: 密码
  - avatar: 头像URL (可选)
- 返回数据: 创建的用户信息（不包含密码）

#### 获取用户信息

- URL: `/api/user/:userID`
- 方法: `GET`
- 请求参数:
  - userID: 用户ID (路径参数)
- 返回数据: 用户信息（不包含密码）

#### 更新用户信息

- URL: `/api/user/:userID`
- 方法: `PUT`
- 请求参数:
  - userID: 用户ID (路径参数)
  - userName: 新用户名 (可选)
  - avatar: 新头像URL (可选)
- 返回数据: 更新后的用户信息

#### 获取用户发布的内容列表

- URL: `/api/user/:userID/releases`
- 方法: `GET`
- 请求参数:
  - userID: 用户ID (路径参数)
- 返回数据: 发布内容列表

#### 获取用户喜欢的内容列表

- URL: `/api/user/:userID/liked`
- 方法: `GET`
- 请求参数:
  - userID: 用户ID (路径参数)
- 返回数据: 喜欢的内容列表

#### 添加喜欢的内容

- URL: `/api/user/:userID/liked`
- 方法: `POST`
- 请求参数:
  - userID: 用户ID (路径参数)
  - releaseID: 发布内容ID
- 返回数据: 成功消息

#### 移除喜欢的内容

- URL: `/api/user/:userID/liked/:releaseID`
- 方法: `DELETE`
- 请求参数:
  - userID: 用户ID (路径参数)
  - releaseID: 发布内容ID (路径参数)
- 返回数据: 成功消息

### 发布内容相关

#### 获取所有发布内容

- URL: `/api/releases`
- 方法: `GET`
- 请求参数:
  - limit: 限制条数，默认为50 (可选)
  - offset: 偏移量，默认为0 (可选)
  - state: 审核状态，默认为'resolve' (可选)
- 返回数据: 发布内容列表

#### 根据ID获取发布内容详情

- URL: `/api/release/:releaseID`
- 方法: `GET`
- 请求参数:
  - releaseID: 发布内容ID (路径参数)
- 返回数据: 发布内容详情

#### 创建发布内容

- URL: `/api/release`
- 方法: `POST`
- 请求参数:
  - userID: 用户ID
  - title: 标题
  - playTime: 游玩时间 (分钟)
  - money: 费用
  - personNum: 人数
  - content: 内容描述
  - pictures: 图片URL数组 (可选)
  - videos: 视频URL数组 (可选)
  - cover: 视频封面URL (可选)
  - location: 位置
- 返回数据: 创建的发布内容

#### 更新发布内容

- URL: `/api/release/:releaseID`
- 方法: `PUT`
- 请求参数:
  - releaseID: 发布内容ID (路径参数)
  - userID: 用户ID (用于权限验证)
  - title: 标题 (可选)
  - playTime: 游玩时间 (分钟) (可选)
  - money: 费用 (可选)
  - personNum: 人数 (可选)
  - content: 内容描述 (可选)
  - pictures: 图片URL数组 (可选)
  - videos: 视频URL数组 (可选)
  - cover: 视频封面URL (可选)
  - location: 位置 (可选)
- 返回数据: 更新后的发布内容

#### 更新游记审核状态

- URL: `/api/release/:releaseID/state`
- 方法: `PUT`
- 请求参数:
  - releaseID: 发布内容ID (路径参数)
  - state: 审核状态 ('wait', 'resolve', 'reject')
  - reason: 状态原因（reject状态必填）
- 返回数据: 更新后的发布内容

#### 删除发布内容

- URL: `/api/release/:releaseID`
- 方法: `DELETE`
- 请求参数:
  - releaseID: 发布内容ID (路径参数)
  - userID: 用户ID
- 返回数据: 成功消息

#### 获取用户发布的内容列表

- URL: `/api/releases/user/:userID`
- 方法: `GET`
- 请求参数:
  - userID: 用户ID (路径参数)
- 返回数据: 发布内容列表

#### 搜索发布内容

- URL: `/api/releases/search`
- 方法: `GET` 或 `POST`
- 请求参数:
  - userName: 用户名 (可选)
  - title: 作品标题关键词 (可选)
  - state: 审核状态，默认为'resolve' (可选)
- 返回数据: 搜索结果列表

### 文件上传

#### 上传文件

- URL: `/api/upload`
- 方法: `POST`
- 请求参数:
  - files: 要上传的文件（图片/视频）
- 返回数据: 上传后的文件URL对象 (包含pictures和videos数组)
