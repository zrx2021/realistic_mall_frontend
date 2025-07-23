import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import { message } from 'ant-design-vue'
import { getToken } from './auth'
import router from '@/router'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: '/api', // 后端服务地址
  timeout: 15000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = token
    }
    return config
  },
  (error) => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    // 这里可以根据后端的数据结构进行调整
    if (res.code === 200) {
      return res.data
    } else {
      message.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
  },
  (error) => {
    console.error('响应错误：', error)
    const { response } = error
    if (response && response.status) {
      switch (response.status) {
        case 401:
          message.error('未授权，请重新登录')
          localStorage.removeItem('token')
          router.push('/login')
          break
        case 403:
          message.error('拒绝访问')
          break
        case 404:
          message.error('请求错误，未找到该资源')
          break
        case 500:
          message.error('服务器错误')
          break
        default:
          message.error(`连接错误 ${response.status}`)
      }
    } else {
      message.error('网络连接异常')
    }
    return Promise.reject(error)
  },
)

// 封装 GET 请求
export function get<T>(url: string, params?: Record<string, any>): Promise<T> {
  return service.get(url, { params })
}

// 封装 POST 请求
export function post<T>(url: string, data?: Record<string, any>): Promise<T> {
  return service.post(url, data)
}

// 封装 PUT 请求
export function put<T>(url: string, data?: Record<string, any>): Promise<T> {
  return service.put(url, data)
}

// 封装 DELETE 请求
export function del<T>(url: string): Promise<T> {
  return service.delete(url)
}

// 导出 axios 实例
export default service
