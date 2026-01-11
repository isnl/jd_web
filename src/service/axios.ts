// @ts-nocheck
const isDev = import.meta.env.MODE === 'development'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { ElMessage } from 'element-plus'
import router from '@/router'
// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: isDev ? 'http://localhost:3100' : 'https://ai.iiter.cn',
  timeout: 60 * 1000 // TODO: 请求超时时间
})
const err = (error) => {
  ElMessage.closeAll()
  const ignoreMessageUrls = ['status']
  if (error.response) {
    // 部分接口请求不走响应拦截器的message通知
    if (ignoreMessageUrls.some((url) => error.response.config.url.includes(url))) {
      return Promise.reject(error)
    }
    let message = '服务器错误，请稍后再试'
    if (error.response.status === 400) {
      try {
        message = error.response.data.message
      } catch (error) {}
      ElMessage.error(message)
    } else if (error.response.status === 401) {
      // token 无效或已过期，清除登录状态并跳转登录页
      const authStore = useAuthStore()
      authStore.clearTokens()
      router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
    }
  } else if (error.message) {
    if (error.message.includes('timeout')) {
      ElMessage({
        message: '网络超时',
        type: 'warning'
      })
    } else {
      ElMessage({
        message: '系统错误，请稍后再试',
        type: 'warning'
      })
    }
  }
  return Promise.reject(error)
}
axiosInstance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.accessToken) {
      config.headers['authorization'] = `Bearer ${authStore.accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
axiosInstance.interceptors.response.use((response) => {
  if (response.data.code === 200) {
    return response.data
  } else if (response.data.code === 401) {
    // token 无效或已过期，清除登录状态并跳转登录页
    const authStore = useAuthStore()
    authStore.clearTokens()
    router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
    return Promise.reject(response.data)
  } else {
    ElMessage.closeAll()
    ElMessage({
      message: response.data.msg,
      type: 'warning'
    })
    return Promise.reject(response.data)
  }
}, err)
export default axiosInstance
