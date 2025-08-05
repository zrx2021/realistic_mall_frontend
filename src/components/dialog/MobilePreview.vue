<template>
  <div class="mobile-preview-overlay" v-if="visible" @click="closePreview">
    <div class="mobile-preview-container container" @click.stop>
      <!-- 预览头部 -->
      <div class="preview-header" :class="{ fullscreen: isFullscreen }">
        <div class="preview-title">
          <h3 class="text-responsive">移动端预览</h3>
          <span class="preview-subtitle">{{ pageData.name || '页面预览' }}</span>
        </div>
        <div class="preview-actions">
          <a-button type="text" @click="toggleFullscreen" class="action-btn btn hide-xxs hide-xs">
            <template #icon>
              <fullscreen-outlined v-if="!isFullscreen" />
              <fullscreen-exit-outlined v-else />
            </template>
            <span class="hide-sm">{{ isFullscreen ? '退出全屏' : '全屏' }}</span>
          </a-button>
          <a-button type="text" @click="closePreview" class="action-btn btn">
            <template #icon><close-outlined /></template>
            <span class="hide-sm">关闭</span>
          </a-button>
        </div>
      </div>

      <!-- 移动端模拟器 -->
      <div class="mobile-simulator" :class="{ fullscreen: isFullscreen }">
        <div class="mobile-frame">
          <!-- 手机状态栏 -->
          <div class="status-bar">
            <div class="status-left">
              <span class="time">{{ getCurrentTime() }}</span>
            </div>
            <div class="status-center">
              <div class="notch"></div>
            </div>
            <div class="status-right">
              <span class="battery">100%</span>
              <div class="battery-icon"></div>
            </div>
          </div>

          <!-- 预览内容区域 -->
          <div class="preview-content" :style="{ backgroundColor: pageData.backgroundColor }">
            <!-- 渲染组件列表 -->
            <div class="component-list">
              <div
                v-for="(element, index) in componentList"
                :key="`preview-${element.id}-${element.type}-${index}`"
                class="preview-component"
              >
                <component
                  :is="getComponent(element.type)"
                  :objData="element.objData as any"
                  :environment="isFullscreen ? 'fullscreen' : 'preview'"
                />
              </div>
            </div>

            <!-- 空状态 -->
            <div class="empty-content" v-if="componentList.length === 0">
              <div class="empty-icon">📱</div>
              <h4 class="text-responsive">暂无内容</h4>
              <p class="text-responsive">当前页面还没有添加任何组件</p>
              <p class="empty-tip text-responsive">返回编辑器添加组件后再预览</p>
            </div>
          </div>

          <!-- iPhone Home 指示器 -->
          <div class="home-indicator"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { CloseOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons-vue'
import { getComponent } from '@/types/content/content'
import type { Wrapper, Article } from '@/types/content/content'

interface Props {
  visible: boolean
  componentList: Wrapper[]
  pageData: Article
}

interface Emits {
  (e: 'update:visible', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isFullscreen = ref(false)

// 获取当前时间
const getCurrentTime = () => {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

// 关闭预览
const closePreview = () => {
  if (isFullscreen.value) {
    exitFullscreen()
  }
  emit('update:visible', false)
}

// 切换全屏
const toggleFullscreen = async () => {
  if (!isFullscreen.value) {
    await enterFullscreen()
  } else {
    await exitFullscreen()
  }
}

// 扩展全屏 API 类型定义
interface ExtendedDocument extends Document {
  mozCancelFullScreen?: () => Promise<void>
  webkitExitFullscreen?: () => Promise<void>
  msExitFullscreen?: () => Promise<void>
  mozFullScreenElement?: Element
  webkitFullscreenElement?: Element
  msFullscreenElement?: Element
}

interface ExtendedElement extends Element {
  mozRequestFullScreen?: () => Promise<void>
  webkitRequestFullscreen?: () => Promise<void>
  msRequestFullscreen?: () => Promise<void>
}

// 进入全屏
const enterFullscreen = async () => {
  try {
    const element = document.documentElement as ExtendedElement
    if (element.requestFullscreen) {
      await element.requestFullscreen()
    } else if (element.mozRequestFullScreen) {
      await element.mozRequestFullScreen()
    } else if (element.webkitRequestFullscreen) {
      await element.webkitRequestFullscreen()
    } else if (element.msRequestFullscreen) {
      await element.msRequestFullscreen()
    }
    isFullscreen.value = true
  } catch (error) {
    console.error('进入全屏失败:', error)
  }
}

// 退出全屏
const exitFullscreen = async () => {
  try {
    const doc = document as ExtendedDocument
    if (doc.exitFullscreen) {
      await doc.exitFullscreen()
    } else if (doc.mozCancelFullScreen) {
      await doc.mozCancelFullScreen()
    } else if (doc.webkitExitFullscreen) {
      await doc.webkitExitFullscreen()
    } else if (doc.msExitFullscreen) {
      await doc.msExitFullscreen()
    }
    isFullscreen.value = false
  } catch (error) {
    console.error('退出全屏失败:', error)
  }
}

// 监听全屏状态变化
const handleFullscreenChange = () => {
  const doc = document as ExtendedDocument
  const isCurrentlyFullscreen = !!(
    doc.fullscreenElement ||
    doc.mozFullScreenElement ||
    doc.webkitFullscreenElement ||
    doc.msFullscreenElement
  )
  isFullscreen.value = isCurrentlyFullscreen
}

// 键盘事件处理
const handleKeydown = (e: KeyboardEvent) => {
  if (props.visible) {
    if (e.key === 'Escape') {
      closePreview()
    } else if (e.key === 'F11') {
      e.preventDefault()
      toggleFullscreen()
    }
  }
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('mozfullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.addEventListener('msfullscreenchange', handleFullscreenChange)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('msfullscreenchange', handleFullscreenChange)
  document.removeEventListener('keydown', handleKeydown)
})

// 监听visible变化，自动清理全屏状态
watch(
  () => props.visible,
  (newVal) => {
    if (!newVal && isFullscreen.value) {
      exitFullscreen()
    }
  },
)
</script>

<style scoped>
.mobile-preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

.mobile-preview-container {
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  max-width: 1200px;
  max-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #e8e8e8;
  background: #fff;
  flex-shrink: 0;
}

.preview-header.fullscreen {
  display: none;
}

.preview-title h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.preview-subtitle {
  font-size: 14px;
  color: #8c8c8c;
  margin-top: 2px;
}

.preview-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #595959;
}

.action-btn:hover {
  color: #1890ff;
}

.mobile-simulator {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%);
  overflow: hidden;
  position: relative;
}

.mobile-simulator.fullscreen {
  padding: 0 !important;
  margin: 0 !important;
  background: #000;
  width: 100vw !important;
  height: 100vh !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  z-index: 9999;
}

.mobile-frame {
  width: 360px;
  max-width: calc(100vw - 120px);
  height: 640px;
  background: #000;
  border-radius: 36px;
  box-sizing: content-box !important;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  overflow: hidden;
  position: absolute;
  border: 6px solid #1a1a1a;
  padding: 4px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.fullscreen .mobile-frame {
  width: 100vw !important;
  max-width: none !important;
  height: 100vh !important;
  border-radius: 0 !important;
  border: none !important;
  box-shadow: none !important;
  margin: 0 !important;
  padding: 0 !important;
  background: #000;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  z-index: 10000;
}

.fullscreen .status-bar {
  display: none;
}

.fullscreen .preview-content {
  border-radius: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  max-width: none !important;
  max-height: none !important;
  box-sizing: border-box !important;
}

/* 全屏模式统一样式 - 完全占满屏幕 */
.fullscreen .mobile-preview-container {
  width: 100vw !important;
  height: 100vh !important;
  max-width: none !important;
  max-height: none !important;
  margin: 0 !important;
  padding: 0 !important;
  border-radius: 0 !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  z-index: 9998;
}

/* 全屏模式下商品容器优化 */
.fullscreen .preview-component :deep(.product-container) {
  width: 100vw !important;
  max-width: none !important;
  padding: 12px !important;
  margin: 0 !important;
  box-sizing: border-box !important;
}

/* 全屏模式下两列布局优化 */
.fullscreen .preview-content :deep(.layout-two-columns) {
  width: 100% !important;
  max-width: none !important;
  display: grid !important;
  grid-template-columns: 1fr 1fr !important;
  gap: 12px !important;
  padding: 0 12px !important;
  box-sizing: border-box !important;
}

/* 全屏模式下的商品卡片 */
.fullscreen .preview-content :deep(.product-card) {
  /* width: 100% !important; */
  min-width: 0 !important;
  max-width: none !important;
  box-sizing: border-box !important;
}

/* 全屏模式响应式适配 - 移除所有边距和圆角 */
@media (max-width: 768px) {
  .fullscreen .mobile-preview-container {
    width: 100vw !important;
    height: 100vh !important;
    margin: 0 !important;
    padding: 0 !important;
    border-radius: 0 !important;
  }

  .fullscreen .mobile-simulator {
    width: 100vw !important;
    height: 100vh !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .fullscreen .mobile-frame {
    width: 100vw !important;
    height: 100vh !important;
    max-width: none !important;
    max-height: none !important;
    border-radius: 0 !important;
    border: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .fullscreen .preview-content {
    width: 100vw !important;
    height: 100vh !important;
    border-radius: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* 移动设备全屏模式下商品布局优化 */
  .fullscreen .preview-component :deep(.product-container) {
    width: 100vw !important;
    padding: 8px !important;
  }

  .fullscreen .preview-content :deep(.layout-two-columns) {
    gap: 8px !important;
    padding: 0 8px !important;
  }
}

/* 超小屏幕全屏模式优化 */
@media (max-width: 480px) {
  .fullscreen .preview-component :deep(.product-container) {
    padding: 6px !important;
  }

  .fullscreen .preview-content :deep(.layout-two-columns) {
    gap: 6px !important;
    padding: 0 6px !important;
  }
}

/* 极小屏幕全屏模式优化 */
@media (max-width: 375px) {
  .fullscreen .preview-component :deep(.product-container) {
    padding: 4px !important;
  }

  .fullscreen .preview-content :deep(.layout-two-columns) {
    gap: 4px !important;
    padding: 0 4px !important;
  }

  /* 极小屏幕下的标签优化 */
  .preview-component :deep(.product-tags) {
    top: 6px !important;
    left: 6px !important;
    max-width: 50px !important;
    gap: 3px !important;
  }

  .preview-component :deep(.product-tags .tag) {
    padding: 2px 4px !important;
    font-size: 9px !important;
    border-radius: 6px !important;
  }

  .fullscreen .preview-component :deep(.product-tags) {
    top: 8px !important;
    left: 8px !important;
    max-width: 60px !important;
  }

  .fullscreen .preview-component :deep(.product-tags .tag) {
    padding: 3px 6px !important;
    font-size: 10px !important;
  }
}

/* 小屏幕标签优化 */
@media (max-width: 480px) {
  .preview-component :deep(.product-tags) {
    top: 6px !important;
    left: 6px !important;
    max-width: 55px !important;
  }

  .preview-component :deep(.product-tags .tag) {
    padding: 2px 5px !important;
    font-size: 9px !important;
  }

  .fullscreen .preview-component :deep(.product-tags) {
    top: 10px !important;
    left: 10px !important;
    max-width: 70px !important;
  }

  .fullscreen .preview-component :deep(.product-tags .tag) {
    padding: 3px 7px !important;
    font-size: 11px !important;
  }
}

/* 中等屏幕标签优化 */
@media (min-width: 768px) {
  .fullscreen .preview-component :deep(.product-tags) {
    top: 16px !important;
    left: 16px !important;
    max-width: 100px !important;
    gap: 8px !important;
  }

  .fullscreen .preview-component :deep(.product-tags .tag) {
    padding: 6px 12px !important;
    font-size: 14px !important;
    border-radius: 16px !important;
  }
}

/* iPhone 物理按键样式 */
.phone-buttons {
  position: absolute;
  z-index: 10;
  width: 100%;
  height: 100%;
}

.volume-buttons {
  position: absolute;
  left: -10px;
  top: 90px;
}

.volume-up {
  width: 3px;
  height: 25px;
  background: linear-gradient(90deg, #0f0f0f 0%, #2a2a2a 50%, #0f0f0f 100%);
  border-radius: 0 2px 2px 0;
  margin-bottom: 5px;
  box-shadow:
    inset 1px 0 1px rgba(255, 255, 255, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.3);
  border: 1px solid #0a0a0a;
  border-left: none;
}

.volume-down {
  width: 3px;
  height: 45px;
  background: linear-gradient(90deg, #0f0f0f 0%, #2a2a2a 50%, #0f0f0f 100%);
  border-radius: 0 2px 2px 0;
  box-shadow:
    inset 1px 0 1px rgba(255, 255, 255, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.3);
  border: 1px solid #0a0a0a;
  border-left: none;
}

.silent-switch {
  position: absolute;
  left: -10px;
  top: 65px;
  width: 3px;
  height: 10px;
  background: linear-gradient(90deg, #0f0f0f 0%, #2a2a2a 50%, #0f0f0f 100%);
  border-radius: 0 2px 2px 0;
  box-shadow:
    inset 1px 0 1px rgba(255, 255, 255, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.3);
  border: 1px solid #0a0a0a;
  border-left: none;
}

.power-button {
  position: absolute;
  right: -10px;
  top: 110px;
  width: 3px;
  height: 60px;
  background: linear-gradient(270deg, #0f0f0f 0%, #2a2a2a 50%, #0f0f0f 100%);
  border-radius: 2px 0 0 2px;
  box-shadow:
    inset -1px 0 1px rgba(255, 255, 255, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.3);
  border: 1px solid #0a0a0a;
  border-right: none;
}

/* Home 指示器样式 */
.home-indicator {
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  z-index: 20;
}

/* 全屏模式下隐藏所有装饰元素 */
.fullscreen .phone-buttons,
.fullscreen .home-indicator,
.fullscreen .volume-buttons,
.fullscreen .volume-up,
.fullscreen .volume-down,
.fullscreen .silent-switch,
.fullscreen .power-button {
  display: none !important;
}

/* 全屏模式下确保背景完全透明/黑色 */
.fullscreen {
  background: #000 !important;
}

/* 全屏模式下的空状态样式 */
.fullscreen .empty-content {
  width: 100vw !important;
  height: 100vh !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  align-items: center !important;
  padding: 40px 20px !important;
  box-sizing: border-box !important;
}

/* 全屏模式下商品标签优化 */
.fullscreen .preview-component :deep(.product-tags) {
  position: absolute !important;
  top: 12px !important;
  left: 12px !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 6px !important;
  z-index: 20 !important;
  max-width: 80px !important;
}

.fullscreen .preview-component :deep(.product-tags .tag) {
  padding: 4px 8px !important;
  border-radius: 12px !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  line-height: 1.2 !important;
  color: white !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4) !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25) !important;
  backdrop-filter: blur(4px) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  max-width: 100% !important;
}

.status-bar {
  height: 40px;
  background: #000;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 600;
  position: relative;
  border-radius: 30px 30px 0 0;
  flex-shrink: 0;
}

.status-center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.notch {
  width: 110px;
  height: 22px;
  background: #000;
  border-radius: 0 0 11px 11px;
  position: relative;
}

.status-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.battery-icon {
  width: 20px;
  height: 10px;
  border: 1px solid #fff;
  border-radius: 2px;
  position: relative;
}

.battery-icon::after {
  content: '';
  position: absolute;
  right: -3px;
  top: 2px;
  width: 2px;
  height: 6px;
  background: #fff;
  border-radius: 0 1px 1px 0;
}

.preview-content {
  flex: 1;
  background: #fff;
  position: relative;
  overflow-y: auto;
  border-radius: 0 0 30px 30px;
  margin: 0;
  padding-bottom: 16px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.mobile-header-container {
  flex-shrink: 0;
  width: 100%;
  overflow: hidden;
}

.mobile-header {
  width: 100%;
  height: auto;
  display: block;
  /* max-width: 360px; */
  object-fit: cover;
}

.component-list {
  flex: 1;
  padding: 0;
  overflow-y: auto;
  min-height: 0;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
}

/* 全屏模式下的组件列表 */
.fullscreen .component-list {
  width: 100vw !important;
  height: 100vh !important;
  max-width: none !important;
  max-height: none !important;
  padding: 0 !important;
  margin: 0 !important;
  box-sizing: border-box !important;
}

.component-list::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.preview-component {
  margin: 0;
  pointer-events: none; /* 禁用预览模式下的交互 */
}

/* 预览模式下的组件样式优化 */
.preview-component :deep(.product-container) {
  cursor: default !important;
}

.preview-component :deep(.product-card) {
  cursor: default !important;
}

.preview-component :deep(.cart-icon) {
  pointer-events: none !important;
}

.preview-component :deep(.tab-item) {
  cursor: default !important;
}

.preview-component :deep(.elevator-item) {
  cursor: default !important;
}

.preview-component :deep(h3:hover) {
  border: none !important;
}

/* 预览模式下商品标签优化 */
.preview-component :deep(.product-tags) {
  position: absolute !important;
  top: 8px !important;
  left: 8px !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 4px !important;
  z-index: 10 !important;
  max-width: 60px !important;
  pointer-events: none !important; /* 确保标签不影响交互 */
}

.preview-component :deep(.product-tags .tag) {
  padding: 2px 6px !important;
  border-radius: 8px !important;
  font-size: 10px !important;
  font-weight: 600 !important;
  line-height: 1.2 !important;
  color: white !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2) !important;
  backdrop-filter: blur(2px) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  max-width: 100% !important;
  transform: scale(1) !important; /* 防止变形 */
  display: inline-block !important;
  vertical-align: top !important;
}

/* 预览模式下不同标签颜色优化 */
.preview-component :deep(.tag-hot) {
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e) !important;
}

.preview-component :deep(.tag-new) {
  background: linear-gradient(45deg, #4ecdc4, #6bcf7f) !important;
}

.preview-component :deep(.tag-seckill) {
  background: linear-gradient(45deg, #ff4757, #ff6b7a) !important;
}

.preview-component :deep(.tag-discount) {
  background: linear-gradient(45deg, #ffa726, #ffcc02) !important;
}

.preview-component :deep(.tag-free-shipping) {
  background: linear-gradient(45deg, #42a5f5, #64b5f6) !important;
}

.preview-component :deep(.tag-feature) {
  background: linear-gradient(45deg, #ab47bc, #ba68c8) !important;
}

.preview-component :deep(.tag-default) {
  background: linear-gradient(45deg, #78909c, #90a4ae) !important;
}

/* 预览组件基础样式 - 现在由组件内部环境管理 */
.preview-component {
  width: 100%;
  box-sizing: border-box;
}

/* 强制修复两列布局 */
.preview-content :deep(.layout-two-columns) {
  display: grid !important;
  grid-template-columns: 1fr 1fr !important;
  gap: 8px !important;
  padding: 0 8px !important;
  width: 100% !important;
  box-sizing: border-box !important;
}

/* 确保预览内容区域充分利用空间 */
.preview-content {
  width: 100% !important;
  padding: 0 !important;
  box-sizing: border-box;
}

/* 商品容器在预览模式下的特殊处理 */
.preview-component :deep(.product-container) {
  margin: 0 !important;
  padding: 8px !important;
}

/* 确保商品图片容器为相对定位，标签能正确定位 */
.preview-component :deep(.product-image-container) {
  position: relative !important;
  overflow: hidden !important;
}

/* 商品图片在预览模式下的优化 */
.preview-component :deep(.product-image) {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain !important;
  display: block !important;
}

/* 两列商品卡片样式 */
.preview-content :deep(.product-card) {
  /* width: 100% !important; */
  min-width: 0 !important;
  flex: none !important;
  box-sizing: border-box !important;
}

/* 一大两小布局中小卡片的标签特殊处理 */
.preview-component :deep(.sub-products .product-tags) {
  top: 4px !important;
  left: 4px !important;
  max-width: 40px !important;
  gap: 2px !important;
}

.preview-component :deep(.sub-products .product-tags .tag) {
  padding: 1px 4px !important;
  font-size: 8px !important;
  border-radius: 4px !important;
  line-height: 1.1 !important;
}

.preview-component :deep(.product-card .product-tags) {
  top: 4px !important;
  left: 4px !important;
  max-width: 40px !important;
  gap: 2px !important;
}

.preview-component :deep(.product-card .product-tags .tag) {
  padding: 1px 4px !important;
  font-size: 8px !important;
  border-radius: 4px !important;
  line-height: 1.1 !important;
}

/* 全屏模式下一大两小布局的标签 */
.fullscreen .preview-component :deep(.sub-products .product-tags) {
  top: 6px !important;
  left: 6px !important;
  max-width: 50px !important;
}

.fullscreen .preview-component :deep(.sub-products .product-tags .tag) {
  padding: 2px 5px !important;
  font-size: 9px !important;
}

.fullscreen .preview-component :deep(.product-card .product-tags) {
  top: 6px !important;
  left: 6px !important;
  max-width: 50px !important;
}

.fullscreen .preview-component :deep(.product-card .product-tags .tag) {
  padding: 2px 5px !important;
  font-size: 9px !important;
}

/* 列表模式下的标签特殊处理 */
.preview-component :deep(.product-card.list-item .product-tags) {
  top: 6px !important;
  left: 6px !important;
  max-width: 45px !important;
  gap: 3px !important;
}

.preview-component :deep(.product-card.list-item .product-tags .tag) {
  padding: 2px 5px !important;
  font-size: 9px !important;
  border-radius: 6px !important;
}

.fullscreen .preview-component :deep(.product-card.list-item .product-tags) {
  top: 8px !important;
  left: 8px !important;
  max-width: 60px !important;
}

.fullscreen .preview-component :deep(.product-card.list-item .product-tags .tag) {
  padding: 3px 6px !important;
  font-size: 10px !important;
}

/* 预览模式下秒杀倒计时样式优化 */
.preview-component :deep(.seckill-timer) {
  position: absolute !important;
  top: 6px !important;
  right: 6px !important;
  background: rgba(255, 71, 87, 0.95) !important;
  color: white !important;
  padding: 2px 6px !important;
  border-radius: 6px !important;
  font-size: 8px !important;
  font-weight: 600 !important;
  z-index: 15 !important;
  backdrop-filter: blur(2px) !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
}

.fullscreen .preview-component :deep(.seckill-timer) {
  top: 8px !important;
  right: 8px !important;
  padding: 4px 8px !important;
  font-size: 10px !important;
  border-radius: 8px !important;
}

/* 针对不同屏幕宽度的Grid优化 */
@media (max-width: 480px) {
  .preview-content :deep(.layout-two-columns) {
    grid-template-columns: 1fr 1fr !important;
    gap: 6px !important;
    padding: 0 6px !important;
  }

  .preview-component :deep(.product-container) {
    padding: 6px !important;
  }
}

@media (max-width: 344px) {
  .preview-content :deep(.layout-two-columns) {
    grid-template-columns: 1fr 1fr !important;
    gap: 4px !important;
    padding: 0 4px !important;
  }

  .preview-component :deep(.product-container) {
    padding: 4px !important;
  }
}

.preview-component :deep(.product-title) {
  font-size: 13px;
  line-height: 1.3;
}

.preview-component :deep(.product-desc) {
  font-size: 12px;
  line-height: 1.2;
}

.preview-component :deep(.product-price) {
  font-size: 15px;
  font-weight: 600;
}

.preview-component :deep(.elevator-item) {
  padding: 6px 8px;
  font-size: 13px;
}

.preview-component :deep(h3) {
  font-size: 16px;
  padding-left: 8px;
  height: 28px;
  width: calc(100% - 16px);
  line-height: 28px;
}

.empty-content {
  text-align: center;
  padding: 80px 20px;
  color: #8c8c8c;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-content h4 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #595959;
}

.empty-content p {
  margin: 0;
  font-size: 14px;
}

.empty-tip {
  margin-top: 12px !important;
  color: #bfbfbf !important;
  font-size: 12px !important;
}

/* 空状态响应式适配 */
@media (max-width: 344px) {
  .empty-content {
    padding: 40px 12px;
  }

  .empty-icon {
    font-size: 48px;
    margin-bottom: 12px;
  }

  .empty-content h4 {
    font-size: 14px;
  }

  .empty-content p {
    font-size: 12px;
  }

  .empty-tip {
    font-size: 11px !important;
  }
}

@media (max-width: 375px) {
  .empty-content {
    padding: 50px 16px;
  }

  .empty-icon {
    font-size: 52px;
    margin-bottom: 14px;
  }

  .empty-content h4 {
    font-size: 15px;
  }

  .empty-content p {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .empty-content {
    padding: 60px 18px;
  }

  .empty-icon {
    font-size: 56px;
    margin-bottom: 15px;
  }

  .empty-content h4 {
    font-size: 16px;
  }
}

@media (max-width: 576px) {
  .empty-content {
    padding: 70px 20px;
  }

  .empty-icon {
    font-size: 60px;
  }

  .empty-content h4 {
    font-size: 17px;
  }
}

/* =================
   响应式断点样式适配
   ================= */

/* xxs: 折叠屏、极老机型 (≤ 344px) */
@media (max-width: 344px) {
  .mobile-preview-container {
    border-radius: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    max-width: none;
  }

  .preview-header {
    padding: var(--padding-xxs);
    font-size: var(--font-size-xxs);
  }

  .preview-title h3 {
    font-size: 14px;
  }

  .preview-subtitle {
    font-size: 11px;
  }

  .mobile-simulator {
    padding: 2px;
  }

  .mobile-frame {
    width: calc(100% - 8px);
    height: calc(100vh - 80px);
    max-width: none;
    min-width: auto;
    border-radius: 12px;
    border-width: 2px;
  }

  .status-bar {
    height: 32px;
    padding: 0 8px;
    font-size: 11px;
  }

  .notch {
    width: 80px;
    height: 16px;
  }
}

/* xs: iPhone SE、早期安卓小屏 (≤ 375px) */
@media (max-width: 375px) {
  .mobile-preview-container {
    border-radius: 0;
    margin: 0;
    width: 100%;
    height: 100%;
  }

  .preview-header {
    padding: var(--padding-xs);
    font-size: var(--font-size-xs);
  }

  .preview-title h3 {
    font-size: 15px;
  }

  .preview-subtitle {
    font-size: 12px;
  }

  .mobile-simulator {
    padding: 4px;
  }

  .mobile-frame {
    width: calc(100% - 16px);
    height: calc(100vh - 90px);
    max-width: 360px;
    min-width: 320px;
    border-radius: 16px;
    border-width: 3px;
  }

  .status-bar {
    height: 36px;
    padding: 0 12px;
    font-size: 12px;
  }

  .notch {
    width: 90px;
    height: 18px;
  }
}

/* sm: 普通小屏手机 (≤ 480px) */
@media (max-width: 480px) {
  .mobile-preview-container {
    border-radius: 8px;
    margin: 8px;
    width: calc(100% - 16px);
    height: calc(100% - 16px);
  }

  .preview-header {
    padding: var(--padding-sm);
    font-size: var(--font-size-sm);
  }

  .preview-title h3 {
    font-size: 16px;
  }

  .preview-subtitle {
    font-size: 13px;
  }

  .mobile-simulator {
    padding: 8px;
  }

  .mobile-frame {
    width: calc(100% - 32px);
    height: calc(100vh - 120px);
    max-width: 360px;
    min-width: 300px;
    border-radius: 20px;
    border-width: 3px;
  }

  .status-bar {
    height: 38px;
    padding: 0 14px;
    font-size: 12px;
  }

  .action-btn {
    min-width: 32px;
    padding: 8px !important;
  }
}

/* md: 中型手机 (≤ 576px) */
@media (max-width: 576px) {
  .mobile-preview-container {
    border-radius: 8px;
    margin: 12px;
    width: calc(100% - 24px);
    height: calc(100% - 24px);
  }

  .preview-header {
    padding: var(--padding-md);
    font-size: var(--font-size-md);
  }

  .preview-title h3 {
    font-size: 17px;
  }

  .preview-subtitle {
    font-size: 13px;
  }

  .mobile-simulator {
    padding: 12px;
  }

  .mobile-frame {
    width: calc(100% - 48px);
    height: calc(100vh - 140px);
    max-width: 360px;
    min-width: 320px;
    border-radius: 24px;
    border-width: 4px;
  }
}

/* lg: 大屏手机 / 横屏小设备 (≤ 768px) */
@media (max-width: 768px) {
  .mobile-preview-container {
    border-radius: 12px;
    margin: 16px;
    width: calc(100% - 32px);
    height: calc(100% - 32px);
  }

  .preview-header {
    padding: var(--padding-lg);
    font-size: var(--font-size-lg);
  }

  .preview-title h3 {
    font-size: 18px;
  }

  .preview-subtitle {
    font-size: 14px;
  }

  .mobile-simulator {
    padding: 16px;
  }

  .mobile-frame {
    width: 380px;
    height: 680px;
    max-width: calc(100% - 64px);
    min-width: 360px;
    border-radius: 28px;
    border-width: 5px;
  }

  .status-bar {
    height: 42px;
    padding: 0 16px;
    font-size: 13px;
  }
}

/* xl: 平板设备 (≤ 992px) */
@media (max-width: 992px) {
  .mobile-preview-container {
    border-radius: 16px;
    margin: 20px;
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    max-width: 900px;
  }

  .preview-header {
    padding: var(--padding-xl);
    font-size: var(--font-size-xl);
  }

  .preview-title h3 {
    font-size: 20px;
  }

  .preview-subtitle {
    font-size: 15px;
  }

  .mobile-simulator {
    padding: 24px;
  }

  .mobile-frame {
    width: 400px;
    height: 720px;
    max-width: calc(100% - 80px);
    border-radius: 32px;
    border-width: 6px;
  }

  .status-bar {
    height: 44px;
    padding: 0 18px;
    font-size: 14px;
  }

  .action-btn {
    padding: 12px 16px !important;
    font-size: 16px;
  }
}

/* 横屏适配 */
@media (orientation: landscape) and (max-height: 600px) {
  .mobile-preview-container {
    flex-direction: row;
    max-height: 100vh;
  }

  .preview-header {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    width: 60px;
    height: auto;
    padding: 12px 8px;
    border-bottom: none;
    border-right: 1px solid #e8e8e8;
  }

  .preview-title {
    transform: rotate(180deg);
  }

  .preview-actions {
    flex-direction: column;
    gap: 4px;
    transform: rotate(180deg);
  }

  .mobile-simulator {
    flex: 1;
    padding: 8px;
  }

  .mobile-frame {
    width: auto;
    height: calc(100vh - 32px);
    max-width: 420px;
    max-height: none;
  }
}

/* 超小屏幕特殊优化 */
@media (max-width: 320px) {
  .mobile-frame {
    width: calc(100vw - 16px);
    max-width: none;
    min-width: auto;
    border-radius: 8px;
    border-width: 1px;
  }

  .preview-header {
    padding: 8px 12px;
  }

  .mobile-simulator {
    padding: 4px;
  }

  .status-bar {
    height: 28px;
    padding: 0 8px;
    font-size: 10px;
  }
}
</style>
