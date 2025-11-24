<template>
  <div class="max-w-4xl mx-auto p-4 space-y-4">
    <!-- 转链卡片 -->
    <div class="bg-white rounded-2xl p-5 shadow-sm">
      <h2 class="text-lg font-medium text-gray-800 mb-4">商品转链</h2>

      <!-- 输入框 -->
      <div class="mb-4">
        <textarea
          v-model="content"
          placeholder="请输入京东商品链接或商品ID"
          rows="3"
          class="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
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

    <!-- 转链结果 -->
    <div v-if="result" class="bg-white rounded-2xl p-5 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-medium text-gray-800">转链结果</h3>
        <span
          :class="result.clickURL ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'"
          class="text-xs px-2 py-1 rounded-full"
        >
          {{ result.clickURL ? '转链成功' : '转链失败' }}
        </span>
      </div>

      <!-- 短链接 -->
      <div class="mb-3">
        <label class="text-xs text-gray-500 mb-1 block">推广短链接</label>
        <div class="flex items-center gap-2">
          <input
            :value="result.shortURL"
            readonly
            class="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-800 truncate"
          />
          <button
            @click="copyToClipboard(result.shortURL)"
            class="px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition flex items-center gap-1"
          >
            <span class="i-carbon-copy"></span>
            复制
          </button>
        </div>
      </div>

      <!-- 长链接 -->
      <div v-if="result.clickURL">
        <label class="text-xs text-gray-500 mb-1 block">完整推广链接</label>
        <div class="flex items-center gap-2">
          <input
            :value="result.clickURL"
            readonly
            class="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-800 truncate"
          />
          <button
            @click="copyToClipboard(result.clickURL)"
            class="px-3 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition flex items-center gap-1"
          >
            <span class="i-carbon-copy"></span>
            复制
          </button>
        </div>
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
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { jdApi } from '@/service/api'

const content = ref('')
const loading = ref(false)
const result = ref<{ shortURL: string; clickURL: string } | null>(null)

const handleConvert = async () => {
  if (!content.value.trim()) return

  loading.value = true
  try {
    const res = await jdApi.convert(content.value)
    result.value = res.data
    if (res.data.clickURL) {
      ElMessage.success('转链成功')
    } else {
      ElMessage.warning('转链失败，返回原内容')
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
</script>
