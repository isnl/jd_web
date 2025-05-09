<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCardStore } from '@/stores/cardStore'
import html2canvas from 'html2canvas'

const router = useRouter()
const cardStore = useCardStore()

// 画布尺寸预设
const sizePresets = [
  { label: '社交媒体 9:16', width: 360, height: 640 },
  { label: '正方形 1:1', width: 500, height: 500 },
  { label: '微信朋友圈 4:3', width: 480, height: 360 },
  { label: '微博卡片 2:1', width: 600, height: 300 },
  { label: '自定义', width: 0, height: 0 }
]

const selectedSizePreset = ref(0)
const customWidth = ref(500)
const customHeight = ref(700)

// 导出加载状态
const isExporting = ref(false)

// 保存当前尺寸设置
const saveSizeSettings = () => {
  const settings = {
    preset: selectedSizePreset.value,
    width: customWidth.value,
    height: customHeight.value
  }
  localStorage.setItem('canvas-size-settings', JSON.stringify(settings))
}

// 更改尺寸
const changeSize = (index: number) => {
  selectedSizePreset.value = index

  if (index < sizePresets.length - 1) {
    // 使用预设尺寸
    const { width, height } = sizePresets[index]
    cardStore.setCanvasSize(width, height)
  }

  // 保存尺寸设置
  saveSizeSettings()
}

// 设置自定义尺寸
const setCustomSize = () => {
  if (customWidth.value < 100 || customHeight.value < 100) {
    ElMessage.warning('尺寸不能小于 100px')
    return
  }

  cardStore.setCanvasSize(customWidth.value, customHeight.value)
  ElMessage.success('尺寸已更新')

  // 保存尺寸设置
  saveSizeSettings()
}

// 初始化时加载保存的尺寸设置
onMounted(() => {
  // 恢复之前保存的尺寸设置
  const savedSettings = localStorage.getItem('canvas-size-settings')
  if (savedSettings) {
    try {
      const settings = JSON.parse(savedSettings)

      // 设置预设选择
      if (settings.preset !== undefined) {
        selectedSizePreset.value = settings.preset
      }

      // 设置自定义尺寸
      if (settings.width && settings.height) {
        customWidth.value = settings.width
        customHeight.value = settings.height
      }

      // 应用尺寸设置
      if (settings.preset < sizePresets.length - 1) {
        // 使用预设尺寸
        const { width, height } = sizePresets[settings.preset]
        cardStore.setCanvasSize(width, height)
      } else if (settings.preset === sizePresets.length - 1) {
        // 使用自定义尺寸
        cardStore.setCanvasSize(settings.width, settings.height)
      }
    } catch (error) {
      console.error('恢复尺寸设置失败', error)
    }
  }
})

// 返回首页
const goBack = () => {
  ElMessageBox.confirm('确定要返回首页吗？未保存的更改将会丢失。', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      router.push('/')
    })
    .catch(() => {})
}

// 导出图片
const exportImage = () => {
  const canvasElement = document.getElementById('card-canvas')
  if (!canvasElement) {
    ElMessage.error('无法找到画布元素')
    return
  }

  isExporting.value = true
  ElMessage.success('正在准备导出图片...')

  // 使用 html2canvas 将画布元素转换为图片
  html2canvas(canvasElement, {
    scale: 3, // 提高导出图片质量（由于减小了卡片尺寸，所以增大导出时的缩放系数）
    useCORS: true, // 允许加载跨域图片
    backgroundColor: null // 保留背景透明度
  })
    .then((canvas) => {
      // 将 canvas 转换为图片
      const image = canvas.toDataURL('image/png')

      // 创建下载链接
      const link = document.createElement('a')
      link.download = '字媒体卡片.png'
      link.href = image
      link.click()

      ElMessage.success('图片已导出')
      isExporting.value = false
    })
    .catch((err) => {
      console.error('导出失败', err)
      ElMessage.error('导出失败，请重试')
      isExporting.value = false
    })
}
</script>

<template>
  <header
    class="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10 transition-all duration-300"
  >
    <!-- 左侧按钮区域 -->
    <div class="flex items-center">
      <button
        @click="goBack"
        class="flex items-center justify-center p-2 text-gray-700 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all mr-4"
      >
        <i class="i-tabler-arrow-left text-xl"></i>
        <span class="ml-1 font-medium">返回</span>
      </button>

      <div class="flex items-center ml-2 border-l pl-4 border-gray-200">
        <span class="text-gray-600 mr-3 font-medium">画布尺寸</span>
        <el-select
          v-model="selectedSizePreset"
          @change="changeSize"
          class="transition-all rounded-lg w-[170px]"
        >
          <el-option
            v-for="(preset, index) in sizePresets"
            :key="index"
            :label="preset.label"
            :value="index"
          />
        </el-select>
      </div>

      <!-- 自定义尺寸输入 -->
      <div
        v-if="selectedSizePreset === sizePresets.length - 1"
        class="flex items-center ml-4 animate-fadeIn"
      >
        <div class="flex items-center bg-gray-50 p-1 rounded-lg">
          <el-input-number
            v-model="customWidth"
            :min="100"
            :max="2000"
            size="small"
            controls-position="right"
            class="border-none bg-transparent"
            style="width: 100px"
          />
          <span class="mx-2 text-gray-400">×</span>
          <el-input-number
            v-model="customHeight"
            :min="100"
            :max="2000"
            size="small"
            controls-position="right"
            class="border-none bg-transparent"
            style="width: 100px"
          />
        </div>
        <button
          @click="setCustomSize"
          class="ml-3 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg flex items-center transition-all"
        >
          <i class="i-tabler-device-floppy text-lg mr-1"></i>
          <span>应用</span>
        </button>
      </div>
    </div>

    <!-- 右侧操作区域 -->
    <div>
      <button
        @click="exportImage"
        :disabled="isExporting"
        class="flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-sm hover:shadow transition-all transform hover:translate-y-[-2px]"
      >
        <i class="i-tabler-download text-lg mr-2"></i>
        <span>{{ isExporting ? '导出中...' : '导出图片' }}</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
