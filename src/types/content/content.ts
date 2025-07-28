import { ref } from 'vue'
import { getImageUrl } from '@/utils/image'
import { getUniqueId } from '@/utils/uniqueId'

import Title from '@/components/content/Title.vue'
import Elevator from '@/components/content/Elevator.vue'
import Product from '@/components/content/Product.vue'
import TitleSetting from '@/views/content/pages/TitleSetting.vue'
import ElevatorSetting from '@/views/content/pages/ElevatorSetting.vue'
import GoodsSetting from '@/views/content/pages/GoodsSetting.vue'
import PageSetting from '@/views/content/pages/PageSetting.vue'

export interface Article {
  id: number
  componentId?: number
  name: string
  status: number
  description: string
  backgroundColor: string
  templateId: number
}

// 添加文本组件接口定义
export interface TextComponent {
  titleContent: string
  componentId?: number
  id?: number // 组件页面关联关系表的主键id
}

export interface ElevatorTabs {
  id: number
  componentId?: number
  name: string
  jumpUrl: string
  imageUrl: string
  deleted?: number // 添加删除标记字段
}

export interface GoodsGroup {
  groupId: number
  componentId?: number
  groupName: string
  displayCount: number
  displayName?: string // 显示名称
  displayType?: 'custom' | 'all' // 显示类型：自定义数量或全部
}

export interface Elevator {
  id: number
  componentId: number
  templateStyle: string
  labels: ElevatorTabs[]
  position: 'top' | 'left'
  colorSetting: ColorSetting[]
  fillType: string
  fillShape: string
  borderRadius: number
  borderSize: number
  customStyle: number
  paddingVertical: number
  paddingHorizontal: number
  marginVertical: number
  marginHorizontal: number
  deleted: number
}

export interface ColorSetting {
  name: string
  label: string
  value: string
}

// 商品项接口
export interface GoodsItem {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number // 原价
  imageUrl: string
  stock: number
  sales: number // 销量
  rating: number // 评分
  tags: string[] // 商品标签
  discount?: number // 折扣百分比
  isHot?: boolean // 是否热销
  isNew?: boolean // 是否新品
  isSeckill?: boolean // 是否秒杀
  seckillEndTime?: string // 秒杀结束时间
  category: string // 商品分类
}

export interface Goods {
  goodsId: number
  componentId?: number
  templateStyle: string
  goodsList: GoodsItem[] // 改为具体的商品数组
  groupData: GoodsGroup[]
  displayStyle: string
  showPrice: boolean // 是否显示价格
  showCart: boolean // 是否显示购物车
  showRating: boolean // 是否显示评分
  showSales: boolean // 是否显示销量
  showTags: boolean // 是否显示标签
  enableSeckill: boolean // 是否启用秒杀功能
  autoPlay: boolean // 是否自动轮播（针对某些布局）
  playInterval: number // 轮播间隔时间
}

export interface Wrapper {
  id: number
  componentId?: number
  type: number
  name: string
  objData: Elevator | Goods | string | Article | TextComponent
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
    const newId = ref(-1)
    newId.value = getUniqueId()
    newTemplate.value.id = newId.value
    newTemplate.value.objData.id = newId.value
    if (type === 2) {
      const newLabelId = ref(-1)
      newTemplate.value.objData.labels.forEach((item: ElevatorTabs) => {
        newLabelId.value = getUniqueId()
        item.id = newLabelId.value
      })
    }
    if (type === 3) {
      // 为商品组件的分组生成新的ID
      const newGroupId = ref(-1)
      newTemplate.value.objData.goodsId = getUniqueId()
      newTemplate.value.objData.groupData.forEach((item: GoodsGroup) => {
        newGroupId.value = getUniqueId()
        item.groupId = newGroupId.value
      })
    }
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
    case 'Product':
      return Product
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
    case 'Product':
      return GoodsSetting
    case 'Page':
      return PageSetting
    default:
      return null
  }
}

// 用于组件的默认颜色设置，可被其他部分引用
export const defaultColorSetting = [
  [
    {
      name: 'activeColor',
      label: '已选文字',
      value: '#1890FF',
    },
    {
      name: 'activeBgColor',
      label: '已选填充色',
      value: '#E6F7FF',
    },
    {
      name: 'inactiveColor',
      label: '未选文字',
      value: '#595959',
    },
    {
      name: 'inactiveBgColor',
      label: '未选填充色',
      value: '#FFFFFF',
    },
    {
      name: 'navBgColor',
      label: '导航背景色',
      value: '#FFFFFF',
    },
  ],
]

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
    name: '标题文本',
    type: 1,
    objData: {
      titleContent: '请输入标题',
      componentId: undefined,
      id: undefined,
    } as TextComponent,
  },
  {
    id: getUniqueId(),
    name: '电梯导航',
    type: 2,
    objData: {
      id: getUniqueId(),
      templateStyle: 'words',
      labels: [
        {
          id: getUniqueId(),
          name: '新建标签',
          jumpUrl: 'www.baidu.com',
          imageUrl: '@/assets/logo.svg',
        },
        {
          id: getUniqueId(),
          name: '新建标签',
          jumpUrl: 'www.google.com',
          imageUrl: '@/assets/logo.svg',
        },
      ],
      position: 'top',
      fillType: 'underline',
      fillShape: 'none',
      colorSetting: defaultColorSetting[0],
      borderRadius: 8,
      customStyle: 0,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderSize: 1,
      marginVertical: 0,
      marginHorizontal: 8,
    },
  },
  {
    id: getUniqueId(),
    name: '商品',
    type: 3,
    objData: {
      goodsId: getUniqueId(),
      componentId: undefined,
      templateStyle: 'oneMainTwoSub',
      goodsList: [
        {
          id: 1,
          name: 'iPhone 15 Pro Max 256GB 深空黑色',
          description: '钛金属设计，A17 Pro芯片，专业级摄像头系统',
          price: 9999,
          originalPrice: 10999,
          imageUrl: new URL(
            '@/assets/content/page/goods/iPhone 15 Pro Max 256GB 深空黑色.webp',
            import.meta.url,
          ).href,
          stock: 50,
          sales: 1234,
          rating: 4.8,
          tags: ['热销', '新品', '5G'],
          discount: 9,
          isHot: true,
          isNew: true,
          category: '数码影音',
        },
        {
          id: 2,
          name: '小米13 Ultra 徕卡影像旗舰手机',
          description: '徕卡专业影像，骁龙8 Gen2处理器',
          price: 5999,
          originalPrice: 6499,
          imageUrl: new URL(
            '@/assets/content/page/goods/小米13 Ultra 徕卡影像旗舰手机.webp',
            import.meta.url,
          ).href,
          stock: 30,
          sales: 856,
          rating: 4.7,
          tags: ['徕卡', '影像'],
          discount: 8,
          category: '数码影音',
        },
        {
          id: 3,
          name: '戴森V15 Detect无绳吸尘器',
          description: '激光探测微尘，强劲吸力，智能清洁',
          price: 4990,
          imageUrl: new URL(
            '@/assets/content/page/goods/戴森V15 Detect无绳吸尘器.webp',
            import.meta.url,
          ).href,
          stock: 20,
          sales: 432,
          rating: 4.9,
          tags: ['智能', '除螨'],
          isHot: true,
          category: '家居生活',
        },
        {
          id: 4,
          name: 'AirPods Pro 第二代',
          description: '主动降噪，空间音频，无线充电',
          price: 1899,
          imageUrl: new URL('@/assets/content/page/goods/AirPods Pro 第二代.webp', import.meta.url)
            .href,
          stock: 100,
          sales: 2341,
          rating: 4.6,
          tags: ['降噪', '无线'],
          category: '数码影音',
        },
      ],
      groupData: [
        {
          groupId: getUniqueId(),
          componentId: undefined,
          groupName: '家居生活',
          displayCount: 10,
          displayName: '精选好物',
          displayType: 'custom',
        },
        {
          groupId: getUniqueId(),
          componentId: undefined,
          groupName: '数码影音',
          displayCount: 10,
          displayName: '数码潮品',
          displayType: 'custom',
        },
      ],
      displayStyle: 'noBorderWhite',
      showPrice: true,
      showCart: true,
      showRating: true,
      showSales: true,
      showTags: true,
      enableSeckill: false,
      autoPlay: false,
      playInterval: 3000,
    } as Goods,
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
