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
      <a-select placeholder="请选择填充方式" @blur="handleChange" v-model:value="data.fillType">
        <a-select-option v-for="item in fillTypeOptions" :key="item.value" :value="item.value">
          {{ item.label }}
        </a-select-option>
      </a-select>
    </div>

    <div class="style-setting-item">
      <span class="setting-item-label">填充形状</span>
      <a-select placeholder="请选择填充形状" @blur="handleChange" v-model:value="data.fillShape">
        <a-select-option v-for="item in fillShapeOptions" :key="item.value" :value="item.value">
          {{ item.label }}
        </a-select-option>
      </a-select>
    </div>

    <div class="style-setting-item" v-for="item in data.colorSetting" :key="item.name">
      <span :v-text="item.label" class="setting-item-label"></span>
      <div class="color-picker-control">
        <a-button class="color-reset-btn">重置</a-button>
        <div id="color-picker">
          <input type="color" v-model="item.value" />
          <div class="color-preview" :style="{ backgroundColor: item.value }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Elevator, ElevatorTabs } from '@/types/content'
import { getUniqueId } from '@/utils/uniqueId'
import { message } from 'ant-design-vue'

const props = defineProps<{
  objData: Elevator
}>()

const data = ref<Elevator>({
  elevatorId: -1,
  templateStyle: '',
  tabData: [],
  tabsPosition: 'top',
  colorSetting: [],
  fillType: 'none',
  fillShape: 'underline',
})

const tabsPosition = ref('top')
const emits = defineEmits(['update:objData'])

const fillTypeOptions = ref([
  { value: 'none', label: '无' },
  { value: 'background', label: '背景' },
  { value: 'border', label: '边框' },
])
const fillShapeOptions = ref([
  { value: 'none', label: '无' },
  { value: 'circle', label: '圆形' },
  { value: 'square', label: '方形' },
  { value: 'underline', label: '下划线' },
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
</style>

<script lang="ts">
export default {
  name: 'ElevatorSetting',
}
</script>
