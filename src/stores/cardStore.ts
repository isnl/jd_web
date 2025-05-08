import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 卡片模板接口
export interface CardTemplate {
  id: number
  name: string
  layout: string
  fontFamily: string
  fontSize: number
  textColor: string
  backgroundColor: string
  gradientType: string
  borderRadius: number
}

// 渐变背景接口
export interface GradientBackground {
  id: number
  name: string
  colors: string[]
  direction: string
}

// 贴纸元素接口
export interface Sticker {
  id: number
  type: string
  url: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
}

export const useCardStore = defineStore(
  'card',
  () => {
    // 文本内容
    const text = ref('')

    // 画布尺寸（默认为常见社交媒体比例 1080x1920）
    const canvasWidth = ref(1080)
    const canvasHeight = ref(1920)

    // 当前选中的模板索引
    const selectedTemplateIndex = ref(0)

    // 当前模板的字体设置
    const fontFamily = ref('SimHei, sans-serif')
    const fontSize = ref(36)
    const fontWeight = ref(400)
    const textColor = ref('#333333')
    const textAlign = ref('center')

    // 渐变背景设置
    const backgroundType = ref('gradient') // 'solid', 'gradient', 'image'
    const backgroundColor = ref('#ffffff')
    const gradientColors = ref(['#4158D0', '#C850C0', '#FFCC70'])
    const gradientDirection = ref('to bottom right')

    // 贴纸素材
    const stickers = ref<Sticker[]>([])

    // 预定义的模板列表
    const templates = ref<CardTemplate[]>([
      {
        id: 1,
        name: '简约白',
        layout: 'center',
        fontFamily: 'SimHei, sans-serif',
        fontSize: 36,
        textColor: '#333333',
        backgroundColor: '#ffffff',
        gradientType: 'none',
        borderRadius: 12
      },
      {
        id: 2,
        name: '渐变蓝紫',
        layout: 'center',
        fontFamily: 'SimSun, serif',
        fontSize: 40,
        textColor: '#ffffff',
        backgroundColor: '#4158D0',
        gradientType: 'linear',
        borderRadius: 16
      },
      {
        id: 3,
        name: '文艺黑',
        layout: 'center',
        fontFamily: 'FangSong, serif',
        fontSize: 32,
        textColor: '#ffffff',
        backgroundColor: '#222222',
        gradientType: 'none',
        borderRadius: 0
      },
      {
        id: 4,
        name: '森林绿',
        layout: 'top',
        fontFamily: 'KaiTi, serif',
        fontSize: 38,
        textColor: '#ffffff',
        backgroundColor: '#2e8b57',
        gradientType: 'linear',
        borderRadius: 8
      }
    ])

    // 预定义的渐变背景列表
    const gradientPresets = ref<GradientBackground[]>([
      {
        id: 1,
        name: '海洋蓝',
        colors: ['#4158D0', '#C850C0', '#FFCC70'],
        direction: 'to bottom right'
      },
      {
        id: 2,
        name: '夕阳红',
        colors: ['#FF9A8B', '#FF6A88', '#FF99AC'],
        direction: 'to bottom'
      },
      {
        id: 3,
        name: '清新绿',
        colors: ['#43E97B', '#38F9D7'],
        direction: 'to right'
      },
      {
        id: 4,
        name: '紫金渐变',
        colors: ['#8E2DE2', '#4A00E0'],
        direction: 'to bottom left'
      },
      {
        id: 5,
        name: '黄昏',
        colors: ['#F83600', '#F9D423'],
        direction: 'to top'
      }
    ])

    // 当前渐变背景
    const backgroundGradient = computed(() => {
      if (backgroundType.value !== 'gradient') return ''

      return `linear-gradient(${gradientDirection.value}, ${gradientColors.value.join(', ')})`
    })

    // 当前选中的模板
    const currentTemplate = computed(() => {
      return templates.value[selectedTemplateIndex.value]
    })

    // 应用模板
    function applyTemplate(index: number) {
      selectedTemplateIndex.value = index
      const template = templates.value[index]

      fontFamily.value = template.fontFamily
      fontSize.value = template.fontSize
      textColor.value = template.textColor

      if (template.gradientType === 'none') {
        backgroundType.value = 'solid'
        backgroundColor.value = template.backgroundColor
      } else {
        backgroundType.value = 'gradient'
        // 应用默认渐变
        applyGradient(0)
      }
    }

    // 应用渐变
    function applyGradient(index: number) {
      const gradient = gradientPresets.value[index]
      gradientColors.value = [...gradient.colors]
      gradientDirection.value = gradient.direction
    }

    // 添加贴纸
    function addSticker(sticker: Sticker) {
      stickers.value.push(sticker)
    }

    // 删除贴纸
    function removeSticker(id: number) {
      stickers.value = stickers.value.filter((sticker) => sticker.id !== id)
    }

    // 设置文本
    function setText(newText: string) {
      text.value = newText
    }

    // 设置画布尺寸
    function setCanvasSize(width: number, height: number) {
      canvasWidth.value = width
      canvasHeight.value = height
    }

    return {
      text,
      canvasWidth,
      canvasHeight,
      selectedTemplateIndex,
      fontFamily,
      fontSize,
      fontWeight,
      textColor,
      textAlign,
      backgroundType,
      backgroundColor,
      gradientColors,
      gradientDirection,
      stickers,
      templates,
      gradientPresets,
      backgroundGradient,
      currentTemplate,
      setText,
      setCanvasSize,
      applyTemplate,
      applyGradient,
      addSticker,
      removeSticker
    }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: 'card-editor',
          storage: localStorage
        }
      ]
    }
  }
)
