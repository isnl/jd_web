import { get, post, put } from './index'
import type { JdUserInfo } from '@/stores/jdUser'

// 认证相关
export const authApi = {
  // 微信登录
  wechatLogin: (code: string, inviteCode: string) =>
    post('/api/auth/wechat', { code, inviteCode })
}

// 用户信息相关
export const userApi = {
  // 获取用户信息
  getUserInfo: () => get('/api/jd_user'),

  // 更新用户信息
  updateUserInfo: (data: { nickname?: string; phone?: string; paymentQrCode?: string }) =>
    put('/api/jd_user', data),

  // 上传收款码图片
  uploadPaymentQr: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return post('/api/jd_user/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

// 京东转链相关
export const jdApi = {
  // 转链
  convert: (content: string) => post('/api/jd/convert', { content }),

  // 获取今日群列表
  getGroupList: () => get('/api/jd')
}

// 订单相关
export interface OrderListParams {
  monthDate: string
  page?: number
  pageSize?: number
}

export interface OrderItem {
  _id: string
  orderId: string
  userId: string
  skuName: string
  skuNum: number
  skuReturnNum: number
  skuFrozenNum: number
  estimateFee: number
  actualFee: number
  estimateCosPrice: number
  actualCosPrice: number
  finishTime: string
  validCode: number
  proPriceAmount: number
  createdAt: string
}

export interface OrderSummary {
  totalEstimateFee: number
  totalActualFee: number
  totalEstimateCosPrice: number
  totalActualCosPrice: number
  settledCount: number
  unsettledCount: number
  hasApplied: boolean
  paymentStatus?: number
}

export const orderApi = {
  // 获取订单列表
  getOrders: (params: OrderListParams) => get('/api/jd_order', params),

  // 绑定订单
  bindOrders: (orderIds: string[]) => post('/api/jd_order', { orderIds })
}

// 结算相关
export interface PaymentRecord {
  _id: string
  userId: string
  monthDate: string
  totalAmount: number
  status: number
  failReason: string
  createdAt: string
  updatedAt: string
}

export const paymentApi = {
  // 获取结算记录列表
  getRecords: (params?: { page?: number; pageSize?: number }) =>
    get('/api/jd_payment_record', params),

  // 申请提现
  applyWithdraw: (monthDate: string) =>
    post('/api/jd_payment_record/apply', { monthDate })
}
