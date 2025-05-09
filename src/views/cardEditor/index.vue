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

// 控制左右面板的显示状态
const leftPanelVisible = ref(true)
const rightPanelVisible = ref(true)

// 切换左侧面板
const toggleLeftPanel = () => {
  leftPanelVisible.value = !leftPanelVisible.value
}

// 切换右侧面板
const toggleRightPanel = () => {
  rightPanelVisible.value = !rightPanelVisible.value
}

// 从 localStorage 获取文字内容
onMounted(() => {
  const cardText = localStorage.getItem('cardText')
  if (!cardText) {
    router.push('/')
    return
  }

  cardStore.setText(cardText)

  // 初始化文本位置（如果未设置）
  cardStore.resetTextPosition()
})
</script>

<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <!-- 顶部导航 -->
    <EditorHeader />

    <!-- 画布容器（左中右布局） -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 左侧面板切换按钮 -->
      <button
        class="absolute left-0 top-1/2 z-10 bg-white rounded-r-lg shadow-md p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300"
        @click="toggleLeftPanel"
        :class="{ 'translate-x-64': leftPanelVisible }"
      >
        <i
          :class="leftPanelVisible ? 'i-tabler-chevron-left' : 'i-tabler-chevron-right'"
          class="text-lg"
        ></i>
      </button>

      <!-- 左侧模板面板 -->
      <el-scrollbar
        class="w-64 border-r border-gray-200 bg-white transition-all duration-300"
        :class="{ '-ml-64': !leftPanelVisible }"
      >
        <TemplatePanel />
      </el-scrollbar>

      <!-- 中间预览区域 -->
      <div class="flex-1 flex flex-col items-center justify-center p-6 grid-background">
        <CanvasPreview />
      </div>

      <!-- 右侧设置面板 -->
      <el-scrollbar
        class="w-80 border-l border-gray-200 bg-white transition-all duration-300"
        :class="{ 'mr-[-320px]': !rightPanelVisible }"
      >
        <SettingsPanel />
      </el-scrollbar>

      <!-- 右侧面板切换按钮 -->
      <button
        class="absolute right-0 top-1/2 z-10 bg-white rounded-l-lg shadow-md p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300"
        @click="toggleRightPanel"
        :class="{ 'translate-x-[-320px]': rightPanelVisible }"
      >
        <i
          :class="rightPanelVisible ? 'i-tabler-chevron-right' : 'i-tabler-chevron-left'"
          class="text-lg"
        ></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.grid-background {
  background-color: #f9fafb;
  background-image: linear-gradient(rgba(55, 65, 81, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(55, 65, 81, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: center center;
}
</style>
