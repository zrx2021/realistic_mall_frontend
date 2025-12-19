import { ref } from 'vue'
import { getImageUrl, getGoodsImageUrl } from '@/utils/image'
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

interface Component {
  id: number,
  name: string,
  icon: string,
  file: string
}

export interface ArticleType {
  name: string,
  component: Component[]
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
  id: number
  componentId?: number
  goodsCategoryId: number
  // goodsCategoryName: string
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
  // category: string // 商品分类
  categoryIds: number[]
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
  enableGroup: boolean // 是否开启分组
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
    if (type === 4) {
      // 为商品组件的分组生成新的ID
      const newGroupId = ref(-1)
      newTemplate.value.objData.goodsId = getUniqueId()
      newTemplate.value.objData.groupData.forEach((item: GoodsGroup) => {
        newGroupId.value = getUniqueId()
        item.id = newGroupId.value
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
    type: 4,
    objData: {
      goodsId: getUniqueId(),
      componentId: undefined,
      templateStyle: 'oneMainTwoSub',
      goodsList: [
        // 数码影音类商品
        {
          id: 1,
          name: 'iPhone 15 Pro Max 256GB 深空黑色',
          description: '钛金属设计，A17 Pro芯片，专业级摄像头系统',
          price: 9999,
          originalPrice: 10999,
          imageUrl: getGoodsImageUrl('iPhone 15 Pro Max 256GB 深空黑色.webp'),
          stock: 50,
          sales: 1234,
          rating: 4.8,
          tags: ['热销', '新品', '5G'],
          discount: 9,
          isHot: true,
          isNew: true,
          categoryIds: [10],
        },
        {
          id: 2,
          name: '小米13 Ultra 徕卡影像旗舰手机',
          description: '徕卡专业影像，骁龙8 Gen2处理器',
          price: 5999,
          originalPrice: 6499,
          imageUrl: getGoodsImageUrl('小米13 Ultra 徕卡影像旗舰手机.webp'),
          stock: 30,
          sales: 856,
          rating: 4.7,
          tags: ['徕卡', '影像'],
          discount: 8,
          categoryIds: [10],
        },
        {
          id: 3,
          name: 'AirPods Pro 第二代',
          description: '主动降噪，空间音频，无线充电',
          price: 1899,
          originalPrice: 2199,
          imageUrl: getGoodsImageUrl('AirPods Pro 第二代.webp'),
          stock: 100,
          sales: 2341,
          rating: 4.6,
          tags: ['降噪', '无线'],
          categoryIds: [10],
        },
        {
          id: 4,
          name: 'MacBook Pro 14英寸 M3芯片',
          description: 'M3芯片，Liquid Retina XDR显示屏，专业级性能',
          price: 14999,
          originalPrice: 15999,
          imageUrl: getGoodsImageUrl('MacBook Pro 14英寸 M3芯片.webp'),
          stock: 25,
          sales: 567,
          rating: 4.9,
          tags: ['新品', '专业'],
          discount: 6,
          isNew: true,
          categoryIds: [10],
        },
        {
          id: 5,
          name: 'iPad Air 第五代 256GB',
          description: 'M1芯片，10.9英寸Liquid Retina显示屏',
          price: 5399,
          originalPrice: 5899,
          imageUrl: new URL(
            '@/assets/content/page/goods/iPad Air 第五代 256GB.webp',
            import.meta.url,
          ).href,
          stock: 40,
          sales: 892,
          rating: 4.7,
          tags: ['热销', 'M1'],
          discount: 8,
          isHot: true,
          categoryIds: [10],
        },
        {
          id: 6,
          name: 'Sony WH-1000XM5 无线降噪耳机',
          description: '业界领先降噪技术，30小时续航',
          price: 2399,
          originalPrice: 2699,
          imageUrl: new URL(
            '@/assets/content/page/goods/Sony WH-1000XM5 无线降噪耳机.webp',
            import.meta.url,
          ).href,
          stock: 60,
          sales: 1456,
          rating: 4.8,
          tags: ['降噪', '音质'],
          discount: 11,
          categoryIds: [10],
        },
        {
          id: 7,
          name: '华为Watch GT 4智能手表',
          description: '健康监测，运动追踪，14天续航',
          price: 1688,
          originalPrice: 1888,
          imageUrl: new URL(
            '@/assets/content/page/goods/华为Watch GT4智能手表.webp',
            import.meta.url,
          ).href,
          stock: 80,
          sales: 723,
          rating: 4.5,
          tags: ['智能', '健康'],
          discount: 10,
          categoryIds: [10],
        },
        {
          id: 8,
          name: 'Nintendo Switch OLED游戏机',
          description: '7英寸OLED屏幕，增强音频体验',
          price: 2599,
          imageUrl: new URL(
            '@/assets/content/page/goods/Nintendo Switch OLED游戏机.webp',
            import.meta.url,
          ).href,
          stock: 35,
          sales: 445,
          rating: 4.6,
          tags: ['游戏', 'OLED'],
          categoryIds: [10],
        },
        // 家居生活类商品
        {
          id: 9,
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
          categoryIds: [100],
        },
        {
          id: 10,
          name: '小米空气净化器Pro H',
          description: 'HEPA滤网，智能控制，静音运行',
          price: 1699,
          originalPrice: 1899,
          imageUrl: new URL(
            '@/assets/content/page/goods/戴森V15 Detect无绳吸尘器.webp',
            import.meta.url,
          ).href,
          stock: 45,
          sales: 678,
          rating: 4.6,
          tags: ['智能', '净化'],
          discount: 10,
          categoryIds: [100],
        },
        {
          id: 11,
          name: '美的变频空调 1.5匹',
          description: '一级能效，智能温控，静音设计',
          price: 2999,
          originalPrice: 3499,
          imageUrl: getGoodsImageUrl('美的变频空调 1.5匹.webp'),
          stock: 30,
          sales: 234,
          rating: 4.4,
          tags: ['节能', '静音'],
          discount: 14,
          categoryIds: [100],
        },
        {
          id: 12,
          name: '九阳破壁机Y88',
          description: '多功能破壁，营养萃取，智能预约',
          price: 899,
          originalPrice: 1199,
          imageUrl: getGoodsImageUrl('九阳破壁机Y88.webp'),
          stock: 55,
          sales: 1123,
          rating: 4.7,
          tags: ['热销', '营养'],
          discount: 25,
          isHot: true,
          categoryIds: [100],
        },
        {
          id: 13,
          name: '飞利浦电动牙刷HX6730',
          description: '声波震动，深度清洁，智能提醒',
          price: 399,
          originalPrice: 499,
          imageUrl: new URL(
            '@/assets/content/page/goods/飞利浦电动牙刷HX6730.webp',
            import.meta.url,
          ).href,
          stock: 80,
          sales: 1567,
          rating: 4.5,
          tags: ['清洁', '健康'],
          discount: 20,
          categoryIds: [100],
        },
        {
          id: 14,
          name: '宜家HEMNES书桌',
          description: '实木材质，简约设计，多功能收纳',
          price: 799,
          imageUrl: getGoodsImageUrl('宜家HEMNES书桌.webp'),
          stock: 25,
          sales: 156,
          rating: 4.3,
          tags: ['实木', '收纳'],
          categoryIds: [100],
        },
        {
          id: 15,
          name: '松下电饭煲SR-HZ106',
          description: 'IH加热，智能烹饪，多种口感选择',
          price: 1299,
          originalPrice: 1499,
          imageUrl: getGoodsImageUrl('松下电饭煲SR-HZ106.webp'),
          stock: 40,
          sales: 445,
          rating: 4.8,
          tags: ['智能', 'IH'],
          discount: 13,
          categoryIds: [100],
        },
        {
          id: 16,
          name: '网易严选乳胶床垫',
          description: '天然乳胶，透气舒适，抗菌防螨',
          price: 2199,
          originalPrice: 2699,
          imageUrl: getGoodsImageUrl('网易严选乳胶床垫.webp'),
          stock: 15,
          sales: 89,
          rating: 4.6,
          tags: ['舒适', '防螨'],
          discount: 18,
          categoryIds: [100],
        },
        // 服装美妆类商品
        {
          id: 17,
          name: 'Uniqlo 优衣库羽绒服',
          description: '轻薄保暖，防风防水，时尚百搭',
          price: 599,
          originalPrice: 799,
          imageUrl: getGoodsImageUrl('Uniqlo 优衣库羽绒服.webp'),
          stock: 60,
          sales: 1234,
          rating: 4.5,
          tags: ['保暖', '时尚'],
          discount: 25,
          categoryIds: [1000],
        },
        {
          id: 18,
          name: 'SK-II 神仙水 230ml',
          description: '经典护肤精华，改善肌肤质感',
          price: 1690,
          originalPrice: 1890,
          imageUrl: getGoodsImageUrl('SK-II 神仙水 230ml.webp'),
          stock: 30,
          sales: 567,
          rating: 4.8,
          tags: ['护肤', '精华'],
          discount: 10,
          categoryIds: [1000],
        },
        {
          id: 19,
          name: 'Nike Air Max 270运动鞋',
          description: '气垫缓震，舒适透气，潮流设计',
          price: 899,
          originalPrice: 1199,
          imageUrl: new URL(
            '@/assets/content/page/goods/Nike Air Max 270运动鞋.webp',
            import.meta.url,
          ).href,
          stock: 45,
          sales: 892,
          rating: 4.6,
          tags: ['运动', '潮流'],
          discount: 25,
          categoryIds: [10],
        },
        {
          id: 20,
          name: '雅诗兰黛小棕瓶精华',
          description: '抗老修护，紧致肌肤，夜间修护',
          price: 780,
          originalPrice: 880,
          imageUrl: getGoodsImageUrl('雅诗兰黛小棕瓶精华.webp'),
          stock: 25,
          sales: 445,
          rating: 4.7,
          tags: ['抗老', '修护'],
          discount: 11,
          categoryIds: [1000],
        },
        // 秒杀商品
        {
          id: 21,
          name: '小米手环8 NFC版',
          description: '健康监测，NFC支付，超长续航',
          price: 199,
          originalPrice: 299,
          imageUrl: getGoodsImageUrl('小米手环8 NFC版.webp'),
          stock: 100,
          sales: 2345,
          rating: 4.4,
          tags: ['秒杀', 'NFC'],
          discount: 33,
          isSeckill: true,
          seckillEndTime: '2024-12-31T23:59:59',
          categoryIds: [10],
        },
        {
          id: 22,
          name: '三只松鼠坚果礼盒',
          description: '精选坚果，营养健康，节日送礼',
          price: 89,
          originalPrice: 129,
          imageUrl: getGoodsImageUrl('三只松鼠坚果礼盒.webp'),
          stock: 200,
          sales: 3456,
          rating: 4.3,
          tags: ['秒杀', '健康'],
          discount: 31,
          isSeckill: true,
          seckillEndTime: '2024-12-31T23:59:59',
          categoryIds: [10000],
        },
        {
          id: 23,
          name: '蒙牛特仑苏纯牛奶 250ml*16盒',
          description: '优质奶源，营养丰富，家庭装',
          price: 69,
          originalPrice: 89,
          imageUrl: getGoodsImageUrl('蒙牛特仑苏纯牛奶250ml16盒.jpg'),
          stock: 150,
          sales: 1789,
          rating: 4.5,
          tags: ['营养', '家庭装'],
          discount: 22,
          categoryIds: [10000],
        },
        {
          id: 24,
          name: '良品铺子零食大礼包',
          description: '多种口味，休闲零食，办公必备',
          price: 128,
          originalPrice: 168,
          imageUrl: getGoodsImageUrl('良品铺子零食大礼包.webp'),
          stock: 80,
          sales: 1123,
          rating: 4.2,
          tags: ['零食', '礼包'],
          discount: 24,
          categoryIds: [10000],
        },
      ],
      groupData: [
        {
          id: getUniqueId(),
          componentId: undefined,
          goodsCategoryId: 10,
          // goodsCategoryName: '数码影音',
          displayCount: 8,
          displayName: '数码潮品',
          displayType: 'custom',
        },
        {
          id: getUniqueId(),
          componentId: undefined,
          goodsCategoryId: 100,
          // goodsCategoryName: '家居生活',
          displayCount: 8,
          displayName: '精选好物',
          displayType: 'custom',
        },
        {
          id: getUniqueId(),
          componentId: undefined,
          goodsCategoryId: 1000,
          // goodsCategoryName: '服装美妆',
          displayCount: 4,
          displayName: '时尚美妆',
          displayType: 'custom',
        },
        {
          id: getUniqueId(),
          componentId: undefined,
          goodsCategoryId: 10000,
          // goodsCategoryName: '食品饮料',
          displayCount: 4,
          displayName: '美食推荐',
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
      { id: 4, name: '商品', icon: '商品', category: '基础组件', file: 'Product' },
      { id: 5, name: '图片', icon: '图片', category: '基础组件', file: 'Image' },
      {
        id: 6,
        name: '富文本',
        icon: '富文本',
        category: '基础组件',
        file: 'RichText',
      },
      { id: 7, name: '搜索', icon: '搜索', category: '基础组件', file: 'Search' },
      {
        id: 8,
        name: '辅助分割',
        icon: '辅助分割',
        category: '基础组件',
        file: 'Divider',
      },
      { id: 9, name: '视频', icon: '视频', category: '基础组件', file: 'Video' },
      { id: 10, name: '公告', icon: '公告', category: '基础组件', file: 'Notice' },
    ],
  },
  {
    name: '营销组件',
    components: [
      {
        id: 11,
        name: '优惠券',
        icon: '优惠券',
        category: '营销组件',
        file: 'Coupon',
      },
      {
        id: 12,
        name: '限时折扣',
        icon: '限时折扣',
        category: '营销组件',
        file: 'Discount',
      },
      { id: 13, name: '秒杀', icon: '秒杀', category: '营销组件', file: 'Seckill' },
      { id: 14, name: '拼团', icon: '拼团', category: '营销组件', file: 'Group' },
      { id: 15, name: '满减', icon: '满减', category: '营销组件', file: 'FullReduction' },
      { id: 16, name: '积分', icon: '积分', category: '营销组件', file: 'Points' },
    ],
  },
  {
    name: '高级组件',
    components: [
      {
        id: 17,
        name: '轮播图',
        icon: '轮播图',
        category: '高级组件',
        file: 'Carousel',
      },
      {
        id: 18,
        name: '分类导航',
        icon: '分类导航',
        category: '高级组件',
        file: 'Category',
      },
      {
        id: 19,
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
