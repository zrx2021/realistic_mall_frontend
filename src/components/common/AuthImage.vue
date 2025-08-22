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
import { getBlob } from '@/utils/request'

interface Props {
  src?: string
  alt?: string
  style?: string | Record<string, string | number>
  class?: string
  fallback?: string
  forceAuth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  fallback: '',
  forceAuth: false,
})

const displayUrl = ref('')
const loading = ref(false)
const error = ref(false)

const className = computed(() => props.class)

// 使用 axios 获取图片并创建 blob URL（走拦截器）
const loadImageWithAuth = async (imageUrl: string): Promise<string> => {
  try {
    const blob = await getBlob(imageUrl)
    return URL.createObjectURL(blob)
  } catch (err) {
    console.error('Failed to load image:', err)
    throw err as unknown as Error
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

    const isPlainUrl =
      newSrc.startsWith('http') || newSrc.startsWith('data:') || newSrc.startsWith('blob:')

    // 如果是普通URL（不需要认证）且未强制认证，直接使用
    if (isPlainUrl && !props.forceAuth) {
      displayUrl.value = newSrc
      return
    }

    // 需要认证的图片路径或被强制认证
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
