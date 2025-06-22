import type { saveRequestDTO } from '@/types/content/pages/savePageDTO'
import { post } from '@/utils/request'

// 账号密码登录
export const savePage = (data: saveRequestDTO) => {
  return post<number>('/content/article/save', data)
}
