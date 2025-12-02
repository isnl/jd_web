<template>
  <div
    class="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4"
  >
    <div class="w-full max-w-md">
      <!-- Logo区域 -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-2xl mb-4">
          <span class="text-2xl text-white font-bold">京</span>
        </div>
        <h1 class="text-2xl font-bold text-gray-800">东东返利</h1>
        <p class="text-gray-500 mt-2">扫码关注公众号，获取登录验证码</p>
      </div>

      <!-- 获取验证码步骤 -->
      <div class="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <div class="flex items-center gap-2 mb-4">
          <span class="i-carbon-qr-code text-red-500 text-xl"></span>
          <h3 class="font-medium text-gray-800">获取验证码</h3>
        </div>

        <div class="space-y-4">
          <!-- 二维码和步骤说明 -->
          <div class="flex gap-4">
            <!-- 公众号二维码 -->
            <div class="flex-shrink-0">
              <div
                class="w-28 h-28 bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200"
              >
                <img
                  src="/qrcode.jpg"
                  alt="公众号二维码"
                  class="w-full h-full object-cover"
                  @error="qrcodeError = true"
                />
              </div>
              <p class="text-xs text-center text-gray-500 mt-2">扫码关注</p>
            </div>

            <!-- 步骤说明 -->
            <div class="flex-1 space-y-3 text-sm">
              <div class="flex items-start gap-2">
                <span
                  class="flex-shrink-0 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium"
                  >1</span
                >
                <span class="text-gray-700 pt-0.5">扫描左侧二维码关注公众号</span>
              </div>
              <div class="flex items-start gap-2">
                <span
                  class="flex-shrink-0 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium"
                  >2</span
                >
                <span class="text-gray-700 pt-0.5"
                  >发送 <span class="text-red-500 font-medium">京东登录</span> 获取验证码</span
                >
              </div>
              <div class="flex items-start gap-2">
                <span
                  class="flex-shrink-0 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium"
                  >3</span
                >
                <span class="text-gray-700 pt-0.5">复制验证码并粘贴到下方输入框</span>
              </div>
            </div>
          </div>

          <!-- 示例提示 -->
          <div class="bg-red-50 rounded-xl p-3">
            <div class="flex items-start gap-2">
              <span class="i-carbon-information text-red-500 text-base mt-0.5 flex-shrink-0"></span>
              <div class="text-xs text-red-700">
                <p class="font-medium mb-1">验证码格式示例：</p>
                <p class="font-mono">JD_123456</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 登录表单 -->
      <div class="bg-white rounded-2xl shadow-sm p-6 space-y-5">
        <!-- 验证码输入 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">验证码</label>
          <div class="relative">
            <span
              class="absolute z-99 left-4 top-1/2 -translate-y-1/2 text-red-500 font-bold text-base"
              >JD_</span
            >
            <input
              v-model="codeInput"
              type="text"
              placeholder="粘贴或输入验证码"
              class="w-full pl-16 pr-4 py-3 bg-gray-50 border-none rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
              @paste="handlePaste"
            />
          </div>
        </div>

        <!-- 邀请码切换按钮 -->
        <div v-if="!showInviteInput">
          <button
            @click="showInviteInput = true"
            class="w-full py-3 bg-orange-50 text-orange-600 font-medium rounded-xl hover:bg-orange-100 transition flex items-center justify-center gap-2"
          >
            <span class="i-carbon-user-identification"></span>
            <span>我有邀请码</span>
            <span class="i-carbon-chevron-down"></span>
          </button>
        </div>

        <!-- 邀请码输入（展开后显示） -->
        <div v-else class="space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700">邀请码</label>
            <button
              @click="hideInviteInput"
              class="text-xs text-gray-400 hover:text-gray-600 transition flex items-center gap-1"
            >
              <span>收起</span>
              <span class="i-carbon-chevron-up"></span>
            </button>
          </div>
          <input
            v-model="form.inviteCode"
            type="text"
            placeholder="请输入邀请码"
            class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
            autofocus
          />
        </div>

        <!-- 登录按钮 -->
        <button
          @click="handleLogin"
          :disabled="loading || !isFormValid"
          class="w-full py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 active:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="i-carbon-loading animate-spin"></span>
          <span>{{ loading ? '登录中...' : '登录' }}</span>
        </button>
      </div>

      <!-- 帮助信息 -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-500">
          遇到问题？
          <a href="#" class="text-red-500 hover:text-red-600">联系客服</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { authApi, userApi } from '@/service/api'
import { useAuthStore } from '@/stores/auth'
import { useJdUserStore } from '@/stores/jdUser'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const jdUserStore = useJdUserStore()

const loading = ref(false)
const qrcodeError = ref(false)
const codeInput = ref('') // 用户输入的验证码部分（不含JD_前缀）
const showInviteInput = ref(false) // 邀请码是选填的，默认隐藏
const form = ref({
  inviteCode: ''
})

const isFormValid = computed(() => {
  // 只有验证码是必填的
  return codeInput.value.trim().length > 0
})

// 处理粘贴事件，自动去除 JD_ 前缀
const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault()
  const pastedText = e.clipboardData?.getData('text') || ''

  // 如果粘贴的内容包含 JD_，自动去除
  if (pastedText.startsWith('JD_')) {
    codeInput.value = pastedText.substring(3)
  } else {
    codeInput.value = pastedText
  }
}

// 隐藏邀请码输入框
const hideInviteInput = () => {
  showInviteInput.value = false
  form.value.inviteCode = ''
}

const handleLogin = async () => {
  if (!isFormValid.value) return

  loading.value = true
  try {
    // 提交时拼接 JD_ 前缀
    const code = `JD_${codeInput.value.trim()}`
    // 邀请码选填，没填就传空字符串
    const inviteCode = form.value.inviteCode.trim() || ''
    const res = await authApi.wechatLogin(code, inviteCode)
    await authStore.setTokens(res.data.accessToken, res.data.refreshToken)

    // 获取用户信息
    const userRes = await userApi.getUserInfo()
    jdUserStore.setUserInfo(userRes.data)

    ElMessage.success('登录成功')

    // 跳转到目标页面或首页
    const redirect = route.query.redirect as string
    router.push(redirect || '/convert')
  } catch (error) {
    // 错误已在axios拦截器中处理
  } finally {
    loading.value = false
  }
}
</script>
