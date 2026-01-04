<template>
  <div class="h-[calc(100vh-8rem)] md:h-[calc(100vh-5rem)] flex flex-col overflow-hidden relative">
    <el-scrollbar ref="scrollbarRef" class="flex-1" @scroll="onScroll">
      <div ref="innerRef" class="w-full flex flex-col p-4 md:p-6">
        <div v-for="item in list" :key="item._id" class="relative">
          <div class="flex mb-6 overflow-hidden">
            <!-- 左侧头像 -->
            <div class="mr-3 basis-10 flex-shrink-0">
              <div class="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                <span class="text-white text-sm font-bold">京</span>
              </div>
            </div>
            <!-- 右侧内容 -->
            <div class="overflow-hidden flex flex-col flex-1">
              <span class="text-xs text-gray-400">
                {{ formatTime(item.create_time) }}
              </span>
              <div class="relative mt-2 max-w-100">
                <div
                  :ref="(el) => setContentRef(item._id, el)"
                  class="markdown-content p-3 pb-8 bg-gray-100 rounded-lg text-sm text-gray-800 leading-relaxed"
                  v-html="renderMarkdown(item.content)"
                ></div>
                <!-- 操作按钮 - 右下角 -->
                <div class="absolute right-2 bottom-2 flex items-center gap-1">
                  <button
                    @click="openConvertDialog(item._id)"
                    class="w-6 h-6 rounded-full text-gray-400 hover:text-red-500 transition flex items-center justify-center bg-white/80 hover:bg-white shadow-sm"
                    title="转链"
                  >
                    <span class="i-carbon-link text-xs"></span>
                  </button>
                  <button
                    @click="onCopy(item._id)"
                    class="w-6 h-6 rounded-full text-gray-400 hover:text-red-500 transition flex items-center justify-center bg-white/80 hover:bg-white shadow-sm"
                    title="复制"
                  >
                    <span class="i-carbon-copy text-xs"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <el-empty
          v-if="!loading && list.length === 0"
          description="今日数据暂未更新，请耐心等待..."
        />

        <!-- 加载状态 -->
        <div v-if="loading" class="flex justify-center py-10">
          <span class="i-carbon-loading animate-spin text-2xl text-red-500"></span>
        </div>
      </div>
    </el-scrollbar>

    <!-- 右侧操作按钮 -->
    <div class="absolute flex flex-col gap-3 bottom-5 right-5">
      <button
        v-if="list.length"
        @click="goScroll('top')"
        class="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-red-500 transition"
        title="去顶部"
      >
        <span class="i-carbon-arrow-up text-lg"></span>
      </button>
      <button
        @click="refresh"
        class="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-red-500 transition"
        title="刷新"
      >
        <span class="i-carbon-renew text-lg"></span>
      </button>
      <button
        v-if="list.length"
        @click="goScroll('bottom')"
        class="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-red-500 transition"
        title="去底部"
      >
        <span class="i-carbon-arrow-down text-lg"></span>
      </button>
    </div>

    <!-- 转链弹窗 -->
    <el-dialog
      v-model="convertDialogVisible"
      title="转链"
      width="800px"
      :close-on-click-modal="false"
      class="convert-dialog"
    >
      <div class="grid grid-cols-2 gap-4 h-80">
        <!-- 左侧：原文内容 -->
        <div class="flex flex-col">
          <div class="text-sm text-gray-500 mb-2">原文内容</div>
          <div
            class="flex-1 bg-gray-50 rounded-lg p-3 text-sm text-gray-700 h-80 overflow-y-auto whitespace-pre-wrap break-all"
          >
            {{ convertContent }}
          </div>
        </div>

        <!-- 右侧：转链结果 -->
        <div class="flex flex-col">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-gray-500">转链结果</span>
            <span
              v-if="convertResult"
              :class="
                convertResult.convertedCount > 0
                  ? 'bg-green-100 text-green-600'
                  : 'bg-yellow-100 text-yellow-600'
              "
              class="text-xs px-2 py-0.5 rounded-full"
            >
              {{
                convertResult.convertedCount > 0
                  ? `成功 ${convertResult.convertedCount}/${convertResult.totalLinks}`
                  : '未找到链接'
              }}
            </span>
          </div>
          <textarea
            v-model="convertResultContent"
            :placeholder="convertLoading ? '转链中...' : '转链结果'"
            class="flex-1 h-80 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
          ></textarea>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <el-button @click="convertDialogVisible = false">关闭</el-button>
          <el-button type="primary" :disabled="!convertResultContent" @click="copyConvertResult">
            复制结果
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElScrollbar } from 'element-plus'
import { jdApi } from '@/service/api'
import { marked } from 'marked'

interface DealItem {
  _id: string
  content: string
  create_time: string
}

const list = ref<DealItem[]>([])
const loading = ref(false)
const scrollTop = ref(0)
const innerRef = ref<HTMLDivElement>()
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
const contentRefs = new Map<string, HTMLElement>()

// 转链相关状态
const convertDialogVisible = ref(false)
const convertContent = ref('')
const convertLoading = ref(false)
const convertResult = ref<{ content: string; convertedCount: number; totalLinks: number } | null>(
  null
)
const convertResultContent = ref('')

// 保存内容元素引用
const setContentRef = (id: string, el: unknown) => {
  if (el) {
    contentRefs.set(id, el as HTMLElement)
  }
}

// 渲染markdown
const renderMarkdown = (content: string) => {
  return marked.parse(content, { breaks: true })
}

// 格式化时间
const formatTime = (time: string) => {
  const date = new Date(time)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

// 复制渲染后的内容
const onCopy = async (id: string) => {
  try {
    const el = contentRefs.get(id)
    if (el) {
      const text = el.innerText || el.textContent || ''
      await navigator.clipboard.writeText(text)
      ElMessage.success('复制成功')
    }
  } catch {
    ElMessage.error('复制失败')
  }
}

// 打开转链弹窗并自动转链
const openConvertDialog = async (id: string) => {
  const el = contentRefs.get(id)
  if (!el) return

  const content = el.innerText || el.textContent || ''
  convertContent.value = content
  convertResult.value = null
  convertResultContent.value = ''
  convertDialogVisible.value = true
  convertLoading.value = true

  try {
    const res = await jdApi.convert(content)
    convertResult.value = res.data
    convertResultContent.value = res.data.content
    if (res.data.convertedCount > 0) {
      ElMessage.success('转链成功')
    } else {
      ElMessage.warning('未找到可转链的链接')
    }
  } catch {
    // 错误已处理
  } finally {
    convertLoading.value = false
  }
}

// 复制转链结果
const copyConvertResult = async () => {
  try {
    await navigator.clipboard.writeText(convertResultContent.value)
    ElMessage.success('复制成功')
  } catch {
    ElMessage.error('复制失败')
  }
}

// 滚动监听
const onScroll = (info: { scrollTop: number }) => {
  scrollTop.value = info.scrollTop
}

// 滚动动画
const scrollTo = (to: number, duration: number) => {
  const start = scrollTop.value
  const change = to - start
  const startTime = performance.now()

  const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
    t /= d / 2
    if (t < 1) return (c / 2) * t * t + b
    t--
    return (-c / 2) * (t * (t - 2) - 1) + b
  }

  const animate = () => {
    const elapsed = performance.now() - startTime
    scrollbarRef.value?.setScrollTop(easeInOutQuad(elapsed, start, change, duration))
    if (elapsed < duration) requestAnimationFrame(animate)
  }

  animate()
}

// 滚动到顶部/底部
const goScroll = (type: 'top' | 'bottom') => {
  const target = type === 'top' ? 0 : innerRef.value?.scrollHeight || 0
  scrollTo(target, 800)
}

// 获取列表
const fetchList = async () => {
  loading.value = true
  try {
    const res = await jdApi.getGroupList()
    list.value = res.data.list || []
  } catch {
    // 错误已处理
  } finally {
    loading.value = false
  }
}

// 刷新
const refresh = async () => {
  await fetchList()
  ElMessage.success('刷新成功')
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped>
.markdown-content :deep(p) {
  margin: 0.5em 0;
}
.markdown-content :deep(p:first-child) {
  margin-top: 0;
}
.markdown-content :deep(p:last-child) {
  margin-bottom: 0;
}
.markdown-content :deep(a) {
  color: #e53e3e;
  text-decoration: underline;
  word-break: break-all;
}
.markdown-content :deep(a:hover) {
  color: #c53030;
}
.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  padding-left: 1.5em;
  margin: 0.5em 0;
}
.markdown-content :deep(li) {
  margin: 0.25em 0;
}
.markdown-content :deep(code) {
  background: rgba(0, 0, 0, 0.08);
  padding: 0.1em 0.3em;
  border-radius: 3px;
  font-size: 0.9em;
}
.markdown-content :deep(pre) {
  background: rgba(0, 0, 0, 0.08);
  padding: 0.75em;
  border-radius: 4px;
  overflow-x: auto;
  margin: 0.5em 0;
}
.markdown-content :deep(pre code) {
  background: none;
  padding: 0;
}
.markdown-content :deep(strong) {
  font-weight: 600;
}
.markdown-content :deep(blockquote) {
  border-left: 3px solid #e53e3e;
  padding-left: 1em;
  margin: 0.5em 0;
  color: #666;
}
</style>
