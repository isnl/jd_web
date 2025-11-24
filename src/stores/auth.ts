import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref('')
  const refreshToken = ref('')

  const isLoggedIn = computed(() => !!accessToken.value)

  const setTokens = (access: string, refresh: string) => {
    accessToken.value = access
    refreshToken.value = refresh
  }

  const clearTokens = () => {
    accessToken.value = ''
    refreshToken.value = ''
  }

  return {
    accessToken,
    refreshToken,
    isLoggedIn,
    setTokens,
    clearTokens
  }
}, {
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ['accessToken', 'refreshToken'],
        storage: localStorage
      }
    ]
  }
})
