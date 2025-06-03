import { post, get } from '@/utils/request'
import type {
  LoginParams,
  LoginResponse,
  PhoneLoginParams,
  SendCodeParams,
  SendCodeResponse,
} from '@/types/user'
import type { MenuItemRaw } from '@/types/menu'

// 账号密码登录
export const login = (data: LoginParams) => {
  return post<LoginResponse>('/login', data)
}

// 手机号登录
export const phoneLogin = (data: PhoneLoginParams) => {
  return post<LoginResponse>('/login/phone', data)
}

// 发送验证码
export const sendCode = (data: SendCodeParams) => {
  return post<SendCodeResponse>('/sms/code', data)
}

// 获取用户菜单
export const getUserMenu = () => {
  return get<MenuItemRaw[]>('/menu')
}
