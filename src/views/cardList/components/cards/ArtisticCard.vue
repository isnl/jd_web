<template>
  <div
    class="w-full h-full bg-gradient-to-br from-[#a78bfa] to-[#6b46c1] rounded-16px flex items-center justify-center p-16px shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
  >
    <div class="font-['SimSun',serif] text-22px text-white text-center w-full break-words">
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>
