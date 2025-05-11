<template>
  <div class="w-full h-full rounded-12px flex items-center justify-center p-30px bg-white">
    <!-- 便签质感的黄色卡片 -->
    <div class="relative w-full h-full bg-[#fcf4a9] shadow-[2px_2px_8px_rgba(0,0,0,0.12)]">
      <!-- 头部区域，颜色稍深 -->
      <div class="w-full h-50px bg-[#f9f08f]"></div>

      <!-- 左上角毛玻璃矩形装饰 -->
      <div
        class="absolute -left-20px top-0 -rotate-45 bg-[rgba(206,227,249,0.4)] backdrop-blur-sm w-90px h-35px rounded-4px border-1px border-solid border-[rgba(206,227,249,0.5)] shadow-lg"
      ></div>

      <!-- 文本内容区域 -->
      <div
        class="font-['手写体',sans-serif] text-16px text-[#333] font-bold p-20px pb-24px handwriting-text whitespace-pre-wrap"
      >
        {{ text }}
      </div>

      <!-- 右下角Note装饰图标 -->
      <div class="absolute bottom-10px right-10px opacity-40 z-0">
        <el-icon :size="32" class="font-bold" color="#f9d423"><Notebook /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Notebook } from '@element-plus/icons-vue'

defineProps<{
  text: string
}>()
</script>

<style scoped>
@font-face {
  font-family: '手写体';
  src: url('/fonts/鼠标仿手写体.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

.handwriting-text {
  font-family: '手写体', Arial, sans-serif;
}
</style>
