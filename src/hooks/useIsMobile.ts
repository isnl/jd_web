import { ref, onMounted, onUnmounted, computed } from 'vue'

// 移动端断点宽度 (768px 以下视为移动端)
const MOBILE_BREAKPOINT = 768

export default function useIsMobile() {
  const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
  const isMobileDevice = ref(false)

  // 基于屏幕宽度判断是否为移动端视图
  const isMobile = computed(() => windowWidth.value < MOBILE_BREAKPOINT)

  // 是否为平板视图 (768px - 1024px)
  const isTablet = computed(() => windowWidth.value >= 768 && windowWidth.value < 1024)

  // 是否为桌面视图 (1024px 以上)
  const isDesktop = computed(() => windowWidth.value >= 1024)

  const handleResize = () => {
    windowWidth.value = window.innerWidth
  }

  const checkMobileDevice = () => {
    const userAgentInfo = navigator.userAgent
    const mobileAgents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
    isMobileDevice.value = mobileAgents.some(agent => userAgentInfo.includes(agent))
  }

  onMounted(() => {
    checkMobileDevice()
    handleResize()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return {
    isMobile,       // 响应式：基于屏幕宽度
    isTablet,       // 响应式：平板尺寸
    isDesktop,      // 响应式：桌面尺寸
    isMobileDevice, // 是否为移动设备（基于 UA）
    windowWidth     // 当前窗口宽度
  }
}
