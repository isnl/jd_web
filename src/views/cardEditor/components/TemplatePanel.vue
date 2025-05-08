<script setup lang="ts">
import { computed } from 'vue'
import { useCardStore } from '@/stores/cardStore'

const cardStore = useCardStore()

// 模板列表
const templates = computed(() => cardStore.templates)
const selectedIndex = computed(() => cardStore.selectedTemplateIndex)

// 选择模板
const selectTemplate = (index: number) => {
  cardStore.applyTemplate(index)
}
</script>

<template>
  <div class="p-4">
    <div class="mb-4">
      <h3 class="text-lg font-medium text-gray-700">模板</h3>
      <p class="text-sm text-gray-500">选择合适的卡片风格</p>
    </div>

    <div class="space-y-4">
      <div
        v-for="(template, index) in templates"
        :key="template.id"
        class="cursor-pointer transition-all duration-200 rounded-lg overflow-hidden"
        :class="[
          selectedIndex === index
            ? 'ring-2 ring-blue-500 shadow-md'
            : 'hover:shadow-md border border-gray-200'
        ]"
        @click="selectTemplate(index)"
      >
        <!-- 模板预览 -->
        <div
          class="aspect-[9/16] flex items-center justify-center p-4"
          :style="{
            backgroundColor: template.backgroundColor,
            borderRadius: `${template.borderRadius}px`,
            color: template.textColor,
            fontFamily: template.fontFamily
          }"
        >
          <div class="text-center truncate" :style="{ fontSize: `${template.fontSize / 3}px` }">
            {{ template.name }}
          </div>
        </div>

        <!-- 模板名称 -->
        <div class="py-2 px-3 bg-white text-center">
          <span class="text-sm font-medium text-gray-700">{{ template.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
