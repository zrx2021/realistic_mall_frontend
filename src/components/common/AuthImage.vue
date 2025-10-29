<template>
  <img
    :src="displayUrl"
    :alt="alt"
    :style="style"
    :class="className"
    @error="handleError"
    @load="handleLoad"
    ref="imgRef"
  />
</template>

<script lang="ts" setup>
import { ref, computed, watch, onUnmounted, onMounted } from 'vue'
import { getBlob } from '@/utils/request'

// 全局并发控制（信号量）
const MAX_CONCURRENT = 6
let currentConcurrent = 0
const requestQueue: Array<() => void> = []

const acquire = async () => {
  if (currentConcurrent < MAX_CONCURRENT) {
    currentConcurrent += 1
    return
  }
  await new Promise<void>((resolve) => requestQueue.push(resolve))
  currentConcurrent += 1
}

const release = () => {
  currentConcurrent = Math.max(0, currentConcurrent - 1)
  const next = requestQueue.shift()
  if (next) next()
}

// 简易 LRU 缓存（缓存 blob URL，避免重复下载与创建）
const CACHE_CAPACITY = 200
const imageCache = new Map<string, string>() // url -> blobUrl

const getCachedBlobUrl = (key: string): string | undefined => {
  const val = imageCache.get(key)
  if (val) {
    // 触发 LRU 更新顺序
    imageCache.delete(key)
    imageCache.set(key, val)
  }
  return val
}

const setCachedBlobUrl = (key: string, blobUrl: string) => {
  imageCache.set(key, blobUrl)
  if (imageCache.size > CACHE_CAPACITY) {
    const firstKey = imageCache.keys().next().value as string | undefined
    if (firstKey) {
      const old = imageCache.get(firstKey)
      if (old && old.startsWith('blob:')) URL.revokeObjectURL(old)
      imageCache.delete(firstKey)
    }
  }
}

interface Props {
  src?: string
  alt?: string
  style?: string | Record<string, string | number>
  class?: string
  fallback?: string
  forceAuth?: boolean
  lazy?: boolean
  rootMargin?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  fallback: '',
  forceAuth: false,
  lazy: true,
  rootMargin: '200px',
})

const displayUrl = ref('')
const loading = ref(false)
const error = ref(false)

const className = computed(() => props.class)
const imgRef = ref<HTMLImageElement | null>(null)
const isInView = ref(false)
let observer: IntersectionObserver | null = null

// 判断是否需要通过后端接口获取图片
const needsImageApi = (url: string): boolean => {
  // 完整的 http/https URL 不需要转换
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return false
  }
  // data: 和 blob: URL 不需要转换
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return false
  }
  // 其他所有情况都需要通过后端接口获取
  return true
}

// 将路径转换为后端图片接口路径
const convertToImageApiUrl = (url: string): string => {
  if (!needsImageApi(url)) {
    return url
  }

  // 提取实际的图片路径
  let imagePath = url

  // 如果是 /file/image/ 开头的路径，提取后面的实际路径
  if (imagePath.startsWith('/file/image/')) {
    imagePath = imagePath.slice(12) // 去掉 '/file/image/'
  } else if (imagePath.startsWith('file/image/')) {
    imagePath = imagePath.slice(11) // 去掉 'file/image/'
  } else if (imagePath.startsWith('/')) {
    // 去掉开头的 /
    imagePath = imagePath.slice(1)
  }

  // 通过后端 /file/image 接口获取，使用查询参数
  return `/file/image?url=${encodeURIComponent(imagePath)}`
}

// 使用 axios 获取图片并创建 blob URL（走拦截器）+ 并发限制 + LRU 缓存
const loadImageWithAuth = async (imageUrl: string): Promise<string> => {
  const cached = getCachedBlobUrl(imageUrl)
  if (cached) return cached

  // 尝试命中持久化缓存（Cache Storage）
  const cacheKey = `/__authimage_cache__${imageUrl}`
  try {
    if ('caches' in window) {
      const cache = await caches.open('auth-image-cache-v1')
      const match = await cache.match(cacheKey)
      if (match) {
        const blob = await match.blob()
        const blobUrl = URL.createObjectURL(blob)
        setCachedBlobUrl(imageUrl, blobUrl)
        // 后台 revalidate - 已禁用，避免重复请求
        // 如果需要更新缓存，可以在特定场景下手动清除缓存
        return blobUrl
      }
    }
  } catch {
    // 缓存失败不影响主流程
  }

  await acquire()
  try {
    // 将相对路径转换为后端接口路径
    const requestUrl = convertToImageApiUrl(imageUrl)
    const blob = await getBlob(requestUrl)
    const blobUrl = URL.createObjectURL(blob)
    setCachedBlobUrl(imageUrl, blobUrl)

    // 写入持久化缓存
    try {
      if ('caches' in window) {
        const cache = await caches.open('auth-image-cache-v1')
        const resp = new Response(blob, {
          headers: { 'Content-Type': blob.type || 'application/octet-stream' },
        })
        await cache.put(cacheKey, resp)
      }
    } catch {}

    return blobUrl
  } catch (err) {
    throw err as unknown as Error
  } finally {
    release()
  }
}

// 清理blob URL（仅清理本组件临时的 displayUrl，不清理缓存里的）
const cleanupBlobUrl = (url: string) => {
  if (url && url.startsWith('blob:') && url !== getCachedBlobUrl(props.src || '')) {
    URL.revokeObjectURL(url)
  }
}

const doLoadIfNeeded = async () => {
  // 清理之前的blob URL
  cleanupBlobUrl(displayUrl.value)

  const newSrc = props.src
  if (!newSrc) {
    displayUrl.value = props.fallback
    return
  }

  const isPlainUrl =
    newSrc.startsWith('http') || newSrc.startsWith('data:') || newSrc.startsWith('blob:')

  // 如果是普通URL且未强制认证，直接使用（并允许浏览器原生缓存）
  if (isPlainUrl && !props.forceAuth) {
    displayUrl.value = newSrc
    return
  }

  // 懒加载：仅在进入视口时加载
  if (props.lazy && !isInView.value) {
    displayUrl.value = props.fallback
    return
  }

  loading.value = true
  error.value = false

  try {
    const blobUrl = await loadImageWithAuth(newSrc)
    displayUrl.value = blobUrl
  } catch {
    error.value = true
    displayUrl.value = props.fallback
  } finally {
    loading.value = false
  }
}

// 监听 src 或可见性变化
watch(
  () => [props.src, isInView.value, props.forceAuth],
  () => {
    doLoadIfNeeded()
  },
  { immediate: true },
)

onMounted(() => {
  if (!props.lazy) return
  if (!('IntersectionObserver' in window)) {
    // 环境不支持时直接加载
    isInView.value = true
    doLoadIfNeeded()
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry && entry.isIntersecting) {
        isInView.value = true
        doLoadIfNeeded()
        if (observer && imgRef.value) observer.unobserve(imgRef.value)
      }
    },
    { root: null, rootMargin: props.rootMargin, threshold: 0.01 },
  )
  if (imgRef.value) observer.observe(imgRef.value)
})

const handleError = () => {
  if (!error.value && props.fallback && displayUrl.value !== props.fallback) {
    error.value = true
    displayUrl.value = props.fallback
  }
}

const handleLoad = () => {
  loading.value = false
}

// 组件卸载时清理资源
onUnmounted(() => {
  if (observer && imgRef.value) observer.unobserve(imgRef.value)
  observer = null
  cleanupBlobUrl(displayUrl.value)
})
</script>
