<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import EmojiPicker from './EmojiPicker.vue'

interface Props {
  modelValue: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

// 添加行数超出警告状态
const showLineWarning = ref(false)

// Emoji选择器状态
const showEmojiPicker = ref(false)

// 计算剩余字符数
const remainingChars = computed(() => {
  return props.modelValue.length
})

// 处理输入文本，限制连续换行符和最大行数
const handleTextInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  const value = target.value

  // 替换连续的换行符为单个换行符
  let newValue = value.replace(/\n{3,}/g, '\n\n')

  // 计算当前行数
  const lineCount = newValue.split('\n').length

  // 如果行数超过15行，显示警告
  showLineWarning.value = lineCount > 15

  if (lineCount > 15) {
    // 截取到15行
    const lines = newValue.split('\n')
    newValue = lines.slice(0, 15).join('\n')
    // 显示警告消息
    ElMessage.warning('最多只能输入15行文字')
  }

  if (newValue !== value) {
    emit('update:modelValue', newValue)
    // 保持光标位置
    const cursorPosition = target.selectionStart
    setTimeout(() => {
      target.selectionStart = Math.min(cursorPosition, newValue.length)
      target.selectionEnd = Math.min(cursorPosition, newValue.length)
    })
  }
}

// 切换emoji选择器显示状态
const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value
}

// 添加emoji到文本
const addEmoji = (emoji: string) => {
  const textarea = document.querySelector('.card-text-area') as HTMLTextAreaElement
  if (!textarea) return

  const cursorPos = textarea.selectionStart
  const textBefore = props.modelValue.substring(0, cursorPos)
  const textAfter = props.modelValue.substring(cursorPos)

  emit('update:modelValue', textBefore + emoji + textAfter)

  // 保持光标在emoji后面
  setTimeout(() => {
    textarea.focus()
    const newCursorPos = cursorPos + emoji.length
    textarea.selectionStart = newCursorPos
    textarea.selectionEnd = newCursorPos
  })

  // 关闭emoji选择器
  showEmojiPicker.value = false
}
</script>

<template>
  <div class="flex flex-col">
    <h3 class="text-18px font-600 text-gray-800 mb-3 flex items-center pl-2">
      <span
        class="inline-flex items-center justify-center w-28px h-28px bg-blue-50 rounded-8px mr-8px text-blue-500"
      >
        <i class="i-tabler-edit text-lg"></i>
      </span>
      输入区
      <span
        class="ml-auto text-14px font-500 px-8px py-2px rounded-12px bg-gray-50 transition-all duration-300"
        :class="remainingChars > 140 ? 'text-red-500' : 'text-gray-500'"
      >
        {{ remainingChars }}/150
      </span>
    </h3>
    <div
      class="w-420px h-528px rounded-lg overflow-hidden transition-all duration-300 border-2 shadow-lg bg-white relative"
      :class="[
        showLineWarning
          ? 'border-amber-400 shadow-amber-100'
          : 'border-gray-200 hover:border-blue-400 hover:shadow-blue-100 hover:translate-y-[-2px] focus-within:border-blue-400 focus-within:shadow-blue-100 focus-within:translate-y-[-2px]'
      ]"
    >
      <textarea
        :value="modelValue"
        @input="(e) => { handleTextInput(e); emit('update:modelValue', (e.target as HTMLTextAreaElement).value) }"
        class="card-text-area w-full h-full p-6 resize-none border-none outline-none bg-transparent font-sans text-16px leading-relaxed text-gray-700 placeholder:text-gray-400 placeholder:opacity-70"
        placeholder="在这里输入您想展示的文字内容..."
        maxlength="150"
      ></textarea>

      <!-- AI生成 -->
      <button
        class="emoji-button absolute bottom-4 right-16 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-300"
        title="AI生成"
      >
        <i class="i-fa-solid:magic text-gray-500"></i>
      </button>

      <!-- 添加Emoji按钮 -->
      <button
        @click.stop="toggleEmojiPicker"
        class="emoji-button absolute bottom-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-300"
        title="插入表情"
      >
        <i class="i-tabler-mood-smile text-lg text-gray-500"></i>
      </button>

      <!-- Emoji选择器 -->
      <EmojiPicker :visible="showEmojiPicker" @close="showEmojiPicker = false" @select="addEmoji" />

      <!-- 添加行数超限警告 -->
      <div
        v-if="showLineWarning"
        class="absolute top-2 right-2 px-2 py-1 bg-amber-50 text-amber-600 text-xs rounded-md border border-amber-200 flex items-center"
      >
        <i class="i-tabler-alert-triangle mr-1 text-amber-500"></i>
        最多15行
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 新增输入区域样式 */
.input-container {
  position: relative;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.input-container:hover,
.input-container:focus-within {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.text-input {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #374151;
  background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.8));
  transition: all 0.3s ease;
}

.text-input:focus {
  background: white;
}

.text-input::placeholder {
  color: #9ca3af;
  opacity: 0.7;
}

/* 适配移动设备 */
@media (max-width: 768px) {
  .input-container {
    margin-top: 20px;
    height: 200px;
  }
}
</style>
