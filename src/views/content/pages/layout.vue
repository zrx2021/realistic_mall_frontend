<template>
  <a-layout>
    <a-layout-header :style="headerStyle">
      <a-flex align="center" justify="space-between" style="width: 100%; padding: 0 20px">
        <div class="header-left">
          <arrow-left-outlined class="back-icon" @click="goBack" />
          <span class="back-text" @click="goBack">返回页面管理</span>
          <span class="page-title">页面编辑 - {{ pageData.name || '新页面' }}</span>
        </div>
        <a-space>
          <a-button variant="outlined" class="action-btn" @click="handlePreview">
            <template #icon><eye-outlined /></template>
            预览
          </a-button>
          <a-button
            type="primary"
            class="action-btn"
            @click="handleSave"
            :disabled="saveBtnDisabled"
          >
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
                  v-for="element in category.components"
                  :key="element.id"
                  @click="addComponent(element.id)"
                  @mouseenter="handleMouseEnter(element.id)"
                  @mouseleave="handleMouseLeave(element.id)"
                >
                  <div class="component-icon">
                    <img
                      :src="imageMap[element.name + '-hover']"
                      :alt="element.name"
                      v-show="indexArray[element.id]"
                    />
                    <img
                      :src="imageMap[element.name]"
                      :alt="element.name"
                      v-show="!indexArray[element.id]"
                    />
                  </div>
                  <span class="component-name">{{ element.name }}</span>
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>

        <!-- 内容编辑区域 -->
        <div class="editor-area">
          <div class="editor-container">
            <div class="placeholder-content" v-if="componentList.length === 0">
              <laptop-outlined class="placeholder-icon" />
              <h3>内容编辑区</h3>
              <p>从左侧拖拽或点击组件添加到此处</p>
            </div>
            <div
              v-for="(element, index) in componentList"
              :key="`${element.id}-${refreshKeysArray[index]}-${element.type}`"
            >
              <component
                :is="getComponent(element.type)"
                :objData="indexData[index] as any"
                :environment="'editing'"
                @click="handleClick(element.id, element.type)"
                :class="{ isSelected: index === settingIndex }"
              />
            </div>
          </div>
        </div>

        <!-- 组件设置区域 -->
        <div class="right-panel">
          <div class="settings-header">
            <h3>组件设置</h3>
            <a-tag color="blue">{{
              settingIndex >= 0 ? componentList[settingIndex]?.name || '组件设置' : '未选择组件'
            }}</a-tag>
          </div>
          <div class="settings-content">
            <div class="settings-placeholder" v-if="componentList.length === 0">
              <setting-outlined class="settings-icon" />
              <p>选择组件后，此处显示配置选项</p>
            </div>
            <div class="settings-component" v-if="componentList.length">
              <component
                :is="getSettingsComponent(settingType)"
                :key="refreshKeysArray[settingIndex]"
                :objData="settingData as any"
                :pageData="pageData"
                @update:objData="(val: any) => (settingData = val)"
                @update:pageData="(val: Article) => (pageData = val)"
              />
            </div>
            <div class="setting-tabs" v-if="componentList.length">
              <div class="right-panel-tabs">
                <div
                  v-for="tab in rightTabs"
                  :key="tab.name"
                  class="tab-item"
                  @click="handleTabClick(tab.name)"
                >
                  <img :src="imageMap[tab.name]" :alt="tab.name" width="32px" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-flex>
    </a-layout-content>

    <!-- 移动端预览组件 -->
    <MobilePreview
      v-model:visible="previewVisible"
      :componentList="componentList"
      :pageData="pageData"
    />
  </a-layout>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
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
  getComponent,
  initMap,
  initImageMap,
  imageMap,
  getTemplate,
  getSettingsComponent,
} from '@/types/content/content'

import type { Wrapper, Elevator, Goods, Article, TextComponent, ArticleType } from '@/types/content/content'
import { getComponentTypes, getPageDetailById } from '@/api/content/page'
import { getUniqueId } from '@/utils/uniqueId'
import { savePage } from '@/api/content/page'
import { message } from 'ant-design-vue'
import { transformComponentData, transformComponentListToBackend } from '@/utils/componentTransform'
import MobilePreview from '@/components/dialog/MobilePreview.vue'

const router = useRouter()
const route = useRoute()
const settingType = ref(-1)
const settingIndex = ref(-1)
const saveBtnDisabled = ref(false)
const activeTab = ref('基础组件')
const previewVisible = ref(false)
const componentTypes = ref<ArticleType[]>([])
const pageData = ref<Article>({
  id: getUniqueId(),
  status: 0,
  name: '',
  description: '',
  backgroundColor: '#fff',
  templateId: 0,
})
const componentList = ref<Wrapper[]>([])
const indexArray = ref<boolean[]>([])
const refreshKeysArray = ref<number[]>([])
const indexData = ref<(string | Elevator | Goods | Article | TextComponent)[]>([])
const settingData = ref<string | Elevator | Goods | Article | TextComponent>(
  {} as string | Elevator | Goods | Article | TextComponent,
)

const rightTabs = ref([
  { name: '组件设置', icon: '组件设置' },
  { name: '组件排序', icon: '组件排序' },
])

// 样式定义
const headerStyle: CSSProperties = {
  backgroundColor: '#fff',
  borderBottom: '1px solid #e8e8e8',
  height: '64px',
  lineHeight: '64px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
}

const handleTabClick = (name: string) => {
  console.log('handleTabClick', name)
  if (name === '组件设置') {
    settingType.value = 999
  } else if (name === '组件排序') {
    settingType.value = 998
  }
  settingData.value = pageData.value
}

// 修改addComponent方法以适应新的组件数据结构
const addComponent = (type: number) => {
  const template = ref(getTemplate(type))
  console.log('newComponent new Template', template.value)
  if (template.value) {
    componentList.value.push(template.value)
    indexData.value.push(template.value.objData)
  }
}

// 修改handleClick方法以适应新的组件数据结构
const handleClick = (id: number, type: number) => {
  componentList.value.forEach((element, index) => {
    if (element.id === id && element.type === type) {
      settingType.value = element.type
      settingIndex.value = index
      settingData.value = element.objData
    }
  })
}

// 保存页面数据
const handleSave = async () => {
  // saveBtnDisabled.value = true
  console.log('保存前组件列表', componentList.value)

  // 转换组件列表为后端格式
  const transformedComponents = transformComponentListToBackend(componentList.value)
  console.log('转换后的组件列表', transformedComponents)

  // 修复类型问题
  const saveComponents = transformedComponents.map((item) => ({
    id: item.id,
    type: item.typeId, // 将typeId转换为type以匹配Wrapper接口
    name: item.name || '',
    objData: item.objData,
  })) as Wrapper[]

  const res = await savePage({
    id: pageData.value.id,
    name: pageData.value.name,
    status: pageData.value.status,
    description: pageData.value.description,
    backgroundColor: pageData.value.backgroundColor,
    templateId: Number(route.query.templateId) || -1,
    components: saveComponents,
  })
  if (res) {
    fetchPageDetail(res)
  }
}

const handlePreview = () => {
  console.log('预览', componentList.value)
  previewVisible.value = true
}

const fetchArticleType = async () => {
  try {
    const typesDetail = await getComponentTypes()
    componentTypes.value = typesDetail
  } catch (error) {
    message.error('获取页面组件失败')
  }
}

// 获取页面详情数据
const fetchPageDetail = async (id: number) => {
  try {
    const pageDetail = await getPageDetailById(id)

    // 更新页面基本信息
    pageData.value = {
      id: pageDetail.id,
      name: pageDetail.name,
      status: pageDetail.status,
      description: pageDetail.description,
      backgroundColor: pageDetail.backgroundColor,
      templateId: pageDetail.templateId || -1,
    }

    // 清空组件列表
    componentList.value = []
    indexData.value = []

    // 按照order排序组件
    const sortedComponents = [...pageDetail.components].sort((a, b) => a.pageOrder - b.pageOrder)

    // 转换后端组件数据为前端需要的格式
    sortedComponents.forEach((component) => {
      const template = getTemplate(component.typeId)

      if (template) {
        // 创建组件
        const newComponent: Wrapper = {
          id: component.id,
          type: component.typeId,
          name: template.name,
          objData: transformComponentData(component),
        }

        componentList.value.push(newComponent)
        indexData.value.push(newComponent.objData)
      }
    })

    // 如果有组件，默认选中第一个
    if (componentList.value.length > 0) {
      settingIndex.value = 0
      settingType.value = componentList.value[0].type
      settingData.value = componentList.value[0].objData
    }
  } catch (error) {
    console.error('获取页面详情失败:', error)
    message.error('获取页面详情失败')
  }
  refreshKeysArray.value = componentList.value.map(() => getUniqueId())
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
    name: 'ContentsManagement',
  })
}

watch(settingData, (newVal, oldVal) => {
  if (settingType.value < 998) {
    indexData.value[settingIndex.value] = newVal
    componentList.value[settingIndex.value].objData = newVal

    // 只有当数据真正发生变化时才重新渲染组件
    if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
      // 保存当前滚动位置
      const editorArea = document.querySelector('.editor-area')
      const settingsContent = document.querySelector('.settings-content')
      const editorScrollTop = editorArea?.scrollTop || 0
      const settingsScrollTop = settingsContent?.scrollTop || 0

      refreshKeysArray.value[settingIndex.value] = getUniqueId()

      // 在下一个tick恢复滚动位置
      nextTick(() => {
        if (editorArea) {
          editorArea.scrollTop = editorScrollTop
        }
        if (settingsContent) {
          settingsContent.scrollTop = settingsScrollTop
        }
      })
    }
  }
  if (settingType.value === 999) {
    console.log('settingType.value === 999', newVal)
    pageData.value = newVal as Article
  }
})

onMounted(() => {
  initMap()
  initImageMap()
  // indexArray.value = Array(availableComponents.value.length).fill(false)
  fetchArticleType()

  const pageId = route.query.id

  if (pageId) {
    // 如果有页面ID参数，获取页面详情
    fetchPageDetail(Number(pageId))
  } else {
    // 没有页面ID，根据模板ID创建新页面
    pageData.value.templateId = Number(route.query.templateId) || 0
    // 添加默认组件
    addComponent(1)
  }
})
</script>

<style scoped>
body::-webkit-scrollbar {
  width: 0.5em;
  background-color: #f5f5f5;
}

body::-webkit-scrollbar-thumb {
  background-color: #000000;
}

body {
  -ms-overflow-style: none;
}

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
  width: 100%;
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

.isSelected {
  border: 1px solid #1890ff;
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
