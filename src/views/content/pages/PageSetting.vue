<template>
  <div class="setting-panel">
    <section class="setting-section">
      <div class="section-header">
        <span class="section-title">页面名称</span>
        <span class="section-subtitle">展示在页面管理和导航位置，保持简洁</span>
      </div>
      <a-input
        class="section-input"
        v-model:value="data.name"
        placeholder="请输入页面名称"
        @change="handleChange"
      />
    </section>

    <div class="setting-divider" role="presentation"></div>

    <section class="setting-section">
      <div class="section-header">
        <span class="section-title">页面描述</span>
        <span class="section-subtitle">用于内部说明，便于快速识别</span>
      </div>
      <a-textarea
        class="section-input"
        v-model:value="data.description"
        placeholder="请输入页面描述"
        :auto-size="{ minRows: 3, maxRows: 5 }"
        @change="handleChange"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Article } from '@/types/content/content'

const props = defineProps<{
  objData: Article
  pageData: Article
}>()

const data = ref({
  id: -1,
  status: -1,
  backgroundColor: '#000',
  templateId: -1,
  name: '出现错误',
  description: '出现错误',
})

const emits = defineEmits(['update:pageData'])

const handleChange = () => {
  emits('update:pageData', data.value)
}

onMounted(() => {
  console.log('props.objData', props.objData)
  data.value = props.objData
})
</script>

<style scoped>
.setting-panel {
  width: 100%;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #fff;
  overflow-y: auto;
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

.setting-divider {
  height: 1px;
  background-color: #f0f0f0;
}

:deep(.ant-input),
:deep(.ant-input-textarea) {
  border-radius: 6px;
  border-color: #d9d9d9;
  padding: 6px 12px;
}
</style>

<script lang="ts">
export default {
  name: 'PageSetting',
}
</script>
