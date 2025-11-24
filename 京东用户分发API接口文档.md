# 京东用户分发系统 API 接口文档

## 概述

本文档描述京东联盟推广系统的相关 API 接口，包括用户认证、用户信息管理、转链、订单管理、结算等功能。

**基础信息：**
- 接口基础路径：`/api` （根据实际部署调整）
- 认证方式：JWT Token (部分接口需要在 Header 中携带 `Authorization: Bearer {token}`)

---

## 1. 用户认证

### 1.1 微信登录（京东用户）

**接口路径：** `POST /auth/wechat`

**接口描述：** 京东用户通过微信公众号验证码登录

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| code | string | 是 | 验证码（以 `JD_` 开头） |
| inviteCode | string | 是 | 邀请码 |

**请求示例：**

```json
{
  "code": "JD_abc123",
  "inviteCode": "INV001"
}
```

**响应示例：**

```json
{
  "code": 200,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**错误响应：**

```json
{
  "code": 400,
  "message": "邀请码有误，请重新输入！-_-"
}
```

或

```json
{
  "code": 400,
  "message": "您输入的验证码有误或已过期，请重新输入！-_-"
}
```

---

## 2. 用户信息管理

### 2.1 获取用户信息

**接口路径：** `GET /jd_user`

**接口描述：** 获取当前登录用户的详细信息

**请求头：**

```
Authorization: Bearer {accessToken}
```

**响应示例：**

```json
{
  "code": 200,
  "data": {
    "_id": "66fa808cac17606faf142041",
    "openId": "o-BAB08c7sACBScWcJwPp-QqDxzk",
    "avatar": "https://...",
    "name": "用户昵称",
    "nickname": "京东昵称",
    "phone": "13800138000",
    "paymentQrCode": "https://qiniu.com/payment_qr.png",
    "inviteCode": "INV001",
    "role": 0,
    "login_type": "wechat",
    "createdAt": "2024-10-20T09:36:43.000Z",
    "updatedAt": "2024-10-20T09:36:43.000Z"
  }
}
```

**错误响应：**

```json
{
  "code": 404,
  "message": "用户不存在"
}
```

---

### 2.2 更新用户信息

**接口路径：** `PUT /jd_user`

**接口描述：** 更新用户个人信息（昵称、手机号、收款码）

**请求头：**

```
Authorization: Bearer {accessToken}
```

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| nickname | string | 否 | 昵称（长度不超过20个字符） |
| phone | string | 否 | 手机号（11位，格式校验） |
| paymentQrCode | string | 否 | 收款码图片URL |

**请求示例：**

```json
{
  "nickname": "小明",
  "phone": "13800138000",
  "paymentQrCode": "https://qiniu.com/payment/xxx.png"
}
```

**响应示例：**

```json
{
  "code": 200,
  "message": "更新成功"
}
```

**错误响应：**

```json
{
  "code": 400,
  "message": "昵称长度不能超过20个字符"
}
```

或

```json
{
  "code": 400,
  "message": "手机号格式不正确"
}
```

---

### 2.3 上传收款码图片

**接口路径：** `POST /jd_user/upload`

**接口描述：** 上传用户收款二维码图片（支付宝或微信）

**请求头：**

```
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data
```

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| file | File | 是 | 图片文件（支持 jpg, jpeg, png, gif, webp，最大5MB） |

**响应示例：**

```json
{
  "code": 200,
  "url": "https://qiniu.com/jd/payment/abc123.png"
}
```

**错误响应：**

```json
{
  "code": 400,
  "message": "只支持上传图片格式: jpg, jpeg, png, gif, webp"
}
```

或

```json
{
  "code": 400,
  "message": "文件大小不能超过5MB"
}
```

---

## 3. 京东转链

### 3.1 京东商品转链

**接口路径：** `POST /jd/convert`

**接口描述：** 将京东商品链接或商品ID转换为推广链接

**请求头：**

```
Authorization: Bearer {accessToken}
```

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| content | string | 是 | 京东商品链接或商品ID |

**请求示例：**

```json
{
  "content": "https://item.jd.com/100012345678.html"
}
```

或

```json
{
  "content": "100012345678"
}
```

**响应示例：**

```json
{
  "code": 200,
  "data": {
    "shortURL": "https://u.jd.com/abc123",
    "clickURL": "https://union-click.jd.com/..."
  },
  "message": "转链成功"
}
```

**转链失败响应：**

```json
{
  "code": 200,
  "data": {
    "shortURL": "https://item.jd.com/100012345678.html",
    "clickURL": ""
  },
  "message": "转链失败，返回原内容"
}
```

**错误响应：**

```json
{
  "code": 400,
  "message": "请输入有效的链接或商品ID"
}
```

---

### 3.2 查看今日京东群列表

**接口路径：** `GET /jd`

**接口描述：** 获取今日的京东群列表信息

**响应示例：**

```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "_id": "xxx",
        "today": "2025-10-20",
        "groupName": "京东优惠群1",
        "groupId": "xxx"
      }
    ]
  }
}
```

---

## 4. 订单管理

### 4.1 获取订单列表（按月份）

**接口路径：** `GET /jd_order`

**接口描述：** 获取指定月份的订单列表及统计信息

**请求头：**

```
Authorization: Bearer {accessToken}
```

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| monthDate | string | 是 | 月份（格式：YYYY-MM） |
| page | number | 否 | 页码（默认1） |
| pageSize | number | 否 | 每页数量（默认10） |

**请求示例：**

```
GET /jd_order?monthDate=2025-10&page=1&pageSize=10
```

**响应示例：**

```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "_id": "xxx",
        "orderId": "123456789",
        "userId": "66fa808cac17606faf142041",
        "skuName": "商品名称",
        "skuNum": 1,
        "skuReturnNum": 0,
        "skuFrozenNum": 0,
        "estimateFee": 10.5,
        "actualFee": 10.5,
        "estimateCosPrice": 100,
        "actualCosPrice": 100,
        "finishTime": "2025-10-15T10:20:30.000Z",
        "validCode": 17,
        "proPriceAmount": 95,
        "createdAt": "2025-10-15T10:20:30.000Z"
      }
    ],
    "total": 15,
    "summary": {
      "totalEstimateFee": 150.5,
      "totalActualFee": 150.5,
      "totalEstimateCosPrice": 1500,
      "totalActualCosPrice": 1500,
      "settledCount": 10,
      "unsettledCount": 5,
      "hasApplied": false,
      "paymentStatus": undefined
    }
  }
}
```

**字段说明：**

- `orderId`: 京东订单号
- `skuName`: 商品名称
- `skuNum`: 商品数量
- `skuReturnNum`: 退货数量
- `skuFrozenNum`: 冻结数量
- `estimateFee`: 预估佣金
- `actualFee`: 实际佣金
- `estimateCosPrice`: 预估计佣金额
- `actualCosPrice`: 实际计佣金额
- `validCode`: 订单状态码（17=已结算）
- `finishTime`: 订单完成时间
- `proPriceAmount`: 推广价

**summary 字段说明：**

- `totalEstimateFee`: 总预估佣金
- `totalActualFee`: 总实际佣金
- `totalEstimateCosPrice`: 总预估计佣金额
- `totalActualCosPrice`: 总实际计佣金额
- `settledCount`: 已结算订单数
- `unsettledCount`: 待结算订单数
- `hasApplied`: 是否已申请提现
- `paymentStatus`: 结算状态（0-待结算，1-已结算，2-结算失败）

**错误响应：**

```json
{
  "code": 400,
  "message": "请传入月份参数"
}
```

---

### 4.2 绑定订单

**接口路径：** `POST /jd_order`

**接口描述：** 将京东订单号绑定到当前用户

**请求头：**

```
Authorization: Bearer {accessToken}
```

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| orderIds | string[] | 是 | 订单号数组 |

**请求示例：**

```json
{
  "orderIds": ["123456789", "987654321"]
}
```

**响应示例：**

```json
{
  "code": 200,
  "message": "订单绑定成功"
}
```

**错误响应：**

```json
{
  "code": 400,
  "message": "请输入订单号"
}
```

或

```json
{
  "code": 400,
  "message": "当前订单超过14天，无法绑定"
}
```

或

```json
{
  "code": 400,
  "message": "订单已被绑定"
}
```

---

## 5. 结算管理

### 5.1 获取结算记录列表

**接口路径：** `GET /jd_payment_record`

**接口描述：** 获取用户的结算记录列表

**请求头：**

```
Authorization: Bearer {accessToken}
```

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | number | 否 | 页码（默认1） |
| pageSize | number | 否 | 每页数量（默认10） |

**响应示例：**

```json
{
  "code": 200,
  "data": {
    "list": [
      {
        "_id": "xxx",
        "userId": "66fa808cac17606faf142041",
        "monthDate": "2025-09",
        "totalAmount": 150.5,
        "status": 1,
        "failReason": "",
        "createdAt": "2025-10-21T10:00:00.000Z",
        "updatedAt": "2025-10-22T10:00:00.000Z"
      }
    ],
    "total": 5
  }
}
```

**字段说明：**

- `monthDate`: 结算月份（YYYY-MM）
- `totalAmount`: 结算金额
- `status`: 结算状态（0-待结算，1-已结算，2-结算失败）
- `failReason`: 失败原因（status=2时）

---

### 5.2 申请提现

**接口路径：** `POST /jd_payment_record/apply`

**接口描述：** 申请指定月份的佣金提现

**重要规则：**
- 次月21号之后可提现上月佣金
- 用户必须完善个人信息（昵称、手机号、收款码）
- 只有 `validCode=17` 的订单才计入结算金额
- 申请提现时会自动更新所有订单状态

**请求头：**

```
Authorization: Bearer {accessToken}
```

**请求参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| monthDate | string | 是 | 要提现的月份（格式：YYYY-MM） |

**请求示例：**

```json
{
  "monthDate": "2025-09"
}
```

**响应示例：**

```json
{
  "code": 200,
  "data": {
    "monthDate": "2025-09",
    "totalAmount": 150.5,
    "updateSuccessCount": 15,
    "updateFailCount": 0
  },
  "message": "提现申请成功"
}
```

**字段说明：**

- `monthDate`: 提现月份
- `totalAmount`: 可提现金额（仅 validCode=17 的订单）
- `updateSuccessCount`: 订单更新成功数量
- `updateFailCount`: 订单更新失败数量

**错误响应：**

```json
{
  "code": 400,
  "message": "2025-10 月份的佣金需要在 2025-11-21 之后才能申请提现"
}
```

或

```json
{
  "code": 400,
  "message": "请先完善个人信息（昵称、手机号、收款码）"
}
```

或

```json
{
  "code": 400,
  "message": "当前月份已申请过提现"
}
```

或

```json
{
  "code": 400,
  "message": "当前月份没有可结算的订单（所有订单均未达到结算状态）"
}
```

---

## 6. 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误或业务逻辑错误 |
| 401 | 未授权或 Token 无效 |
| 404 | 资源不存在 |
| 409 | 资源冲突 |
| 500 | 服务器内部错误 |

---

## 7. 业务流程说明

### 7.1 用户注册登录流程

1. 用户关注微信公众号
2. 发送"登录"获取验证码（格式：`JD_xxx`）
3. 输入邀请码进行注册/登录
4. 获取 accessToken 和 refreshToken

### 7.2 完善个人信息流程

1. 调用 `GET /jd_user` 获取当前用户信息
2. 上传收款码图片 `POST /jd_user/upload`
3. 更新用户信息 `PUT /jd_user`（填写昵称、手机号、收款码URL）

### 7.3 转链推广流程

1. 复制京东商品链接或商品ID
2. 调用 `POST /jd/convert` 进行转链
3. 获取推广短链接，分享给用户
4. 用户通过短链接下单

### 7.4 订单绑定流程

1. 用户下单后，复制订单号
2. 调用 `POST /jd_order` 绑定订单号
3. 系统自动查询订单详情并保存（14天内有效）

### 7.5 提现结算流程

1. 查看订单列表 `GET /jd_order?monthDate=YYYY-MM`
2. 确认 `summary.hasApplied` 和 `summary.paymentStatus`
3. 次月21号后调用 `POST /jd_payment_record/apply` 申请提现
4. 系统自动更新订单状态并计算可提现金额
5. 后台管理员审核后进行打款
6. 查看结算记录 `GET /jd_payment_record`

---

## 8. 注意事项

1. **Token 管理**：所有需要认证的接口都需要在 Header 中携带 `Authorization: Bearer {accessToken}`
2. **时间格式**：统一使用 ISO 8601 格式（如：`2025-10-20T09:36:43.000Z`）
3. **月份格式**：`YYYY-MM`（如：`2025-10`）
4. **订单绑定限制**：订单完成后14天内可以绑定，超过14天无法绑定
5. **提现时间限制**：次月21号之后才能申请上月佣金提现
6. **结算规则**：只有 `validCode=17` 的订单才计入结算金额
7. **图片上传限制**：支持 jpg, jpeg, png, gif, webp，最大5MB
8. **个人信息必填**：申请提现前必须完善昵称、手机号、收款码

---

## 9. 环境变量配置

后端需要配置以下环境变量：

```env
JdAppKey=你的京东联盟AppKey
JdAppSecret=你的京东联盟AppSecret
TEMP_EMAIL_API_KEY=API密钥（用于某些接口验证）
```

---

**文档版本：** v1.0
**最后更新：** 2025-10-20
**提交记录：** aa12ed199e702b2953604815786ac5b6782cbce6
