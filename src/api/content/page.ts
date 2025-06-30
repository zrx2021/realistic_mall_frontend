import type { saveRequestDTO } from '@/types/content/pages/savePageDTO'
import { get, post } from '@/utils/request'

// 账号密码登录
export const savePage = (data: saveRequestDTO) => {
  return post<number>('/content/article/save', data)
}

// 获取页面详情
export const getPageDetail = (id: number) => {
  return get<saveRequestDTO>('/content/article/detail', {
    params: {
      id,
    },
  })
}

// 获取页面详情
export interface ComponentVO {
  id: number
  name: string | null
  typeId: number
  order: number
  objData: string | Record<string, unknown>
}

export interface ArticleVO {
  id: number
  name: string
  description: string
  backgroundColor: string
  status: number
  templateId: number | null
  version: string
  components: ComponentVO[]
}

// 获取页面详情
export const getPageDetailById = (id: number) => {
  return get<ArticleVO>(`/content/article/${id}`)
}

// 分页获取页面列表
export interface ArticleQueryDTO {
  articleTitle?: string
  status?: number
}

export interface PageParams {
  pageNumber?: number
  pageSize?: number
}

export interface PageItem {
  id: number
  name: string
  status: number
  description: string
  backgroundColor: string
  createTime: string
  updateTime: string | null
  createBy: string | null
  updateBy: string | null
  template: unknown | null
  deleted: number
  version: string
}

export interface PageResponse {
  content: PageItem[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export const getPageList = (queryDTO: ArticleQueryDTO, params: PageParams) => {
  // Create a URL with query parameters for pagination
  const url = `/content/article/pagination?pageNumber=${params.pageNumber || 1}&pageSize=${params.pageSize || 10}`
  return post<PageResponse>(url, queryDTO)
}
