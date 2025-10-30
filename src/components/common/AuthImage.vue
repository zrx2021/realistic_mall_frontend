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

const loadImage = async () => {
  const newSrc = props.src
  if (!newSrc) {
    displayUrl.value = props.fallback
    return
  }

  // data: 和 blob: URL 直接使用，不需要通过后端
  if (newSrc.startsWith('data:') || newSrc.startsWith('blob:')) {
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
    // 所有其他URL都通过后端 /file/image 接口获取
    let imageUrl = newSrc

    // 如果是 /file/image/ 开头的路径，提取后面的实际路径
    if (imageUrl.startsWith('/file/image/')) {
      imageUrl = imageUrl.slice(12) // 去掉 '/file/image/'
    } else if (imageUrl.startsWith('file/image/')) {
      imageUrl = imageUrl.slice(11) // 去掉 'file/image/'
    } else if (imageUrl.startsWith('/')) {
      imageUrl = imageUrl.slice(1) // 去掉开头的 /
    }
    // 如果是完整URL（如 http://localhost:9000/...），直接传递

    // 通过后端 /file/image 接口获取（传递完整URL或相对路径）
    const requestUrl = `/file/image?url=${encodeURIComponent(imageUrl)}`
    const blob = await getBlob(requestUrl)
    const blobUrl = URL.createObjectURL(blob)
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
    loadImage()
  },
  { immediate: true },
)

onMounted(() => {
  if (!props.lazy) return
  if (!('IntersectionObserver' in window)) {
    // 环境不支持时直接加载
    isInView.value = true
    loadImage()
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry && entry.isIntersecting) {
        isInView.value = true
        loadImage()
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
  // 清理 blob URL
  if (displayUrl.value && displayUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(displayUrl.value)
  }
})
</script>
