/**
 * 组件环境类型定义
 * 用于不同渲染环境下的样式适配
 */
export type ComponentEnvironment = 'editing' | 'preview' | 'fullscreen'

/**
 * 环境配置接口
 */
export interface EnvironmentConfig {
  /** 最大宽度 */
  maxWidth: string
  /** 内边距 */
  padding: string
  /** 间距 */
  gap: string
  /** 是否显示交互效果 */
  showInteraction: boolean
  /** 是否显示编辑边框 */
  showEditingBorder: boolean
}

/**
 * 设计令牌系统
 * 基于环境的样式配置
 */
export const environmentTokens: Record<ComponentEnvironment, EnvironmentConfig> = {
  editing: {
    maxWidth: '800px',
    padding: '12px',
    gap: '12px',
    showInteraction: true,
    showEditingBorder: true,
  },
  preview: {
    maxWidth: '360px',
    padding: '8px',
    gap: '8px',
    showInteraction: false,
    showEditingBorder: false,
  },
  fullscreen: {
    maxWidth: '100%',
    padding: '16px',
    gap: '16px',
    showInteraction: false,
    showEditingBorder: false,
  },
}

/**
 * 获取环境配置
 */
export const getEnvironmentConfig = (environment: ComponentEnvironment): EnvironmentConfig => {
  return environmentTokens[environment]
}

/**
 * 生成环境类名
 */
export const getEnvironmentClass = (environment: ComponentEnvironment): string => {
  return `env-${environment}`
}

/**
 * 生成组件环境类名
 */
export const getComponentEnvironmentClass = (environment: ComponentEnvironment): string => {
  return `component-${environment}`
}

/**
 * 响应式断点定义
 */
export const breakpoints = {
  // 设备断点 - 用于fullscreen环境
  devices: {
    mobile: '375px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px',
  },

  // 容器断点 - 用于editing/preview环境
  containers: {
    small: '300px',
    medium: '600px',
    large: '800px',
    xlarge: '1000px',
  },
}

/**
 * 标签样式配置
 */
export interface TagStyleConfig {
  padding: string
  fontSize: string
  borderRadius: string
  maxWidth: string
  gap: string
  top: string
  left: string
}

/**
 * 不同环境下的标签样式配置
 */
export const tagStyleTokens: Record<ComponentEnvironment, TagStyleConfig> = {
  editing: {
    padding: '4px 8px',
    fontSize: '11px',
    borderRadius: '12px',
    maxWidth: '100px',
    gap: '6px',
    top: '12px',
    left: '12px',
  },
  preview: {
    padding: '2px 6px',
    fontSize: '10px',
    borderRadius: '8px',
    maxWidth: '60px',
    gap: '4px',
    top: '8px',
    left: '8px',
  },
  fullscreen: {
    padding: '4px 8px',
    fontSize: '12px',
    borderRadius: '12px',
    maxWidth: '120px',
    gap: '6px',
    top: '12px',
    left: '12px',
  },
}
