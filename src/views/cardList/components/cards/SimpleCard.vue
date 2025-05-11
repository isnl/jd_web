<template>
  <div
    class="w-full h-full bg-[#f0f5fa] rounded-12px flex items-center justify-center p-16px shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
  >
    <div
      class="font-['Microsoft_YaHei',sans-serif] text-18px text-[#333333] text-center w-full break-words"
    >
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>
