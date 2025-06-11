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

    <!-- 标签样式设置部分 -->
    <a-divider class="divider" />
    <h3 style="color: #1f1f1f; padding: 5px; margin: 0">标签样式</h3>

    <div class="style-setting-item">
      <span class="setting-label">文本位置</span>
      <div class="setting-controls">
        <a-radio-group v-model:value="styleConfig.textPosition" button-style="solid">
          <a-radio-button value="dropdown">下拉展示</a-radio-button>
          <a-radio-button value="scroll">横向滚动</a-radio-button>
        </a-radio-group>
      </div>
    </div>

    <div class="style-setting-item">
      <span class="setting-label">标签样式</span>
      <div class="setting-controls">
        <a-radio-group v-model:value="styleConfig.tabStyle" button-style="solid">
          <a-radio-button value="background">背景色</a-radio-button>
          <a-radio-button value="round">圆框</a-radio-button>
          <a-radio-button value="square">方框</a-radio-button>
          <a-radio-button value="underline">下划线</a-radio-button>
        </a-radio-group>
      </div>
    </div>

    <div class="style-setting-item">
      <span class="setting-label">文本颜色_默认状态</span>
      <div class="setting-controls">
        <a-button class="reset-btn" @click="resetColor('defaultTextColor')">重置</a-button>
        <div class="color-picker">
          <input type="color" v-model="styleConfig.defaultTextColor" @change="handleChange" />
          <div
            class="color-preview"
            :style="{ backgroundColor: styleConfig.defaultTextColor }"
          ></div>
        </div>
      </div>
    </div>

    <div class="style-setting-item">
      <span class="setting-label">文本颜色_选中状态</span>
      <div class="setting-controls">
        <a-button class="reset-btn" @click="resetColor('activeTextColor')">重置</a-button>
        <div class="color-picker">
          <input type="color" v-model="styleConfig.activeTextColor" @change="handleChange" />
          <div
            class="color-preview"
            :style="{ backgroundColor: styleConfig.activeTextColor }"
          ></div>
        </div>
      </div>
    </div>

    <div class="style-setting-item">
      <span class="setting-label" v-text="getTabStyleText(styleConfig.tabStyle)"></span>
      <div class="setting-controls">
        <a-button class="reset-btn" @click="resetColor('activeBackgroundColor')">重置</a-button>
        <div class="color-picker">
          <input type="color" v-model="styleConfig.activeBackgroundColor" @change="handleChange" />
          <div
            class="color-preview"
            :style="{ backgroundColor: styleConfig.activeBackgroundColor }"
          ></div>
        </div>
      </div>
    </div>

    <div class="style-setting-item">
      <span class="setting-label">背景颜色</span>
      <div class="setting-controls">
        <a-button class="reset-btn" @click="resetColor('backgroundColor')">重置</a-button>
        <div class="color-picker">
          <input type="color" v-model="styleConfig.backgroundColor" @change="handleChange" />
          <div
            class="color-preview"
            :style="{ backgroundColor: styleConfig.backgroundColor }"
          ></div>
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
})

// 样式配置数据
const styleConfig = ref({
  textPosition: 'dropdown',
  tabStyle: 'background',
  defaultTextColor: '#333333',
  activeTextColor: '#333333',
  activeBackgroundColor: '#FFC0CB',
  backgroundColor: '#FFFFFF',
})

const emits = defineEmits(['update:objData'])

const options = ref([
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
])

const handleChange = () => {
  // 合并样式配置到data中
  data.value.styleConfig = styleConfig.value
  emits('update:objData', data.value)
}

const getTabStyleText = (tabStyle: string) => {
  switch (tabStyle) {
    case 'background':
      return '背景颜色_选中状态'
    case 'round':
      return '圆框颜色_选中状态'
    case 'square':
      return '方框颜色_选中状态'
    case 'underline':
      return '下划线颜色_选中状态'
    default:
      return '背景颜色_选中状态'
  }
}

const resetColor = (colorType: string) => {
  const defaultColors = {
    defaultTextColor: '#333333',
    activeTextColor: '#333333',
    activeBackgroundColor: '#FFC0CB',
    backgroundColor: '#FFFFFF',
  }

  styleConfig.value[colorType as keyof typeof styleConfig.value] =
    defaultColors[colorType as keyof typeof defaultColors]

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
  // 如果没有样式配置，初始化它
  if (!data.value.styleConfig) {
    data.value.styleConfig = styleConfig.value
  } else {
    styleConfig.value = data.value.styleConfig
  }
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

/* 新增的样式设置部分 */
.style-setting-item {
  display: flex;
  padding: 12px 16px;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.setting-label {
  width: 150px;
  color: #666;
  font-size: 14px;
}

.setting-controls {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  align-items: center;
}

.reset-btn {
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
</style>

<script lang="ts">
export default {
  name: 'ElevatorSetting',
}
</script>
