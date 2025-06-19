import type { saveRequestDTO } from '@/types/content'
import { post } from '@/utils/request'

// 账号密码登录
export const savePage = (data: saveRequestDTO) => {
  return post<string>('/content/article/save', data)
}
