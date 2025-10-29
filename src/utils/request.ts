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
    // 针对二进制/图片响应，直接返回数据，走拦截器但不做业务包裹解析
    const respType = (response.config as { responseType?: string } | undefined)?.responseType
    const contentType = response.headers ? String(response.headers['content-type'] || '') : ''
    if (
      respType === 'blob' ||
      respType === 'arraybuffer' ||
      contentType.includes('application/octet-stream') ||
      contentType.startsWith('image/')
    ) {
      return response.data
    }

    const res = response.data
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
export function get<T>(url: string, params?: Record<string, any>, config?: Record<string, any>): Promise<T> {
  return service.get(url, { params, ...config })
}

// 新增：封装获取二进制/图片的 GET（通过拦截器返回 Blob）
export async function getBlob(url: string): Promise<Blob> {
  const data = (await service.get(url, {
    responseType: 'blob' as const,
    headers: {
      // 协商更优图片格式（由后端/网关按需支持）
      Accept: 'image/avif,image/webp,image/apng,image/*;q=0.8,*/*;q=0.5',
      // 可选：启用浏览器缓存对比（若后端支持强/弱校验）
      // 'Cache-Control': 'public, max-age=86400',
    },
  })) as unknown as Blob
  return data
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

// 封装文件上传请求
export function upload<T>(url: string, formData: FormData, config?: Record<string, any>): Promise<T> {
  return service.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  })
}

// 导出 axios 实例
export default service
