<template>
  <a-layout>
    <a-layout-header :style="headerStyle">
      <a-flex align="center" justify="space-between" style="width: 100%; padding: 0 20px">
        <div class="header-left">
          <arrow-left-outlined class="back-icon" @click="goBack" />
          <span class="back-text" @click="goBack">返回页面管理</span>
          <span class="page-title">页面编辑 - 首页</span>
        </div>
        <a-space>
          <a-button variant="outlined" class="action-btn">
            <template #icon><eye-outlined /></template>
            预览
          </a-button>
          <a-button type="primary" class="action-btn">
            <template #icon><save-outlined /></template>
            保存
          </a-button>
          <a-button type="primary" class="action-btn publish-btn">
            <template #icon><rocket-outlined /></template>
            发布
          </a-button>
        </a-space>
      </a-flex>
    </a-layout-header>

    <a-layout-content>
      <a-flex class="main-container">
        <!-- 组件列表区域 -->
        <div class="component-panel">
          <a-tabs v-model:activeKey="activeTab" centered class="component-tabs">
            <a-tab-pane
              v-for="category in componentCategories"
              :key="category.name"
              :tab="category.name"
            >
              <div class="components-grid">
                <div
                  class="component-item"
                  v-for="item in category.components"
                  :key="item.id"
                  @click="addComponent(item)"
                  @mouseenter="handleMouseEnter(item.id)"
                  @mouseleave="handleMouseLeave(item.id)"
                >
                  <div class="component-icon">
                    <img :src="imageMap[item.id]" :alt="item.name" />
                  </div>
                  <span class="component-name">{{ item.name }}</span>
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>

        <!-- 内容编辑区域 -->
        <div class="editor-area">
          <div class="editor-container">
            <div class="placeholder-content">
              <laptop-outlined class="placeholder-icon" />
              <h3>内容编辑区</h3>
              <p>从左侧拖拽或点击组件添加到此处</p>
            </div>
          </div>
        </div>

        <!-- 组件设置区域 -->
        <div class="settings-panel">
          <div class="settings-header">
            <h3>组件设置</h3>
            <a-tag color="blue">未选择组件</a-tag>
          </div>
          <div class="settings-placeholder">
            <setting-outlined class="settings-icon" />
            <p>选择组件后，此处显示配置选项</p>
          </div>
        </div>
      </a-flex>
    </a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeftOutlined,
  EyeOutlined,
  SaveOutlined,
  RocketOutlined,
  LaptopOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue'

const imageMap = ref<Record<string, string>>({})
const router = useRouter()

const getImageUrl = (icon: string, isHover: boolean) => {
  return new URL(
    `../../assets/content/page/editing/${icon}${isHover ? '-hover' : ''}.svg`,
    import.meta.url,
  ).href
}

onMounted(() => {
  // 初始化图片映射
  componentCategories.value.forEach((type) => {
    type.components.forEach((item) => {
      imageMap.value[item.id] = getImageUrl(item.icon, false)
      imageMap.value[item.id + 'hover'] = getImageUrl(item.icon, true)
    })
  })
})

// 组件分类结构
const componentCategories = ref([
  {
    name: '基础组件',
    components: [
      { id: 1, name: '标题文本', icon: '标题文本', category: '基础组件' },
      { id: 2, name: '电梯导航', icon: '电梯导航', category: '基础组件' },
      { id: 3, name: '商品', icon: '商品', category: '基础组件' },
      { id: 4, name: '图片', icon: '图片', category: '基础组件' },
      { id: 5, name: '富文本', icon: '富文本', category: '基础组件' },
      { id: 6, name: '搜索', icon: '搜索', category: '基础组件' },
      { id: 7, name: '辅助分割', icon: '辅助分割', category: '基础组件' },
      { id: 8, name: '视频', icon: '视频', category: '基础组件' },
      { id: 9, name: '公告', icon: '公告', category: '基础组件' },
    ],
  },
  {
    name: '营销组件',
    components: [
      { id: 10, name: '优惠券', icon: '优惠券', category: '营销组件' },
      { id: 11, name: '限时折扣', icon: '限时折扣', category: '营销组件' },
      { id: 12, name: '秒杀', icon: '秒杀', category: '营销组件' },
      { id: 13, name: '拼团', icon: '拼团', category: '营销组件' },
      { id: 14, name: '满减', icon: '满减', category: '营销组件' },
      { id: 15, name: '积分', icon: '积分', category: '营销组件' },
    ],
  },
  {
    name: '高级组件',
    components: [
      { id: 16, name: '轮播图', icon: '轮播图', category: '高级组件' },
      { id: 17, name: '分类导航', icon: '分类导航', category: '高级组件' },
      { id: 18, name: '会员卡', icon: '会员卡', category: '高级组件' },
    ],
  },
])

const activeTab = ref('基础组件')

const swapImage = (item: number) => {
  const temp = imageMap.value[item]
  imageMap.value[item] = imageMap.value[item + 'hover']
  imageMap.value[item + 'hover'] = temp
}

// 鼠标事件处理
const handleMouseEnter = (item: number) => {
  swapImage(item)
}

const handleMouseLeave = (item: number) => {
  swapImage(item)
}

// 添加组件
const addComponent = (item: ComponentItem) => {
  console.log('添加组件:', item.name)
}

// 返回上一页
const goBack = () => {
  router.push({
    path: '/contents/pages',
  })
}

// 样式定义
const headerStyle: CSSProperties = {
  backgroundColor: '#fff',
  borderBottom: '1px solid #e8e8e8',
  height: '64px',
  lineHeight: '64px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
}
</script>

<style scoped>
/* 整体布局 */
.main-container {
  height: calc(100vh - 64px);
}

/* 组件面板 */
.component-panel {
  width: 280px;
  border-right: 1px solid #e8e8e8;
  background: #fff;
  height: 100%;
  overflow-y: auto;
}

.component-tabs {
  padding: 0 12px;
}

/* 编辑区域 */
.editor-area {
  flex: 1;
  padding: 20px;
  background: #f8f8f8;
  overflow-y: auto;
}

.editor-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-content {
  text-align: center;
  color: #999;
  padding: 40px;
}

.placeholder-icon {
  font-size: 64px;
  color: #d9d9d9;
  margin-bottom: 16px;
}

.placeholder-content h3 {
  font-size: 18px;
  margin-bottom: 8px;
  color: #595959;
}

.placeholder-content p {
  font-size: 14px;
}

/* 设置面板 */
.settings-panel {
  width: 320px;
  border-left: 1px solid #e8e8e8;
  background: #fff;
  height: 100%;
  overflow-y: auto;
  padding: 16px;
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 20px;
}

.settings-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.settings-placeholder {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.settings-icon {
  font-size: 48px;
  color: #d9d9d9;
  margin-bottom: 16px;
}

/* 组件项样式 */
.components-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 12px;
}

.component-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.component-item:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
  transform: translateY(-2px);
}

.component-item:hover .component-name {
  color: #1890ff;
}

.component-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.component-name {
  font-size: 12px;
  color: #595959;
  text-align: center;
}

/* 头部样式 */
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-icon {
  color: #1890ff;
  cursor: pointer;
  font-size: 16px;
}

.back-text {
  user-select: none;
  color: #1890ff;
  cursor: pointer;
  font-size: 14px;
}

.back-text:hover {
  opacity: 0.8;
}

.page-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-left: 8px;
  padding-left: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
}

.publish-btn {
  background: #52c41a;
  border-color: #52c41a;
}

.publish-btn:hover {
  background: #73d13d;
  border-color: #73d13d;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .components-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .settings-panel {
    width: 280px;
  }
}
</style>

<script lang="ts">
export default {
  name: 'ContentPageEdit',
}
</script>
