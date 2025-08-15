<template>
  <img
    :src="displayUrl"
    :alt="alt"
    :style="style"
    :class="className"
    @error="handleError"
    @load="handleLoad"
  />
</template>

<script lang="ts" setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { getToken } from '@/utils/auth'

interface Props {
  src?: string
  alt?: string
  style?: string | Record<string, string | number>
  class?: string
  fallback?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  fallback: '',
})

const displayUrl = ref('')
const loading = ref(false)
const error = ref(false)

const className = computed(() => props.class)

// 构建带token的图片URL
const buildImageUrl = (imagePath: string): string => {
  if (!imagePath) return ''

  // 解析路径：/goods/2025/08/12/filename.jpg
  const pathParts = imagePath.split('/')
  if (pathParts.length < 6) return imagePath // 如果不是标准格式，直接返回

  const category = pathParts[1] // goods
  const year = pathParts[2] // 2025
  const mouth = pathParts[3] // 08 (注意：接口文档中是mouth，不是month)
  const date = pathParts[4] // 12
  const fileName = pathParts[5] // filename.jpg

  return `/api/file/image/${category}/${year}/${mouth}/${date}/${fileName}`
}

// 使用fetch获取图片并创建blob URL
const loadImageWithAuth = async (imageUrl: string): Promise<string> => {
  try {
    const token = getToken()
    const headers: Record<string, string> = {}

    if (token) {
      headers['Authorization'] = token
    }

    const response = await fetch(imageUrl, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const blob = await response.blob()
    return URL.createObjectURL(blob)
  } catch (err) {
    console.error('Failed to load image:', err)
    throw err
  }
}

// 清理blob URL
const cleanupBlobUrl = (url: string) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

// 监听src变化，加载图片
watch(
  () => props.src,
  async (newSrc) => {
    // 清理之前的blob URL
    cleanupBlobUrl(displayUrl.value)

    if (!newSrc) {
      displayUrl.value = props.fallback
      return
    }

    // 如果是普通URL（不需要认证），直接使用
    if (newSrc.startsWith('http') || newSrc.startsWith('data:') || newSrc.startsWith('blob:')) {
      displayUrl.value = newSrc
      return
    }

    // 如果是需要认证的图片路径
    loading.value = true
    error.value = false

    try {
      const imageUrl = buildImageUrl(newSrc)
      const blobUrl = await loadImageWithAuth(imageUrl)
      displayUrl.value = blobUrl
    } catch {
      error.value = true
      displayUrl.value = props.fallback
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)

const handleError = () => {
  if (!error.value && props.fallback && displayUrl.value !== props.fallback) {
    error.value = true
    displayUrl.value = props.fallback
  }
}

const handleLoad = () => {
  loading.value = false
}

// 组件卸载时清理blob URL
onUnmounted(() => {
  cleanupBlobUrl(displayUrl.value)
})
</script>
