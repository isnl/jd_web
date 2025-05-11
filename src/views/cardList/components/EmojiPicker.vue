<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

interface Props {
  visible: boolean // 控制显示状态
}

const props = defineProps<Props>()

const emit = defineEmits(['close', 'select'])

// Emoji选择器DOM引用
const emojiPickerRef = ref<HTMLElement | null>(null)
// 分类容器DOM引用
const categoriesContainerRef = ref<HTMLElement | null>(null)

// 当前选中的分类
const currentEmojiCategory = ref('表情')

// Emoji分类 - 移除最近使用
const emojiCategories = [
  { id: 'emotion', name: '表情', icon: 'i-tabler-mood-smile' },
  { id: 'people', name: '人物', icon: 'i-tabler-user' },
  { id: 'nature', name: '自然', icon: 'i-tabler-plant' },
  { id: 'food', name: '食物', icon: 'i-tabler-cookie' },
  { id: 'activity', name: '活动', icon: 'i-tabler-ball-football' },
  { id: 'travel', name: '旅行', icon: 'i-tabler-car' },
  { id: 'object', name: '物品', icon: 'i-tabler-bulb' },
  { id: 'symbol', name: '符号', icon: 'i-tabler-heart' }
]

// 按分类组织的emoji列表
const emojiByCategoryMap = {
  emotion: [
    '😀',
    '😃',
    '😄',
    '😁',
    '😆',
    '😅',
    '🤣',
    '😂',
    '🙂',
    '🙃',
    '😉',
    '😊',
    '😇',
    '🥰',
    '😍',
    '🤩',
    '😘',
    '😗',
    '😚',
    '😙',
    '😋',
    '😛',
    '😜',
    '🤪',
    '😝',
    '🤑',
    '🤗',
    '🤭',
    '🤫',
    '🤔',
    '🤐',
    '🤨',
    '😐',
    '😑',
    '😶',
    '😏',
    '😒',
    '🙄',
    '😬',
    '🤥',
    '😌',
    '😔',
    '😪',
    '🤤',
    '😴',
    '😷',
    '🤒',
    '🤕',
    '🤢',
    '🤮',
    '🤧',
    '🥵',
    '🥶',
    '🥴',
    '😵',
    '🤯',
    '🤠',
    '🥳',
    '😎',
    '🤓',
    '🧐',
    '😕',
    '😟',
    '🙁',
    '☹️',
    '😮',
    '😯',
    '😲',
    '😳',
    '🥺',
    '😦',
    '😧',
    '😨',
    '😰',
    '😥',
    '😢',
    '😭',
    '😱',
    '😖',
    '😣',
    '😞',
    '😓',
    '😩',
    '😫',
    '🥱',
    '😤',
    '😡',
    '😠',
    '🤬',
    '😈',
    '👿',
    '💀',
    '☠️',
    '💩',
    '🤡',
    '👹',
    '👺',
    '👻',
    '👽',
    '👾',
    '🤖',
    '😺',
    '😸',
    '😹'
  ],
  people: [
    '👋',
    '🤚',
    '🖐️',
    '✋',
    '🖖',
    '👌',
    '🤌',
    '🤏',
    '✌️',
    '🤞',
    '🤟',
    '🤘',
    '🤙',
    '👈',
    '👉',
    '👆',
    '🖕',
    '👇',
    '☝️',
    '👍',
    '👎',
    '✊',
    '👊',
    '🤛',
    '🤜',
    '👏',
    '🙌',
    '👐',
    '🤲',
    '🤝',
    '🙏',
    '✍️',
    '💪',
    '🦾',
    '🦿',
    '🦵',
    '🦶',
    '👂',
    '🦻',
    '👃',
    '🧠',
    '🫀',
    '🫁',
    '🦷',
    '🦴',
    '👀',
    '👁️',
    '👅',
    '👄',
    '💋',
    '🩸',
    '👶',
    '🧒',
    '👦',
    '👧',
    '🧑',
    '👱',
    '👨',
    '🧔',
    '👨‍🦰',
    '👨‍🦱',
    '👨‍🦳',
    '👨‍🦲',
    '👩',
    '👩‍🦰',
    '🧑‍🦰',
    '👩‍🦱',
    '🧑‍🦱',
    '👩‍🦳',
    '🧑‍🦳',
    '👩‍🦲',
    '🧑‍🦲',
    '👱‍♀️',
    '👱‍♂️',
    '🧓',
    '👴',
    '👵',
    '🙍',
    '🙍‍♂️',
    '🙍‍♀️',
    '🙎',
    '🙎‍♂️',
    '🙎‍♀️',
    '🙅',
    '🙅‍♂️',
    '🙅‍♀️',
    '🙆',
    '🙆‍♂️',
    '💑',
    '👩‍❤️‍👨',
    '👨‍❤️‍👨',
    '👩‍❤️‍👩',
    '👪',
    '👨‍👩‍👦'
  ],
  nature: [
    '🐶',
    '🐱',
    '🐭',
    '🐹',
    '🐰',
    '🦊',
    '🐻',
    '🐼',
    '🐻‍❄️',
    '🐨',
    '🐯',
    '🦁',
    '🐮',
    '🐷',
    '🐽',
    '🐸',
    '🐵',
    '🙈',
    '🙉',
    '🙊',
    '🐒',
    '🐔',
    '🐧',
    '🐦',
    '🐤',
    '🐣',
    '🐥',
    '🦆',
    '🦅',
    '🦉',
    '🦇',
    '🐺',
    '🐗',
    '🐴',
    '🦄',
    '🐝',
    '🪱',
    '🐛',
    '🦋',
    '🐌',
    '🐞',
    '🐜',
    '🪰',
    '🪲',
    '🪳',
    '🦟',
    '🦗',
    '🕷️',
    '🕸️',
    '🦂',
    '🐢',
    '🐍',
    '🦎',
    '🦖',
    '🦕',
    '🐙',
    '🦑',
    '🦐',
    '🦞',
    '🦀',
    '🐡',
    '🐠',
    '🐟',
    '🐬',
    '🐳',
    '🐋',
    '🦈',
    '🐊',
    '🐅',
    '🐆',
    '🦓',
    '🦍',
    '🦧',
    '🦣',
    '🐘',
    '🦛',
    '🦏',
    '🐪',
    '🐫',
    '🦒',
    '🦘',
    '🦬',
    '🐃',
    '🐂',
    '🐄',
    '🐎',
    '🐖',
    '🐏',
    '🌵',
    '🎄',
    '🌲',
    '🌳',
    '🌴',
    '🪵',
    '🌱',
    '🌿',
    '☘️',
    '🍀',
    '🎍',
    '🪴',
    '🎋',
    '🍃',
    '🍂',
    '🍁',
    '🍄',
    '🌸',
    '🌺',
    '🌼',
    '🌻',
    '🌞',
    '🌝',
    '🌛',
    '🌜',
    '🌚',
    '🌕',
    '🌖',
    '🌗',
    '🌘',
    '🌑',
    '🌒',
    '🌍',
    '🌎',
    '🌏',
    '🌋',
    '🌌',
    '⛅',
    '☁️',
    '⛈️'
  ],
  food: [
    '🍏',
    '🍎',
    '🍐',
    '🍊',
    '🍋',
    '🍌',
    '🍉',
    '🍇',
    '🍓',
    '🫐',
    '🍈',
    '🍒',
    '🍑',
    '🥭',
    '🍍',
    '🥥',
    '🥝',
    '🍅',
    '🍆',
    '🥑',
    '🥦',
    '🥬',
    '🥒',
    '🌶️',
    '🫑',
    '🌽',
    '🥕',
    '🧄',
    '🧅',
    '🥔',
    '🍠',
    '🥐',
    '🥯',
    '🍞',
    '🥖',
    '🥨',
    '🧀',
    '🥚',
    '🍳',
    '🧈',
    '🥞',
    '🧇',
    '🥓',
    '🥩',
    '🍗',
    '🍖',
    '🦴',
    '🌭',
    '🍔',
    '🍟',
    '🍕',
    '🫓',
    '🥪',
    '🥙',
    '🧆',
    '🌮',
    '🌯',
    '🫔',
    '🥗',
    '🥘',
    '🫕',
    '🥫',
    '🍝',
    '🍜',
    '🍲',
    '🍛',
    '🍣',
    '🍱',
    '🥟',
    '🦪',
    '🍤',
    '🍙',
    '🍚',
    '🍘',
    '🍥',
    '🥠',
    '🥮',
    '🍢',
    '🍡',
    '🍧',
    '🍨',
    '🍦',
    '🥧',
    '🧁',
    '🍰',
    '🎂',
    '🍮',
    '🍭',
    '🍬',
    '🍫',
    '🍿',
    '🍩',
    '🍪',
    '🌰',
    '🥜',
    '☕',
    '🫖',
    '🍵',
    '🧃',
    '🥤',
    '🧋',
    '🍶',
    '🍺',
    '🍻',
    '🥂',
    '🍷',
    '🥃',
    '🍸',
    '🍹',
    '🧉',
    '🍾',
    '🧊'
  ],
  activity: [
    '⚽',
    '🏀',
    '🏈',
    '⚾',
    '🥎',
    '🎾',
    '🏐',
    '🏉',
    '🥏',
    '🎱',
    '🪀',
    '🏓',
    '🏸',
    '🏒',
    '🏑',
    '🥍',
    '🏏',
    '🪃',
    '🥅',
    '⛳',
    '🪁',
    '🏹',
    '🎣',
    '🤿',
    '🥊',
    '🥋',
    '🎽',
    '🛹',
    '🛼',
    '🛷',
    '⛸️',
    '🥌',
    '🎿',
    '⛷️',
    '🏂',
    '🪂',
    '🏋️',
    '🤼',
    '🤸',
    '⛹️',
    '🤺',
    '🤾',
    '🏌️',
    '🏇',
    '🧘',
    '🏄',
    '🏊',
    '🤽',
    '🚣',
    '🧗',
    '🚵',
    '🚴',
    '🏆',
    '🥇',
    '🥈',
    '🥉',
    '🏅',
    '🎖️',
    '🏵️',
    '🎗️',
    '🎫',
    '🎟️',
    '🎪',
    '🎭',
    '🎨',
    '🎬',
    '🎤',
    '🎧',
    '🎼',
    '🎹',
    '🥁',
    '🎷',
    '🎺',
    '🎸',
    '🪕',
    '🎻',
    '🎲',
    '♟️',
    '🎯',
    '🎳',
    '🎮',
    '🎰',
    '🧩',
    '🎭',
    '👓',
    '👔',
    '👕',
    '👖'
  ],
  travel: [
    '🚗',
    '🚕',
    '🚙',
    '🚌',
    '🚎',
    '🏎️',
    '🚓',
    '🚑',
    '🚒',
    '🚐',
    '🛻',
    '🚚',
    '🚛',
    '🚜',
    '🦯',
    '🦽',
    '🦼',
    '🛴',
    '🚲',
    '🛵',
    '🏍️',
    '🛺',
    '🚨',
    '🚔',
    '🚍',
    '🚘',
    '🚖',
    '🚡',
    '🚠',
    '🚟',
    '🚃',
    '🚋',
    '🚞',
    '🚝',
    '🚄',
    '🚅',
    '🚈',
    '🚂',
    '🚆',
    '🚇',
    '🚊',
    '🚉',
    '🚁',
    '🛩️',
    '✈️',
    '🛫',
    '🛬',
    '🪂',
    '💺',
    '🛰️',
    '🚀',
    '🛸',
    '🛶',
    '⛵',
    '🛥️',
    '🚤',
    '⛴️',
    '🛳️',
    '🚢',
    '⚓',
    '🪝',
    '⛽',
    '🚧',
    '🚦',
    '🚥',
    '🚏',
    '🗽',
    '🗿',
    '🗼',
    '🏰',
    '🏯',
    '🏟️',
    '🎡',
    '🎢',
    '🎠',
    '⛲',
    '⛱️',
    '🏖️',
    '🏝️',
    '🏜️',
    '🌋',
    '⛰️',
    '🏔️',
    '🗻',
    '🏕️',
    '⛺',
    '🏠',
    '🏡'
  ],
  object: [
    '⌚',
    '📱',
    '📲',
    '💻',
    '⌨️',
    '🖥️',
    '🖨️',
    '🖱️',
    '🖲️',
    '🕹️',
    '🗜️',
    '💾',
    '💿',
    '📀',
    '📼',
    '📷',
    '📸',
    '📹',
    '🎥',
    '📽️',
    '🎞️',
    '📞',
    '☎️',
    '📟',
    '📠',
    '📺',
    '📻',
    '🎙️',
    '🎚️',
    '🎛️',
    '🧭',
    '⏱️',
    '⏲️',
    '⏰',
    '🕰️',
    '⌛',
    '⏳',
    '📡',
    '🔋',
    '🔌',
    '💡',
    '🔦',
    '🕯️',
    '🪔',
    '🧯',
    '🛢️',
    '💸',
    '💵',
    '💴',
    '💶',
    '💷',
    '💰',
    '💳',
    '💎',
    '⚖️',
    '🪜',
    '🧰',
    '🪛',
    '🔧',
    '🔨',
    '⚒️',
    '🛠️',
    '🧲',
    '🔩',
    '⚙️',
    '🧱',
    '⛓️',
    '🧲',
    '🔪',
    '🗡️',
    '⚔️',
    '🛡️',
    '🚬',
    '⚰️',
    '⚱️',
    '🏺',
    '🔮',
    '📿',
    '🧿',
    '💈'
  ],
  symbol: [
    '❤️',
    '🧡',
    '💛',
    '💚',
    '💙',
    '💜',
    '🖤',
    '🤍',
    '🤎',
    '💔',
    '❣️',
    '💕',
    '💞',
    '💓',
    '💗',
    '💖',
    '💘',
    '💝',
    '💟',
    '☮️',
    '✝️',
    '☪️',
    '🕉️',
    '☸️',
    '✡️',
    '🔯',
    '🕎',
    '☯️',
    '☦️',
    '🛐',
    '⛎',
    '♈',
    '♉',
    '♊',
    '♋',
    '♌',
    '♍',
    '♎',
    '♏',
    '♐',
    '♑',
    '♒',
    '♓',
    '🆔',
    '⚛️',
    '🉑',
    '☢️',
    '☣️',
    '📴',
    '📳',
    '🈶',
    '🈚',
    '🈸',
    '🈺',
    '🈷️',
    '✴️',
    '🆚',
    '💮',
    '🉐',
    '㊙️',
    '㊗️',
    '🈴',
    '🈵',
    '🈹',
    '🈲',
    '🅰️',
    '🅱️',
    '🆎',
    '🆑',
    '🅾️',
    '🆘',
    '❌',
    '⭕',
    '🛑',
    '⛔',
    '📛',
    '🚫',
    '💯',
    '💢',
    '♨️',
    '🚷',
    '🚯',
    '🚳',
    '🚱',
    '🔞',
    '📵',
    '🚭',
    '❗',
    '❕',
    '❓',
    '❔',
    '‼️',
    '⁉️',
    '🔅',
    '🔆',
    '〽️',
    '⚠️',
    '🚸',
    '🔱',
    '⚜️',
    '🔰',
    '♻️',
    '✅',
    '🈯',
    '💹',
    '❇️',
    '✳️',
    '❎',
    '🌐',
    '💠',
    'Ⓜ️',
    '🌀',
    '💤',
    '🏧',
    '🚾',
    '♿',
    '🅿️',
    '🛗',
    '🈳',
    '🈂️'
  ]
}

// 从localStorage加载最近使用
const recentEmojis = ref(JSON.parse(localStorage.getItem('recentEmojis') || '[]') as string[])

// 可以滚动到左侧
const canScrollLeft = ref(false)
// 可以滚动到右侧
const canScrollRight = ref(true)

// 初始化最近使用的emoji类别
onMounted(() => {
  // 检查分类导航栏滚动状态
  nextTick(() => {
    updateScrollableStatus()
  })
})

// 当前选中分类的emoji
const currentCategoryEmojis = computed(() => {
  const categoryId =
    emojiCategories.find((c) => c.name === currentEmojiCategory.value)?.id || 'emotion'

  // 确保返回有效的数组
  const emojis = emojiByCategoryMap[categoryId as keyof typeof emojiByCategoryMap]
  return emojis || emojiByCategoryMap.emotion // 如果没有找到，使用表情类别作为后备
})

// 更新并保存最近使用的emoji
const updateRecentEmojis = (emoji: string) => {
  // 如果emoji已存在，则移除旧位置
  const index = recentEmojis.value.indexOf(emoji)
  if (index > -1) {
    recentEmojis.value.splice(index, 1)
  }

  // 添加到最前面
  recentEmojis.value.unshift(emoji)

  // 保持最近列表不超过24个
  if (recentEmojis.value.length > 24) {
    recentEmojis.value = recentEmojis.value.slice(0, 24)
  }

  // 保存到localStorage
  localStorage.setItem('recentEmojis', JSON.stringify(recentEmojis.value))
}

// 切换emoji分类
const changeEmojiCategory = (category: string) => {
  currentEmojiCategory.value = category
  // 滚动到选中的分类
  nextTick(() => {
    scrollToSelectedCategory()
  })
}

// 滚动到选中的分类标签
const scrollToSelectedCategory = () => {
  if (!categoriesContainerRef.value) return

  const container = categoriesContainerRef.value
  const selectedButton = container.querySelector(
    `.emoji-category-btn[data-category="${currentEmojiCategory.value}"]`
  ) as HTMLElement

  if (selectedButton) {
    // 计算滚动位置，使选中的按钮居中
    const containerWidth = container.offsetWidth
    const buttonLeft = selectedButton.offsetLeft
    const buttonWidth = selectedButton.offsetWidth
    const scrollPosition = buttonLeft - containerWidth / 2 + buttonWidth / 2

    container.scrollTo({
      left: Math.max(0, scrollPosition),
      behavior: 'smooth'
    })

    // 更新滚动状态
    updateScrollableStatus()
  }
}

// 更新滚动按钮状态
const updateScrollableStatus = () => {
  if (!categoriesContainerRef.value) return

  const container = categoriesContainerRef.value
  canScrollLeft.value = container.scrollLeft > 0
  canScrollRight.value = container.scrollLeft < container.scrollWidth - container.clientWidth - 1
}

// 向左滚动分类
const scrollCategoriesLeft = () => {
  if (!categoriesContainerRef.value || !canScrollLeft.value) return

  const container = categoriesContainerRef.value
  const scrollAmount = container.clientWidth / 2
  container.scrollBy({
    left: -scrollAmount,
    behavior: 'smooth'
  })

  // 更新滚动状态
  setTimeout(() => {
    updateScrollableStatus()
  }, 300)
}

// 向右滚动分类
const scrollCategoriesRight = () => {
  if (!categoriesContainerRef.value || !canScrollRight.value) return

  const container = categoriesContainerRef.value
  const scrollAmount = container.clientWidth / 2
  container.scrollBy({
    left: scrollAmount,
    behavior: 'smooth'
  })

  // 更新滚动状态
  setTimeout(() => {
    updateScrollableStatus()
  }, 300)
}

// 检测分类导航栏的滚动事件
const handleCategoriesScroll = () => {
  updateScrollableStatus()
}

// 选择emoji
const selectEmoji = (emoji: string) => {
  updateRecentEmojis(emoji)
  emit('select', emoji)
}

// 点击外部关闭
const handleClickOutside = (event: MouseEvent) => {
  if (
    emojiPickerRef.value &&
    !emojiPickerRef.value.contains(event.target as Node) &&
    !(event.target as HTMLElement)?.classList?.contains('emoji-button')
  ) {
    emit('close')
  }
}

// 添加和移除事件监听
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  if (categoriesContainerRef.value) {
    categoriesContainerRef.value.addEventListener('scroll', handleCategoriesScroll)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  if (categoriesContainerRef.value) {
    categoriesContainerRef.value.removeEventListener('scroll', handleCategoriesScroll)
  }
})
</script>

<template>
  <div
    v-show="visible"
    ref="emojiPickerRef"
    class="emoji-picker absolute bottom-14 right-4 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-10"
  >
    <!-- 分类标签栏 -->
    <div class="categories-wrapper relative mb-2 border-b border-gray-100">
      <!-- 左侧滚动按钮 -->
      <button
        v-show="canScrollLeft"
        @click="scrollCategoriesLeft"
        class="category-nav-button left-0"
      >
        <div class="nav-button-inner">
          <i class="i-tabler-chevron-left"></i>
        </div>
      </button>

      <div ref="categoriesContainerRef" class="emoji-categories flex overflow-x-auto">
        <button
          v-for="category in emojiCategories"
          :key="category.id"
          :data-category="category.name"
          @click="changeEmojiCategory(category.name)"
          class="emoji-category-btn flex-shrink-0 px-2 py-1 mx-1 rounded-md text-xs transition-all duration-200 flex items-center"
          :class="
            currentEmojiCategory === category.name
              ? 'bg-blue-50 text-blue-500'
              : 'text-gray-500 hover:bg-gray-50'
          "
        >
          <i :class="category.icon" class="mr-1"></i>
          {{ category.name }}
        </button>
      </div>

      <!-- 右侧滚动按钮 -->
      <button
        v-show="canScrollRight"
        @click="scrollCategoriesRight"
        class="category-nav-button right-0"
      >
        <div class="nav-button-inner">
          <i class="i-tabler-chevron-right"></i>
        </div>
      </button>
    </div>

    <!-- Emoji网格 -->
    <div class="emoji-scroll-container overflow-y-auto" style="max-height: 200px">
      <div class="grid-container">
        <button
          v-for="emoji in currentCategoryEmojis"
          :key="emoji"
          @click="selectEmoji(emoji)"
          class="emoji-btn w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-xl transition-all duration-200"
        >
          {{ emoji }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Emoji选择器样式 */
.emoji-picker {
  animation: fadeIn 0.2s ease-out;
  width: 320px;
  max-width: calc(100vw - 40px); /* 响应式宽度，避免在小屏幕上溢出 */
}

.categories-wrapper {
  position: relative;
  overflow: hidden;
}

.category-nav-button {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 28px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  background: none;
}

.category-nav-button:before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: -1;
}

.category-nav-button.left-0:before {
  background: linear-gradient(to right, white 50%, rgba(255, 255, 255, 0));
  left: 0;
  right: auto;
}

.category-nav-button.right-0:before {
  background: linear-gradient(to left, white 50%, rgba(255, 255, 255, 0));
  right: 0;
  left: auto;
}

.nav-button-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.category-nav-button:hover .nav-button-inner {
  background-color: rgba(229, 231, 235, 0.5);
}

.emoji-scroll-container {
  scrollbar-width: thin;
  scrollbar-color: #e5e7eb transparent;
  overflow-x: hidden;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 0.5rem;
  padding: 0.25rem;
}

.emoji-scroll-container::-webkit-scrollbar {
  width: 6px;
}

.emoji-scroll-container::-webkit-scrollbar-track {
  background: transparent;
}

.emoji-scroll-container::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 6px;
}

.emoji-categories {
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 0 24px;
}

.emoji-categories::-webkit-scrollbar {
  display: none;
}

.emoji-category-btn {
  white-space: nowrap;
}

.emoji-btn {
  transition: transform 0.15s ease;
}

.emoji-btn:hover {
  transform: scale(1.2);
  background-color: rgba(219, 234, 254, 0.5);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
