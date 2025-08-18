import { get, post, put, del } from '@/utils/request'

// 商品查询参数
export interface GoodsQueryParams {
  // 基础搜索
  name?: string // 商品名称/SPU编码
  subTitle?: string // 副标题

  // 分类和品牌
  categoryId?: number | number[] // 分类ID，支持单个或多个
  brandId?: number // 品牌ID
  supplierId?: number // 供应商ID

  // 价格相关
  minPrice?: number // 最低价格
  maxPrice?: number // 最高价格
  minMarketPrice?: number // 最低市场价
  maxMarketPrice?: number // 最高市场价

  // 库存相关
  minStock?: number // 最低库存
  maxStock?: number // 最高库存
  isLowStock?: boolean // 是否筛选库存预警商品

  // 状态相关
  status?: number // 商品状态
  auditStatus?: number // 审核状态
  goodsType?: number // 商品类型

  // 标签相关
  isHot?: boolean // 是否热销
  isNew?: boolean // 是否新品
  isRecommend?: boolean // 是否推荐
  isGift?: boolean // 是否赠品
  isFreeShipping?: boolean // 是否包邮

  // 时间相关
  createStartTime?: string // 创建开始时间
  createEndTime?: string // 创建结束时间
  shelfStartTime?: string // 上架开始时间
  shelfEndTime?: string // 上架结束时间

  // 销量和数据
  minSalesCount?: number // 最低销量
  maxSalesCount?: number // 最高销量
  minViewCount?: number // 最低浏览量
  minGoodCommentRate?: number // 最低好评率

  // 分页
  pageNumber?: number
  pageSize?: number

  // 排序
  sortBy?: string // 排序字段
  sortOrder?: 'asc' | 'desc' // 排序方向
}

// 商品信息
export interface GoodsInfo {
  id: number
  spuCode: string // SPU编码
  name: string // 商品名称
  subTitle?: string // 商品副标题/卖点
  categoryId: number // 分类ID
  categoryName?: string // 分类名称（关联查询）
  brandId?: number // 品牌ID
  brandName?: string // 品牌名称（关联查询）
  supplierId?: number // 供应商ID
  supplierName?: string // 供应商名称（关联查询）
  status: number // 商品状态：0-下架，1-上架，2-库存不足自动下架，3-审核中，4-审核失败，5-审核通过
  auditStatus: number // 审核状态：0-待审核，1-审核通过，2-审核拒绝
  auditReason?: string // 审核拒绝原因
  auditTime?: string // 审核时间
  auditBy?: number // 审核人ID
  goodsType: number // 商品类型：1-实物商品，2-虚拟商品，3-服务商品
  unit: string // 商品单位
  weight?: number // 商品重量(kg)
  volume?: number // 商品体积(m³)
  marketPrice: number // 市场价/吊牌价
  minPrice: number // 最低售价
  maxPrice: number // 最高售价
  costPrice: number // 成本价
  totalStock: number // 总库存
  availableStock: number // 可用库存
  warningStock: number // 库存预警值
  salesCount: number // 销量
  viewCount: number // 浏览量
  collectCount: number // 收藏量
  commentCount: number // 评论数
  goodCommentRate: number // 好评率
  mainImage?: string // 主图URL
  images?: string[] // 商品图片列表
  detailImages?: string[] // 详情图片列表
  description?: string // 商品详细描述
  mobileDescription?: string // 移动端商品描述
  isFreeShipping: boolean // 是否包邮
  shippingTemplateId?: number // 运费模板ID
  deliveryTime: number // 发货时间(小时)
  isHot: boolean // 是否热销
  isNew: boolean // 是否新品
  isRecommend: boolean // 是否推荐
  isGift: boolean // 是否赠品
  purchaseLimit: number // 限购数量，0表示不限购
  minPurchase: number // 起购数量
  seoTitle?: string // SEO标题
  seoKeywords?: string // SEO关键词
  seoDescription?: string // SEO描述
  shelfTime?: string // 上架时间
  createdBy?: number // 创建人ID
  updatedBy?: number // 更新人ID
  createdTime: string // 创建时间
  updatedTime?: string // 更新时间
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
  const { pageNumber = 0, pageSize = 10, ...queryParams } = params

  // 构建查询参数（分页参数通过URL传递）
  const urlParams = new URLSearchParams({
    pageNumber: String((pageNumber || 0) + 1), // 前端从0开始，后端从1开始
    pageSize: String(pageSize || 10),
  })

  return post<PageResponse<GoodsInfo>>(`/goods/list?${urlParams.toString()}`, queryParams)
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

// 元数据类型定义
export interface CategoryOption {
  id: number
  name: string
  parentId?: number
  level?: number
  children?: CategoryOption[] // 子分类
}

export interface BrandOption {
  id: number
  name: string
  logo?: string
}

export interface SupplierOption {
  id: number
  name: string
  contactName?: string
  contactPhone?: string
}

export interface GoodsMetadata {
  categories: CategoryOption[]
  brands: BrandOption[]
  suppliers: SupplierOption[]
  goodsTypes: { value: number; label: string }[]
  statusOptions: { value: number; label: string }[]
  auditStatusOptions: { value: number; label: string }[]
}

// 获取商品子分类
export const getGoodsCategorySubTree = (parentId: number) => {
  return get<CategoryOption[]>(`/goods/category/sub/${parentId}`)
}

// 获取商品分类树(前两层)
export const getGoodsCategories = () => {
  return get<CategoryOption[]>('/goods/category')
}

// 获取品牌列表
export const getGoodsBrands = () => {
  return get<BrandOption[]>('/goods/brands')
}

// 获取供应商列表
export const getGoodsSuppliers = () => {
  return get<SupplierOption[]>('/goods/suppliers')
}

// 审核商品
export const auditGoods = (id: number, data: { auditStatus: number; auditReason?: string }) => {
  return put<void>(`/goods/${id}/audit`, data)
}

// 批量审核商品
export const batchAuditGoods = (
  ids: number[],
  data: { auditStatus: number; auditReason?: string },
) => {
  return post<void>('/goods/batch/audit', { ids, ...data })
}

// 修改商品状态
export const updateGoodsStatus = (id: number, status: number) => {
  return put<void>(`/goods/${id}/status`, { status })
}

// 获取商品统计信息
export const getGoodsStats = () => {
  return get<{
    total: number
    online: number
    offline: number
    reviewing: number
    reviewFailed: number
    reviewPassed: number
    lowStock: number
  }>('/goods/stats')
}
