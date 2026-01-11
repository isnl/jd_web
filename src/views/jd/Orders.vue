<template>
  <div class="h-full flex flex-col overflow-hidden">
    <!-- 固定头部区域 -->
    <div class="flex-shrink-0 p-4 md:p-6 space-y-4 md:space-y-6">
      <!-- 月份选择和绑定订单 -->
      <div class="bg-white rounded-2xl p-4 md:p-5 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800">订单管理</h2>
          <button
            @click="showBindModal = true"
            class="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-sm hover:shadow-md flex items-center gap-1.5"
          >
            <span class="i-carbon-add"></span>
            绑定订单
          </button>
        </div>

        <!-- 月份选择 -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1">
            <button
              @click="changeMonth(-1)"
              class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all"
            >
              <span class="i-carbon-chevron-left"></span>
            </button>
            <!-- 点击月份展开快速选择 -->
            <div class="relative month-picker-container">
              <button
                @click="toggleMonthPicker"
                class="h-8 flex items-center gap-2 px-2 rounded-lg hover:bg-gray-100 transition-all"
              >
                <span class="text-gray-800 font-semibold">{{ currentMonth }}</span>
                <span
                  :class="[
                    'text-xs px-1.5 py-0.5 rounded-md font-medium',
                    isCurrentMonth ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                  ]"
                >
                  {{ isCurrentMonth ? '本月' : '历史' }}
                </span>
              </button>
              <!-- 月份快速选择下拉 -->
              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 scale-95 -translate-y-2"
                enter-to-class="opacity-100 scale-100 translate-y-0"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 scale-100 translate-y-0"
                leave-to-class="opacity-0 scale-95 -translate-y-2"
              >
                <div
                  v-if="showMonthPicker"
                  class="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white rounded-2xl shadow-xl border border-gray-100/80 p-4 z-50 min-w-[280px]"
                >
                  <!-- 年份切换 -->
                  <div class="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
                    <button
                      @click="pickerYear--"
                      class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                    >
                      <span class="i-carbon-chevron-left"></span>
                    </button>
                    <span class="text-base font-semibold text-gray-800">{{ pickerYear }} 年</span>
                    <button
                      @click="pickerYear++"
                      :disabled="pickerYear >= new Date().getFullYear()"
                      class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all"
                    >
                      <span class="i-carbon-chevron-right"></span>
                    </button>
                  </div>
                  <!-- 月份网格 -->
                  <div class="grid grid-cols-4 gap-2">
                    <button
                      v-for="m in 12"
                      :key="m"
                      @click="selectMonthFromPicker(m)"
                      :disabled="isMonthDisabled(m)"
                      :class="[
                        'relative h-9 text-sm rounded-xl transition-all duration-200 font-medium',
                        isSelectedMonth(m)
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md shadow-red-200'
                          : isMonthDisabled(m)
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                      ]"
                    >
                      {{ m }}月
                      <span
                        v-if="isCurrentMonthIndicator(m)"
                        class="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-blue-500 rounded-full"
                      ></span>
                    </button>
                  </div>
                  <!-- 快捷操作 -->
                  <div class="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button
                      @click="selectQuickMonth('current')"
                      class="flex-1 py-2 text-xs font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      本月
                    </button>
                    <button
                      @click="selectQuickMonth('last')"
                      class="flex-1 py-2 text-xs font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      上月
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
            <button
              @click="changeMonth(1)"
              :disabled="isCurrentMonth"
              class="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
              :class="
                isCurrentMonth
                  ? 'text-gray-300 bg-gray-50 cursor-not-allowed'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              "
            >
              <span class="i-carbon-chevron-right"></span>
            </button>
          </div>
          <button
            @click="handleRefreshOrders"
            :disabled="refreshLoading || !canRefreshOrders"
            :title="!canRefreshOrders ? '当前月份已申请结算或无订单数据' : '同步订单最新状态'"
            class="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
          >
            <span
              :class="[refreshLoading ? 'i-carbon-loading animate-spin' : 'i-carbon-renew', 'w-4 h-4 inline-block']"
            ></span>
            <span>{{ refreshLoading ? '同步中...' : '批量同步订单状态' }}</span>
          </button>
        </div>
      </div>

      <!-- 统计卡片骨架屏 -->
      <div v-if="summaryLoading" class="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        <div
          v-for="i in 5"
          :key="i"
          class="bg-white rounded-xl p-3 md:p-4 shadow-sm"
          :class="i === 5 ? 'col-span-2 md:col-span-1' : ''"
        >
          <div class="h-3 w-12 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div class="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      <!-- 统计卡片 -->
      <div v-else-if="summary" class="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        <!-- 预估佣金 -->
        <div
          class="relative bg-white rounded-xl p-3 md:p-4 shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
        >
          <div
            class="absolute -right-3 -bottom-3 w-16 h-16 md:w-20 md:h-20 opacity-[0.08] group-hover:opacity-[0.12] transition-opacity"
          >
            <span class="i-carbon-calculator text-red-500 w-full h-full block"></span>
          </div>
          <div class="relative z-10">
            <div class="text-xs text-gray-500 mb-1">预估佣金</div>
            <div class="text-lg md:text-xl font-bold text-red-500">
              ¥{{ summary.totalEstimateFee.toFixed(2) }}
            </div>
          </div>
        </div>
        <!-- 实际佣金 -->
        <div
          class="relative bg-white rounded-xl p-3 md:p-4 shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
        >
          <div
            class="absolute -right-3 -bottom-3 w-16 h-16 md:w-20 md:h-20 opacity-[0.08] group-hover:opacity-[0.12] transition-opacity"
          >
            <span class="i-carbon-piggy-bank text-green-500 w-full h-full block"></span>
          </div>
          <div class="relative z-10">
            <div class="text-xs text-gray-500 mb-1">实际佣金</div>
            <div class="text-lg md:text-xl font-bold text-green-500">
              ¥{{ summary.totalActualFee.toFixed(2) }}
            </div>
          </div>
        </div>
        <!-- 已完成 -->
        <div
          class="relative bg-white rounded-xl p-3 md:p-4 shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
        >
          <div
            class="absolute -right-3 -bottom-3 w-16 h-16 md:w-20 md:h-20 opacity-[0.08] group-hover:opacity-[0.12] transition-opacity"
          >
            <span class="i-carbon-checkmark-filled text-blue-500 w-full h-full block"></span>
          </div>
          <div class="relative z-10">
            <div class="text-xs text-gray-500 mb-1">已完成</div>
            <div class="text-base md:text-lg font-medium text-gray-800">
              {{ summary.settledCount }} 单
            </div>
          </div>
        </div>
        <!-- 待结算 -->
        <div
          class="relative bg-white rounded-xl p-3 md:p-4 shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
        >
          <div
            class="absolute -right-3 -bottom-3 w-16 h-16 md:w-20 md:h-20 opacity-[0.08] group-hover:opacity-[0.12] transition-opacity"
          >
            <span class="i-carbon-time text-amber-500 w-full h-full block"></span>
          </div>
          <div class="relative z-10">
            <div class="text-xs text-gray-500 mb-1">待结算</div>
            <div class="text-base md:text-lg font-medium text-gray-800">
              {{ summary.unsettledCount }} 单
            </div>
          </div>
        </div>
        <!-- 异常订单 -->
        <div
          class="relative bg-white rounded-xl p-3 md:p-4 shadow-sm overflow-hidden group hover:shadow-md transition-shadow col-span-2 md:col-span-1"
        >
          <div
            class="absolute -right-3 -bottom-3 w-16 h-16 md:w-20 md:h-20 opacity-[0.08] group-hover:opacity-[0.12] transition-opacity"
          >
            <span class="i-carbon-warning-alt text-orange-500 w-full h-full block"></span>
          </div>
          <div class="relative z-10">
            <div class="text-xs text-gray-500 mb-1">异常订单</div>
            <div class="text-base md:text-lg font-medium text-gray-800">
              {{ summary.abnormalCount }} 单
            </div>
          </div>
        </div>
      </div>

      <!-- 申请提现按钮 -->
      <div v-if="summary && canApplyWithdraw" class="bg-white rounded-2xl p-4 md:p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm text-gray-600">可提现金额</div>
            <div class="text-xl font-bold text-red-500">
              ¥{{ summary.totalActualFee.toFixed(2) }}
            </div>
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
    </div>

    <!-- 订单列表（可滚动） -->
    <div class="flex-1 overflow-hidden px-4 md:px-6 pb-4 md:pb-6">
      <div class="bg-white rounded-2xl shadow-sm h-full flex flex-col overflow-hidden">
        <!-- 订单列表头部 -->
        <div
          class="flex-shrink-0 p-3 md:p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0"
        >
          <h3 class="font-medium text-gray-800">订单列表</h3>
          <!-- 状态筛选 -->
          <div class="flex items-center gap-1.5 md:gap-2 overflow-x-auto">
            <button
              v-for="item in statusOptions"
              :key="item.value"
              @click="handleStatusChange(item.value)"
              :class="[
                'px-2 md:px-3 py-1 text-xs rounded-full transition whitespace-nowrap',
                statusFilter === item.value
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              {{ item.label }}
            </button>
          </div>
        </div>

        <!-- 订单内容区域 -->
        <el-scrollbar class="flex-1">
          <!-- 订单列表骨架屏 -->
          <div v-if="loading" class="p-2 md:p-4 space-y-3">
            <div
              v-for="i in 5"
              :key="i"
              class="p-3 md:p-4 border-b border-gray-100 last:border-b-0"
            >
              <!-- 标题和状态 -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <div class="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div class="h-3 w-1/2 bg-gray-100 rounded animate-pulse"></div>
                </div>
                <div class="h-5 w-14 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <!-- 详情行 -->
              <div class="flex gap-4 mb-2">
                <div class="h-3 w-16 bg-gray-100 rounded animate-pulse"></div>
                <div class="h-3 w-20 bg-gray-100 rounded animate-pulse"></div>
              </div>
              <!-- 底部信息 -->
              <div class="flex items-center justify-between">
                <div class="h-3 w-32 bg-gray-100 rounded animate-pulse"></div>
                <div class="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          <div v-else-if="orders.length === 0" class="p-8 text-center text-gray-500">
            <span class="i-carbon-document text-4xl mb-2"></span>
            <p>暂无订单数据</p>
          </div>

          <div v-else class="p-2 md:p-4">
            <div
              v-for="order in orders"
              :key="order._id"
              :class="[
                'p-3 md:p-4 border-b border-gray-100 last:border-b-0 transition-colors duration-200 cursor-pointer',
                isInvalidOrder(order.validCode) ? 'bg-gray-100 opacity-60' : 'hover:bg-gray-50'
              ]"
            >
              <div class="flex items-start justify-between mb-2 gap-2">
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-gray-800 line-clamp-2 md:truncate">
                    {{ order.skuName }}
                  </div>
                  <div class="flex items-center gap-1 mt-1">
                    <span class="text-xs text-gray-500 truncate">订单号: {{ order.orderId }}</span>
                    <button
                      @click.stop="copyOrderId(order.orderId)"
                      class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors flex-shrink-0"
                      title="复制订单号"
                    >
                      <span class="i-carbon-copy text-sm"></span>
                    </button>
                  </div>
                  <div v-if="order.parentId" class="flex items-center gap-1 mt-0.5">
                    <span class="text-xs text-gray-400 truncate">主单号: {{ order.parentId }}</span>
                    <button
                      @click.stop="copyOrderId(String(order.parentId))"
                      class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors flex-shrink-0"
                      title="复制主单号"
                    >
                      <span class="i-carbon-copy text-sm"></span>
                    </button>
                  </div>
                </div>
                <div
                  class="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2 flex-shrink-0"
                >
                  <span
                    v-if="order.skuReturnNum && order.skuReturnNum > 0"
                    class="text-xs px-2 py-0.5 md:py-1 rounded-full bg-orange-100 text-orange-600"
                  >
                    有退货
                  </span>
                  <span
                    v-if="order.skuFrozenNum && order.skuFrozenNum > 0"
                    class="text-xs px-2 py-0.5 md:py-1 rounded-full bg-purple-100 text-purple-600"
                  >
                    有售后
                  </span>
                  <span
                    v-if="order.plus"
                    class="text-xs px-2 py-0.5 md:py-1 rounded-full bg-yellow-100 text-yellow-600"
                  >
                    Plus会员
                  </span>
                  <span
                    :class="getStatusClass(order.validCode)"
                    class="text-xs px-2 py-0.5 md:py-1 rounded-full whitespace-nowrap"
                  >
                    {{ getStatusText(order.validCode) }}
                  </span>
                </div>
              </div>

              <div
                class="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2 text-xs text-gray-500 mb-2"
              >
                <span>数量: {{ order.skuNum }}</span>
                <span>单价: ¥{{ order.price?.toFixed(2) || '0.00' }}</span>
                <span v-if="order.skuReturnNum">已退货: {{ order.skuReturnNum }}</span>
                <span v-if="order.proPriceAmount"
                  >价保: ¥{{ order.proPriceAmount.toFixed(2) }}</span
                >
              </div>

              <div
                class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 text-xs text-gray-400 mb-2"
              >
                <div class="flex flex-wrap gap-x-3 gap-y-1">
                  <span v-if="order.orderTime"
                    >下单时间: {{ formatDateTime(order.orderTime) }}</span
                  >
                  <span v-if="order.validCode === 17 && order.finishTime"
                    >订单完成时间: {{ formatDateTime(order.finishTime) }}</span
                  >
                </div>
                <span class="text-red-500 font-medium text-sm"
                  >¥{{ order.actualFee.toFixed(2) }}</span
                >
              </div>

              <!-- 数据时间（与订单时间分开） -->
              <div
                class="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-300 pt-2 border-t border-gray-50"
              >
                <span v-if="order.createdAt">数据创建: {{ formatDateTime(order.createdAt) }}</span>
                <span v-if="order.updatedAt">数据更新: {{ formatDateTime(order.updatedAt) }}</span>
              </div>
            </div>
          </div>
        </el-scrollbar>

        <!-- 分页 -->
        <div v-if="total > 0" class="flex-shrink-0 p-3 md:p-4 border-t border-gray-100">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="text-sm text-gray-500">
              共 <span class="font-medium text-red-500">{{ total }}</span> 条数据
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="handlePageChange(page - 1)"
                :disabled="page <= 1"
                class="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-50 disabled:hover:text-gray-600 transition"
              >
                <span class="i-carbon-chevron-left"></span>
              </button>
              <div class="flex items-center gap-1">
                <template v-for="p in visiblePages" :key="p">
                  <span
                    v-if="p === '...'"
                    class="w-8 h-8 flex items-center justify-center text-gray-400"
                    >...</span
                  >
                  <button
                    v-else
                    @click="handlePageChange(p as number)"
                    :class="[
                      'w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition',
                      page === p
                        ? 'bg-red-500 text-white shadow-sm'
                        : 'bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-500'
                    ]"
                  >
                    {{ p }}
                  </button>
                </template>
              </div>
              <button
                @click="handlePageChange(page + 1)"
                :disabled="page >= totalPages"
                class="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-50 disabled:hover:text-gray-600 transition"
              >
                <span class="i-carbon-chevron-right"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 绑定订单弹窗 -->
    <el-dialog
      v-model="showBindModal"
      title="绑定订单"
      width="90%"
      class="max-w-[400px]"
      :align-center="true"
      :show-close="false"
      @opened="bindInputRef?.focus()"
      @close="bindOrderId = ''"
    >
      <div class="space-y-4">
        <input
          ref="bindInputRef"
          v-model="bindOrderId"
          placeholder="请输入订单号"
          class="w-full px-4 py-3 bg-gray-50 rounded-md text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
        />
        <p class="text-xs text-gray-500">订单完成后14天内可绑定</p>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <button
            @click="showBindModal = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 transition rounded-md"
          >
            取消
          </button>
          <button
            @click="handleBindOrder"
            :disabled="bindLoading || !bindOrderId.trim()"
            class="px-4 py-2 bg-red-500 text-white rounded-md disabled:bg-gray-300 transition"
            :class="bindLoading || !bindOrderId.trim() ? '' : 'hover:bg-red-600'"
          >
            {{ bindLoading ? '绑定中...' : '确定绑定' }}
          </button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { orderApi, paymentApi } from '@/service/api'
import type { OrderItem, OrderSummary, OrderListParams } from '@/service/api'

const loading = ref(false)
const summaryLoading = ref(false)
const orders = ref<OrderItem[]>([])
const summary = ref<OrderSummary | null>(null)
const total = ref(0)
const page = ref(1)
const pageSize = 10

// 分页相关
const totalPages = computed(() => Math.ceil(total.value / pageSize))

const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const tp = totalPages.value

  if (tp <= 5) {
    for (let i = 1; i <= tp; i++) pages.push(i)
  } else {
    if (page.value <= 3) {
      pages.push(1, 2, 3, 4, '...', tp)
    } else if (page.value >= tp - 2) {
      pages.push(1, '...', tp - 3, tp - 2, tp - 1, tp)
    } else {
      pages.push(1, '...', page.value - 1, page.value, page.value + 1, '...', tp)
    }
  }
  return pages
})

const handlePageChange = (newPage: number) => {
  if (newPage < 1 || newPage > totalPages.value || newPage === page.value) return
  page.value = newPage
  fetchOrders()
}

// 状态筛选
type StatusType = OrderListParams['status']
const statusFilter = ref<StatusType>(undefined)
const statusOptions = [
  { label: '全部', value: undefined as StatusType },
  { label: '已完成', value: 'completed' as StatusType },
  { label: '已付款', value: 'paid' as StatusType },
  { label: '异常', value: 'abnormal' as StatusType }
]

const handleStatusChange = (status: StatusType) => {
  statusFilter.value = status
  page.value = 1
  fetchOrders()
}

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

// 是否可以刷新订单：有订单数据且未申请结算
const canRefreshOrders = computed(() => {
  if (!summary.value) return false
  // 已申请结算则不能刷新
  if (summary.value.hasApplied) return false
  // 有订单数据才能刷新
  return summary.value.settledCount + summary.value.unsettledCount + summary.value.abnormalCount > 0
})

const changeMonth = (delta: number) => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + delta)
  currentDate.value = newDate
  page.value = 1
  statusFilter.value = undefined
  fetchData()
}

// 月份快速选择
const showMonthPicker = ref(false)
const pickerYear = ref(new Date().getFullYear())

// 切换选择器显示状态，打开时同步当前年份
const toggleMonthPicker = () => {
  if (!showMonthPicker.value) {
    pickerYear.value = currentDate.value.getFullYear()
  }
  showMonthPicker.value = !showMonthPicker.value
}

// 判断月份是否禁用（不能选择未来月份）
const isMonthDisabled = (month: number) => {
  const now = new Date()
  if (pickerYear.value > now.getFullYear()) return true
  if (pickerYear.value === now.getFullYear() && month > now.getMonth() + 1) return true
  return false
}

// 判断是否为当前选中的月份
const isSelectedMonth = (month: number) => {
  return (
    pickerYear.value === currentDate.value.getFullYear() &&
    month === currentDate.value.getMonth() + 1
  )
}

// 判断是否为"今天"所在的月份（用于显示小圆点指示器）
const isCurrentMonthIndicator = (month: number) => {
  const now = new Date()
  return pickerYear.value === now.getFullYear() && month === now.getMonth() + 1
}

// 从选择器选择月份
const selectMonthFromPicker = (month: number) => {
  if (isMonthDisabled(month)) return
  currentDate.value = new Date(pickerYear.value, month - 1, 1)
  page.value = 1
  statusFilter.value = undefined
  showMonthPicker.value = false
  fetchData()
}

// 快捷选择
const selectQuickMonth = (type: 'current' | 'last') => {
  const now = new Date()
  let targetDate: Date

  if (type === 'current') {
    targetDate = new Date(now.getFullYear(), now.getMonth(), 1)
  } else {
    targetDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  }

  currentDate.value = targetDate
  page.value = 1
  statusFilter.value = undefined
  showMonthPicker.value = false
  fetchData()
}

// 点击外部关闭月份选择器
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (showMonthPicker.value && !target.closest('.month-picker-container')) {
    showMonthPicker.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  fetchData()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 获取订单汇总
const fetchSummary = async () => {
  summaryLoading.value = true
  try {
    const res = await orderApi.getSummary(currentMonth.value)
    summary.value = res.data
  } catch {
    // 错误已处理
  } finally {
    summaryLoading.value = false
  }
}

// 获取订单列表
const fetchOrders = async () => {
  loading.value = true
  try {
    const params: OrderListParams = {
      monthDate: currentMonth.value,
      page: page.value,
      pageSize
    }
    if (statusFilter.value) {
      params.status = statusFilter.value
    }
    const res = await orderApi.getOrders(params)
    orders.value = res.data.list
    total.value = res.data.total
  } catch {
    // 错误已处理
  } finally {
    loading.value = false
  }
}

// 获取所有数据
const fetchData = () => {
  fetchSummary()
  fetchOrders()
}

// 绑定订单
const showBindModal = ref(false)
const bindOrderId = ref('')
const bindLoading = ref(false)
const bindInputRef = ref<HTMLInputElement | null>(null)

// 刷新订单状态
const refreshLoading = ref(false)
const handleRefreshOrders = async () => {
  refreshLoading.value = true
  try {
    const res = await orderApi.refreshOrders(currentMonth.value)
    ElMessage.success(res.data.message || '刷新完成')
    // 刷新完成后重新获取数据
    fetchData()
  } catch {
    // 错误已处理
  } finally {
    refreshLoading.value = false
  }
}

const handleBindOrder = async () => {
  const orderId = bindOrderId.value.trim()
  if (!orderId) return

  bindLoading.value = true
  try {
    await orderApi.bindOrder(orderId)
    ElMessage.success('订单绑定成功')
    showBindModal.value = false
    bindOrderId.value = ''
    fetchData()
  } catch {
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
    fetchSummary()
  } catch {
    // 错误已处理
  } finally {
    applyLoading.value = false
  }
}

// 订单状态映射
const validCodeMap: Record<number, string> = {
  [-1]: '未知',
  2: '无效-拆单',
  3: '无效-取消',
  4: '无效-京东帮帮主订单',
  5: '无效-账号异常',
  6: '无效-赠品类目不返佣',
  7: '无效-校园订单',
  8: '无效-企业订单',
  9: '无效-团购订单',
  11: '无效-乡村推广员下单',
  13: '违规订单-其他',
  14: '无效-来源与备案网址不符',
  15: '待付款',
  16: '已付款',
  17: '已完成',
  19: '无效-佣金比例为0',
  20: '无效-首购订单无效',
  21: '无效-云店订单',
  22: '无效-PLUS会员佣金比例为0',
  23: '无效-支付有礼',
  24: '已付定金',
  25: '违规订单-流量劫持',
  26: '违规订单-流量异常',
  27: '违规订单-违反平台规则',
  28: '违规订单-多笔交易异常',
  29: '无效-跨屏跨店',
  30: '无效-累计件数超出类目上限',
  31: '无效-黑名单sku',
  33: '超市卡充值订单',
  34: '无效-推卡订单无效',
  35: '无效-非CID订单',
  36: '违规订单-账户绑定有误'
}

const getStatusText = (validCode: number) => {
  return validCodeMap[validCode] || `未知(${validCode})`
}

const getStatusClass = (validCode: number) => {
  if (validCode === 17) return 'bg-green-100 text-green-600'
  if (validCode === 15 || validCode === 16 || validCode === 24)
    return 'bg-yellow-100 text-yellow-600'
  if (validCode >= 2 && validCode <= 14) return 'bg-red-100 text-red-600'
  if (validCode >= 19 && validCode <= 36) return 'bg-red-100 text-red-600'
  return 'bg-gray-100 text-gray-600'
}

// 判断是否为无效订单（拆单或取消）
const isInvalidOrder = (validCode: number) => {
  return validCode === 2 || validCode === 3
}

// 复制订单号
const copyOrderId = async (orderId: string) => {
  try {
    await navigator.clipboard.writeText(orderId)
    ElMessage.success('订单号已复制')
  } catch {
    ElMessage.error('复制失败')
  }
}

// 格式化完整日期时间（YYYY-MM-DD HH:mm:ss）
const formatDateTime = (time: string) => {
  if (!time) return ''
  const date = new Date(time)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
</script>
