<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { CardComponents } from '@/views/cardList/components/cards'
import html2canvas from 'html2canvas'
import { ElMessage, ElLoading } from 'element-plus'
import gsap from 'gsap'

// 引入我们新创建的组件
import CardInput from './components/CardInput.vue'
import CardPreview from './components/CardPreview.vue'
import ThumbnailSelector from './components/ThumbnailSelector.vue'

const router = useRouter()
const cardText = ref('')

// 当前选中的卡片模板索引
const currentCardIndex = ref(0)

// 动画控制
const isAnimating = ref(false)
const slideDirection = ref('next')

// 返回首页
const goBack = () => {
  router.push('/')
}

// 下载卡片
const downloadCard = () => {
  const cardElement = document.querySelector('.card-wrapper')
  if (!cardElement) return

  // 显示加载状态
  const loading = ElLoading.service({
    lock: true,
    text: '正在生成卡片图片...',
    background: 'rgba(255, 255, 255, 0.7)'
  })

  // html2canvas配置，增加清晰度
  const scale = 3 // 增加缩放比例提高清晰度
  html2canvas(cardElement as HTMLElement, {
    scale: scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
    onclone: (doc) => {
      // 在克隆的DOM上进行处理，避免影响原始DOM
      const clonedCard = doc.querySelector('.card-wrapper')
      if (clonedCard && clonedCard instanceof HTMLElement) {
        clonedCard.style.transform = 'none'
        clonedCard.style.opacity = '1'
      }
    }
  })
    .then((canvas) => {
      // 转换为图片
      const imgData = canvas.toDataURL('image/png')

      // 创建下载链接
      const link = document.createElement('a')
      link.href = imgData
      link.download = `卡片_${new Date().getTime()}.png`

      // 模拟点击下载
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // 关闭加载状态
      loading.close()

      // 显示成功提示
      ElMessage.success('卡片下载成功')
    })
    .catch((error) => {
      console.error('下载卡片失败:', error)
      loading.close()
      ElMessage.error('下载卡片失败，请重试')
    })
}

// 切换到上一个卡片模板
const prevTemplate = () => {
  if (isAnimating.value) return

  slideDirection.value = 'prev'
  isAnimating.value = true

  // 使用GSAP动画
  gsap.to('.card-wrapper', {
    opacity: 0,
    x: 30,
    duration: 0.2,
    onComplete: () => {
      if (currentCardIndex.value > 0) {
        currentCardIndex.value--
      } else {
        currentCardIndex.value = CardComponents.length - 1
      }

      // 重置位置并淡入
      gsap.fromTo(
        '.card-wrapper',
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.25,
          ease: 'power1.out',
          onComplete: () => {
            isAnimating.value = false
          }
        }
      )
    }
  })
}

// 切换到下一个卡片模板
const nextTemplate = () => {
  if (isAnimating.value) return

  slideDirection.value = 'next'
  isAnimating.value = true

  // 使用GSAP动画
  gsap.to('.card-wrapper', {
    opacity: 0,
    x: -30,
    duration: 0.2,
    onComplete: () => {
      if (currentCardIndex.value < CardComponents.length - 1) {
        currentCardIndex.value++
      } else {
        currentCardIndex.value = 0
      }

      // 重置位置并淡入
      gsap.fromTo(
        '.card-wrapper',
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.25,
          ease: 'power1.out',
          onComplete: () => {
            isAnimating.value = false
          }
        }
      )
    }
  })
}

// 处理滑动事件处理方法
const handleSwipeLeft = () => {
  nextTemplate()
}

const handleSwipeRight = () => {
  prevTemplate()
}

// 选择模板的方法
const selectTemplate = (index: number) => {
  if (isAnimating.value || index === currentCardIndex.value) return

  slideDirection.value = index > currentCardIndex.value ? 'next' : 'prev'
  isAnimating.value = true

  // 使用GSAP动画替代setTimeout
  gsap.to('.card-wrapper', {
    opacity: 0,
    x: slideDirection.value === 'next' ? -30 : 30,
    duration: 0.2,
    onComplete: () => {
      currentCardIndex.value = index
      // 重置位置并淡入
      gsap.fromTo(
        '.card-wrapper',
        { opacity: 0, x: slideDirection.value === 'next' ? 30 : -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.25,
          ease: 'power1.out',
          onComplete: () => {
            isAnimating.value = false
          }
        }
      )
    }
  })
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- 顶部导航 -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center">
          <button @click="goBack" class="text-gray-600 hover:text-blue-600 mr-4">
            <i class="i-tabler-arrow-left text-xl"></i>
          </button>
          <h1 class="text-xl font-medium text-gray-800">卡片预览</h1>
        </div>
        <el-button type="primary" @click="downloadCard">下载卡片</el-button>
      </div>
    </header>

    <!-- 卡片预览区域 - 紧凑布局 -->
    <div class="flex-1 flex justify-center flex-col max-w-7xl mx-auto w-full py-4 px-4">
      <!-- 卡片预览容器 -->
      <div class="flex flex-col md:flex-row items-center justify-center mb-3 gap-8">
        <!-- 输入区 -->
        <CardInput v-model="cardText" />

        <!-- 预览区 -->
        <CardPreview
          :text="cardText"
          :current-index="currentCardIndex"
          :is-animating="isAnimating"
          :slide-direction="slideDirection"
          @swipe-left="handleSwipeLeft"
          @swipe-right="handleSwipeRight"
        />

        <!-- 缩略图选择器 -->
        <ThumbnailSelector
          :current-index="currentCardIndex"
          :is-animating="isAnimating"
          :text="cardText"
          @select="selectTemplate"
        />
      </div>
    </div>
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
