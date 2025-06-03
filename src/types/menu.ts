import type { Component } from 'vue'

// 后端返回的原始菜单项接口
export interface MenuItemRaw {
  id: number
  parentId: number | null
  title: string
  label: string
  path: string
  icon: string | null
  key: string
  sort: number
  visible: boolean
  children: MenuItemRaw[]
  createTime: string | null
  updateTime: string | null
  createBy: string | null
  updateBy: string | null
}

// 处理后的菜单项接口（用于 Ant Design Vue）
export interface MenuItem {
  key: string
  icon?: () => Component
  label: string
  title: string
  path: string
  children?: MenuItem[]
}

// API 响应接口
export interface MenuResponse {
  code: number
  data: MenuItemRaw[]
  message: string
}
