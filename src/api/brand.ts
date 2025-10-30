import { get, post, put, del, upload } from '@/utils/request'

// 品牌查询参数
export interface BrandQueryParams {
  keyword?: string // 品牌名称或英文名搜索
  country?: string // 品牌国家
  isActive?: boolean // 是否启用
  pageNumber?: number
  pageSize?: number
  sortBy?: string // 排序字段
  sortOrder?: 'asc' | 'desc' // 排序方向
}

// 品牌信息
export interface BrandInfo {
  id: number
  name: string // 品牌名称
  englishName?: string // 品牌英文名
  logo?: string // 品牌LOGO URL
  description?: string // 品牌描述
  website?: string // 品牌官网
  country?: string // 品牌国家
  sortOrder: number // 排序权重
  isActive: boolean // 是否启用：1-启用，0-禁用
  createdBy?: number // 创建人ID
  updatedBy?: number // 更新人ID
  createdTime?: string // 创建时间
  updatedTime?: string // 更新时间
}

// 品牌创建/更新参数
export interface BrandCreateParams {
  name: string
  englishName?: string
  logo?: string
  description?: string
  website?: string
  country?: string
  sortOrder?: number
  isActive?: boolean
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

// 获取品牌列表
export const getBrandList = (params: BrandQueryParams) => {
  const { pageNumber = 0, pageSize = 10, ...queryParams } = params

  // 构建查询参数（分页参数通过URL传递）
  const urlParams = new URLSearchParams({
    pageNumber: String((pageNumber || 0) + 1), // 前端从0开始，后端从1开始
    pageSize: String(pageSize || 10),
  })

  return get<PageResponse<BrandInfo>>(`/goods/brands?${urlParams.toString()}`, queryParams)
}

// 获取品牌详情
export const getBrandDetail = (id: number) => {
  return get<BrandInfo>(`/goods/brands/${id}`)
}

// 新增品牌
export const addBrand = (data: BrandCreateParams) => {
  return post<BrandInfo>('/goods/brands', data)
}

// 更新品牌
export const updateBrand = (id: number, data: Partial<BrandCreateParams>) => {
  return put<BrandInfo>(`/goods/brands/${id}`, data)
}

// 删除品牌
export const deleteBrand = (id: number) => {
  return del<void>(`/goods/brands/${id}`)
}

// 批量删除品牌
export const batchDeleteBrands = (ids: number[]) => {
  return del<void>(`/goods/brands/${ids.join(',')}`)
}

// 更新品牌状态
export const updateBrandStatus = (id: number, isActive: boolean) => {
  return put<void>(`/goods/brands/${id}/status`, { isActive })
}

// 导出品牌数据
export const exportBrands = (params: BrandQueryParams) => {
  return get<Blob>('/goods/brands/export', params)
}

// 上传品牌LOGO
export const uploadBrandLogo = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('category', 'goods/brands')
  formData.append('file', file)

  return await upload<string>('/file/image/upload', formData)
}

// 获取所有启用的品牌（用于下拉选择）
export const getActiveBrands = () => {
  return get<BrandInfo[]>('/brands/active')
}

// 获取品牌统计信息
export const getBrandStats = () => {
  return get<{
    total: number
    active: number
    inactive: number
  }>('/brands/stats')
}

