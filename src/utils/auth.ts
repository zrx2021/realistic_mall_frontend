import type { UserInfo } from '@/types/user'

// Token 相关操作
const TOKEN_KEY = 'token'
const AUTO_LOGIN_KEY = 'autoLogin'

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}

// 用户信息相关操作
const USER_INFO_KEY = 'user_info'

export const getUserInfo = (): UserInfo | null => {
  const userInfo = localStorage.getItem(USER_INFO_KEY)
  return userInfo ? JSON.parse(userInfo) : null
}

export const setUserInfo = (userInfo: UserInfo): void => {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo))
}

export const removeUserInfo = (): void => {
  localStorage.removeItem(USER_INFO_KEY)
}

// 自动登录相关操作
export const getAutoLoginStatus = (): boolean => {
  const expiresTime = localStorage.getItem(AUTO_LOGIN_KEY)
  if (!expiresTime) return false

  const now = Date.now()
  const expires = parseInt(expiresTime)

  // 如果过期，清除自动登录状态
  if (now > expires) {
    removeAutoLoginStatus()
    return false
  }

  return true
}

export const setAutoLoginStatus = (days: number = 3): void => {
  const expiresTime = Date.now() + days * 24 * 60 * 60 * 1000
  localStorage.setItem(AUTO_LOGIN_KEY, String(expiresTime))
}

export const removeAutoLoginStatus = (): void => {
  localStorage.removeItem(AUTO_LOGIN_KEY)
}

// 清除所有认证信息
export const clearAuth = (): void => {
  removeToken()
  removeUserInfo()
  removeAutoLoginStatus()
}
