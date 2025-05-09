<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCardStore } from '@/stores/cardStore'
import { ElMessage } from 'element-plus'

const cardStore = useCardStore()

// 选项卡相关
const activeTab = ref('text')

// 获取当前设置
const text = computed({
  get: () => cardStore.text,
  set: (val) => cardStore.setText(val)
})

const fontFamily = computed({
  get: () => cardStore.fontFamily,
  set: (val) => (cardStore.fontFamily = val)
})

const fontSize = computed({
  get: () => cardStore.fontSize,
  set: (val) => (cardStore.fontSize = val)
})

const fontWeight = computed({
  get: () => cardStore.fontWeight,
  set: (val) => (cardStore.fontWeight = val)
})

const textColor = computed({
  get: () => cardStore.textColor,
  set: (val) => (cardStore.textColor = val)
})

const textAlign = computed({
  get: () => cardStore.textAlign,
  set: (val) => (cardStore.textAlign = val)
})

const backgroundType = computed({
  get: () => cardStore.backgroundType,
  set: (val) => (cardStore.backgroundType = val)
})

const backgroundColor = computed({
  get: () => cardStore.backgroundColor,
  set: (val) => (cardStore.backgroundColor = val)
})

// 可用字体列表
const fontOptions = [
  { label: '黑体', value: 'SimHei, sans-serif' },
  { label: '宋体', value: 'SimSun, serif' },
  { label: '楷体', value: 'KaiTi, serif' },
  { label: '仿宋', value: 'FangSong, serif' },
  { label: '微软雅黑', value: 'Microsoft YaHei, sans-serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Times New Roman', value: 'Times New Roman, serif' }
]

// 字体粗细选项
const fontWeightOptions = [
  { label: '细', value: 300 },
  { label: '正常', value: 400 },
  { label: '粗', value: 700 },
  { label: '特粗', value: 900 }
]

// 文本对齐选项
const textAlignOptions = [
  { label: '左对齐', value: 'left' },
  { label: '居中', value: 'center' },
  { label: '右对齐', value: 'right' }
]

// 背景类型选项
const backgroundTypeOptions = [
  { label: '纯色背景', value: 'solid' },
  { label: '渐变背景', value: 'gradient' }
]

// 渐变预设
const gradientPresets = computed(() => cardStore.gradientPresets)

// 应用渐变预设
const applyGradient = (index: number) => {
  cardStore.applyGradient(index)
}

// 贴纸数据 - 扩展贴纸列表
const availableStickers = [
  { id: 1, type: 'emoji', url: '😊', width: 60, height: 60 },
  { id: 2, type: 'emoji', url: '🎉', width: 60, height: 60 },
  { id: 3, type: 'emoji', url: '💖', width: 60, height: 60 },
  { id: 4, type: 'emoji', url: '🌟', width: 60, height: 60 },
  { id: 5, type: 'emoji', url: '🎨', width: 60, height: 60 },
  { id: 6, type: 'emoji', url: '📝', width: 60, height: 60 },
  { id: 7, type: 'emoji', url: '🌈', width: 60, height: 60 },
  { id: 8, type: 'emoji', url: '✨', width: 60, height: 60 },
  { id: 9, type: 'emoji', url: '🔥', width: 60, height: 60 },
  { id: 10, type: 'emoji', url: '💯', width: 60, height: 60 },
  { id: 11, type: 'emoji', url: '🎵', width: 60, height: 60 },
  { id: 12, type: 'emoji', url: '🎀', width: 60, height: 60 }
]

// 添加贴纸
const addSticker = (sticker: any) => {
  // 获取画布尺寸
  const canvasWidth = cardStore.canvasWidth
  const canvasHeight = cardStore.canvasHeight

  // 给贴纸一个唯一 ID，并放置在画布中央位置
  const newSticker = {
    id: Date.now(),
    type: sticker.type,
    url: sticker.url,
    x: (canvasWidth - sticker.width) / 2, // 水平居中
    y: (canvasHeight - sticker.height) / 2, // 垂直居中
    width: sticker.width,
    height: sticker.height,
    rotation: 0
  }

  cardStore.addSticker(newSticker)
  ElMessage.success('贴纸已添加')
}
</script>

<template>
  <div class="p-4">
    <!-- 设置面板标题 -->
    <div class="mb-4">
      <h3 class="text-lg font-medium text-gray-700">设置</h3>
      <p class="text-sm text-gray-500">调整卡片样式与内容</p>
    </div>

    <!-- 选项卡 -->
    <el-tabs v-model="activeTab" class="transition-all duration-300">
      <!-- 文字设置选项卡 -->
      <el-tab-pane label="文字" name="text">
        <!-- 文本输入 -->
        <div class="mb-4">
          <div class="flex items-center justify-between mb-1">
            <label class="block text-sm font-medium text-gray-700">文本内容</label>
            <el-tooltip content="支持换行，可拖拽调整位置">
              <i class="i-fa-solid:info-circle text-gray-400"></i>
            </el-tooltip>
          </div>
          <el-input
            v-model="text"
            type="textarea"
            :rows="4"
            placeholder="输入文字内容，支持换行"
            maxlength="200"
            show-word-limit
            class="transition-all hover:shadow-sm"
          />
        </div>

        <!-- 字体设置 -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">字体</label>
          <el-select v-model="fontFamily" class="w-full transition-all hover:shadow-sm">
            <el-option
              v-for="option in fontOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
              :style="{ fontFamily: option.value }"
            />
          </el-select>
        </div>

        <!-- 字体大小 -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">字体大小</label>
          <el-slider v-model="fontSize" :min="16" :max="120" show-input />
        </div>

        <!-- 字体粗细 -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">字体粗细</label>
          <el-select v-model="fontWeight" class="w-full transition-all hover:shadow-sm">
            <el-option
              v-for="option in fontWeightOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </div>

        <!-- 文字颜色 -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">文字颜色</label>
          <el-color-picker v-model="textColor" class="w-full" show-alpha />
        </div>

        <!-- 文本对齐 -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">文本对齐</label>
          <div class="flex justify-between bg-gray-100 rounded-lg p-1">
            <button
              class="flex-1 flex items-center justify-center p-2 rounded-md transition-all duration-200 outline-none cursor-pointer"
              :class="[
                textAlign === 'left'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              ]"
              @click="textAlign = 'left'"
            >
              <i class="i-tabler-align-left text-lg"></i>
            </button>
            <button
              class="flex-1 flex items-center justify-center p-2 rounded-md transition-all duration-200 outline-none cursor-pointer"
              :class="[
                textAlign === 'center'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              ]"
              @click="textAlign = 'center'"
            >
              <i class="i-tabler-align-center text-lg"></i>
            </button>
            <button
              class="flex-1 flex items-center justify-center p-2 rounded-md transition-all duration-200 outline-none cursor-pointer"
              :class="[
                textAlign === 'right'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              ]"
              @click="textAlign = 'right'"
            >
              <i class="i-tabler-align-right text-lg"></i>
            </button>
          </div>
        </div>
      </el-tab-pane>

      <!-- 背景设置选项卡 -->
      <el-tab-pane label="背景" name="background">
        <!-- 背景类型选择 -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">背景类型</label>
          <el-radio-group v-model="backgroundType" class="w-full">
            <el-radio
              v-for="option in backgroundTypeOptions"
              :key="option.value"
              :label="option.value"
            >
              {{ option.label }}
            </el-radio>
          </el-radio-group>
        </div>

        <!-- 纯色背景设置 -->
        <div v-if="backgroundType === 'solid'" class="mb-4 transition-all duration-300 ease-in-out">
          <label class="block text-sm font-medium text-gray-700 mb-1">背景颜色</label>
          <el-color-picker v-model="backgroundColor" class="w-full" show-alpha />
        </div>

        <!-- 渐变背景设置 -->
        <div
          v-if="backgroundType === 'gradient'"
          class="mb-4 transition-all duration-300 ease-in-out"
        >
          <label class="block text-sm font-medium text-gray-700 mb-1">渐变背景</label>
          <div class="grid grid-cols-2 gap-3">
            <div
              v-for="(gradient, index) in gradientPresets"
              :key="gradient.id"
              class="h-20 rounded-lg cursor-pointer overflow-hidden transform transition-transform hover:scale-105 hover:shadow-md"
              :style="{
                background: `linear-gradient(${gradient.direction}, ${gradient.colors.join(', ')})`
              }"
              @click="applyGradient(index)"
            ></div>
          </div>
        </div>
      </el-tab-pane>

      <!-- 贴纸选项卡 -->
      <el-tab-pane label="贴纸" name="stickers">
        <div class="mb-2">
          <div class="flex items-center justify-between mb-1">
            <label class="block text-sm font-medium text-gray-700">选择贴纸</label>
            <el-tooltip content="点击添加到画布">
              <i class="i-fa-solid:info-circle text-gray-400"></i>
            </el-tooltip>
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3">
          <div
            v-for="sticker in availableStickers"
            :key="sticker.id"
            class="h-14 flex items-center justify-center border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transform transition-transform hover:scale-110 hover:shadow-sm"
            @click="addSticker(sticker)"
          >
            <span class="text-2xl">{{ sticker.url }}</span>
          </div>
        </div>

        <div class="mt-4 bg-blue-50 p-3 rounded-lg text-sm">
          <div class="flex">
            <i class="i-fa-solid:lightbulb text-yellow-500 mr-2 text-lg"></i>
            <div>
              <p class="text-gray-700">贴纸已支持随机位置添加，避免重叠。</p>
              <p class="text-gray-500 text-xs mt-1">注意：下一版本将支持拖拽调整位置</p>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
