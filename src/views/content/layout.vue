<template>
  <a-layout>
    <a-layout-header :style="headerStyle">
      <a-flex align="center" justify="space-between" style="width: 100%; padding: 0 10px">
        <span class="back-text">返回页面管理</span>
        <a-space>
          <a-button variant="outlined">预览</a-button>
          <a-button type="primary">保存</a-button>
          <a-button type="primary">发布</a-button>
        </a-space>
      </a-flex>
    </a-layout-header>
    <a-layout-content>
      <!-- 组件列表 -->
      <a-flex>
        <!-- 基础组件 -->
        <a-flex vertical class="component-section">
          <span class="section-title">基础组件</span>
          <a-flex class="components-grid" gap="middle">
            <div
              class="component-item"
              v-for="item in baseComponents"
              :key="item.id"
              @click="addComponent(item.id)"
              @mouseenter="handleMouseEnter(item.id)"
              @mouseleave="handleMouseLeave(item.id)"
            >
              <img :src="imageMap[item.id]" :alt="item.name" />
              <span>{{ item.name }}</span>
            </div>
          </a-flex>
        </a-flex>
        <!-- 营销组件 -->
        <a-flex>
          <!-- 点击按钮后添加组件到内容中 -->
          <!-- 优惠券、限时折扣、秒杀 -->
        </a-flex>
      </a-flex>
      <!-- 内容编辑区 -->
      <a-flex> </a-flex>
      <!-- 组件设置 -->
      <a-flex>
        <router-view />
      </a-flex>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { ref, onMounted } from 'vue'

const imageMap = ref<Record<number, string>>({})

// 获取图片路径
const getImageUrl = (icon: string, isHover: boolean) => {
  return new URL(
    `../../assets/content/page/editing/${icon}${isHover ? '-hover' : ''}.svg`,
    import.meta.url,
  ).href
}

onMounted(() => {
  // 初始化图片路径
  baseComponents.forEach((item) => {
    imageMap.value[item.id] = getImageUrl(item.icon, false)
  })
})

const handleMouseEnter = (itemId: number) => {
  const item = baseComponents.find((item) => item.id === itemId)
  if (item) {
    imageMap.value[itemId] = getImageUrl(item.icon, true)
  }
}

const handleMouseLeave = (itemId: number) => {
  const item = baseComponents.find((item) => item.id === itemId)
  if (item) {
    imageMap.value[itemId] = getImageUrl(item.icon, false)
  }
}

const addComponent = (itemId: number) => {
  console.log(itemId)
}

const baseComponents = [
  { id: 1, name: '标题文本', icon: '标题文本' },
  { id: 2, name: '电梯导航', icon: '电梯导航' },
  { id: 3, name: '商品', icon: '商品' },
  { id: 4, name: '图片', icon: '图片' },
  { id: 5, name: '富文本', icon: '富文本' },
  { id: 6, name: '搜索', icon: '搜索' },
  { id: 7, name: '辅助分割', icon: '辅助分割' },
  { id: 8, name: '视频', icon: '视频' },
  { id: 9, name: '公告', icon: '公告' },
]

const headerStyle: CSSProperties = {
  backgroundColor: '#F5F5F5',
  borderBottom: '1px solid #d3d3d3',
  height: '64px',
  lineHeight: '64px',
}
</script>

<style scoped>
.component-section {
  width: 200px;
  padding: 10px;
  border-right: 1px solid #d3d3d3;
}

.section-title {
  height: 30px;
  font-size: 14px;
  margin-bottom: 8px;
  line-height: 30px;
  user-select: none;
  color: #333;
  font-weight: 500;
}

.components-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0;
}

.component-item {
  display: flex;
  width: 100%;
  aspect-ratio: 1;
  padding: 8px;
  user-select: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.component-item :deep(svg) {
  color: #868686;
  fill: #868686;
  transition: all 0.2s;
}

.component-item:hover :deep(svg) {
  color: #fff;
  fill: #fff;
}

.component-item :deep(img) {
  color: #868686;
}

.component-item img {
  width: 24px;
  height: 24px;
}

.component-item span {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.component-item:hover span {
  color: #fff;
}

.component-item:hover {
  background-color: #1890ff;
}

.back-text {
  color: #333;
  font-size: 14px;
  cursor: pointer;
}

.back-text:hover {
  color: #1890ff;
}

:deep(.ant-layout-header) {
  background-color: #f4f4f4 !important;
}
</style>

<script lang="ts">
export default {
  name: 'ContentPageEdit',
}
</script>
