<template>
  <a-radio-group v-model:value="displayType" button-style="solid" class="display-type-radio">
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
      <div class="close-btn"></div>
      <a-input v-model:value="item.label" placeholder="请输入标签" @blur="handleChange" />
      <a-select placeholder="请选择目标链接" @blur="handleChange" v-model:value="item.jumpUrl">
        <a-select-option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </a-select-option>
      </a-select>
    </div>
    <a-button type="primary" class="add-tag-btn">添加标签</a-button>
  </a-flex>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Elevator } from '@/types/content'
import { getUniqueId } from '@/utils/uniqueId'

const props = defineProps<{
  objData: Elevator
}>()

const data = ref<Elevator>({
  elevatorId: -1,
  templateStyle: '',
  tabData: [
    { tabId: getUniqueId(), label: '导航1', jumpUrl: 'www.baidu.com' },
    { tabId: getUniqueId(), label: '导航2', jumpUrl: 'www.jingdong.com' },
    { tabId: getUniqueId(), label: '导航3', jumpUrl: 'www.taobao.com' },
    { tabId: getUniqueId(), label: '导航4', jumpUrl: 'www.sina.com' },
  ],
})

const emits = defineEmits(['update:objData'])
const displayType = ref('words')

const options = ref([
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
])

const handleChange = () => {
  emits('update:objData', data.value)
}

onMounted(() => {
  data.value = props.objData as Elevator
  console.log('onMounted', data.value)
})
</script>

<style scoped>
.display-type-radio {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 16px 0;
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
  justify-content: center;
  position: relative;
  padding: 10px;
  height: 100px;
  background-color: #fefefe;
  flex-direction: column;
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
