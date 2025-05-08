<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const inputText = ref('')
const maxLength = 100

const generateCard = () => {
  if (!inputText.value.trim()) {
    ElMessage.warning('请输入文字内容')
    return
  }

  // 将文字内容存储到 localStorage，方便编辑页面获取
  localStorage.setItem('cardText', inputText.value)

  // 跳转到编辑页面
  router.push('/editor')
}
</script>

<template>
  <main
    class="w-full min-h-screen flex flex-col items-center pt-20 bg-gradient-to-r from-blue-50 to-indigo-50"
  >
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-800 mb-2">字媒体卡片</h1>
      <p class="text-gray-600">将您的文字转换成精美的分享卡片</p>
    </div>

    <div class="w-full max-w-3xl px-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="mb-4">
          <h2 class="text-xl font-medium text-gray-800 mb-2">输入您的文字</h2>
          <p class="text-gray-500 text-sm">目前限制在 {{ maxLength }} 字以内</p>
        </div>

        <el-input
          v-model="inputText"
          type="textarea"
          :rows="6"
          :maxlength="maxLength"
          placeholder="请在此输入您想要展示的文字..."
          show-word-limit
          class="mb-6"
        />

        <div class="flex justify-center">
          <el-button
            type="primary"
            size="large"
            :disabled="!inputText.trim()"
            @click="generateCard"
            class="px-8"
          >
            <i class="i-fa-solid:magic mr-2"></i>
            生成卡片
          </el-button>
        </div>
      </div>
    </div>
  </main>
</template>
