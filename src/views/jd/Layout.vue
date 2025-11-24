<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航 -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <span class="text-white text-sm font-bold">京</span>
          </div>
          <span class="font-medium text-gray-800">东东返利</span>
        </div>

        <!-- 用户头像 -->
        <div
          v-if="jdUserStore.userInfo"
          @click="router.push('/profile')"
          class="w-8 h-8 rounded-full bg-gray-200 overflow-hidden cursor-pointer hover:ring-2 hover:ring-red-500 transition"
        >
          <img
            v-if="jdUserStore.userInfo.avatar"
            :src="jdUserStore.userInfo.avatar"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
            <span class="i-carbon-user text-sm"></span>
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="pb-20">
      <router-view />
    </main>

    <!-- 底部导航 -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
      <div class="max-w-4xl mx-auto flex">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex-1 py-3 flex flex-col items-center gap-1 text-xs transition"
          :class="[
            $route.path === item.path ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'
          ]"
        >
          <span :class="item.icon" class="text-xl"></span>
          <span>{{ item.label }}</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useJdUserStore } from '@/stores/jdUser'

const router = useRouter()
const jdUserStore = useJdUserStore()

const navItems = [
  { path: '/convert', label: '转链', icon: 'i-carbon-link' },
  { path: '/orders', label: '订单', icon: 'i-carbon-list' },
  { path: '/settlement', label: '结算', icon: 'i-carbon-currency-dollar' },
  { path: '/profile', label: '我的', icon: 'i-carbon-user-avatar' }
]
</script>
