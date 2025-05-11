<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, shallowRef, watch } from 'vue'
import gsap from 'gsap'
import { CardComponents } from './cards'

interface Props {
  currentIndex: number // 当前选中的卡片索引
  isAnimating: boolean // 是否正在动画中
  text: string // 卡片文字内容
}

const props = defineProps<Props>()
const emit = defineEmits(['select'])

// 卡片列表
const cardList = shallowRef(CardComponents)

// 缩略图列表容器的引用
const thumbnailsContainer = ref<HTMLElement | null>(null)
// 上下滚动的控制变量 - 始终显示
const showUpArrow = ref(true)
const showDownArrow = ref(true)

// 监听currentIndex的变化，滚动到对应的缩略图
watch(
  () => props.currentIndex,
  () => {
    scrollToCurrentTemplate()
  }
)

// 初始化
onMounted(() => {
  // 添加滚动监听
  if (thumbnailsContainer.value) {
    thumbnailsContainer.value.addEventListener('scroll', updateArrowVisibility)
    // 初始化箭头状态
    updateArrowVisibility()
  }

  // 初始滚动到当前模板
  scrollToCurrentTemplate()
})

onBeforeUnmount(() => {
  // 移除滚动监听
  if (thumbnailsContainer.value) {
    thumbnailsContainer.value.removeEventListener('scroll', updateArrowVisibility)
  }
})

// 监听滚动位置并更新箭头显示状态
const updateArrowVisibility = () => {
  if (!thumbnailsContainer.value) return

  showUpArrow.value = true
  showDownArrow.value = true
}

// 当前模板变化时，确保其可见 - 使用GSAP优化动画
const scrollToCurrentTemplate = () => {
  if (!thumbnailsContainer.value) return

  const container = thumbnailsContainer.value
  const thumbnailHeight = 120 // 缩略图高度 + 间距

  // 直接计算当前项的位置
  const itemTop = props.currentIndex * thumbnailHeight
  const itemBottom = itemTop + thumbnailHeight

  // 获取当前可视区域的上下边界
  const viewTop = container.scrollTop
  const viewBottom = viewTop + container.clientHeight

  let targetScrollTop = container.scrollTop

  // 如果选中项不完全在可视区域内，调整滚动位置
  if (itemTop < viewTop) {
    // 项目在可视区域上方 - 向上滚动
    targetScrollTop = itemTop
  } else if (itemBottom > viewBottom) {
    // 项目在可视区域下方 - 向下滚动确保项目完全可见
    targetScrollTop = itemBottom - container.clientHeight
  }

  // 使用GSAP动画
  gsap.to(container, {
    scrollTop: targetScrollTop,
    duration: 0.6,
    ease: 'back.out(1.2)'
  })
}

// 滚动到指定位置 - 使用GSAP优化动画
const scrollThumbnails = (direction: 'up' | 'down') => {
  if (!thumbnailsContainer.value) return

  const container = thumbnailsContainer.value
  const scrollAmount = 120 // 增加滚动量以获得更明显的效果
  const targetScrollTop =
    direction === 'up' ? container.scrollTop - scrollAmount : container.scrollTop + scrollAmount

  // 使用GSAP动画
  gsap.to(container, {
    scrollTop: targetScrollTop,
    duration: 0.5,
    ease: 'power2.out'
  })
}

// 选择模板的方法
const selectTemplate = (index: number) => {
  if (props.isAnimating || index === props.currentIndex) return
  emit('select', index)
}
</script>

<template>
  <div class="flex flex-col">
    <!-- 缩略图纵向滑动预览容器 -->
    <div class="relative w-100px h-420px mx-auto mb-4">
      <!-- 上方切换箭头 - 添加过渡效果 -->
      <div
        @click="scrollThumbnails('up')"
        class="absolute top-0 left-0 right-0 z-10 flex items-center justify-center h-10 cursor-pointer"
      >
        <div
          class="w-8 h-8 rounded-full bg-white bg-opacity-80 backdrop-blur-md flex items-center justify-center shadow-md hover:bg-blue-50 hover:scale-110 transition-all duration-300"
        >
          <i class="i-tabler-chevron-up text-gray-600"></i>
        </div>
      </div>

      <!-- 上方覆盖层 -->
      <div
        class="absolute top-0 left-0 right-0 h-6 z-5 bg-gradient-to-b from-gray-50 to-transparent pointer-events-none"
      ></div>

      <!-- 缩略图滚动区域 - 增加内部间距和调整高度 -->
      <div
        ref="thumbnailsContainer"
        class="w-full overflow-y-auto no-scrollbar"
        style="height: calc(100% - 100px); margin: 50px auto 50px auto"
      >
        <div class="flex flex-col gap-4 py-10px">
          <div
            v-for="(card, index) in cardList"
            :key="index"
            @click="selectTemplate(index)"
            class="cursor-pointer flex flex-col items-center gap-2"
          >
            <div
              class="thumbnail-card rounded-8px transition-duration-300 w-84px h-106px"
              :class="
                props.currentIndex === index
                  ? 'ring-2 ring-blue-500 shadow-md overflow-hidden'
                  : 'opacity-70 hover:opacity-90'
              "
            >
              <!-- 真实卡片缩略图预览 -->
              <component :is="card.component" :text="text" class="scale-preview" />
            </div>
            <span
              class="text-xs"
              :class="props.currentIndex === index ? 'text-blue-600 font-medium' : 'text-gray-500'"
            >
              {{ card.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- 下方覆盖层 -->
      <div
        class="absolute bottom-0 left-0 right-0 h-6 z-5 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"
      ></div>

      <!-- 下方切换箭头 - 添加过渡效果 -->
      <div
        @click="scrollThumbnails('down')"
        class="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center h-10 cursor-pointer"
      >
        <div
          class="w-8 h-8 rounded-full bg-white bg-opacity-80 backdrop-blur-md flex items-center justify-center shadow-md hover:bg-blue-50 hover:scale-110 transition-all duration-300"
        >
          <i class="i-tabler-chevron-down text-gray-600"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 去掉滚动条但保留滚动功能 */
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* 确保垂直缩略图容器限制高度 */
.thumbnails-container-vertical {
  max-height: 360px;
  overflow-y: auto;
}

/* 缩略图预览样式 */
.scale-preview {
  transform: scale(0.2);
  transform-origin: top left;
  width: 420px;
  height: 528px;
  overflow: hidden;
  pointer-events: none;
}

.scale-preview .text-content {
  font-size: 12px !important;
}

/* 毛玻璃效果 */
.backdrop-blur-md {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* 缩略图项动画效果 */
.thumbnail-card {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.thumbnail-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 当前选中的缩略图效果 */
.thumbnail-card.ring-blue-500 {
  transform: scale(1.08);
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.2);
}

/* 箭头按钮悬停效果 */
.arrow-button {
  transition: all 0.3s ease;
}

.arrow-button:hover {
  transform: scale(1.1);
  background-color: rgba(239, 246, 255, 0.95);
}
</style>
