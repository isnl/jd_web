<template>
  <div class="p-4 md:p-6 space-y-4 md:space-y-6">
    <!-- 标题 -->
    <div class="bg-white rounded-2xl p-5 shadow-sm">
      <h2 class="text-lg font-medium text-gray-800">结算记录</h2>
      <p class="text-sm text-gray-500 mt-1">次月21号后可申请上月佣金提现</p>
    </div>

    <!-- 结算记录列表 -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-gray-500">
        <span class="i-carbon-loading animate-spin text-2xl"></span>
        <p class="mt-2">加载中...</p>
      </div>

      <div v-else-if="records.length === 0" class="p-8 text-center text-gray-500">
        <span class="i-carbon-document text-4xl mb-2"></span>
        <p>暂无结算记录</p>
      </div>

      <div v-else class="divide-y divide-gray-100">
        <div v-for="record in records" :key="record._id" class="p-4">
          <div class="flex items-start justify-between mb-2">
            <div>
              <div class="text-sm font-medium text-gray-800">{{ record.monthDate }} 月份</div>
              <div class="text-xs text-gray-500 mt-1">
                申请时间: {{ formatDate(record.createdAt) }}
              </div>
            </div>
            <span :class="getStatusClass(record.status)" class="text-xs px-2 py-1 rounded-full">
              {{ getStatusText(record.status) }}
            </span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-500">结算金额</span>
            <span class="text-xl font-bold text-red-500">¥{{ record.totalAmount.toFixed(2) }}</span>
          </div>

          <!-- 失败原因 -->
          <div v-if="record.status === 2 && record.failReason" class="mt-2">
            <div class="text-xs text-red-500 bg-red-50 rounded-lg p-2">
              {{ record.failReason }}
            </div>
          </div>

          <!-- 更新时间 -->
          <div v-if="record.status !== 0" class="mt-2 text-xs text-gray-400">
            更新时间: {{ formatDate(record.updatedAt) }}
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
          @current-change="fetchRecords"
        />
      </div>
    </div>

    <!-- 提现说明 -->
    <div class="bg-white rounded-2xl p-5 shadow-sm">
      <h3 class="font-medium text-gray-800 mb-3">提现说明</h3>
      <ul class="space-y-2 text-sm text-gray-600">
        <li class="flex items-start gap-2">
          <span class="i-carbon-checkmark-outline text-red-500 mt-0.5 flex-shrink-0"></span>
          <span>每月21号之后可申请上月佣金提现</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="i-carbon-checkmark-outline text-red-500 mt-0.5 flex-shrink-0"></span>
          <span>申请提现前需完善个人信息（昵称、手机号、收款码）</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="i-carbon-checkmark-outline text-red-500 mt-0.5 flex-shrink-0"></span>
          <span>只有已结算订单（validCode=17）才计入提现金额</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="i-carbon-checkmark-outline text-red-500 mt-0.5 flex-shrink-0"></span>
          <span>提现申请提交后，将由管理员审核并打款</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { paymentApi } from '@/service/api'
import type { PaymentRecord } from '@/service/api'

const loading = ref(false)
const records = ref<PaymentRecord[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = 10

const fetchRecords = async () => {
  loading.value = true
  try {
    const res = await paymentApi.getRecords({ page: page.value, pageSize })
    records.value = res.data.list
    total.value = res.data.total
  } catch (error) {
    // 错误已处理
  } finally {
    loading.value = false
  }
}

const getStatusText = (status: number) => {
  const map: Record<number, string> = {
    0: '待结算',
    1: '已结算',
    2: '结算失败'
  }
  return map[status] || '未知'
}

const getStatusClass = (status: number) => {
  const map: Record<number, string> = {
    0: 'bg-yellow-100 text-yellow-600',
    1: 'bg-green-100 text-green-600',
    2: 'bg-red-100 text-red-600'
  }
  return map[status] || 'bg-gray-100 text-gray-600'
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

onMounted(() => {
  fetchRecords()
})
</script>
