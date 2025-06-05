import type { TableColumnsType } from 'ant-design-vue'
import { h } from 'vue'

interface DataType {
  key: string
  title: string
  status: number
  createTime: string
  comment: string
}

export const columns: TableColumnsType<DataType> = [
  {
    title: '页面标题',
    dataIndex: 'title',
    key: 'title',
    width: 200,
  },
  {
    title: '发布状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    customRender: ({ text }) => {
      const statusMap: Record<number, { text: string; color: string }> = {
        0: { text: '未发布', color: '#d9d9d9' },
        1: { text: '已发布', color: '#52c41a' },
      }
      return h(
        'span',
        {
          style: { color: statusMap[text as number]?.color || '#666' },
        },
        statusMap[text as number]?.text || '未知',
      )
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180,
  },
  {
    title: '备注',
    dataIndex: 'comment',
    key: 'comment',
    ellipsis: true,
  },
  {
    title: '操作',
    key: 'action',
    width: 180,
    customRender: ({ record }) => {
      return h('div', [
        h(
          'a',
          {
            style: { marginRight: '15px' },
            onClick: () => console.log('编辑', record),
          },
          '编辑',
        ),
        h(
          'a',
          {
            style: { marginRight: '15px' },
            onClick: () => console.log('复制', record),
          },
          '复制',
        ),
        h(
          'a',
          {
            style: { color: '#ff4d4f' },
            onClick: () => console.log('删除', record),
          },
          '删除',
        ),
      ])
    },
  },
]

export const data: DataType[] = [
  {
    key: '1',
    title: '首页',
    status: 1,
    createTime: '2024-01-15 10:30:45',
    comment: '网站主页面',
  },
  {
    key: '2',
    title: '关于我们',
    status: 1,
    createTime: '2024-01-16 14:20:30',
    comment: '公司简介页面',
  },
  {
    key: '3',
    title: '新功能介绍',
    status: 0,
    createTime: '2024-01-17 09:15:00',
    comment: '产品新功能说明页面，待发布',
  },
]
