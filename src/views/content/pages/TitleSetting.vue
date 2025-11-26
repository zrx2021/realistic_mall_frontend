<template>
  <div class="setting-panel">
    <section class="setting-section">
      <div class="section-header">
        <span class="section-title">模块标题</span>
        <span class="section-subtitle">用于组件展示，控制在12个字以内</span>
      </div>
      <a-input
        class="section-input"
        v-model:value="title"
        placeholder="请输入标题"
        @blur="changing"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { TextComponent } from '@/types/content/content'

const props = defineProps<{
  objData: string | TextComponent
}>()

const emits = defineEmits(['update:objData'])

const title = ref('')
const changing = () => {
  console.log('TitleSetting changing', title.value)
  if (typeof props.objData === 'string') {
    // 如果原来是字符串格式，保持字符串格式
    emits('update:objData', title.value)
  } else {
    // 如果原来是对象格式，保持对象格式
    emits('update:objData', {
      ...props.objData,
      titleContent: title.value,
    })
  }
}

onMounted(() => {
  if (typeof props.objData === 'string') {
    title.value = props.objData
  } else {
    title.value = props.objData.titleContent
  }
})

watch(
  () => props.objData,
  (newVal) => {
    if (typeof newVal === 'string') {
      title.value = newVal
    } else {
      title.value = newVal.titleContent
    }
  },
)
</script>

<style scoped>
.setting-panel {
  width: 100%;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.setting-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f1f1f;
}

.section-subtitle {
  font-size: 12px;
  color: #8c8c8c;
}

.section-input {
  width: 100%;
}

:deep(.ant-input) {
  border-radius: 6px;
  border-color: #d9d9d9;
  padding: 6px 12px;
}
</style>

<script lang="ts">
export default {
  name: 'TitleSetting',
}
</script>
