import { get, post, put } from './index'
import type { JdUserInfo } from '@/stores/jdUser'

// 认证相关
export const authApi = {
  // 微信登录
  wechatLogin: (code: string) => post('/auth/wechat', { code })
}

// 用户信息相关
export const userApi = {
  // 获取用户信息
  getUserInfo: () => get('/jd/user'),

  // 更新用户信息
  updateUserInfo: (data: { nickname?: string; phone?: string; paymentQrCode?: string }) =>
    put('/jd/user', data),

  // 上传收款码图片
  uploadPaymentQr: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return post('/jd/user/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

// 京东转链相关
export const jdApi = {
  // 转链
  convert: (content: string) => post('/jd/convert', { content }),

  // 获取今日群列表
  getGroupList: () => get('/jd')
}

// 订单相关
export interface OrderListParams {
  monthDate: string
  page?: number
  pageSize?: number
  status?: 'completed' | 'paid' | 'abnormal'
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
  updatedAt: string
  price?: number
  plus?: boolean
  orderTime?: string
  parentId?: number
}

export interface OrderSummary {
  totalEstimateFee: number
  totalActualFee: number
  totalEstimateCosPrice: number
  totalActualCosPrice: number
  settledCount: number
  unsettledCount: number
  abnormalCount: number
  hasApplied: boolean
  paymentStatus?: number
}

export const orderApi = {
  // 获取订单列表
  getOrders: (params: OrderListParams) => get('/jd/order', params),

  // 获取订单汇总
  getSummary: (monthDate: string) => get('/jd/order/summary', { monthDate }),

  // 绑定单个订单
  bindOrder: (orderId: string, bind: boolean = true) => post('/jd/order', { orderId, bind }),

  // 批量刷新订单状态（同步接口，可能需要较长时间）
  refreshOrders: (monthDate: string) =>
    post('/jd/order/refresh', { monthDate }, { timeout: 120000 })
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
  getRecords: (params?: { page?: number; pageSize?: number }) => get('/jd/payment_record', params),

  // 申请提现
  applyWithdraw: (monthDate: string) => post('/jd/payment_record/apply', { monthDate })
}
