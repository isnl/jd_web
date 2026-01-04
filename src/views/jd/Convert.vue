<template>
  <div class="p-4 md:p-6 space-y-4 md:space-y-6">
    <!-- 转链区域：左右两列布局 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <!-- 左侧：输入区域 -->
      <div class="bg-white rounded-2xl p-5 shadow-sm flex flex-col">
        <h2 class="text-lg font-medium text-gray-800 mb-4">商品转链/文案转链</h2>

        <!-- 输入框 -->
        <div class="flex-1 mb-4">
          <textarea
            v-model="content"
            placeholder="请输入京东商品链接、商品ID或包含链接的文案"
            class="w-full h-full min-h-80 px-4 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
          ></textarea>
        </div>

        <!-- 转链按钮 -->
        <button
          @click="handleConvert"
          :disabled="loading || !content.trim()"
          class="w-full py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 active:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
        >
          <span v-if="loading" class="i-carbon-loading animate-spin"></span>
          <span>{{ loading ? '转链中...' : '立即转链' }}</span>
        </button>
      </div>

      <!-- 右侧：结果区域 -->
      <div class="bg-white rounded-2xl p-5 shadow-sm flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-800">转链结果</h3>
          <span
            v-if="result"
            :class="result.convertedCount > 0 ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'"
            class="text-xs px-2 py-1 rounded-full"
          >
            {{ result.convertedCount > 0 ? `成功转链 ${result.convertedCount}/${result.totalLinks}` : '未找到链接' }}
          </span>
        </div>

        <!-- 转链内容 -->
        <div class="flex-1 mb-4">
          <textarea
            v-model="resultContent"
            :placeholder="result ? '' : '转链结果将显示在这里...'"
            class="w-full h-full min-h-80 px-4 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition"
          ></textarea>
        </div>

        <!-- 复制按钮 -->
        <button
          @click="copyToClipboard(resultContent)"
          :disabled="!resultContent"
          class="w-full py-3 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
        >
          <span class="i-carbon-copy"></span>
          复制内容
        </button>
      </div>
    </div>

    <!-- 使用说明 -->
    <div class="bg-white rounded-2xl p-5 shadow-sm">
      <h3 class="font-medium text-gray-800 mb-3">使用说明</h3>
      <ul class="space-y-2 text-sm text-gray-600">
        <li class="flex items-start gap-2">
          <span class="i-carbon-checkmark-outline text-red-500 mt-0.5 flex-shrink-0"></span>
          <span>支持京东商品链接或商品ID</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="i-carbon-checkmark-outline text-red-500 mt-0.5 flex-shrink-0"></span>
          <span>转链后分享给用户，用户下单即可获得佣金</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="i-carbon-checkmark-outline text-red-500 mt-0.5 flex-shrink-0"></span>
          <span>请在订单完成后14天内绑定订单号</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { jdApi } from '@/service/api'

const content = ref('')
const loading = ref(false)
const result = ref<{ content: string; convertedCount: number; totalLinks: number } | null>(null)
const resultContent = ref('')

// 京东短链正则
const JD_LINK_REG = /(https:\/\/)?(u\.jd\.com\/)[a-zA-Z0-9]{6,7}/g

// 检测剪贴板
const checkClipboard = async () => {
  try {
    const clipboardText = await navigator.clipboard.readText()
    if (clipboardText && JD_LINK_REG.test(clipboardText)) {
      // 重置正则lastIndex
      JD_LINK_REG.lastIndex = 0

      await ElMessageBox.confirm(
        '检测到剪贴板中包含京东链接，是否自动获取并转链？',
        '智能识别',
        {
          confirmButtonText: '立即转链',
          cancelButtonText: '取消',
          type: 'info'
        }
      )

      content.value = clipboardText
      handleConvert()
    }
  } catch {
    // 用户拒绝剪贴板权限或取消操作，静默处理
  }
}

const handleConvert = async () => {
  if (!content.value.trim()) return

  loading.value = true
  try {
    const res = await jdApi.convert(content.value)
    result.value = res.data
    resultContent.value = res.data.content
    if (res.data.convertedCount > 0) {
      ElMessage.success('转链成功')
    } else {
      ElMessage.warning('未找到可转链的链接')
    }
  } catch (error) {
    // 错误已在拦截器处理
  } finally {
    loading.value = false
  }
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('复制成功')
  } catch {
    ElMessage.error('复制失败')
  }
}

// 页面加载时检测剪贴板
onMounted(() => {
  checkClipboard()
})
</script>
