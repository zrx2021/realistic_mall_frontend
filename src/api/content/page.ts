import { post } from '@/utils/request'

// 账号密码登录
export const savePage = (data: object) => {
  return post<string>('/content/article/save', data)
}
