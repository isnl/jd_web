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
  scale?: number
}

export const useCardStore = defineStore(
  'card',
  () => {
    // 文本内容
    const text = ref('')

    // 画布尺寸（修改为更合理的尺寸）
    const canvasWidth = ref(500)
    const canvasHeight = ref(700)

    // 当前选中的模板索引
    const selectedTemplateIndex = ref(0)

    // 当前模板的字体设置
    const fontFamily = ref('SimHei, sans-serif')
    const fontSize = ref(24)
    const fontWeight = ref(400)
    const textColor = ref('#333333')
    const textAlign = ref('center')

    // 文本位置和尺寸
    const textX = ref(0)
    const textY = ref(0)
    const textWidth = ref(400)
    const textHeight = ref(200)

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
      },
      {
        id: 5,
        name: '樱花粉',
        layout: 'center',
        fontFamily: 'Microsoft YaHei, sans-serif',
        fontSize: 34,
        textColor: '#ffffff',
        backgroundColor: '#ff9a9e',
        gradientType: 'linear',
        borderRadius: 20
      },
      {
        id: 6,
        name: '深蓝质感',
        layout: 'bottom',
        fontFamily: 'Arial, sans-serif',
        fontSize: 36,
        textColor: '#ffffff',
        backgroundColor: '#1e3c72',
        gradientType: 'linear',
        borderRadius: 4
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
      },
      {
        id: 6,
        name: '薄雾青',
        colors: ['#74EBD5', '#9FACE6'],
        direction: 'to right'
      },
      {
        id: 7,
        name: '深夜蓝',
        colors: ['#0F2027', '#203A43', '#2C5364'],
        direction: 'to bottom'
      },
      {
        id: 8,
        name: '温暖橙',
        colors: ['#FF512F', '#F09819'],
        direction: 'to right'
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

      // 重置文本位置为中心
      resetTextPosition()

      if (template.gradientType === 'none') {
        backgroundType.value = 'solid'
        backgroundColor.value = template.backgroundColor
      } else {
        backgroundType.value = 'gradient'
        // 应用默认渐变
        applyGradient(0)
      }
    }

    // 重置文本位置到中心
    function resetTextPosition() {
      // 水平居中，垂直居中略微偏上
      textX.value = canvasWidth.value / 2 - textWidth.value / 2 // 文本宽度的一半
      textY.value = canvasHeight.value / 2 - textHeight.value / 2 // 文本高度的一半，略微偏上
      // 设置文本对齐方式为居中
      textAlign.value = 'center'
    }

    // 设置文本位置
    function setTextPosition(x: number, y: number) {
      textX.value = x
      textY.value = y
    }

    // 设置文本尺寸
    function setTextSize(width: number, height: number) {
      textWidth.value = width
      textHeight.value = height
    }

    // 应用渐变
    function applyGradient(index: number) {
      const gradient = gradientPresets.value[index]
      gradientColors.value = [...gradient.colors]
      gradientDirection.value = gradient.direction
    }

    // 添加贴纸
    function addSticker(sticker: Sticker) {
      stickers.value.push({
        ...sticker,
        scale: 1
      })
    }

    // 删除贴纸
    function removeSticker(id: number) {
      stickers.value = stickers.value.filter((sticker) => sticker.id !== id)
    }

    // 更新贴纸位置
    function updateStickerPosition(id: number, x: number, y: number) {
      const sticker = stickers.value.find((s) => s.id === id)
      if (sticker) {
        sticker.x = x
        sticker.y = y
      }
    }

    // 更新贴纸全部属性
    function updateSticker(id: number, newSticker: Partial<Sticker>) {
      const index = stickers.value.findIndex((s) => s.id === id)
      if (index !== -1) {
        stickers.value[index] = { ...stickers.value[index], ...newSticker }
      }
    }

    // 旋转贴纸
    function rotateSsticker(id: number, rotation: number) {
      const sticker = stickers.value.find((s) => s.id === id)
      if (sticker) {
        sticker.rotation = rotation
      }
    }

    // 缩放贴纸
    function scaleSsticker(id: number, scale: number) {
      const sticker = stickers.value.find((s) => s.id === id)
      if (sticker) {
        sticker.scale = scale
      }
    }

    // 设置文本
    function setText(newText: string) {
      text.value = newText
    }

    // 设置画布尺寸
    function setCanvasSize(width: number, height: number) {
      canvasWidth.value = width
      canvasHeight.value = height

      // 调整尺寸后重置文本位置
      resetTextPosition()
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
      textX,
      textY,
      textWidth,
      textHeight,
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
      removeSticker,
      updateStickerPosition,
      updateSticker,
      rotateSsticker,
      scaleSsticker,
      setTextPosition,
      resetTextPosition,
      setTextSize
    }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: 'text-card-store',
          storage: localStorage,
          paths: [
            'text',
            'canvasWidth',
            'canvasHeight',
            'selectedTemplateIndex',
            'fontFamily',
            'fontSize',
            'fontWeight',
            'textColor',
            'textAlign',
            'textX',
            'textY',
            'textWidth',
            'textHeight',
            'backgroundType',
            'backgroundColor',
            'gradientColors',
            'gradientDirection',
            'stickers'
          ]
        }
      ]
    }
  }
)
