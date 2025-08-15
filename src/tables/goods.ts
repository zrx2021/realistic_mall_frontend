import type { TableColumnsType } from 'ant-design-vue'
import { h } from 'vue'
import { Tag } from 'ant-design-vue'
import AuthImage from '@/components/common/AuthImage.vue'

export interface GoodsItem {
  key: string
  id: number
  spuCode: string
  name: string
  subTitle?: string
  categoryId: number
  categoryName?: string
  brandId?: number
  brandName?: string
  supplierId?: number
  supplierName?: string
  status: number
  auditStatus: number
  auditReason?: string
  auditTime?: string
  goodsType: number
  unit: string
  weight?: number
  volume?: number
  marketPrice: number
  minPrice: number
  maxPrice: number
  costPrice: number
  totalStock: number
  availableStock: number
  warningStock: number
  salesCount: number
  viewCount: number
  collectCount: number
  commentCount: number
  goodCommentRate: number
  mainImage?: string
  images?: string[]
  isFreeShipping: boolean
  deliveryTime: number
  isHot: boolean
  isNew: boolean
  isRecommend: boolean
  isGift: boolean
  purchaseLimit: number
  minPurchase: number
  shelfTime?: string
  createdTime: string
  updatedTime?: string
}

export const columns: TableColumnsType<GoodsItem> = [
  {
    title: 'SPU编码',
    dataIndex: 'spuCode',
    key: 'spuCode',
    width: 120,
    fixed: 'left',
    customRender: ({ text }) => {
      return h('span', { style: { fontFamily: 'monospace', fontSize: '12px' } }, text)
    },
  },
  {
    title: '商品信息',
    key: 'goodsInfo',
    width: 320,
    fixed: 'left',
    customRender: ({ record }) => {
      const fallbackImage = new URL(
        '../assets/content/page/goods/九阳破壁机Y88.webp',
        import.meta.url,
      ).href

      return h('div', { style: { display: 'flex', alignItems: 'flex-start', gap: '12px' } }, [
        h(AuthImage, {
          src: record.mainImage,
          fallback: fallbackImage,
          alt: record.name,
          style: {
            width: '60px',
            height: '60px',
            objectFit: 'cover',
            borderRadius: '6px',
            border: '1px solid #f0f0f0',
            display: 'block',
            flexShrink: 0,
          },
        }),
        h('div', { style: { flex: 1, minWidth: 0 } }, [
          h(
            'div',
            {
              style: {
                fontWeight: '500',
                fontSize: '14px',
                marginBottom: '4px',
                color: '#333',
                lineHeight: '1.4',
                display: '-webkit-box',
                '-webkit-line-clamp': 2,
                '-webkit-box-orient': 'vertical',
                overflow: 'hidden',
              },
            },
            record.name,
          ),
          record.subTitle &&
            h(
              'div',
              {
                style: {
                  fontSize: '12px',
                  color: '#999',
                  marginBottom: '4px',
                  lineHeight: '1.3',
                  display: '-webkit-box',
                  '-webkit-line-clamp': 1,
                  '-webkit-box-orient': 'vertical',
                  overflow: 'hidden',
                },
              },
              record.subTitle,
            ),
          h(
            'div',
            { style: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '2px' } },
            [
              h(
                'span',
                { style: { fontSize: '12px', color: '#666' } },
                `分类: ${record.categoryName || '未分类'}`,
              ),
              record.brandName &&
                h(
                  'span',
                  { style: { fontSize: '12px', color: '#666' } },
                  `品牌: ${record.brandName}`,
                ),
            ],
          ),
          h('div', { style: { display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' } }, [
            record.isHot && h(Tag, { color: 'red', size: 'small' }, () => '热销'),
            record.isNew && h(Tag, { color: 'green', size: 'small' }, () => '新品'),
            record.isRecommend && h(Tag, { color: 'blue', size: 'small' }, () => '推荐'),
            record.isGift && h(Tag, { color: 'purple', size: 'small' }, () => '赠品'),
            record.isFreeShipping && h(Tag, { color: 'orange', size: 'small' }, () => '包邮'),
          ]),
        ]),
      ])
    },
  },
  {
    title: '商品类型',
    dataIndex: 'goodsType',
    key: 'goodsType',
    width: 100,
    customRender: ({ text }) => {
      const typeMap: Record<number, { text: string; color: string }> = {
        1: { text: '实物', color: 'blue' },
        2: { text: '虚拟', color: 'purple' },
        3: { text: '服务', color: 'green' },
      }
      const type = typeMap[text as number] || { text: '未知', color: 'default' }
      return h(Tag, { color: type.color }, () => type.text)
    },
  },
  {
    title: '价格信息',
    key: 'priceInfo',
    width: 160,
    customRender: ({ record }) => {
      const minPrice = record.minPrice || 0
      const maxPrice = record.maxPrice || 0
      const marketPrice = record.marketPrice || 0

      return h('div', { style: { fontSize: '12px' } }, [
        h(
          'div',
          { style: { color: '#e74c3c', fontWeight: '600', fontSize: '13px' } },
          `¥${minPrice.toFixed(2)}`,
        ),
        maxPrice > minPrice &&
          h(
            'div',
            { style: { color: '#95a5a6', textDecoration: 'line-through' } },
            `¥${maxPrice.toFixed(2)}`,
          ),
        marketPrice > 0 &&
          marketPrice !== minPrice &&
          h('div', { style: { color: '#7f8c8d' } }, `市场价: ¥${marketPrice.toFixed(2)}`),
        h(
          'div',
          { style: { color: '#95a5a6', fontSize: '11px' } },
          `成本: ¥${(record.costPrice || 0).toFixed(2)}`,
        ),
      ])
    },
  },
  {
    title: '库存信息',
    key: 'stockInfo',
    width: 120,
    sorter: true,
    customRender: ({ record }) => {
      const totalStock = record.totalStock || 0
      const availableStock = record.availableStock || totalStock
      const warningStock = record.warningStock || 0
      const isLowStock = totalStock <= warningStock && warningStock > 0

      return h('div', { style: { fontSize: '12px' } }, [
        h(
          'div',
          {
            style: {
              color: isLowStock ? '#e74c3c' : totalStock === 0 ? '#95a5a6' : '#2ecc71',
              fontWeight: '600',
              fontSize: '13px',
            },
          },
          `总库存: ${totalStock}`,
        ),
        h('div', { style: { color: '#7f8c8d' } }, `可用: ${availableStock}`),
        warningStock > 0 &&
          h('div', { style: { color: '#f39c12', fontSize: '11px' } }, `预警: ${warningStock}`),
        isLowStock && h('div', { style: { color: '#e74c3c', fontSize: '11px' } }, '库存不足'),
      ])
    },
  },
  {
    title: '销售数据',
    key: 'salesData',
    width: 140,
    sorter: true,
    customRender: ({ record }) => {
      const salesCount = record.salesCount || 0
      const viewCount = record.viewCount || 0
      const collectCount = record.collectCount || 0
      const commentCount = record.commentCount || 0
      const goodCommentRate = record.goodCommentRate || 0

      return h('div', { style: { fontSize: '12px' } }, [
        h(
          'div',
          { style: { color: '#2ecc71', fontWeight: '600', fontSize: '13px' } },
          `销量: ${salesCount.toLocaleString()}`,
        ),
        viewCount > 0 &&
          h('div', { style: { color: '#3498db' } }, `浏览: ${viewCount.toLocaleString()}`),
        collectCount > 0 &&
          h('div', { style: { color: '#9b59b6' } }, `收藏: ${collectCount.toLocaleString()}`),
        commentCount > 0 &&
          h(
            'div',
            { style: { color: '#f39c12' } },
            `评论: ${commentCount} (${goodCommentRate.toFixed(1)}%)`,
          ),
      ])
    },
  },
  {
    title: '商品状态',
    key: 'statusInfo',
    width: 120,
    customRender: ({ record }) => {
      const statusMap: Record<number, { text: string; color: string }> = {
        0: { text: '已下架', color: 'default' },
        1: { text: '上架中', color: 'success' },
        2: { text: '库存下架', color: 'warning' },
        3: { text: '审核中', color: 'processing' },
        4: { text: '审核失败', color: 'error' },
        5: { text: '审核通过', color: 'success' },
      }

      const auditStatusMap: Record<number, { text: string; color: string }> = {
        0: { text: '待审核', color: 'default' },
        1: { text: '审核通过', color: 'success' },
        2: { text: '审核拒绝', color: 'error' },
      }

      const status = statusMap[record.status] || { text: '未知', color: 'default' }
      const auditStatus = auditStatusMap[record.auditStatus] || { text: '未知', color: 'default' }

      return h('div', { style: { fontSize: '12px' } }, [
        h(Tag, { color: status.color }, () => status.text),
        h('div', { style: { marginTop: '4px' } }, [
          h(Tag, { color: auditStatus.color, size: 'small' }, () => auditStatus.text),
        ]),
        record.auditReason &&
          record.auditStatus === 2 &&
          h(
            'div',
            {
              style: {
                color: '#e74c3c',
                fontSize: '10px',
                marginTop: '2px',
                maxWidth: '100px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              },
              title: record.auditReason,
            },
            record.auditReason,
          ),
      ])
    },
  },
  {
    title: '规格信息',
    key: 'specInfo',
    width: 120,
    customRender: ({ record }) => {
      return h('div', { style: { fontSize: '12px' } }, [
        h('div', { style: { color: '#7f8c8d' } }, `单位: ${record.unit || '件'}`),
        record.weight && h('div', { style: { color: '#7f8c8d' } }, `重量: ${record.weight}kg`),
        record.volume && h('div', { style: { color: '#7f8c8d' } }, `体积: ${record.volume}m³`),
        h(
          'div',
          { style: { color: '#7f8c8d' } },
          `起购: ${record.minPurchase || 1}${record.unit || '件'}`,
        ),
        record.purchaseLimit > 0 &&
          h(
            'div',
            { style: { color: '#f39c12' } },
            `限购: ${record.purchaseLimit}${record.unit || '件'}`,
          ),
      ])
    },
  },
  {
    title: '时间信息',
    key: 'timeInfo',
    width: 160,
    customRender: ({ record }) => {
      const createdTime = record.createdTime
      const shelfTime = record.shelfTime

      return h('div', { style: { fontSize: '12px' } }, [
        createdTime &&
          h(
            'div',
            { style: { color: '#7f8c8d' } },
            `创建: ${new Date(createdTime).toLocaleDateString()}`,
          ),
        shelfTime &&
          h(
            'div',
            { style: { color: '#2ecc71' } },
            `上架: ${new Date(shelfTime).toLocaleDateString()}`,
          ),
        record.auditTime &&
          h(
            'div',
            { style: { color: '#3498db' } },
            `审核: ${new Date(record.auditTime).toLocaleDateString()}`,
          ),
      ])
    },
  },
  {
    title: '操作',
    key: 'action',
    width: 160,
    fixed: 'right',
    customRender: ({ record }) => {
      const handleEdit = () => {
        console.log('编辑商品', record)
      }

      const handleDetail = () => {
        // 通过事件通知父组件查看详情
        window.dispatchEvent(new CustomEvent('view-goods-detail', { detail: record }))
      }

      const handleAudit = () => {
        console.log('审核商品', record)
      }

      const handleStatusChange = () => {
        console.log('修改状态', record)
      }

      const handleCopy = () => {
        console.log('复制商品', record)
      }

      const handleDelete = () => {
        console.log('删除商品', record)
      }

      return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } }, [
        h('div', [
          h(
            'a',
            {
              style: { marginRight: '8px', color: '#1890ff', fontSize: '12px' },
              onClick: handleDetail,
            },
            '详情',
          ),
          h(
            'a',
            {
              style: { marginRight: '8px', color: '#1890ff', fontSize: '12px' },
              onClick: handleEdit,
            },
            '编辑',
          ),
        ]),
        h('div', [
          record.auditStatus === 0 &&
            h(
              'a',
              {
                style: { marginRight: '8px', color: '#52c41a', fontSize: '12px' },
                onClick: handleAudit,
              },
              '审核',
            ),
          h(
            'a',
            {
              style: { marginRight: '8px', color: '#fa8c16', fontSize: '12px' },
              onClick: handleStatusChange,
            },
            record.status === 1 ? '下架' : '上架',
          ),
        ]),
        h('div', [
          h(
            'a',
            {
              style: { marginRight: '8px', color: '#722ed1', fontSize: '12px' },
              onClick: handleCopy,
            },
            '复制',
          ),
          h(
            'a',
            {
              style: { color: '#ff4d4f', fontSize: '12px' },
              onClick: handleDelete,
            },
            '删除',
          ),
        ]),
      ])
    },
  },
]

// 示例数据
export const mockData: GoodsItem[] = [
  {
    key: '1',
    id: 2468896445,
    spuCode: 'SPU202401001',
    name: '格兰仕烤箱12L 自动控温多功能电烤箱',
    subTitle: '家用小烤箱，智能控温，多层烘烤，操作简单',
    categoryId: 1,
    categoryName: '家用电器',
    brandId: 1,
    brandName: '格兰仕',
    supplierId: 1,
    supplierName: '格兰仕供应商',
    status: 1,
    auditStatus: 1,
    goodsType: 1,
    unit: '台',
    weight: 8.5,
    volume: 0.045,
    marketPrice: 399.0,
    minPrice: 269.0,
    maxPrice: 399.0,
    costPrice: 180.0,
    totalStock: 2999,
    availableStock: 2950,
    warningStock: 100,
    salesCount: 34678,
    viewCount: 125890,
    collectCount: 5678,
    commentCount: 2345,
    goodCommentRate: 96.8,
    mainImage: new URL('../assets/content/page/goods/九阳破壁机Y88.webp', import.meta.url).href,
    isFreeShipping: true,
    deliveryTime: 24,
    isHot: true,
    isNew: false,
    isRecommend: true,
    isGift: false,
    purchaseLimit: 5,
    minPurchase: 1,
    shelfTime: '2024-01-10 09:00:00',
    createdTime: '2024-01-09 15:30:00',
  },
  {
    key: '2',
    id: 1234567890,
    spuCode: 'SPU202401002',
    name: 'iPhone 15 Pro Max 256GB 深空黑色',
    subTitle: '钛金属设计，A17 Pro芯片，专业级摄像头系统',
    categoryId: 2,
    categoryName: '数码产品',
    brandId: 2,
    brandName: '苹果',
    supplierId: 2,
    supplierName: '苹果授权供应商',
    status: 1,
    auditStatus: 1,
    goodsType: 1,
    unit: '台',
    weight: 0.221,
    marketPrice: 10999.0,
    minPrice: 9999.0,
    maxPrice: 10999.0,
    costPrice: 8500.0,
    totalStock: 150,
    availableStock: 145,
    warningStock: 20,
    salesCount: 1250,
    viewCount: 89650,
    collectCount: 12340,
    commentCount: 890,
    goodCommentRate: 98.2,
    mainImage: new URL(
      '../assets/content/page/goods/iPhone 15 Pro Max 256GB 深空黑色.webp',
      import.meta.url,
    ).href,
    isFreeShipping: true,
    deliveryTime: 12,
    isHot: true,
    isNew: true,
    isRecommend: true,
    isGift: false,
    purchaseLimit: 2,
    minPurchase: 1,
    shelfTime: '2024-01-15 10:00:00',
    createdTime: '2024-01-14 16:20:30',
  },
  {
    key: '3',
    id: 9876543210,
    spuCode: 'SPU202401003',
    name: 'Nike Air Max 270运动鞋',
    subTitle: '全掌气垫，舒适透气，时尚百搭',
    categoryId: 3,
    categoryName: '服装鞋帽',
    brandId: 3,
    brandName: 'Nike',
    supplierId: 3,
    supplierName: '耐克供应商',
    status: 2,
    auditStatus: 1,
    auditReason: '库存不足自动下架',
    goodsType: 1,
    unit: '双',
    weight: 0.8,
    marketPrice: 1299.0,
    minPrice: 899.0,
    maxPrice: 1299.0,
    costPrice: 650.0,
    totalStock: 0,
    availableStock: 0,
    warningStock: 10,
    salesCount: 2890,
    viewCount: 45600,
    collectCount: 3210,
    commentCount: 1560,
    goodCommentRate: 94.5,
    mainImage: new URL('../assets/content/page/goods/Nike Air Max 270运动鞋.webp', import.meta.url)
      .href,
    isFreeShipping: false,
    deliveryTime: 48,
    isHot: false,
    isNew: false,
    isRecommend: false,
    isGift: false,
    purchaseLimit: 3,
    minPurchase: 1,
    shelfTime: '2024-02-10 14:00:00',
    createdTime: '2024-02-09 16:45:12',
  },
  {
    key: '4',
    id: 5555666677,
    spuCode: 'SPU202401004',
    name: '三只松鼠坚果礼盒',
    subTitle: '精选优质坚果，营养丰富，健康美味',
    categoryId: 4,
    categoryName: '食品饮料',
    brandId: 4,
    brandName: '三只松鼠',
    supplierId: 4,
    supplierName: '三只松鼠供应商',
    status: 3,
    auditStatus: 0,
    goodsType: 1,
    unit: '盒',
    weight: 1.2,
    marketPrice: 168.0,
    minPrice: 128.0,
    maxPrice: 168.0,
    costPrice: 85.0,
    totalStock: 8888,
    availableStock: 8800,
    warningStock: 500,
    salesCount: 15670,
    viewCount: 78900,
    collectCount: 4560,
    commentCount: 3210,
    goodCommentRate: 97.8,
    mainImage: new URL('../assets/content/page/goods/三只松鼠坚果礼盒.webp', import.meta.url).href,
    isFreeShipping: true,
    deliveryTime: 24,
    isHot: true,
    isNew: false,
    isRecommend: true,
    isGift: true,
    purchaseLimit: 10,
    minPurchase: 1,
    shelfTime: '2024-03-05 09:30:00',
    createdTime: '2024-03-04 10:30:45',
  },
  {
    key: '5',
    id: 7777888899,
    spuCode: 'SPU202401005',
    name: '戴森V15 Detect无绳吸尘器',
    subTitle: '激光探测科技，强劲吸力，深度清洁',
    categoryId: 1,
    categoryName: '家用电器',
    brandId: 5,
    brandName: '戴森',
    supplierId: 5,
    supplierName: '戴森供应商',
    status: 4,
    auditStatus: 2,
    auditReason: '产品描述不符合规范要求',
    auditTime: '2024-03-22 14:30:00',
    goodsType: 1,
    unit: '台',
    weight: 3.1,
    volume: 0.02,
    marketPrice: 5990.0,
    minPrice: 4990.0,
    maxPrice: 5990.0,
    costPrice: 3800.0,
    totalStock: 45,
    availableStock: 40,
    warningStock: 10,
    salesCount: 567,
    viewCount: 23400,
    collectCount: 1890,
    commentCount: 234,
    goodCommentRate: 95.6,
    mainImage: new URL(
      '../assets/content/page/goods/戴森V15 Detect无绳吸尘器.webp',
      import.meta.url,
    ).href,
    isFreeShipping: true,
    deliveryTime: 24,
    isHot: false,
    isNew: true,
    isRecommend: false,
    isGift: false,
    purchaseLimit: 1,
    minPurchase: 1,
    createdTime: '2024-03-20 11:15:22',
  },
]
