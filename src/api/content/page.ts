import { post } from '@/utils/request'
import type { Article } from '@/types/content'

// 账号密码登录
export const savePage = (data: Article) => {
  return post<string>('/content/article/save', data)
}
