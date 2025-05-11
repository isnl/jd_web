<script setup lang="ts">
import IconExport from '@/components/icons/IconExport.vue'
import IconMore from '@/components/icons/IconMore.vue'
defineProps<{
  text: string
}>()
</script>
<template>
  <div
    class="w-full h-full px-20px rounded-12px flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.08)] bg-white"
  >
    <!-- 顶部导航栏 -->
    <div class="flex justify-between items-center py-20px">
      <div class="flex items-center gap-2">
        <el-icon :size="20" class="text-#f4a02e"><ArrowLeftBold /></el-icon>
        <span class="text-16px text-[#f4a02e]">Notes</span>
      </div>
      <div class="flex items-center gap-6">
        <el-icon :size="20" class="text-#f4a02e"><IconExport /></el-icon>
        <el-icon :size="20" class="text-#f4a02e"><IconMore /></el-icon>
      </div>
    </div>

    <!-- 内容区域 - 带有横向网格线 -->
    <div class="flex-1 p-16px relative overflow-auto">
      <!-- 网格线背景 - 使用实际DOM元素替代背景图像 -->
      <div class="absolute inset-0 grid-lines-container">
        <div v-for="i in 20" :key="i" class="grid-line"></div>
      </div>

      <!-- 文本内容 -->
      <div
        class="font-['沐瑶手写体',sans-serif] handwriting-text text-16px leading-28px text-[#484848] relative z-10 w-full break-words whitespace-pre-wrap"
      >
        {{ text }}
      </div>
    </div>
  </div>
</template>

<style scoped>
@font-face {
  font-family: '沐瑶手写体';
  src: url('/fonts/沐瑶随心手写体.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

.handwriting-text {
  font-family: '沐瑶手写体', Arial, sans-serif;
}

.grid-background {
  background-image: linear-gradient(to bottom, #f1f1f1 1px, transparent 1px);
  background-size: 100% 28px;
  z-index: 0;
}

.grid-lines-container {
  z-index: 0;
  overflow: hidden;
}

.grid-line {
  height: 1px;
  background-color: #f1f1f1;
  margin-bottom: 27px; /* 28px的总高度减去1px的线高 */
  width: 100%;
}
</style>
