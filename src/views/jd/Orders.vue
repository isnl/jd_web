<template>
  <div class="max-w-4xl mx-auto p-4 space-y-4">
    <!-- 月份选择和绑定订单 -->
    <div class="bg-white rounded-2xl p-5 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-medium text-gray-800">订单管理</h2>
        <button
          @click="showBindModal = true"
          class="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
        >
          绑定订单
        </button>
      </div>

      <!-- 月份选择 -->
      <div class="flex items-center gap-3">
        <button
          @click="changeMonth(-1)"
          class="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition"
        >
          <span class="i-carbon-chevron-left"></span>
        </button>
        <span class="text-gray-800 font-medium">{{ currentMonth }}</span>
        <button
          @click="changeMonth(1)"
          :disabled="isCurrentMonth"
          class="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <span class="i-carbon-chevron-right"></span>
        </button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div v-if="summary" class="grid grid-cols-2 gap-3">
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <div class="text-xs text-gray-500 mb-1">预估佣金</div>
        <div class="text-xl font-bold text-red-500">¥{{ summary.totalEstimateFee.toFixed(2) }}</div>
      </div>
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <div class="text-xs text-gray-500 mb-1">实际佣金</div>
        <div class="text-xl font-bold text-green-500">¥{{ summary.totalActualFee.toFixed(2) }}</div>
      </div>
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <div class="text-xs text-gray-500 mb-1">已结算</div>
        <div class="text-lg font-medium text-gray-800">{{ summary.settledCount }} 单</div>
      </div>
      <div class="bg-white rounded-xl p-4 shadow-sm">
        <div class="text-xs text-gray-500 mb-1">待结算</div>
        <div class="text-lg font-medium text-gray-800">{{ summary.unsettledCount }} 单</div>
      </div>
    </div>

    <!-- 申请提现按钮 -->
    <div v-if="summary && canApplyWithdraw" class="bg-white rounded-2xl p-5 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-sm text-gray-600">可提现金额</div>
          <div class="text-xl font-bold text-red-500">¥{{ summary.totalActualFee.toFixed(2) }}</div>
        </div>
        <button
          v-if="!summary.hasApplied"
          @click="handleApplyWithdraw"
          :disabled="applyLoading"
          class="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 disabled:bg-gray-300 transition"
        >
          {{ applyLoading ? '申请中...' : '申请提现' }}
        </button>
        <span v-else class="text-sm text-green-500">已申请</span>
      </div>
    </div>

    <!-- 订单列表 -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div class="p-4 border-b border-gray-100">
        <h3 class="font-medium text-gray-800">订单列表</h3>
      </div>

      <div v-if="loading" class="p-8 text-center text-gray-500">
        <span class="i-carbon-loading animate-spin text-2xl"></span>
        <p class="mt-2">加载中...</p>
      </div>

      <div v-else-if="orders.length === 0" class="p-8 text-center text-gray-500">
        <span class="i-carbon-document text-4xl mb-2"></span>
        <p>暂无订单数据</p>
      </div>

      <div v-else class="divide-y divide-gray-100">
        <div v-for="order in orders" :key="order._id" class="p-4">
          <div class="flex items-start justify-between mb-2">
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-800 truncate">{{ order.skuName }}</div>
              <div class="text-xs text-gray-500 mt-1">订单号: {{ order.orderId }}</div>
            </div>
            <span
              :class="getStatusClass(order.validCode)"
              class="text-xs px-2 py-1 rounded-full ml-2 flex-shrink-0"
            >
              {{ getStatusText(order.validCode) }}
            </span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500">数量: {{ order.skuNum }}</span>
            <span class="text-red-500 font-medium">¥{{ order.estimateFee.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="total > pageSize" class="p-4 border-t border-gray-100 flex justify-center">
        <el-pagination
          v-model:current-page="page"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
          @current-change="fetchOrders"
        />
      </div>
    </div>

    <!-- 绑定订单弹窗 -->
    <el-dialog v-model="showBindModal" title="绑定订单" width="90%" max-width="400px">
      <div class="space-y-4">
        <textarea
          v-model="bindOrderIds"
          placeholder="请输入订单号，多个订单号用换行分隔"
          rows="5"
          class="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-red-500 transition"
        ></textarea>
        <p class="text-xs text-gray-500">订单完成后14天内可绑定</p>
      </div>
      <template #footer>
        <button
          @click="showBindModal = false"
          class="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
        >
          取消
        </button>
        <button
          @click="handleBindOrders"
          :disabled="bindLoading || !bindOrderIds.trim()"
          class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 transition ml-2"
        >
          {{ bindLoading ? '绑定中...' : '确定绑定' }}
        </button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { orderApi, paymentApi } from '@/service/api'
import type { OrderItem, OrderSummary } from '@/service/api'

const loading = ref(false)
const orders = ref<OrderItem[]>([])
const summary = ref<OrderSummary | null>(null)
const total = ref(0)
const page = ref(1)
const pageSize = 10

// 月份相关
const currentDate = ref(new Date())
const currentMonth = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = String(currentDate.value.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
})

const isCurrentMonth = computed(() => {
  const now = new Date()
  return (
    currentDate.value.getFullYear() === now.getFullYear() &&
    currentDate.value.getMonth() === now.getMonth()
  )
})

const canApplyWithdraw = computed(() => {
  if (!summary.value) return false
  const now = new Date()
  const [year, month] = currentMonth.value.split('-').map(Number)

  // 次月21号之后可提现
  if (now.getFullYear() > year) return true
  if (now.getFullYear() === year && now.getMonth() + 1 > month) {
    if (now.getMonth() + 1 === month + 1) {
      return now.getDate() >= 21
    }
    return true
  }
  return false
})

const changeMonth = (delta: number) => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + delta)
  currentDate.value = newDate
  page.value = 1
  fetchOrders()
}

// 获取订单
const fetchOrders = async () => {
  loading.value = true
  try {
    const res = await orderApi.getOrders({
      monthDate: currentMonth.value,
      page: page.value,
      pageSize
    })
    orders.value = res.data.list
    total.value = res.data.total
    summary.value = res.data.summary
  } catch (error) {
    // 错误已处理
  } finally {
    loading.value = false
  }
}

// 绑定订单
const showBindModal = ref(false)
const bindOrderIds = ref('')
const bindLoading = ref(false)

const handleBindOrders = async () => {
  const ids = bindOrderIds.value
    .split('\n')
    .map(id => id.trim())
    .filter(id => id)

  if (ids.length === 0) return

  bindLoading.value = true
  try {
    await orderApi.bindOrders(ids)
    ElMessage.success('绑定成功')
    showBindModal.value = false
    bindOrderIds.value = ''
    fetchOrders()
  } catch (error) {
    // 错误已处理
  } finally {
    bindLoading.value = false
  }
}

// 申请提现
const applyLoading = ref(false)
const handleApplyWithdraw = async () => {
  applyLoading.value = true
  try {
    const res = await paymentApi.applyWithdraw(currentMonth.value)
    ElMessage.success(`提现申请成功，金额: ¥${res.data.totalAmount}`)
    fetchOrders()
  } catch (error) {
    // 错误已处理
  } finally {
    applyLoading.value = false
  }
}

// 订单状态
const getStatusText = (validCode: number) => {
  return validCode === 17 ? '已结算' : '待结算'
}

const getStatusClass = (validCode: number) => {
  return validCode === 17
    ? 'bg-green-100 text-green-600'
    : 'bg-yellow-100 text-yellow-600'
}

onMounted(() => {
  fetchOrders()
})
</script>
