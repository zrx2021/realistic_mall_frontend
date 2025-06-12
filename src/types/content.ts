import { ref } from 'vue'
import { getImageUrl } from '@/utils/image'
import { getUniqueId } from '@/utils/uniqueId'

import Title from '@/components/content/Title.vue'
import Elevator from '@/components/content/Elevator.vue'
import TitleSetting from '@/views/content/TitleSetting.vue'
import ElevatorSetting from '@/views/content/ElevatorSetting.vue'
import PageSetting from '@/views/content/PageSetting.vue'

export interface Page {
  pageName: string
  pageDescription: string
}

export interface ElevatorTabs {
  tabId: number
  label?: string
  image?: string
  jumpUrl: string
}

export interface GoodsGroup {
  groupId: number
  groupName: string
  displayCount: number
}

export interface Elevator {
  elevatorId: number
  templateStyle: string
  tabData: ElevatorTabs[]
  styleConfig?: {
    tabsPosition?: 'top' | 'left' | 'right' | 'bottom'
  }
}

export interface Goods {
  goodsId: number
  templateStyle: string
  goodsList: string[]
  groupData: GoodsGroup[]
  displayStyle: string
}

export interface Wrapper {
  id: number
  type: number
  name: string
  objData: Elevator | Goods | string | Page
}

export const initMap = () => {
  availableComponents.value.forEach((item) => {
    item.components.map((item) => {
      fileMap.value[item.id] = item.file
    })
  })
  fileMap.value[999] = 'Page'
  fileMap.value[998] = 'Sort'
}

export const getTemplate = (type: number) => {
  const template = componentTemplate.find((item) => item.type === type) || null
  if (template) {
    const newTemplate = ref(JSON.parse(JSON.stringify(template)))
    newTemplate.value.id = getUniqueId()
    return newTemplate.value
  }
  return null
}

export const getComponent = (type: number) => {
  initMap()
  const fileName = fileMap.value[type] || null
  switch (fileName) {
    case 'Title':
      return Title
    case 'Elevator':
      return Elevator
    default:
      return null
  }
}

export const getSettingsComponent = (type: number) => {
  initMap()
  const fileName = fileMap.value[type] || null
  switch (fileName) {
    case 'Title':
      return TitleSetting
    case 'Elevator':
      return ElevatorSetting
    case 'Page':
      return PageSetting
    default:
      return null
  }
}

const componentTemplate = [
  {
    id: getUniqueId(),
    name: '页面',
    type: 999,
    objData: {
      pageName: '',
      pageDescription: '',
    },
  },
  {
    id: getUniqueId(),
    name: '标题',
    type: 1,
    objData: '请输入标题',
  },
  {
    id: getUniqueId(),
    name: '电梯导航',
    type: 2,
    objData: {
      elevatorId: getUniqueId(),
      templateStyle: 'words',
      tabData: [
        {
          tabId: getUniqueId(),
          label: '新建标签',
          jumpUrl: 'www.baidu.com',
          image: '@/assets/logo.svg',
        },
        {
          tabId: getUniqueId(),
          label: '新建标签',
          jumpUrl: 'www.google.com',
          image: '@/assets/logo.svg',
        },
      ],
      styleConfig: {
        tabsPosition: 'top',
      },
    },
  },
]

export const imageMap = ref<Record<string, string>>({})
export const fileMap = ref<Record<number, string>>({})

// 组件分类结构
export const availableComponents = ref([
  {
    name: '基础组件',
    components: [
      {
        id: 1,
        name: '标题文本',
        icon: '标题文本',
        category: '基础组件',
        file: 'Title',
      },
      {
        id: 2,
        name: '电梯导航',
        icon: '电梯导航',
        category: '基础组件',
        file: 'Elevator',
      },
      { id: 3, name: '商品', icon: '商品', category: '基础组件', file: 'Product' },
      { id: 4, name: '图片', icon: '图片', category: '基础组件', file: 'Image' },
      {
        id: 5,
        name: '富文本',
        icon: '富文本',
        category: '基础组件',
        file: 'RichText',
      },
      { id: 6, name: '搜索', icon: '搜索', category: '基础组件', file: 'Search' },
      {
        id: 7,
        name: '辅助分割',
        icon: '辅助分割',
        category: '基础组件',
        file: 'Divider',
      },
      { id: 8, name: '视频', icon: '视频', category: '基础组件', file: 'Video' },
      { id: 9, name: '公告', icon: '公告', category: '基础组件', file: 'Notice' },
    ],
  },
  {
    name: '营销组件',
    components: [
      {
        id: 10,
        name: '优惠券',
        icon: '优惠券',
        category: '营销组件',
        file: 'Coupon',
      },
      {
        id: 11,
        name: '限时折扣',
        icon: '限时折扣',
        category: '营销组件',
        file: 'Discount',
      },
      { id: 12, name: '秒杀', icon: '秒杀', category: '营销组件', file: 'Seckill' },
      { id: 13, name: '拼团', icon: '拼团', category: '营销组件', file: 'Group' },
      { id: 14, name: '满减', icon: '满减', category: '营销组件', file: 'FullReduction' },
      { id: 15, name: '积分', icon: '积分', category: '营销组件', file: 'Points' },
    ],
  },
  {
    name: '高级组件',
    components: [
      {
        id: 16,
        name: '轮播图',
        icon: '轮播图',
        category: '高级组件',
        file: 'Carousel',
      },
      {
        id: 17,
        name: '分类导航',
        icon: '分类导航',
        category: '高级组件',
        file: 'Category',
      },
      {
        id: 18,
        name: '会员卡',
        icon: '会员卡',
        category: '高级组件',
        file: 'MemberCard',
      },
    ],
  },
])

export const initImageMap = () => {
  const path = '/content/page/editing/'
  imageMap.value['组件设置'] = getImageUrl(path, '组件设置', false, 'svg')
  imageMap.value['组件排序'] = getImageUrl(path, '组件排序', false, 'svg')
  imageMap.value['标题文本'] = getImageUrl(path, '标题文本', false, 'svg')
  imageMap.value['电梯导航'] = getImageUrl(path, '电梯导航', false, 'svg')
  imageMap.value['商品'] = getImageUrl(path, '商品', false, 'svg')
  imageMap.value['图片'] = getImageUrl(path, '图片', false, 'svg')
  imageMap.value['富文本'] = getImageUrl(path, '富文本', false, 'svg')
  imageMap.value['搜索'] = getImageUrl(path, '搜索', false, 'svg')
  imageMap.value['辅助分割'] = getImageUrl(path, '辅助分割', false, 'svg')
  imageMap.value['视频'] = getImageUrl(path, '视频', false, 'svg')
  imageMap.value['公告'] = getImageUrl(path, '公告', false, 'svg')
  imageMap.value['优惠券'] = getImageUrl(path, '优惠券', false, 'svg')
  imageMap.value['限时折扣'] = getImageUrl(path, '限时折扣', false, 'svg')
  imageMap.value['秒杀'] = getImageUrl(path, '秒杀', false, 'svg')
  imageMap.value['拼团'] = getImageUrl(path, '拼团', false, 'svg')
  imageMap.value['满减'] = getImageUrl(path, '满减', false, 'svg')
  imageMap.value['积分'] = getImageUrl(path, '积分', false, 'svg')
  imageMap.value['分类导航'] = getImageUrl(path, '分类导航', false, 'svg')
  imageMap.value['会员卡'] = getImageUrl(path, '会员卡', false, 'svg')
  imageMap.value['轮播图'] = getImageUrl(path, '轮播图', false, 'svg')
  imageMap.value['标题文本-hover'] = getImageUrl(path, '标题文本', true, 'svg')
  imageMap.value['电梯导航-hover'] = getImageUrl(path, '电梯导航', true, 'svg')
  imageMap.value['商品-hover'] = getImageUrl(path, '商品', true, 'svg')
  imageMap.value['图片-hover'] = getImageUrl(path, '图片', true, 'svg')
  imageMap.value['富文本-hover'] = getImageUrl(path, '富文本', true, 'svg')
  imageMap.value['搜索-hover'] = getImageUrl(path, '搜索', true, 'svg')
  imageMap.value['辅助分割-hover'] = getImageUrl(path, '辅助分割', true, 'svg')
  imageMap.value['视频-hover'] = getImageUrl(path, '视频', true, 'svg')
  imageMap.value['公告-hover'] = getImageUrl(path, '公告', true, 'svg')
  imageMap.value['优惠券-hover'] = getImageUrl(path, '优惠券', true, 'svg')
  imageMap.value['限时折扣-hover'] = getImageUrl(path, '限时折扣', true, 'svg')
  imageMap.value['秒杀-hover'] = getImageUrl(path, '秒杀', true, 'svg')
  imageMap.value['拼团-hover'] = getImageUrl(path, '拼团', true, 'svg')
  imageMap.value['满减-hover'] = getImageUrl(path, '满减', true, 'svg')
  imageMap.value['积分-hover'] = getImageUrl(path, '积分', true, 'svg')
  imageMap.value['分类导航-hover'] = getImageUrl(path, '分类导航', true, 'svg')
  imageMap.value['会员卡-hover'] = getImageUrl(path, '会员卡', true, 'svg')
  imageMap.value['轮播图-hover'] = getImageUrl(path, '轮播图', true, 'svg')
}
