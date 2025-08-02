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
                <component :is="getComponent(element.type)" :objData="element.objData as any" />
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
  /* width: calc(100% - 40px);*/
  width: 100%;
  /* height: calc(100% - 40px); */
  height: 100%;
  max-width: 1200px;
  /* max-height: calc(100vh - 40px); */
  display: flex;
  flex-direction: column;
  background: #fff;
  /* border-radius: 12px; */
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
  padding: 0;
  background: #000;
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
  width: 100%;
  /* max-width: 360px; */
  height: 100%;
  border-radius: 0;
  border: none;
  box-shadow: none;
  margin: 0 auto;
  padding: 0;
  background: #000;
}

.fullscreen .status-bar {
  display: none;
}

.fullscreen .preview-content {
  border-radius: 0;
  padding-bottom: 0;
}

/* 全屏模式响应式适配 */
@media (max-width: 344px) {
  .fullscreen .mobile-frame {
    width: 100vw;
    height: 100vh;
    max-width: none;
    max-height: none;
  }

  .fullscreen .preview-content {
    height: 100vh;
  }
}

@media (max-width: 375px) {
  .fullscreen .mobile-frame {
    width: 100vw;
    height: 100vh;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .fullscreen .mobile-simulator {
    padding: 0;
  }

  .fullscreen .mobile-frame {
    width: 100vw;
    height: 100vh;
  }
}

@media (max-width: 768px) {
  .fullscreen .mobile-frame {
    width: 100vw;
    height: 100vh;
    max-width: none;
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

/* 全屏模式下隐藏物理按键和指示器 */
.fullscreen .phone-buttons,
.fullscreen .home-indicator {
  display: none;
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

/* 针对360x640分辨率的组件优化 */
.preview-component :deep(.product-container) {
  /* max-width: 360px;*/
  width: 100%;
  font-size: 14px;
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
    /* width: calc(100% - 8px);
    height: calc(100vh - 80px);
    max-width: none;
    min-width: auto;
    border-radius: 12px;
    border-width: 2px; */
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
    /* width: calc(100% - 16px);
    height: calc(100vh - 90px);
    max-width: 340px;
    min-width: 300px;
    border-radius: 16px;
    border-width: 3px; */
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
    /* width: calc(100% - 32px);
    height: calc(100vh - 120px);
    max-width: 360px;
    min-width: 320px;
    border-radius: 20px;
    border-width: 4px; */
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
    /* width: calc(100% - 48px);
    height: calc(100vh - 140px);
    max-width: 380px;
    min-width: 340px;
    border-radius: 24px;
    border-width: 5px; */
  }
}

/* lg: 大屏手机 / 横屏小设备 (≤ 768px) */
@media (max-width: 768px) {
  .mobile-preview-container {
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
    /* width: 380px;
    height: 680px;
    max-width: calc(100% - 64px);
    min-width: 360px;
    border-radius: 28px;
    border-width: 5px; */
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
    /* width: 400px;
    height: 720px;
    max-width: calc(100% - 80px);
    border-radius: 32px;
    border-width: 6px; */
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
    /* width: auto;
    height: calc(100vh - 32px);
    max-width: 420px;
    max-height: none; */
  }
}

/* 超小屏幕特殊优化 */
@media (max-width: 320px) {
  .mobile-frame {
    /* width: calc(100vw - 16px);
    max-width: none;
    min-width: auto;
    border-radius: 8px;
    border-width: 1px; */
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
