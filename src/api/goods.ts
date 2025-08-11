import { get, post, put, del } from '@/utils/request'

// 商品查询参数
export interface GoodsQueryParams {
  name?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  inventoryType?: string
  inventoryRange?: string
  startTime?: string
  status?: number
  pageNumber?: number
  pageSize?: number
}

// 商品信息
export interface GoodsInfo {
  id: number
  name: string
  category: string
  inventory: number
  salePrice: number
  originalPrice: number
  totalSales: number
  status: number
  createTime: string
  updateTime?: string
  image?: string
  description?: string
}

// 分页响应
export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  page: number
  size: number
  first: boolean
  last: boolean
}

// 获取商品列表
export const getGoodsList = (params: GoodsQueryParams) => {
  return get<PageResponse<GoodsInfo>>('/goods/list', params)
}

// 获取商品详情
export const getGoodsDetail = (id: number) => {
  return get<GoodsInfo>(`/goods/${id}`)
}

// 新增商品
export const addGoods = (data: Omit<GoodsInfo, 'id' | 'createTime' | 'updateTime'>) => {
  return post<GoodsInfo>('/goods', data)
}

// 更新商品
export const updateGoods = (id: number, data: Partial<GoodsInfo>) => {
  return put<GoodsInfo>(`/goods/${id}`, data)
}

// 删除商品
export const deleteGoods = (id: number) => {
  return del<void>(`/goods/${id}`)
}

// 批量删除商品
export const batchDeleteGoods = (ids: number[]) => {
  return post<void>('/goods/batch/delete', { ids })
}

// 批量上架
export const batchOnlineGoods = (ids: number[]) => {
  return put<void>('/goods/batch/online', { ids })
}

// 批量下架
export const batchOfflineGoods = (ids: number[]) => {
  return put<void>('/goods/batch/offline', { ids })
}

// 导出商品数据
export const exportGoods = (params: GoodsQueryParams) => {
  return get<Blob>('/goods/export', params)
}

// 获取商品分类列表
export const getGoodsCategories = () => {
  return get<string[]>('/goods/categories')
}
