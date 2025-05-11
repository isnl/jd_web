<script setup lang="ts">
import { shallowRef, computed } from 'vue'
import TouchSwipe from './TouchSwipe.vue'
import { CardComponents } from './cards'

interface Props {
  text: string // 卡片文字内容
  currentIndex: number // 当前选中的卡片索引
  isAnimating: boolean // 是否正在动画中
  slideDirection: string // 滑动方向
}

const props = defineProps<Props>()
const emit = defineEmits(['swipeLeft', 'swipeRight'])

// 卡片列表
const cardList = shallowRef(CardComponents)

// 当前活跃的卡片组件
const activeCardComponent = computed(() => {
  return cardList.value[props.currentIndex].component
})

// 处理滑动事件
const handleSwipeLeft = () => {
  emit('swipeLeft')
}

const handleSwipeRight = () => {
  emit('swipeRight')
}
</script>

<template>
  <div class="flex flex-col">
    <h3 class="text-18px font-600 text-gray-800 mb-3 flex items-center pl-2">
      <span
        class="inline-flex items-center justify-center w-28px h-28px bg-blue-50 rounded-8px mr-8px text-blue-500"
      >
        <i class="i-tabler-eye text-lg"></i>
      </span>
      预览区
    </h3>
    <TouchSwipe
      :threshold="50"
      @swipeleft="handleSwipeLeft"
      @swiperight="handleSwipeRight"
      class="relative touch-card-container w-420px h-528px"
    >
      <div class="card-wrapper absolute inset-0 w-full h-full">
        <component :is="activeCardComponent" :text="text" />
      </div>
    </TouchSwipe>
  </div>
</template>

<style scoped>
.card-wrapper {
  backface-visibility: hidden;
  transform-style: preserve-3d;
  will-change: transform, opacity;
}

/* 触摸滑动支持 */
.touch-card-container {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

@media (hover: none) {
  .card-wrapper {
    touch-action: pan-y;
  }
}
</style>
