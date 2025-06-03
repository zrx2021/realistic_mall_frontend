// 后端返回的菜单项接口
export interface MenuItem {
  key: string
  icon?: string
  label: string
  title: string
  children?: MenuItem[]
}

// API 响应接口
export interface MenuResponse {
  code: number
  data: MenuItem[]
  message: string
}
