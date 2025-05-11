<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const inputText = ref('')
const maxLength = 100
const isGenerating = ref(false)

// 生成卡片 - 跳转到卡片列表页面
const generateCard = () => {
  if (!inputText.value.trim()) {
    ElMessage.warning('请输入文字内容')
    return
  }

  isGenerating.value = true

  // 将文字内容存储到 localStorage，方便卡片列表页面获取
  localStorage.setItem('cardText', inputText.value)

  // 模拟加载效果
  setTimeout(() => {
    // 跳转到卡片列表页面
    router.push('/card-list')
    isGenerating.value = false
  }, 600)
}

// 设计卡片 - 跳转到编辑器页面
const designCard = () => {
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
    class="min-h-screen flex flex-col items-center py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
  >
    <div class="text-center mb-12 animate-fadeIn">
      <h1
        class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4"
      >
        字媒体卡片
      </h1>
      <p class="text-gray-600 text-lg">将您的文字转换成精美的分享卡片</p>
    </div>

    <div class="w-full max-w-3xl px-6 animate-slideUp">
      <div
        class="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl"
      >
        <div class="mb-6">
          <h2 class="text-2xl font-medium text-gray-800 mb-2">输入您的文字</h2>
          <p class="text-gray-500">目前限制在 {{ maxLength }} 字以内，支持换行</p>
        </div>

        <el-input
          v-model="inputText"
          type="textarea"
          :rows="6"
          :maxlength="maxLength"
          placeholder="请在此输入您想要展示的文字..."
          show-word-limit
          class="mb-8 transition-all duration-300 hover:shadow-sm"
        />

        <div class="flex justify-center space-x-4">
          <el-button
            type="primary"
            size="large"
            :loading="isGenerating"
            :disabled="!inputText.trim()"
            @click="generateCard"
            class="px-6 py-3 text-lg transform transition-all duration-300 hover:translate-y-[-3px] hover:shadow-md"
          >
            <i class="i-fa-solid:magic mr-2"></i>
            {{ isGenerating ? '生成中...' : '生成卡片' }}
          </el-button>

          <el-button
            type="info"
            size="large"
            :disabled="!inputText.trim()"
            @click="designCard"
            class="px-6 py-3 text-lg transform transition-all duration-300 hover:translate-y-[-3px] hover:shadow-md"
          >
            <i class="i-fa-solid:edit mr-2"></i>
            设计卡片
          </el-button>
        </div>
      </div>

      <div
        class="mt-8 text-center text-gray-500 text-sm animate-fadeIn"
        style="animation-delay: 0.3s"
      >
        <p>通过字媒体卡片，您可以将普通文字转化为精美的图片卡片</p>
        <p class="mt-2">支持多种风格模板，字体调整，背景设置和贴纸添加</p>
      </div>
    </div>

    <div
      class="mt-16 grid grid-cols-3 gap-6 max-w-3xl px-6 animate-fadeIn"
      style="animation-delay: 0.5s"
    >
      <div class="bg-white p-4 rounded-lg shadow text-center">
        <div class="text-blue-500 text-3xl mb-2">
          <i class="i-fa-solid:palette"></i>
        </div>
        <h3 class="font-medium mb-1">多种精美模板</h3>
        <p class="text-gray-500 text-sm">选择适合您内容的模板</p>
      </div>

      <div class="bg-white p-4 rounded-lg shadow text-center">
        <div class="text-indigo-500 text-3xl mb-2">
          <i class="i-fa-solid:font"></i>
        </div>
        <h3 class="font-medium mb-1">字体样式自定义</h3>
        <p class="text-gray-500 text-sm">调整大小、颜色和字体</p>
      </div>

      <div class="bg-white p-4 rounded-lg shadow text-center">
        <div class="text-purple-500 text-3xl mb-2">
          <i class="i-fa-solid:download"></i>
        </div>
        <h3 class="font-medium mb-1">一键导出分享</h3>
        <p class="text-gray-500 text-sm">保存为高清图片随时分享</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.8s ease-out forwards;
}

.animate-slideUp {
  animation: slideUp 0.5s ease-out forwards;
}
</style>
