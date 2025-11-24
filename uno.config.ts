// 引入Unocss
import { defineConfig } from 'unocss'
import { presetUno, presetAttributify, presetIcons, transformerVariantGroup } from 'unocss'

export default defineConfig({
  // 使用Unocss
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      // 使用Iconify图标
      scale: 1.2,
      warn: true,
      collections: {
        'carbon': () => import('@iconify/json/json/carbon.json').then((i) => i.default),
        'fa-solid': () => import('@iconify/json/json/fa-solid.json').then((i) => i.default),
        'fa-regular': () => import('@iconify/json/json/fa-regular.json').then((i) => i.default),
        'fa-brands': () => import('@iconify/json/json/fa-brands.json').then((i) => i.default)
      },
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle'
      }
    })
  ],
  shortcuts: [
    {
      fc: 'flex justify-center items-center',
      bl: 'b-1 b-solid b-gray-200 dark:b-gray-6',
      brl: 'b-r-1 b-r-solid b-r-gray-200 dark:b-r-gray-6',
      bbl: 'b-b-1 b-b-solid b-b-gray-200 dark:b-b-gray-6',
      btl: 'b-t-1 b-t-solid b-t-gray-200 dark:b-t-gray-6',
      bll: 'b-l-1 b-l-solid b-l-gray-200 dark:b-l-gray-6',
      ellipsis: 'overflow-hidden text-ellipsis whitespace-nowrap',
      'ellipsis-2': 'display-box line-clamp-2 text-ellipsis',
      'section-gradient': 'display-box bg-gradient-to-l from-#d6dee4 to-#fbfbfb',
      greenBorder:
        'shadow-[0px_6px_12px_1px_rgba(6,54,47,0.12)]  border-rd-8px  border-2 border-solid border-#D9ECEA bg-#fff',
      tableOperationBtn: 'text-16px min-w-100px fc gap-7px text-#fff pht p0',
      searchBtn: 'w-80px text-16px pht p0',
      resetBtn: 'w-80px text-16px ml-12px pht p0 bg-#EBEDF2 b-#EBEDF2',
      pht: "font-['pht']",
      pmzdbtt: 'font-[pmzdbtt]',
      textPrimary: 'text-#5c79f6',
      bgPrimary: 'bg-#5c79f6'
    }
  ],
  transformers: [transformerVariantGroup()]
})
