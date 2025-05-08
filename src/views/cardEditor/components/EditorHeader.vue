<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCardStore } from '@/stores/cardStore'
import html2canvas from 'html2canvas'

const router = useRouter()
const cardStore = useCardStore()

// 画布尺寸预设
const sizePresets = [
  { label: '社交媒体 9:16', width: 1080, height: 1920 },
  { label: '正方形 1:1', width: 1080, height: 1080 },
  { label: '微信朋友圈 4:3', width: 1080, height: 810 },
  { label: '微博卡片 2:1', width: 1200, height: 600 },
  { label: '自定义', width: 0, height: 0 }
]

const selectedSizePreset = ref(0)
const customWidth = ref(1080)
const customHeight = ref(1920)

// 更改尺寸
const changeSize = (index: number) => {
  selectedSizePreset.value = index

  if (index < sizePresets.length - 1) {
    // 使用预设尺寸
    const { width, height } = sizePresets[index]
    cardStore.setCanvasSize(width, height)
  }
}

// 设置自定义尺寸
const setCustomSize = () => {
  if (customWidth.value < 100 || customHeight.value < 100) {
    ElMessage.warning('尺寸不能小于 100px')
    return
  }

  cardStore.setCanvasSize(customWidth.value, customHeight.value)
  ElMessage.success('尺寸已更新')
}

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

  ElMessage.success('正在准备导出图片...')

  // 使用 html2canvas 将画布元素转换为图片
  html2canvas(canvasElement, {
    scale: 2, // 提高导出图片质量
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
    })
    .catch((err) => {
      console.error('导出失败', err)
      ElMessage.error('导出失败，请重试')
    })
}
</script>

<template>
  <header class="h-16 bg-white shadow-sm flex items-center justify-between px-4 z-10">
    <!-- 左侧按钮区域 -->
    <div class="flex items-center">
      <el-button @click="goBack" class="mr-4">
        <i class="i-fa-solid:arrow-left mr-1"></i>
        返回
      </el-button>

      <div class="flex items-center ml-4">
        <span class="text-gray-600 mr-2">画布尺寸:</span>
        <el-select v-model="selectedSizePreset" @change="changeSize" style="width: 160px">
          <el-option
            v-for="(preset, index) in sizePresets"
            :key="index"
            :label="preset.label"
            :value="index"
          />
        </el-select>
      </div>

      <!-- 自定义尺寸输入 -->
      <div v-if="selectedSizePreset === sizePresets.length - 1" class="flex items-center ml-4">
        <el-input-number
          v-model="customWidth"
          :min="100"
          :max="2000"
          size="small"
          class="mr-1"
          style="width: 120px"
        />
        <span class="mx-1">x</span>
        <el-input-number
          v-model="customHeight"
          :min="100"
          :max="2000"
          size="small"
          class="ml-1"
          style="width: 120px"
        />
        <el-button type="primary" size="small" @click="setCustomSize" class="ml-2">
          应用
        </el-button>
      </div>
    </div>

    <!-- 右侧操作区域 -->
    <div>
      <el-button type="primary" @click="exportImage" class="mr-2">
        <i class="i-fa-solid:download mr-1"></i>
        导出图片
      </el-button>
    </div>
  </header>
</template>
