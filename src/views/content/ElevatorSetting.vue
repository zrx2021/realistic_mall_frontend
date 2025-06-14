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
      <div v-for="item in data.tabData" :key="item.tabId" class="setting-item">
        <div class="close-btn" @click="deleteTab(item.tabId)"></div>
        <div class="tab-image" v-if="!(data.templateStyle === 'words')">
          <img src="@/assets/logo.svg" alt="logo" />
          <span>点击</span>
          <span>上传</span>
        </div>
        <div class="input-container">
          <a-input
            v-model:value="item.label"
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

    <a-divider class="divider" />
    <h3 style="color: #1f1f1f; padding: 5px; margin: 0">标签颜色设置</h3>

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

    <a-divider class="divider" />
    <h3 style="color: #1f1f1f; padding: 5px; margin: 0">标签尺寸</h3>

    <div class="style-setting-item">
      <span class="setting-item-label">标签宽度</span>
      <div class="size-input">
        <a-input-number
          v-model:value="data.tabWidth"
          :min="50"
          :max="200"
          :step="1"
          @change="handleChange"
        />
        <span class="unit">px</span>
      </div>
    </div>

    <div class="style-setting-item">
      <span class="setting-item-label">标签高度</span>
      <div class="size-input">
        <a-input-number
          v-model:value="data.tabHeight"
          :min="30"
          :max="100"
          :step="1"
          @change="handleChange"
        />
        <span class="unit">px</span>
      </div>
    </div>

    <a-divider class="divider" />
    <h3 style="color: #1f1f1f; padding: 5px; margin: 0">边距设置</h3>

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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { Elevator, ElevatorTabs } from '@/types/content'
import { getUniqueId } from '@/utils/uniqueId'
import { message } from 'ant-design-vue'

const props = defineProps<{
  objData: Elevator
}>()

const data = ref<Elevator>({
  elevatorId: -1,
  templateStyle: 'words',
  tabData: [],
  tabsPosition: 'top',
  colorSetting: [],
  fillType: 'underline',
  fillShape: 'none',
  borderRadius: 8,
  tabWidth: 100,
  tabHeight: 40,
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

const handleChange = () => {
  emits('update:objData', data.value)
}

const handlePositionChange = (value: string) => {
  handleChange()
}

const deleteTab = (tabId: number) => {
  if (data.value.tabData.length < 2) {
    message.error('至少保留两个标签')
    return
  }
  data.value.tabData = data.value.tabData.filter((item) => item.tabId !== tabId)
  handleChange()
}

const addTab = () => {
  const newTab = ref<ElevatorTabs>({
    tabId: -1,
    label: '新建标签',
    jumpUrl: 'www.baidu.com',
    image: '@/assets/logo.svg',
  })
  newTab.value.tabId = getUniqueId()
  data.value.tabData.push(newTab.value)
  handleChange()
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
    } else {
      data.value.fillShape = 'square'
    }
    handleChange()
  },
)

watch(
  () => data.value.fillShape,
  (newVal) => {
    if (newVal === 'circle-square') {
      data.value.borderRadius = 8
    }
    handleChange()
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
</style>

<script lang="ts">
export default {
  name: 'ElevatorSetting',
}
</script>
