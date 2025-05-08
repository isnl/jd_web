<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useCardStore } from '@/stores/cardStore'

const cardStore = useCardStore()

// 获取卡片内容和样式
const text = computed(() => cardStore.text)
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

// 计算缩放比例，使卡片适应屏幕
const scale = computed(() => {
  const containerWidth = cardContainerRef.value?.clientWidth || 600
  const containerHeight = cardContainerRef.value?.clientHeight || 800

  const widthRatio = containerWidth / canvasWidth.value
  const heightRatio = containerHeight / canvasHeight.value

  // 使用较小的缩放比例，确保卡片完全可见
  return Math.min(widthRatio, heightRatio, 1) * 0.9
})

// 卡片背景样式
const cardBackgroundStyle = computed(() => {
  if (backgroundType.value === 'gradient' && backgroundGradient.value) {
    return { background: backgroundGradient.value }
  } else {
    return { backgroundColor: backgroundColor.value }
  }
})

// 调整文本样式
const textStyle = computed(() => {
  return {
    fontFamily: fontFamily.value,
    fontSize: `${fontSize.value}px`,
    fontWeight: fontWeight.value,
    color: textColor.value,
    textAlign: textAlign.value as any
  }
})

// 获取卡片容器 DOM 引用
const cardContainerRef = ref<HTMLDivElement | null>(null)
</script>

<template>
  <div ref="cardContainerRef" class="w-full h-full flex items-center justify-center overflow-auto">
    <div
      id="card-canvas"
      class="relative shadow-lg transition-all duration-300"
      :style="{
        width: `${canvasWidth}px`,
        height: `${canvasHeight}px`,
        transform: `scale(${scale})`,
        borderRadius: `${currentTemplate.borderRadius}px`,
        ...cardBackgroundStyle
      }"
    >
      <!-- 文本内容 -->
      <div
        class="absolute inset-0 flex items-center justify-center p-8 overflow-hidden"
        :style="textStyle"
      >
        <div class="w-full break-words text-center">{{ text }}</div>
      </div>

      <!-- 贴纸元素 -->
      <div
        v-for="sticker in stickers"
        :key="sticker.id"
        class="absolute"
        :style="{
          left: `${sticker.x}px`,
          top: `${sticker.y}px`,
          width: `${sticker.width}px`,
          height: `${sticker.height}px`,
          transform: `rotate(${sticker.rotation}deg)`,
          backgroundImage: `url(${sticker.url})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }"
      ></div>
    </div>
  </div>
</template>
