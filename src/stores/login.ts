import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoginStore = defineStore('login', () => {
  const visible = ref(false)

  const setVisible = (value: boolean) => {
    visible.value = value
  }

  return { visible, setVisible }
})
