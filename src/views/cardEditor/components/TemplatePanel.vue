<script setup lang="ts">
import { ref } from 'vue'

// 行业分类选项
const categories = [
  { value: 'general', label: '通用', icon: 'i-tabler-layout-grid' },
  { value: 'education', label: '教育', icon: 'i-tabler-school' },
  { value: 'business', label: '商务', icon: 'i-tabler-briefcase' },
  { value: 'social', label: '社交', icon: 'i-tabler-messages' },
  { value: 'creative', label: '创意', icon: 'i-tabler-brush' },
  { value: 'tech', label: '科技', icon: 'i-tabler-device-laptop' }
]

// 当前选中的分类
const activeCategory = ref('general')
</script>

<template>
  <div class="p-4">
    <div class="mb-4">
      <h3 class="text-lg font-medium text-gray-700">行业模板</h3>
      <p class="text-sm text-gray-500">选择适合您的行业分类</p>
    </div>

    <!-- 分类筛选 - 现代化设计 -->
    <div class="mb-6">
      <div class="flex flex-wrap rounded-xl bg-gray-100 p-1 overflow-hidden">
        <button
          v-for="category in categories"
          :key="category.value"
          @click="activeCategory = category.value"
          class="flex flex-1 items-center justify-center px-2 py-2 text-sm font-medium transition-all duration-200 rounded-lg whitespace-nowrap mb-1"
          :class="[
            activeCategory === category.value
              ? 'bg-white text-blue-600 shadow-sm flex-shrink-0'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 flex-shrink-0'
          ]"
        >
          <i :class="[category.icon, 'mr-1 text-base']"></i>
          <span class="text-xs">{{ category.label }}</span>
        </button>
      </div>
    </div>

    <!-- 空状态 - 即将推出的提示 -->
    <div class="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
      <div class="text-gray-400 text-5xl mb-2">
        <i class="i-tabler-mood-empty"></i>
      </div>
      <p class="text-gray-500 mb-2">该分类下的模板即将推出</p>
      <p class="text-gray-400 text-xs">我们正在努力为您准备更多精美模板</p>
    </div>
  </div>
</template>
