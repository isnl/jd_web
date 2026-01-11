<template>
  <div class="h-screen bg-gray-50 overflow-hidden">
    <!-- PC端布局：侧边栏 + 内容区 -->
    <div class="flex h-full">
      <!-- 侧边栏导航 (PC端显示) -->
      <aside class="hidden md:flex w-60 bg-white border-r border-gray-200 fixed left-0 top-0 h-screen flex-col z-50">
        <!-- Logo区域 -->
        <div class="h-16 flex items-center px-6 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
              <span class="text-white text-lg font-bold">京</span>
            </div>
            <span class="font-semibold text-gray-800 text-lg">东东返利</span>
          </div>
        </div>

        <!-- 导航菜单 -->
        <nav class="flex-1 py-4 px-3">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all duration-200 no-underline"
            :class="[
              $route.path === item.path
                ? 'bg-red-50 text-red-500'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            <span :class="item.icon" class="text-xl"></span>
            <span class="font-medium">{{ item.label }}</span>
          </router-link>
        </nav>

        <!-- 用户信息 -->
        <div
          v-if="jdUserStore.userInfo"
          class="border-t border-gray-100 p-4"
        >
          <div
            @click="router.push('/profile')"
            class="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition"
          >
            <div
              class="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-medium"
              :style="{ backgroundColor: getAvatarColor(jdUserStore.userInfo.nickname) }"
            >
              {{ getAvatarText(jdUserStore.userInfo.nickname) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-700 truncate">
                {{ jdUserStore.userInfo.nickname || '用户' }}
              </p>
              <p class="text-xs text-gray-400">个人中心</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- 主内容区域 -->
      <div class="flex-1 md:ml-60 h-full flex flex-col overflow-hidden">
        <!-- 顶部导航 (仅移动端显示) -->
        <header class="md:hidden bg-white shadow-sm flex-shrink-0 z-40">
          <div class="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <!-- Logo -->
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
              class="w-8 h-8 rounded-full cursor-pointer hover:ring-2 hover:ring-red-500 transition flex items-center justify-center text-white text-sm font-medium"
              :style="{ backgroundColor: getAvatarColor(jdUserStore.userInfo.nickname) }"
            >
              {{ getAvatarText(jdUserStore.userInfo.nickname) }}
            </div>
          </div>
        </header>

        <!-- 主内容区 -->
        <main class="flex-1 overflow-hidden pb-16 md:pb-0">
          <div class="h-full max-w-7xl mx-auto">
            <router-view />
          </div>
        </main>
      </div>
    </div>

    <!-- 底部导航 (仅移动端显示) -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
      <div class="max-w-4xl mx-auto flex">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex-1 py-3 flex flex-col items-center gap-1 text-xs transition no-underline"
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
  { path: '/deals', label: '好单', icon: 'i-carbon-fire' },
  { path: '/orders', label: '订单', icon: 'i-carbon-list' },
  { path: '/settlement', label: '结算', icon: 'i-carbon-currency-dollar' },
  { path: '/profile', label: '我的', icon: 'i-carbon-user-avatar' }
]

// 头像颜色列表
const avatarColors = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e'
]

// 根据昵称生成头像颜色
const getAvatarColor = (nickname?: string) => {
  if (!nickname) return avatarColors[0]
  let hash = 0
  for (let i = 0; i < nickname.length; i++) {
    hash = nickname.charCodeAt(i) + ((hash << 5) - hash)
  }
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

// 获取头像文字
const getAvatarText = (nickname?: string) => {
  if (!nickname) return '用'
  return nickname.charAt(0)
}
</script>

<style scoped>
/* 侧边栏滚动样式 */
aside {
  scrollbar-width: thin;
  scrollbar-color: #e5e7eb transparent;
}

aside::-webkit-scrollbar {
  width: 4px;
}

aside::-webkit-scrollbar-track {
  background: transparent;
}

aside::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 2px;
}
</style>
