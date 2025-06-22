<template>
  <div>
    <a-radio-group
      v-model:value="data.templateStyle"
      button-style="solid"
      class="display-type-radio"
    >
      <a-radio-button value="words">文字型</a-radio-button>
      <a-radio-button value="fixed">图文型</a-radio-button>
      <a-radio-button value="image">图片型</a-radio-button>
    </a-radio-group>
    <a-divider class="divider" />
    <h3 style="color: #1f1f1f; padding: 5px; margin: 0">标签位置</h3>
    <a-radio-group
      v-model:value="tabsPosition"
      button-style="solid"
      class="display-type-radio"
      @change="handlePositionChange"
    >
      <a-radio-button value="top">顶部</a-radio-button>
      <a-radio-button value="left">左侧</a-radio-button>
      <a-radio-button value="right">右侧</a-radio-button>
      <a-radio-button value="bottom">底部</a-radio-button>
    </a-radio-group>
    <a-divider class="divider" />
    <h3 style="color: #1f1f1f; padding: 5px; margin: 0">添加标签</h3>
    <h5 style="color: #9a9a9a; padding: 5px; margin: 0">
      标签字数建议在5个字以内，图片建议尺寸100*100像素
    </h5>
    <a-flex class="setting-list">
      <div v-for="item in data.labels" :key="item.id" class="setting-item">
        <div class="close-btn" @click="deleteTab(item.id)"></div>
        <div class="tab-image" v-if="!(data.templateStyle === 'words')">
          <img src="@/assets/logo.svg" alt="logo" />
          <span>点击</span>
          <span>上传</span>
        </div>
        <div class="input-container">
          <a-input
            v-model:value="item.name"
            placeholder="请输入标签"
            @blur="handleChange"
            v-if="data.templateStyle !== 'image'"
          />
          <a-select placeholder="请选择目标链接" @blur="handleChange" v-model:value="item.jumpUrl">
            <a-select-option v-for="option in options" :key="option.value" :value="option.value">
              {{ option.label }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <a-button type="primary" class="add-tag-btn" @click="addTab">添加标签</a-button>
    </a-flex>

    <div class="style-setting-item">
      <span class="setting-item-label">填充方式</span>
      <a-select
        placeholder="请选择填充方式"
        @blur="handleChange"
        v-model:value="data.fillType"
        class="setting-select"
      >
        <a-select-option
          v-for="item in fillTypeOptions"
          :key="item.value"
          :value="item.value"
          :disabled="
            (data.templateStyle === 'fixed' || data.templateStyle === 'image') &&
            item.value === 'underline'
          "
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
    </div>

    <div class="style-setting-item">
      <span class="setting-item-label">填充形状</span>
      <a-select
        placeholder="请选择填充形状"
        @blur="handleChange"
        v-model:value="data.fillShape"
        class="setting-select"
        :disabled="data.fillType === 'none' || data.fillType === 'underline'"
      >
        <a-select-option
          v-for="item in fillShapeOptions"
          :key="item.value"
          :value="item.value"
          :disabled="data.fillType !== 'none' && item.value === 'none'"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
    </div>

    <div class="style-setting-item" v-if="data.fillShape === 'circle-square'">
      <span class="setting-item-label">圆角大小</span>
      <div class="radius-slider">
        <a-slider
          v-model:value="data.borderRadius"
          :min="0"
          :max="20"
          :step="1"
          @change="handleChange"
        />
        <span class="radius-value">{{ data.borderRadius }}px</span>
      </div>
    </div>

    <div class="style-setting-item" v-if="data.fillType === 'border'">
      <span class="setting-item-label">边框大小</span>
      <div class="size-input">
        <a-input-number
          v-model:value="data.borderSize"
          :min="1"
          :max="10"
          :step="1"
          @change="handleChange"
        />
        <span class="unit">px</span>
      </div>
    </div>

    <a-divider class="divider" />
    <h3 style="color: #1f1f1f; padding: 5px; margin: 0">边距设置</h3>

    <div class="style-setting-item">
      <span class="setting-item-label">自定义样式</span>
      <a-switch v-model:checked="data.customStyle" @change="handleChange" />
    </div>

    <template v-if="data.customStyle">
      <div class="style-setting-item">
        <span class="setting-item-label">上下内边距</span>
        <div class="size-input">
          <a-input-number
            v-model:value="data.paddingVertical"
            :min="0"
            :max="50"
            :step="1"
            @change="handleChange"
          />
          <span class="unit">px</span>
        </div>
      </div>

      <div class="style-setting-item">
        <span class="setting-item-label">左右内边距</span>
        <div class="size-input">
          <a-input-number
            v-model:value="data.paddingHorizontal"
            :min="0"
            :max="50"
            :step="1"
            @change="handleChange"
          />
          <span class="unit">px</span>
        </div>
      </div>

      <div class="style-setting-item">
        <span class="setting-item-label">上下外边距</span>
        <div class="size-input">
          <a-input-number
            v-model:value="data.marginVertical"
            :min="0"
            :max="50"
            :step="1"
            @change="handleChange"
          />
          <span class="unit">px</span>
        </div>
      </div>

      <div class="style-setting-item">
        <span class="setting-item-label">左右外边距</span>
        <div class="size-input">
          <a-input-number
            v-model:value="data.marginHorizontal"
            :min="0"
            :max="50"
            :step="1"
            @change="handleChange"
          />
          <span class="unit">px</span>
        </div>
      </div>
    </template>

    <a-divider class="divider" />
    <h3 style="color: #1f1f1f; padding: 5px; margin: 0">标签颜色设置</h3>
    <div class="style-setting-item" v-for="item in data.colorSetting" :key="item.name">
      <span class="setting-item-label">{{ item.label }}</span>
      <div class="color-picker-control">
        <a-button class="color-reset-btn">重置</a-button>
        <div class="color-picker">
          <input
            type="color"
            v-model="item.value"
            :disabled="item.name === 'inactiveBgColor' && data.fillType === 'underline'"
          />
          <div class="color-preview" :style="{ backgroundColor: item.value }"></div>
        </div>
      </div>
    </div>

    <a-divider class="divider" />
    <h3 style="color: #1f1f1f; padding: 5px; margin: 0">主题预设</h3>
    <div class="theme-presets">
      <div
        v-for="theme in themePresets"
        :key="theme.name"
        class="theme-item"
        :class="{ active: currentTheme === theme.name }"
        @click="applyTheme(theme)"
      >
        <div class="theme-preview" :style="getThemePreviewStyle(theme)">
          <div class="preview-tab active">标签1</div>
          <div class="preview-tab">标签2</div>
        </div>
        <span class="theme-name">{{ theme.label }}</span>
      </div>
    </div>

    <a-divider class="divider" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { Elevator, ElevatorTabs } from '@/types/content/content'
import { getUniqueId } from '@/utils/uniqueId'
import { message } from 'ant-design-vue'

const props = defineProps<{
  objData: Elevator
}>()

const data = ref<Elevator>({
  id: -1,
  templateStyle: 'words',
  labels: [],
  position: 'top',
  colorSetting: [],
  fillType: 'underline',
  fillShape: 'none',
  borderRadius: 8,
  borderSize: 1,
  customStyle: 0,
  paddingVertical: 8,
  paddingHorizontal: 16,
  marginVertical: 0,
  marginHorizontal: 8,
})

const tabsPosition = ref('top')
const emits = defineEmits(['update:objData'])

const fillTypeOptions = ref([
  { value: 'none', label: '无' },
  { value: 'background', label: '背景' },
  { value: 'underline', label: '下划线' },
  { value: 'border', label: '边框' },
])
const fillShapeOptions = ref([
  { value: 'none', label: '无' },
  { value: 'circle', label: '圆形' },
  { value: 'square', label: '方形' },
  { value: 'circle-square', label: '圆角方形' },
])

const options = ref([
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
])

const currentTheme = ref('')

const themePresets = [
  {
    name: 'default',
    label: '经典简约',
    fillType: 'none',
    fillShape: 'none',
    borderSize: 0,
    borderRadius: 8,
    customStyle: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 0,
    marginHorizontal: 8,
    colorSetting: [
      { name: 'activeColor', label: '选中文字颜色', value: '#1890ff' },
      { name: 'inactiveColor', label: '未选中文字颜色', value: '#666666' },
      { name: 'activeBgColor', label: '选中背景颜色', value: '#ffffff' },
      { name: 'inactiveBgColor', label: '未选中背景颜色', value: '#ffffff' },
      { name: 'navBgColor', label: '导航背景颜色', value: '#ffffff' },
    ],
  },
  {
    name: 'techBlue',
    label: '科技蓝',
    fillType: 'background',
    fillShape: 'circle-square',
    borderSize: 0,
    borderRadius: 20,
    customStyle: 0,
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginVertical: 5,
    marginHorizontal: 5,
    colorSetting: [
      { name: 'activeColor', label: '选中文字颜色', value: '#ffffff' },
      { name: 'inactiveColor', label: '未选中文字颜色', value: '#333333' },
      { name: 'activeBgColor', label: '选中背景颜色', value: '#1890ff' },
      { name: 'inactiveBgColor', label: '未选中背景颜色', value: '#e6f7ff' },
      { name: 'navBgColor', label: '导航背景颜色', value: '#f0f5ff' },
    ],
  },
  {
    name: 'elegantPurple',
    label: '优雅紫',
    fillType: 'background',
    fillShape: 'circle-square',
    borderSize: 0,
    borderRadius: 20,
    customStyle: 0,
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginVertical: 5,
    marginHorizontal: 5,
    colorSetting: [
      { name: 'activeColor', label: '选中文字颜色', value: '#722ed1' },
      { name: 'inactiveColor', label: '未选中文字颜色', value: '#666666' },
      { name: 'activeBgColor', label: '选中背景颜色', value: '#f9f0ff' },
      { name: 'inactiveBgColor', label: '未选中背景颜色', value: '#f9f0ff' },
      { name: 'navBgColor', label: '导航背景颜色', value: '#ffffff' },
    ],
  },
  {
    name: 'natureGreen',
    label: '自然绿',
    fillType: 'background',
    fillShape: 'circle-square',
    borderSize: 0,
    borderRadius: 20,
    customStyle: 0,
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginVertical: 5,
    marginHorizontal: 5,
    colorSetting: [
      { name: 'activeColor', label: '选中文字颜色', value: '#ffffff' },
      { name: 'inactiveColor', label: '未选中文字颜色', value: '#52c41a' },
      { name: 'activeBgColor', label: '选中背景颜色', value: '#52c41a' },
      { name: 'inactiveBgColor', label: '未选中背景颜色', value: '#f6ffed' },
      { name: 'navBgColor', label: '导航背景颜色', value: '#ffffff' },
    ],
  },
  {
    name: 'vibrantOrange',
    label: '活力橙',
    fillType: 'background',
    fillShape: 'none',
    borderSize: 0,
    borderRadius: 0,
    customStyle: 0,
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginVertical: 5,
    marginHorizontal: 5,
    colorSetting: [
      { name: 'activeColor', label: '选中文字颜色', value: '#fa8c16' },
      { name: 'inactiveColor', label: '未选中文字颜色', value: '#666666' },
      { name: 'activeBgColor', label: '选中背景颜色', value: '#ffffff' },
      { name: 'inactiveBgColor', label: '未选中背景颜色', value: '#ffffff' },
      { name: 'navBgColor', label: '导航背景颜色', value: '#fff7e6' },
    ],
  },
  {
    name: 'darkMode',
    label: '暗夜模式',
    fillType: 'background',
    fillShape: 'circle-square',
    borderSize: 0,
    borderRadius: 20,
    customStyle: 0,
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginVertical: 5,
    marginHorizontal: 5,
    colorSetting: [
      { name: 'activeColor', label: '选中文字颜色', value: '#ffffff' },
      { name: 'inactiveColor', label: '未选中文字颜色', value: '#aaaaaa' },
      { name: 'activeBgColor', label: '选中背景颜色', value: '#333333' },
      { name: 'inactiveBgColor', label: '未选中背景颜色', value: '#1f1f1f' },
      { name: 'navBgColor', label: '导航背景颜色', value: '#141414' },
    ],
  },
  {
    name: 'minimalist',
    label: '极简主义',
    fillType: 'none',
    fillShape: 'none',
    borderSize: 0,
    borderRadius: 0,
    customStyle: 0,
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginVertical: 5,
    marginHorizontal: 5,
    colorSetting: [
      { name: 'activeColor', label: '选中文字颜色', value: '#000000' },
      { name: 'inactiveColor', label: '未选中文字颜色', value: '#888888' },
      { name: 'activeBgColor', label: '选中背景颜色', value: 'transparent' },
      { name: 'inactiveBgColor', label: '未选中背景颜色', value: 'transparent' },
      { name: 'navBgColor', label: '导航背景颜色', value: '#ffffff' },
    ],
  },
]

const handleChange = () => {
  emits('update:objData', data.value)
}

const handlePositionChange = (value: string) => {
  handleChange()
}

const deleteTab = (tabId: number) => {
  if (data.value.labels.length < 3) {
    message.error('至少保留两个标签')
    return
  }
  data.value.labels = data.value.labels.filter((item) => item.id !== tabId)
  handleChange()
}

const addTab = () => {
  const newTab = ref<ElevatorTabs>({
    id: -1,
    name: '新建标签',
    jumpUrl: 'www.baidu.com',
    imageUrl: '@/assets/logo.svg',
  })
  newTab.value.id = getUniqueId()
  data.value.labels.push(newTab.value)
  handleChange()
}

const isThemeChanging = ref(false)

const applyTheme = (theme: (typeof themePresets)[0]) => {
  isThemeChanging.value = true
  data.value.fillShape = theme.fillShape
  data.value.fillType = theme.fillType
  data.value.borderSize = theme.borderSize
  data.value.borderRadius = theme.borderRadius
  data.value.colorSetting = JSON.parse(JSON.stringify(theme.colorSetting))
  data.value.customStyle = theme.customStyle ? 1 : 0
  data.value.paddingVertical = theme.paddingVertical
  data.value.paddingHorizontal = theme.paddingHorizontal
  data.value.marginVertical = theme.marginVertical
  data.value.marginHorizontal = theme.marginHorizontal
  currentTheme.value = theme.name
  handleChange()
  setTimeout(() => {
    isThemeChanging.value = false
  }, 0)
}

const getThemePreviewStyle = (theme: (typeof themePresets)[0]) => {
  const activeColor = theme.colorSetting.find((item) => item.name === 'activeColor')?.value
  const inactiveColor = theme.colorSetting.find((item) => item.name === 'inactiveColor')?.value
  const activeBgColor = theme.colorSetting.find((item) => item.name === 'activeBgColor')?.value
  const inactiveBgColor = theme.colorSetting.find((item) => item.name === 'inactiveBgColor')?.value
  const navBgColor = theme.colorSetting.find((item) => item.name === 'navBgColor')?.value

  return {
    '--active-color': activeColor,
    '--inactive-color': inactiveColor,
    '--active-bg-color': activeBgColor,
    '--inactive-bg-color': inactiveBgColor,
    '--nav-bg-color': navBgColor,
    '--border-radius': `${theme.borderRadius}px`,
    '--border-size': `${theme.borderSize}px`,
  }
}

onMounted(() => {
  data.value = props.objData as Elevator
})

watch(
  () => data.value.templateStyle,
  (newVal) => {
    data.value.fillType = 'none'
    data.value.fillShape = 'none'
    handleChange()
  },
)

watch(
  () => data.value.fillType,
  (newVal) => {
    if (newVal === 'underline') {
      data.value.fillShape = 'none'
    } else if (newVal === 'none') {
      data.value.fillShape = 'none'
    } else if (newVal === 'border' || newVal === 'background') {
      if (data.value.fillShape === 'none') {
        data.value.fillShape = 'square'
      }
    }
    handleChange()
  },
)

watch(
  () => data.value.fillShape,
  (newVal) => {
    if (newVal === 'circle-square' && !isThemeChanging.value) {
      if (!data.value.borderRadius) {
        data.value.borderRadius = 8
      }
    }
    handleChange()
  },
)

watch(
  () => data.value.customStyle,
  (newVal) => {
    data.value.customStyle = data.value.customStyle ? 1 : 0
  },
)
</script>

<style scoped>
.display-type-radio {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 16px 0;
}

.tab-image {
  display: flex;
  font-size: 12px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.tab-image img {
  width: 32px;
  height: 32px;
}

.input-container {
  gap: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.divider {
  margin: 0;
}

.setting-list {
  display: flex;
  gap: 10px;
  padding: 10px;
  justify-content: space-between;
  background-color: #f2f2f2;
  align-items: center;
  flex-direction: column;
}

.setting-item {
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  position: relative;
  padding: 10px;
  height: 100px;
  background-color: #fefefe;
  gap: 5px;
}

/* 关闭按钮样式 */
.close-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #95a5a6;
  cursor: pointer;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.close-btn:hover {
  background: #e74c3c;
  transform: scale(1);
}

.close-btn::before,
.close-btn::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 2px;
  background: white;
}

.close-btn::before {
  transform: rotate(45deg);
}

.close-btn::after {
  transform: rotate(-45deg);
}

/* 鼠标悬停时显示关闭按钮 */
.setting-item:hover .close-btn {
  opacity: 1;
  transform: scale(1);
}

.add-tag-btn {
  width: 100%;
}

.style-setting-item {
  display: flex;
  padding: 12px 16px;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item-label {
  width: 80px;
  color: #666;
  font-size: 14px;
}

.setting-select {
  width: 150px;
}

.color-picker-control {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  align-items: center;
}

.color-reset-btn {
  font-size: 14px;
  color: #1890ff;
  background: none;
  border: none;
  padding: 4px 0;
  cursor: pointer;
}

.color-picker {
  position: relative;
  width: 70px;
  height: 30px;
  border-radius: 4px;
  overflow: hidden;
}

.color-picker input[type='color'] {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.color-preview {
  width: 100%;
  height: 100%;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

.radius-slider {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.radius-value {
  min-width: 50px;
  color: #666;
  font-size: 14px;
}

:deep(.ant-slider-horizontal) {
  width: 100%;
}

.size-input {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.unit {
  color: #666;
  font-size: 14px;
}

:deep(.ant-input-number) {
  width: 100px;
}

/* 更新后的主题预设样式 */
.theme-presets {
  display: flex;
  gap: 8px; /* 减小间隙 */
  padding: 12px 0; /* 调整内边距 */
  flex-wrap: wrap;
  justify-content: space-between; /* 两端对齐 */
}

.theme-item {
  cursor: pointer;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 8px;
  transition: all 0.3s;
  width: calc(50% - 4px); /* 每行显示2个 */
  box-sizing: border-box;
  position: relative;
}

.theme-item:hover {
  border-color: #1890ff;
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.theme-item.active {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.theme-item.active::after {
  content: '✓';
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  background: #1890ff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  z-index: 1;
}

.theme-preview {
  width: 100%;
  height: 50px; /* 降低高度 */
  background-color: var(--nav-bg-color);
  border-radius: 6px;
  padding: 6px;
  display: flex;
  gap: 4px; /* 减小标签间隙 */
  margin-bottom: 6px;
  align-items: center;
  justify-content: center;
}

.preview-tab {
  padding: 3px 6px; /* 减小内边距 */
  border-radius: var(--border-radius);
  font-size: 10px; /* 减小字体大小 */
  color: var(--inactive-color);
  background-color: var(--inactive-bg-color);
  border: var(--border-size) solid transparent;
  white-space: nowrap;
  transition: all 0.2s;
  flex-shrink: 1; /* 允许缩小 */
  min-width: 30px; /* 最小宽度 */
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preview-tab.active {
  color: var(--active-color);
  background-color: var(--active-bg-color);
  border: var(--border-size) solid var(--active-bg-color);
  transform: scale(1.05);
}

.theme-name {
  display: block;
  text-align: center;
  font-size: 11px; /* 减小字体大小 */
  color: #333;
  font-weight: 500;
  line-height: 1.3;
}
</style>

<script lang="ts">
export default {
  name: 'ElevatorSetting',
}
</script>
