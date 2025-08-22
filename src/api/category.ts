import { get, post, put, del, upload } from '@/utils/request'

// 分类数据接口（匹配后端实体类）
export interface CategoryItem {
  id: number
  name: string
  parentId: number | null
  level: number
  path?: string // 分类路径，格式：1,2,3
  sortOrder: number // 排序权重，数值越大越靠前
  icon?: string // 分类图标URL
  description?: string // 分类描述
  isActive: boolean // 是否启用：true-启用，false-禁用
  seoTitle?: string // SEO标题
  seoKeywords?: string // SEO关键词
  seoDescription?: string // SEO描述
  createTime: string
  updateTime?: string
  children?: CategoryItem[]
  hasChildren?: boolean
  goodsCount?: number // 商品数量（可能需要关联查询）
}

// 分类查询参数
export interface CategoryQueryParams {
  name?: string // 分类名称
  parentId?: number | null // 父级分类ID
  level?: number // 分类级别
  pageNumber?: number
  pageSize?: number
}

// 分类创建/更新参数
export interface CategoryCreateParams {
  name: string
  parentId?: number | null
  level?: number
  sortOrder: number
  icon?: string
  description?: string
  isActive: boolean
  seoTitle?: string
  seoKeywords?: string
  seoDescription?: string
}

export interface CategoryUpdateParams extends CategoryCreateParams {
  id: number
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

// 获取商品分类（前两层）- 匹配后端接口
export const getCategoryList = () => {
  return get<CategoryItem[]>('/goods/category')
}

// 获取分类列表（分页）
export const getCategoryListPaged = (params: CategoryQueryParams) => {
  const { pageNumber = 0, pageSize = 10, ...queryParams } = params

  const urlParams = new URLSearchParams({
    pageNumber: String((pageNumber || 0) + 1),
    pageSize: String(pageSize || 10),
  })

  return post<PageResponse<CategoryItem>>(`/category/list?${urlParams.toString()}`, queryParams)
}

// 获取分类详情
export const getCategoryDetail = (id: number) => {
  return get<CategoryItem>(`/category/${id}`)
}

// 添加商品分类 - 匹配后端接口
export const addCategory = (data: CategoryCreateParams) => {
  return post<number>('/goods/category', data)
}

// 更新分类
export const updateCategory = (id: number, data: CategoryCreateParams) => {
  return put<CategoryItem>(`/goods/category/${id}`, data)
}

// 删除分类
export const deleteCategory = (id: number) => {
  return del<void>(`/category/${id}`)
}

// 批量删除分类
export const batchDeleteCategory = (ids: number[]) => {
  return post<void>('/category/batch/delete', { ids })
}

// 根据父商品分类id获取子商品分类 - 匹配后端接口
export const getSubCategories = (parentId: number) => {
  return get<CategoryItem[]>(`/goods/category/sub/${parentId}`)
}

// 移动分类（调整父级分类）
export const moveCategory = (id: number, targetParentId: number | null) => {
  return put<void>(`/category/${id}/move`, { parentId: targetParentId })
}

// 调整分类排序
export const sortCategory = (id: number, sort: number) => {
  return put<void>(`/category/${id}/sort`, { sort })
}

// 获取分类统计信息
export const getCategoryStats = () => {
  return get<{
    total: number
    level1: number
    level2: number
    level3: number
    withGoods: number
    empty: number
  }>('/category/stats')
}

// 上传分类图片
export const uploadCategoryImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('category', 'goods category')
  formData.append('file', file)

  return await upload<string>('/file/image/upload', formData)
}
