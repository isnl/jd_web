import BasicCard from './BasicCard.vue'
import ConvenientCard from './ConvenientCard.vue'
import MemoCard from './MemoCard.vue'
import SimpleCard from './SimpleCard.vue'
import ArtisticCard from './ArtisticCard.vue'
import DarkCard from './DarkCard.vue'

export const CardComponents = [
  {
    name: '基础',
    component: BasicCard
  },
  {
    name: '便签',
    component: ConvenientCard
  },
  {
    name: '备忘',
    component: MemoCard
  },
  {
    name: '简约',
    component: SimpleCard
  },
  {
    name: '涂鸦',
    component: ArtisticCard
  },
  {
    name: '暗黑',
    component: DarkCard
  }
]

export { BasicCard, ConvenientCard, MemoCard, SimpleCard, ArtisticCard, DarkCard }
