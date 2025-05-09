<script setup lang="ts">
import { computed, ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useCardStore } from '@/stores/cardStore'
import { ElMessage } from 'element-plus'
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/style.css'

const cardStore = useCardStore()

// 获取卡片内容和样式
const text = computed({
  get: () => cardStore.text,
  set: (val) => cardStore.setText(val)
})
const canvasWidth = computed(() => cardStore.canvasWidth)
const canvasHeight = computed(() => cardStore.canvasHeight)
const fontFamily = computed(() => cardStore.fontFamily)
const fontSize = computed(() => cardStore.fontSize)
const fontWeight = computed(() => cardStore.fontWeight)
const textColor = computed(() => cardStore.textColor)
const textAlign = computed(() => cardStore.textAlign)
const backgroundType = computed(() => cardStore.backgroundType)
const backgroundColor = computed(() => cardStore.backgroundColor)
const backgroundGradient = computed(() => cardStore.backgroundGradient)
const stickers = computed(() => cardStore.stickers)
const currentTemplate = computed(() => cardStore.currentTemplate)
const canvasRadius = computed(() => cardStore.canvasRadius)
const canvasShadow = computed(() => cardStore.canvasShadow)

// 文本位置和大小
const textPosition = computed({
  get: () => ({
    x: cardStore.textX,
    y: cardStore.textY
  }),
  set: (val) => {
    cardStore.setTextPosition(val.x, val.y)
  }
})

// 文本宽高
const textWidth = computed({
  get: () => cardStore.textWidth,
  set: (val) => cardStore.setTextSize(val, textHeight.value)
})

const textHeight = computed({
  get: () => cardStore.textHeight,
  set: (val) => cardStore.setTextSize(textWidth.value, val)
})

// 设置文本元素为选中状态
const selectedElement = ref<'text' | number | null>(null)

// 是否显示辅助线
const showGuides = ref(true)

// 自定义缩放比例（50%-200%）
const userScale = ref(100) // 初始100%
const MIN_SCALE = 50
const MAX_SCALE = 200

// 卡片容器 DOM 引用
const cardContainerRef = ref<HTMLDivElement | null>(null)

// 计算缩放比例，使卡片适应屏幕
const scale = computed(() => {
  const containerWidth = cardContainerRef.value?.clientWidth || 600
  const containerHeight = cardContainerRef.value?.clientHeight || 800

  // 当卡片尺寸超过容器时，才进行缩放以适应容器
  const widthRatio = containerWidth / canvasWidth.value
  const heightRatio = containerHeight / canvasHeight.value

  // 如果卡片完全能在容器内显示，则保持原始大小(比例为1)
  // 否则才缩小到适合容器的大小
  const baseScale =
    widthRatio >= 1 && heightRatio >= 1
      ? 1 // 能够完全显示，保持原始大小
      : Math.min(widthRatio, heightRatio) * 0.95 // 需要缩小才能完全显示

  // 应用用户自定义缩放（百分比转换为小数）
  return baseScale * (userScale.value / 100)
})

// 卡片背景样式
const cardBackgroundStyle = computed(() => {
  if (backgroundType.value === 'gradient' && backgroundGradient.value) {
    return { background: backgroundGradient.value }
  } else {
    return { backgroundColor: backgroundColor.value }
  }
})

// 文本编辑模式
const isEditing = ref(false)

// 处理键盘快捷键
const handleKeyDown = (e: KeyboardEvent) => {
  // 忽略在输入框内的键盘操作（不需要了）

  // Ctrl/Command + '+' 放大
  if ((e.ctrlKey || e.metaKey) && e.key === '+') {
    e.preventDefault()
    zoomIn()
  }

  // Ctrl/Command + '-' 缩小
  if ((e.ctrlKey || e.metaKey) && e.key === '-') {
    e.preventDefault()
    zoomOut()
  }

  // Ctrl/Command + '0' 重置缩放
  if ((e.ctrlKey || e.metaKey) && e.key === '0') {
    e.preventDefault()
    resetZoom()
  }
}

// 显示缩放提示
const showZoomTip = ref(true)
const hideZoomTip = () => {
  showZoomTip.value = false
  localStorage.setItem('zoomTipSeen', 'true')
}

// 保存缩放比例到本地存储
const saveUserScale = (scale: number) => {
  localStorage.setItem('canvas-scale', scale.toString())
}

// 初始化文本位置为居中
onMounted(() => {
  if (textPosition.value.x === 0 && textPosition.value.y === 0) {
    resetTextPosition()
  }

  // 在初始化时更新文本尺寸
  updateTextDimensions()

  // 添加键盘事件监听
  window.addEventListener('keydown', handleKeyDown)

  // 检查是否已显示过缩放提示
  if (localStorage.getItem('zoomTipSeen') === 'true') {
    showZoomTip.value = false
  }

  // 恢复保存的缩放比例
  const savedScale = localStorage.getItem('canvas-scale')
  if (savedScale) {
    const scale = parseInt(savedScale)
    if (!isNaN(scale) && scale >= MIN_SCALE && scale <= MAX_SCALE) {
      userScale.value = scale
    }
  }
})

onBeforeUnmount(() => {
  // 移除键盘事件监听
  window.removeEventListener('keydown', handleKeyDown)
})

// 重置文本位置到中心
const resetTextPosition = () => {
  cardStore.resetTextPosition()
}

// 当文本元素大小变化时更新宽高
const updateTextDimensions = () => {
  // 设置默认的文本尺寸
  const defaultWidth = Math.min(400, canvasWidth.value * 0.8)
  const defaultHeight = Math.min(200, canvasHeight.value * 0.3)

  // 基于内容长度估算所需尺寸
  const contentLength = text.value.length
  const estimatedWidth = Math.max(
    defaultWidth,
    Math.min(contentLength * 10, canvasWidth.value * 0.8)
  )
  const estimatedHeight = Math.max(
    defaultHeight,
    Math.min(contentLength * 0.8, canvasHeight.value * 0.5)
  )

  textWidth.value = estimatedWidth
  textHeight.value = estimatedHeight
}

// 监听文本内容变化，更新尺寸
watch(text, () => {
  setTimeout(updateTextDimensions, 0)
})

// 监听字体样式变化
watch([fontFamily, fontSize, fontWeight], () => {
  setTimeout(updateTextDimensions, 0)
})

// 准备显示的文本，用于显示
const displayText = computed(() => {
  return text.value.replace(/\n/g, '<br>')
})

// 文本位置更新处理
const handleTextDragStop = (x: number, y: number) => {
  // 确保文本不会超出画布边界
  const boundedX = Math.max(0, Math.min(x, canvasWidth.value - textWidth.value))
  const boundedY = Math.max(0, Math.min(y, canvasHeight.value - textHeight.value))

  textPosition.value = { x: boundedX, y: boundedY }

  // 显示操作反馈
  ElMessage.success('文本位置已更新')
}

// 文本大小调整处理
const handleTextResize = (left: number, top: number, width: number, height: number) => {
  // 确保调整大小后不会超出画布
  const maxWidth = canvasWidth.value
  const maxHeight = canvasHeight.value

  // 调整宽高不超出画布
  const boundedWidth = Math.min(width, maxWidth)
  const boundedHeight = Math.min(height, maxHeight)

  const boundedX = Math.max(0, Math.min(left, maxWidth - boundedWidth))
  const boundedY = Math.max(0, Math.min(top, maxHeight - boundedHeight))

  // 更新位置
  textPosition.value = { x: boundedX, y: boundedY }

  // 保持跟踪容器宽高（使用直接赋值触发computed setter）
  textWidth.value = boundedWidth
  textHeight.value = boundedHeight
}

// 文本大小调整完成处理
const handleTextResizeStop = (left: number, top: number, width: number, height: number) => {
  // 使用相同的边界检查
  handleTextResize(left, top, width, height)

  // 显示操作反馈
  ElMessage.success('文本大小已调整')
}

// 贴纸位置更新处理
const handleStickerDragStop = (stickerId: number, x: number, y: number) => {
  // 获取贴纸信息
  const sticker = stickers.value.find((s) => s.id === stickerId)
  if (sticker) {
    // 确保贴纸不会超出画布边界
    const boundedX = Math.max(0, Math.min(x, canvasWidth.value - sticker.width))
    const boundedY = Math.max(0, Math.min(y, canvasHeight.value - sticker.height))

    cardStore.updateStickerPosition(stickerId, boundedX, boundedY)
  } else {
    cardStore.updateStickerPosition(stickerId, x, y)
  }
}

// 贴纸缩放处理
const handleStickerResize = (
  stickerId: number,
  left: number,
  top: number,
  width: number,
  height: number
) => {
  const sticker = stickers.value.find((s) => s.id === stickerId)
  if (sticker) {
    // 确保贴纸不会超出画布边界
    const boundedX = Math.max(0, Math.min(left, canvasWidth.value - width))
    const boundedY = Math.max(0, Math.min(top, canvasHeight.value - height))

    // 更新位置
    cardStore.updateStickerPosition(stickerId, boundedX, boundedY)

    // 更新宽高
    const newSticker = {
      ...sticker,
      width,
      height
    }

    // 更新贴纸
    cardStore.updateSticker(stickerId, newSticker)
  }
}

// 删除贴纸
const removeSticker = (e: MouseEvent, stickerId: number) => {
  e.stopPropagation()
  cardStore.removeSticker(stickerId)
  ElMessage.success('贴纸已删除')
}

// 点击画布空白区域时取消选择
const handleCanvasClick = (e: MouseEvent) => {
  // 如果点击的是画布本身，取消所有选择
  if (e.target instanceof HTMLElement && e.target.id === 'card-canvas') {
    selectedElement.value = null
  }
}

// 选择元素
const selectElement = (type: 'text' | number) => {
  selectedElement.value = type
}

// 处理鼠标滚轮缩放
const handleWheel = (e: WheelEvent) => {
  // 检查Ctrl/Command键是否按下
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault()

    // 根据滚轮方向调整缩放
    const delta = e.deltaY > 0 ? -5 : 5
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, userScale.value + delta))

    userScale.value = newScale
    saveUserScale(newScale)
  }
}

// 增加缩放
const zoomIn = () => {
  userScale.value = Math.min(MAX_SCALE, userScale.value + 10)
  saveUserScale(userScale.value)
}

// 减少缩放
const zoomOut = () => {
  userScale.value = Math.max(MIN_SCALE, userScale.value - 10)
  saveUserScale(userScale.value)
}

// 重置缩放
const resetZoom = () => {
  userScale.value = 100
  saveUserScale(userScale.value)
}

// 监听画布尺寸变化，调整文本容器大小
watch([canvasWidth, canvasHeight], () => {
  // 当画布尺寸变化时，如果文本内容的拖拽容器宽高均超出画布尺寸，重置为画布尺寸
  if (textWidth.value > canvasWidth.value || textHeight.value > canvasHeight.value) {
    // 调整宽高不超出画布
    const newWidth = Math.min(textWidth.value, canvasWidth.value)
    const newHeight = Math.min(textHeight.value, canvasHeight.value)

    // 更新文本尺寸
    cardStore.setTextSize(newWidth, newHeight)

    // 确保文本位置不超出画布
    handleTextResize(textPosition.value.x, textPosition.value.y, newWidth, newHeight)
  }
})
</script>

<template>
  <div
    ref="cardContainerRef"
    class="w-full h-full flex items-center justify-center overflow-auto hide-scrollbar"
    @wheel.passive="handleWheel"
  >
    <div
      id="card-canvas"
      class="relative transition-all duration-300"
      :style="{
        width: `${canvasWidth}px`,
        height: `${canvasHeight}px`,
        transform: `scale(${scale})`,
        borderRadius: `${canvasRadius}px`,
        boxShadow: canvasShadow,
        ...cardBackgroundStyle
      }"
      @click="handleCanvasClick"
    >
      <!-- 文本内容 -->
      <vue-draggable-resizable
        :x="textPosition.x"
        :y="textPosition.y"
        :w="textWidth"
        :h="textHeight"
        :parent="true"
        :draggable="true"
        :resizable="true"
        :active="selectedElement === 'text'"
        :prevent-deactivation="false"
        axis="both"
        :drag-handle="null"
        :handles="['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml']"
        :min-width="50"
        :min-height="30"
        :snap="true"
        :snap-tolerance="10"
        class-name="text-element"
        :scale="scale"
        @activated="selectElement('text')"
        @dragstop="handleTextDragStop"
        @resizing="handleTextResize"
        @resizestop="handleTextResizeStop"
        :style="{ zIndex: selectedElement === 'text' ? 100 : 1 }"
      >
        <div class="w-full h-full flex items-center justify-center cursor-move">
          <div
            class="w-full text-center outline-none transition-all whitespace-pre-wrap break-words"
            :style="{
              fontFamily: fontFamily as string,
              fontSize: `${fontSize}px`,
              fontWeight: fontWeight as number,
              color: textColor as string,
              textAlign: textAlign as 'left' | 'center' | 'right'
            }"
            v-html="text.replace(/\n/g, '<br>')"
          ></div>
        </div>
      </vue-draggable-resizable>

      <!-- 贴纸元素 -->
      <vue-draggable-resizable
        v-for="sticker in stickers"
        :key="sticker.id"
        :x="sticker.x"
        :y="sticker.y"
        :w="sticker.width"
        :h="sticker.height"
        :parent="true"
        :draggable="true"
        :resizable="true"
        :active="selectedElement === sticker.id"
        :prevent-deactivation="false"
        axis="both"
        class-name="sticker-element"
        :scale="scale"
        :snap="true"
        :snap-tolerance="10"
        :handles="['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml']"
        @activated="selectElement(sticker.id)"
        @dragstop="(x: number, y: number) => handleStickerDragStop(sticker.id, x, y)"
        @resizing="(left: number, top: number, width: number, height: number) => handleStickerResize(sticker.id, left, top, width, height)"
        @resizestop="(left: number, top: number, width: number, height: number) => handleStickerResize(sticker.id, left, top, width, height)"
        :style="{ zIndex: selectedElement === sticker.id ? 100 : 2 }"
      >
        <!-- 表情贴纸 -->
        <div v-if="sticker.type === 'emoji'" class="w-full h-full flex items-center justify-center">
          {{ sticker.url }}
        </div>

        <!-- 图片贴纸 -->
        <img v-else :src="sticker.url" class="w-full h-full object-contain" draggable="false" />

        <!-- 贴纸控制按钮 -->
        <div
          v-if="selectedElement === sticker.id"
          class="absolute top-[-25px] right-0 opacity-100 flex bg-white rounded-full shadow-md transition-all duration-200"
        >
          <button
            class="p-1 text-red-500 hover:bg-red-50 rounded-full transform transition-transform hover:scale-110"
            @click="removeSticker($event, sticker.id)"
            title="删除贴纸"
          >
            <i class="i-fa-solid:trash-alt text-xs"></i>
          </button>
        </div>
      </vue-draggable-resizable>
    </div>

    <!-- 编辑提示 - 移到左下角 -->
    <div
      class="absolute bottom-4 left-4 flex items-center bg-black/50 text-white px-4 py-1.5 rounded-full shadow-lg z-50"
    >
      <span v-if="selectedElement === 'text'" class="text-sm"
        >拖拽文本调整位置，拖拽边角手柄调整大小</span
      >
      <span v-else-if="selectedElement !== null" class="text-sm"
        >拖拽贴纸调整位置，拖拽边角手柄调整大小</span
      >
      <span v-else class="text-sm"
        >请在右侧设置面板编辑文本，按住Ctrl/Command + 滚轮可缩放画布</span
      >
    </div>

    <!-- 缩放控制按钮组 - 保持在右下角 -->
    <div
      class="absolute bottom-4 right-4 flex items-center bg-white/90 px-3 py-1.5 rounded-full shadow-lg z-50"
    >
      <button
        class="p-1 w-8 h-8 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors outline-none cursor-pointer"
        @click="zoomOut"
        :disabled="userScale <= MIN_SCALE"
        :class="{ 'opacity-50 cursor-not-allowed': userScale <= MIN_SCALE }"
      >
        <i class="i-fa-solid:search-minus"></i>
      </button>

      <div class="mx-2 text-sm font-medium text-gray-700 select-none">{{ userScale }}%</div>

      <button
        class="p-1 w-8 h-8 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors outline-none cursor-pointer"
        @click="zoomIn"
        :disabled="userScale >= MAX_SCALE"
        :class="{ 'opacity-50 cursor-not-allowed': userScale >= MAX_SCALE }"
      >
        <i class="i-fa-solid:search-plus"></i>
      </button>

      <button
        class="ml-1 p-1 w-8 h-8 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors outline-none cursor-pointer"
        @click="resetZoom"
        :disabled="userScale === 100"
        :class="{ 'opacity-50 cursor-not-allowed': userScale === 100 }"
      >
        <i class="i-fa-solid:undo"></i>
      </button>
    </div>

    <!-- 缩放功能提示 -->
    <div
      v-if="showZoomTip"
      class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-50 text-blue-700 p-3 rounded-lg shadow-lg max-w-xs z-50 animate-fade-in"
    >
      <div class="flex items-start">
        <i class="i-fa-solid:info-circle mr-2 text-blue-500 mt-0.5"></i>
        <div>
          <p class="text-sm font-medium">新功能: 画布缩放</p>
          <p class="text-xs mt-1">您现在可以使用 Ctrl/Command + 鼠标滚轮 来缩放画布。</p>
          <p class="text-xs mt-1">也可以使用快捷键：</p>
          <ul class="text-xs mt-1 list-disc pl-4">
            <li>Ctrl/Command + '+': 放大</li>
            <li>Ctrl/Command + '-': 缩小</li>
            <li>Ctrl/Command + '0': 重置</li>
          </ul>
        </div>
        <button
          class="ml-2 text-xs text-blue-500 hover:text-blue-700 outline-none cursor-pointer"
          @click="hideZoomTip"
        >
          <i class="i-fa-solid:times"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style>
/* 不在这里导入样式，改为在style标签中导入 */
/* import 'vue-draggable-resizable/dist/VueDraggableResizable.css' */
</style>

<style scoped>
@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0.8) rotate(0deg);
  }
  50% {
    transform: scale(1.2) rotate(0deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

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

.animate-pop-in {
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

/* 自定义调整手柄样式 */
:deep(.vdr-handle) {
  width: 16px !important;
  height: 16px !important;
  background-color: white !important;
  border: 2px solid #1976d2 !important;
  border-radius: 50% !important;
  z-index: 110 !important;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4) !important;
  transform: translate(-50%, -50%) !important;
  position: absolute !important;
  margin: 0 !important;
  padding: 0 !important;
}

/* 特定位置手柄的位置调整 */
:deep(.vdr-handle-tl) {
  left: 0 !important;
  top: 0 !important;
}

:deep(.vdr-handle-tm) {
  left: 50% !important;
  top: 0 !important;
}

:deep(.vdr-handle-tr) {
  left: 100% !important;
  top: 0 !important;
}

:deep(.vdr-handle-ml) {
  left: 0 !important;
  top: 50% !important;
}

:deep(.vdr-handle-mr) {
  left: 100% !important;
  top: 50% !important;
}

:deep(.vdr-handle-bl) {
  left: 0 !important;
  top: 100% !important;
}

:deep(.vdr-handle-bm) {
  left: 50% !important;
  top: 100% !important;
}

:deep(.vdr-handle-br) {
  left: 100% !important;
  top: 100% !important;
}

/* 旋转手柄样式 */
:deep(.vdr-handle-rotator) {
  width: 18px !important;
  height: 18px !important;
  background-color: #1976d2 !important;
  border: 2px solid white !important;
  border-radius: 50% !important;
  top: -35px !important;
  left: 50% !important;
  margin-left: -9px !important;
  cursor: crosshair !important;
  z-index: 110 !important;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4) !important;
  transition: transform 0.2s ease;
}

:deep(.vdr-handle-rotator:hover) {
  transform: scale(1.2);
}

/* 选中元素时显示半透明边框 */
.text-element.active,
.sticker-element.active {
  border: 2px dashed rgba(25, 118, 210, 0.7) !important;
  box-shadow: 0 0 8px rgba(25, 118, 210, 0.3) !important;
}

/* 元素初始无边框 */
.text-element,
.sticker-element {
  border: 1px solid transparent;
  transition: border 0.3s ease, box-shadow 0.3s ease;
}

/* 元素悬停样式 */
.text-element:hover:not(.active),
.sticker-element:hover:not(.active) {
  border: 1px dashed rgba(25, 118, 210, 0.3) !important;
}

/* 隐藏滚动条但保留滚动功能 */
.hide-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
</style>
