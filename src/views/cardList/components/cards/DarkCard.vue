<template>
  <div
    class="w-full h-full bg-[#222222] rounded-12px flex items-center justify-center p-16px shadow-[0_8px_30px_rgba(0,0,0,0.15)]"
  >
    <div class="font-['SimSun',serif] text-20px text-white text-center w-full break-words">
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>
