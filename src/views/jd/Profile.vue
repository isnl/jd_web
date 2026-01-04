<template>
  <div class="p-4 md:p-6 space-y-4 md:space-y-6">
    <!-- 用户信息卡片 -->
    <div class="bg-white rounded-2xl p-5 shadow-sm">
      <div class="flex items-center gap-4">
        <div
          class="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center text-white text-2xl font-medium"
          :style="{ backgroundColor: getAvatarColor(userInfo?.nickname) }"
        >
          {{ getAvatarText(userInfo?.nickname) }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-lg font-medium text-gray-800">{{ userInfo?.nickname || '未设置昵称' }}</div>
          <div class="text-sm text-gray-500">{{ userInfo?.phone || '未绑定手机号' }}</div>
        </div>
      </div>
    </div>

    <!-- 个人信息编辑 -->
    <div class="bg-white rounded-2xl p-5 shadow-sm">
      <h3 class="font-medium text-gray-800 mb-4">个人信息</h3>

      <div class="space-y-4">
        <!-- 昵称 -->
        <div>
          <label class="block text-sm text-gray-600 mb-2">昵称</label>
          <input
            v-model="form.nickname"
            type="text"
            placeholder="请输入昵称"
            maxlength="20"
            class="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
          />
        </div>

        <!-- 手机号 -->
        <div>
          <label class="block text-sm text-gray-600 mb-2">手机号</label>
          <input
            v-model="form.phone"
            type="tel"
            placeholder="请输入手机号"
            maxlength="11"
            class="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
          />
        </div>

        <!-- 收款码 -->
        <div>
          <label class="block text-sm text-gray-600 mb-2">收款码</label>
          <div
            v-if="form.paymentQrCode || uploadPreview"
            class="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-100 mb-3"
          >
            <img
              :src="uploadPreview || form.paymentQrCode"
              class="w-full h-full object-cover"
            />
            <button
              @click="removeQrCode"
              class="absolute top-1 right-1 w-6 h-6 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition"
            >
              <span class="i-carbon-close text-sm"></span>
            </button>
          </div>
          <input
            ref="fileInput"
            type="file"
            accept="image/jpg,image/jpeg,image/png,image/gif,image/webp"
            @change="handleFileChange"
            class="hidden"
          />
          <button
            @click="$refs.fileInput.click()"
            class="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition"
          >
            {{ form.paymentQrCode || uploadPreview ? '重新上传' : '上传收款码' }}
          </button>
          <p class="text-xs text-gray-400 mt-2">支持 JPG、PNG、GIF、WEBP 格式，最大5MB</p>
        </div>
      </div>

      <!-- 保存按钮 -->
      <button
        @click="handleSave"
        :disabled="saving || !hasChanges"
        class="w-full mt-5 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
      >
        {{ saving ? '保存中...' : '保存修改' }}
      </button>
    </div>

    <!-- 其他功能 -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <button
        @click="handleLogout"
        class="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition"
      >
        <span class="text-gray-700">退出登录</span>
        <span class="i-carbon-chevron-right text-gray-400"></span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { userApi } from '@/service/api'
import { useJdUserStore } from '@/stores/jdUser'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const jdUserStore = useJdUserStore()
const authStore = useAuthStore()

const userInfo = computed(() => jdUserStore.userInfo)

// 头像颜色列表
const avatarColors = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e'
]

// 根据昵称生成头像颜色
const getAvatarColor = (nickname?: string) => {
  if (!nickname) return avatarColors[0]
  let hash = 0
  for (let i = 0; i < nickname.length; i++) {
    hash = nickname.charCodeAt(i) + ((hash << 5) - hash)
  }
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

// 获取头像文字
const getAvatarText = (nickname?: string) => {
  if (!nickname) return '用'
  return nickname.charAt(0)
}

const form = ref({
  nickname: '',
  phone: '',
  paymentQrCode: ''
})

const uploadPreview = ref('')
const fileInput = ref<HTMLInputElement>()
const saving = ref(false)

const hasChanges = computed(() => {
  if (!userInfo.value) return false
  return (
    form.value.nickname !== (userInfo.value.nickname || '') ||
    form.value.phone !== (userInfo.value.phone || '') ||
    form.value.paymentQrCode !== (userInfo.value.paymentQrCode || '') ||
    uploadPreview.value !== ''
  )
})

// 初始化表单
const initForm = () => {
  if (userInfo.value) {
    form.value = {
      nickname: userInfo.value.nickname || '',
      phone: userInfo.value.phone || '',
      paymentQrCode: userInfo.value.paymentQrCode || ''
    }
  }
}

// 文件选择
const handleFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // 验证文件大小
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('文件大小不能超过5MB')
    return
  }

  // 验证文件类型
  const validTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!validTypes.includes(file.type)) {
    ElMessage.error('只支持 JPG、PNG、GIF、WEBP 格式')
    return
  }

  // 预览
  const reader = new FileReader()
  reader.onload = (e) => {
    uploadPreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)

  // 上传
  try {
    const res = await userApi.uploadPaymentQr(file)
    form.value.paymentQrCode = res.url
    ElMessage.success('上传成功')
  } catch (error) {
    uploadPreview.value = ''
  }
}

const removeQrCode = () => {
  form.value.paymentQrCode = ''
  uploadPreview.value = ''
}

// 保存信息
const handleSave = async () => {
  // 验证手机号
  if (form.value.phone && !/^1[3-9]\d{9}$/.test(form.value.phone)) {
    ElMessage.error('手机号格式不正确')
    return
  }

  saving.value = true
  try {
    await userApi.updateUserInfo(form.value)
    ElMessage.success('保存成功')

    // 刷新用户信息
    const res = await userApi.getUserInfo()
    jdUserStore.setUserInfo(res.data)
  } catch (error) {
    // 错误已处理
  } finally {
    saving.value = false
  }
}

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    authStore.clearTokens()
    jdUserStore.clearUserInfo()
    ElMessage.success('已退出登录')
    router.push('/login')
  } catch {
    // 取消操作
  }
}

watch(userInfo, () => {
  initForm()
}, { immediate: true })

onMounted(() => {
  initForm()
})
</script>
