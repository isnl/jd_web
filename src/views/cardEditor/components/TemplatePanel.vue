<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCardStore } from '@/stores/cardStore'

const cardStore = useCardStore()

// 模板列表
const templates = computed(() => cardStore.templates)
const selectedIndex = computed(() => cardStore.selectedTemplateIndex)

// 分类选项
const categories = [
  { value: 'all', label: '全部', icon: 'i-tabler-layout-grid' },
  { value: 'simple', label: '简约', icon: 'i-tabler-square' },
  { value: 'gradient', label: '渐变', icon: 'i-tabler-gradient' },
  { value: 'dark', label: '深色', icon: 'i-tabler-moon' }
]

// 当前选中的分类
const activeCategory = ref('all')

// 根据分类筛选模板
const filteredTemplates = computed(() => {
  if (activeCategory.value === 'all') {
    return templates.value
  }

  // 根据模板特性进行筛选
  return templates.value.filter((template) => {
    switch (activeCategory.value) {
      case 'simple':
        return template.gradientType === 'none' && template.backgroundColor === '#ffffff'
      case 'gradient':
        return template.gradientType === 'linear'
      case 'dark':
        return (
          template.backgroundColor === '#222222' ||
          template.backgroundColor.startsWith('#1') ||
          template.backgroundColor.startsWith('#2') ||
          template.backgroundColor.startsWith('#3')
        )
      default:
        return true
    }
  })
})

// 选择模板
const selectTemplate = (index: number) => {
  const realIndex = templates.value.findIndex((t) => t.id === filteredTemplates.value[index].id)
  cardStore.applyTemplate(realIndex)
}
</script>

<template>
  <div class="p-4">
    <div class="mb-4">
      <h3 class="text-lg font-medium text-gray-700">模板</h3>
      <p class="text-sm text-gray-500">选择合适的卡片风格</p>
    </div>

    <!-- 分类筛选 - 现代化设计 -->
    <div class="mb-6">
      <div class="flex rounded-xl bg-gray-100 p-1 overflow-hidden">
        <button
          v-for="category in categories"
          :key="category.value"
          @click="activeCategory = category.value"
          class="flex flex-1 items-center justify-center px-2 py-2 text-sm font-medium transition-all duration-200 rounded-lg whitespace-nowrap"
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

    <!-- 双列瀑布流模板列表 -->
    <div class="grid grid-cols-2 gap-4">
      <div
        v-for="(template, index) in filteredTemplates"
        :key="template.id"
        class="cursor-pointer transition-all duration-300 rounded-xl overflow-hidden transform"
        :class="[
          selectedIndex === templates.findIndex((t) => t.id === template.id)
            ? 'scale-105 shadow-md'
            : 'hover:shadow-sm hover:scale-102'
        ]"
        @click="selectTemplate(index)"
      >
        <!-- 模板预览 -->
        <div
          class="aspect-[9/16] flex items-center justify-center p-3 relative border border-gray-200 shadow-sm"
          :style="{
            backgroundColor: template.backgroundColor,
            borderRadius: `${template.borderRadius}px`,
            color: template.textColor,
            fontFamily: template.fontFamily
          }"
        >
          <div class="text-center truncate" :style="{ fontSize: `${template.fontSize / 4}px` }">
            {{ template.name }}
          </div>

          <!-- 选中指示器 -->
          <div
            v-if="selectedIndex === templates.findIndex((t) => t.id === template.id)"
            class="absolute inset-0 border-2 border-blue-500 rounded-xl flex items-center justify-center"
          >
            <div
              class="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
            >
              <i class="i-tabler-check text-xs"></i>
            </div>
          </div>
        </div>

        <!-- 模板名称 -->
        <div
          class="py-2 px-2 bg-white text-center"
          :class="[
            selectedIndex === templates.findIndex((t) => t.id === template.id)
              ? 'text-blue-600 font-medium'
              : 'text-gray-700'
          ]"
        >
          <span class="text-xs">{{ template.name }}</span>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredTemplates.length === 0" class="text-center py-10">
      <div class="text-gray-400 text-5xl mb-2">
        <i class="i-tabler-mood-empty"></i>
      </div>
      <p class="text-gray-500">没有找到符合条件的模板</p>
    </div>
  </div>
</template>
