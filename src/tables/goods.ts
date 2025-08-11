import type { TableColumnsType } from 'ant-design-vue'
import { h } from 'vue'
import { Tag } from 'ant-design-vue'

export interface GoodsItem {
  key: string
  id: number
  name: string
  category: string
  inventory: number
  salePrice: number
  originalPrice: number
  totalSales: number
  status: number
  createTime: string
  image?: string
}

export const columns: TableColumnsType<GoodsItem> = [
  {
    title: '商品ID',
    dataIndex: 'id',
    key: 'id',
    width: 120,
  },
  {
    title: '商品信息',
    key: 'goodsInfo',
    width: 300,
    customRender: ({ record }) => {
      return h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } }, [
        h('img', {
          src:
            record.image ||
            new URL('../assets/content/page/goods/九阳破壁机Y88.webp', import.meta.url).href,
          style: {
            width: '60px',
            height: '60px',
            objectFit: 'cover',
            borderRadius: '4px',
            border: '1px solid #f0f0f0',
            display: 'block',
          },
          onError: (e: Event) => {
            const target = e.target as HTMLImageElement
            target.src = new URL(
              '../assets/content/page/goods/九阳破壁机Y88.webp',
              import.meta.url,
            ).href
          },
        }),
        h('div', { style: { flex: 1 } }, [
          h(
            'div',
            {
              style: {
                fontWeight: '500',
                fontSize: '14px',
                marginBottom: '4px',
                color: '#333',
              },
            },
            record.name,
          ),
          h(
            'div',
            {
              style: {
                fontSize: '12px',
                color: '#666',
              },
            },
            `分类: ${record.category}`,
          ),
        ]),
      ])
    },
  },
  {
    title: '库存',
    dataIndex: 'inventory',
    key: 'inventory',
    width: 100,
    sorter: true,
  },
  {
    title: '售价',
    dataIndex: 'salePrice',
    key: 'salePrice',
    width: 100,
    customRender: ({ text }) => {
      return h('span', `¥${Number(text).toFixed(2)}`)
    },
  },
  {
    title: '原价',
    dataIndex: 'originalPrice',
    key: 'originalPrice',
    width: 100,
    customRender: ({ text }) => {
      return h('span', `¥${Number(text).toFixed(2)}`)
    },
  },
  {
    title: '总销量',
    dataIndex: 'totalSales',
    key: 'totalSales',
    width: 100,
    sorter: true,
  },
  {
    title: '商品状态',
    dataIndex: 'status',
    key: 'status',
    width: 120,
    customRender: ({ text }) => {
      const statusMap: Record<number, { text: string; color: string }> = {
        0: { text: '已下架', color: 'default' },
        1: { text: '上架中', color: 'success' },
        2: { text: '违规下架', color: 'error' },
        3: { text: '审核通过', color: 'processing' },
        4: { text: '审核失败', color: 'error' },
        5: { text: '审核通过', color: 'success' },
      }

      const status = statusMap[text as number] || { text: '未知', color: 'default' }

      return h('div', [
        h(Tag, { color: status.color }, () => status.text),
        text === 1 &&
          h('div', { style: { fontSize: '12px', color: '#666', marginTop: '2px' } }, '审核通过'),
      ])
    },
  },
  {
    title: '上架时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180,
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    customRender: ({ record }) => {
      const handleEdit = () => {
        console.log('编辑商品', record)
      }

      const handleTakeDown = () => {
        console.log('下架商品', record)
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
              style: { marginRight: '12px', color: '#1890ff' },
              onClick: handleEdit,
            },
            '编辑',
          ),
          h(
            'a',
            {
              style: { marginRight: '12px', color: '#1890ff' },
              onClick: handleTakeDown,
            },
            '下架',
          ),
        ]),
        h('div', [
          h(
            'a',
            {
              style: { marginRight: '12px', color: '#1890ff' },
              onClick: handleCopy,
            },
            '复制商品',
          ),
          h(
            'a',
            {
              style: { color: '#ff4d4f' },
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
    name: '格兰仕烤箱12L 自动',
    category: '家用电器',
    inventory: 2999,
    salePrice: 69.0,
    originalPrice: 39.0,
    totalSales: 34678,
    status: 1,
    createTime: '2035-09-19 9:39:39',
    image: new URL('../assets/content/page/goods/九阳破壁机Y88.webp', import.meta.url).href,
  },
  {
    key: '2',
    id: 1234567890,
    name: 'iPhone 15 Pro Max 256GB 深空黑色',
    category: '数码产品',
    inventory: 150,
    salePrice: 9999.0,
    originalPrice: 10999.0,
    totalSales: 1250,
    status: 1,
    createTime: '2024-01-15 14:20:30',
    image: new URL(
      '../assets/content/page/goods/iPhone 15 Pro Max 256GB 深空黑色.webp',
      import.meta.url,
    ).href,
  },
  {
    key: '3',
    id: 9876543210,
    name: 'Nike Air Max 270运动鞋',
    category: '服装鞋帽',
    inventory: 0,
    salePrice: 899.0,
    originalPrice: 1299.0,
    totalSales: 2890,
    status: 0,
    createTime: '2024-02-10 16:45:12',
    image: new URL('../assets/content/page/goods/Nike Air Max 270运动鞋.webp', import.meta.url)
      .href,
  },
  {
    key: '4',
    id: 5555666677,
    name: '三只松鼠坚果礼盒',
    category: '食品饮料',
    inventory: 8888,
    salePrice: 128.0,
    originalPrice: 168.0,
    totalSales: 15670,
    status: 3,
    createTime: '2024-03-05 10:30:45',
    image: new URL('../assets/content/page/goods/三只松鼠坚果礼盒.webp', import.meta.url).href,
  },
  {
    key: '5',
    id: 7777888899,
    name: '戴森V15 Detect无绳吸尘器',
    category: '家用电器',
    inventory: 45,
    salePrice: 4990.0,
    originalPrice: 5990.0,
    totalSales: 567,
    status: 4,
    createTime: '2024-03-20 11:15:22',
    image: new URL('../assets/content/page/goods/戴森V15 Detect无绳吸尘器.webp', import.meta.url)
      .href,
  },
]
