// 用户信息接口
export interface UserInfo {
  id: number
  username: string
  nickname: string
  status: number
  createTime: number
  updateTime: number
  authorities: string[]
  isAccountNonExpired: boolean
  isAccountNonLocked: boolean
  isCredentialsNonExpired: boolean
  isEnabled: boolean
}

// 登录参数接口
export interface LoginParams {
  username: string
  password: string
}

// 手机号登录参数接口
export interface PhoneLoginParams {
  phone: string
  code: string
}

// 发送验证码参数接口
export interface SendCodeParams {
  phone: string
}

// 登录响应接口
export interface LoginResponse {
  code: number
  data: {
    token: string
    userInfo: UserInfo
  }
  message: string
}

// 发送验证码响应接口
export interface SendCodeResponse {
  code: number
  data: boolean
  message: string
}
