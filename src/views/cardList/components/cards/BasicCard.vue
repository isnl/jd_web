<template>
  <div
    class="w-full h-full bg-[#e7f7e7] rounded-12px flex justify-center p-16px shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
  >
    <div
      class="font-['SimHei',sans-serif] text-18px text-[#333333] w-full break-words whitespace-pre-wrap"
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
