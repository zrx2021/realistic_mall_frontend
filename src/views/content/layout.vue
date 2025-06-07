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
          <a-button variant="outlined" class="action-btn" @click="handlePreview">
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
              v-for="category in availableComponents"
              :key="category.name"
              :tab="category.name"
            >
              <div class="components-grid">
                <div
                  class="component-item"
                  v-for="item in category.components"
                  :key="item.id"
                  @click="addComponent(item.id)"
                  @mouseenter="handleMouseEnter(item.id)"
                  @mouseleave="handleMouseLeave(item.id)"
                >
                  <div class="component-icon">
                    <img
                      :src="imageMap[item.name + '-hover']"
                      :alt="item.name"
                      v-show="indexArray[item.id]"
                    />
                    <img
                      :src="imageMap[item.name]"
                      :alt="item.name"
                      v-show="!indexArray[item.id]"
                    />
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
            <div class="editor-container-inner">
              <img
                src="@/assets/content/page/editing/手机头部.png"
                alt="placeholder"
                width="375px"
              />
            </div>
            <div class="placeholder-content" v-if="componentList.length === 0">
              <laptop-outlined class="placeholder-icon" />
              <h3>内容编辑区</h3>
              <p>从左侧拖拽或点击组件添加到此处</p>
            </div>
            <div v-for="item in componentList" :key="item.id">
              <component :is="getComponent(item.type)" :ObjData="item.data" />
            </div>
          </div>
        </div>

        <!-- 组件设置区域 -->
        <div class="right-panel">
          <div class="settings-header">
            <h3>组件设置</h3>
            <a-tag color="blue">未选择组件</a-tag>
          </div>
          <div class="settings-content">
            <div class="settings-placeholder" v-if="componentList.length === 0">
              <setting-outlined class="settings-icon" />
              <p>选择组件后，此处显示配置选项</p>
            </div>
            <div class="settings-component" v-if="componentList.length">
              <router-view />
            </div>
            <div class="setting-tabs" v-if="componentList.length">
              <div class="right-panel-tabs">
                <div v-for="tab in rightTabs" :key="tab.name" class="tab-item">
                  <img :src="imageMap[tab.name]" :alt="tab.name" width="32px" />
                </div>
              </div>
            </div>
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
import {
  availableComponents,
  addComponentAndJump,
  getComponent,
  componentList,
  initMap,
  initImageMap,
  imageMap,
} from '@/types/content'

const router = useRouter()
const activeTab = ref('基础组件')
const rightTabs = ref([
  { name: '组件设置', icon: '组件设置' },
  { name: '组件排序', icon: '组件排序' },
])

const indexArray = ref<boolean[]>([])

// 样式定义
const headerStyle: CSSProperties = {
  backgroundColor: '#fff',
  borderBottom: '1px solid #e8e8e8',
  height: '64px',
  lineHeight: '64px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
}

const handlePreview = () => {
  console.log('预览', componentList)
}

const addComponent = (id: number) => {
  const returnData = addComponentAndJump(id)
  if (returnData) {
    router.push(returnData)
  }
}

// 鼠标事件处理
const handleMouseEnter = (index: number) => {
  indexArray.value[index] = true
}

const handleMouseLeave = (index: number) => {
  indexArray.value[index] = false
}

// 返回上一页
const goBack = () => {
  router.push({
    path: '/contents/pages',
  })
}

onMounted(() => {
  initMap()
  initImageMap()
  indexArray.value = Array(availableComponents.value.length).fill(false)
})
</script>

<style scoped>
/* 整体布局 */
.main-container {
  height: calc(100vh - 64px);
  justify-content: space-between;
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
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.editor-container {
  display: flex;
  width: 375px;
  text-align: center;
  background: #fff;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.placeholder-content {
  padding: 40px;
  color: #999;
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

.right-panel {
  width: 400px;
  border-left: 1px solid #e8e8e8;
  background: #fff;
  height: 100%;
  overflow-y: auto;
}

.settings-header {
  display: flex;
  align-items: center;
  padding: 16px;
  justify-content: space-between;
  border-bottom: 1px solid #e8e8e8;
}

.settings-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.settings-content {
  height: 100%;
  overflow-y: auto;
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

.settings-component {
  float: left;
  width: calc(100% - 65px);
  overflow-y: auto;
}

.right-panel-tabs {
  float: right;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #e8e8e8;
  overflow-y: auto;
}

.tab-item {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e8e8e8;
}

.setting-component {
  width: calc(100% - 64px);
  height: 100%;
  overflow-y: auto;
  background-color: red;
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
