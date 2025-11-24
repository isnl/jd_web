import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface JdUserInfo {
  _id: string
  openId: string
  avatar: string
  name: string
  nickname: string
  phone: string
  paymentQrCode: string
  inviteCode: string
  role: number
  login_type: string
  createdAt: string
  updatedAt: string
}

export const useJdUserStore = defineStore('jdUser', () => {
  const userInfo = ref<JdUserInfo | null>(null)

  const isProfileComplete = computed(() => {
    if (!userInfo.value) return false
    return !!(userInfo.value.nickname && userInfo.value.phone && userInfo.value.paymentQrCode)
  })

  const setUserInfo = (info: JdUserInfo) => {
    userInfo.value = info
  }

  const clearUserInfo = () => {
    userInfo.value = null
  }

  return {
    userInfo,
    isProfileComplete,
    setUserInfo,
    clearUserInfo
  }
}, {
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ['userInfo'],
        storage: localStorage
      }
    ]
  }
})
