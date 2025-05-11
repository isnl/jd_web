<template>
  <div
    ref="touchEl"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  threshold?: number // 触发滑动的阈值
}>()

const emit = defineEmits<{
  swipeleft: [] // 向左滑动事件
  swiperight: [] // 向右滑动事件
}>()

const touchEl = ref<HTMLElement | null>(null)

// 触摸开始位置
const touchStartX = ref(0)
const touchStartY = ref(0)

// 触摸移动距离
const touchDeltaX = ref(0)

// 处理触摸开始事件
const handleTouchStart = (e: TouchEvent) => {
  const touch = e.touches[0]
  touchStartX.value = touch.clientX
  touchStartY.value = touch.clientY
  touchDeltaX.value = 0
}

// 处理触摸移动事件
const handleTouchMove = (e: TouchEvent) => {
  if (e.touches.length > 1) return // 忽略多点触摸

  const touch = e.touches[0]
  const deltaX = touch.clientX - touchStartX.value
  const deltaY = touch.clientY - touchStartY.value

  // 如果垂直移动大于水平移动，则可能是在滚动页面，不处理滑动
  if (Math.abs(deltaY) > Math.abs(deltaX)) return

  // 防止页面滚动
  e.preventDefault()

  touchDeltaX.value = deltaX
}

// 处理触摸结束事件
const handleTouchEnd = () => {
  const threshold = props.threshold || 50 // 默认阈值为50像素

  if (touchDeltaX.value > threshold) {
    // 向右滑动
    emit('swiperight')
  } else if (touchDeltaX.value < -threshold) {
    // 向左滑动
    emit('swipeleft')
  }

  // 重置
  touchDeltaX.value = 0
}
</script>
