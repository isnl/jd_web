<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import EditorHeader from './components/EditorHeader.vue'
import TemplatePanel from './components/TemplatePanel.vue'
import CanvasPreview from './components/CanvasPreview.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import { useCardStore } from '@/stores/cardStore'

const router = useRouter()
const cardStore = useCardStore()

// 从 localStorage 获取文字内容
onMounted(() => {
  const cardText = localStorage.getItem('cardText')
  if (!cardText) {
    router.push('/')
    return
  }

  cardStore.setText(cardText)
})
</script>

<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <!-- 顶部导航 -->
    <EditorHeader />

    <!-- 画布容器（左中右布局） -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 左侧模板面板 -->
      <TemplatePanel class="w-64 border-r border-gray-200 bg-white overflow-y-auto" />

      <!-- 中间预览区域 -->
      <div class="flex-1 flex flex-col items-center justify-center p-6 overflow-auto bg-gray-100">
        <CanvasPreview />
      </div>

      <!-- 右侧设置面板 -->
      <SettingsPanel class="w-80 border-l border-gray-200 bg-white overflow-y-auto" />
    </div>
  </div>
</template>
