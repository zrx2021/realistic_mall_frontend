<template>
  <div class="page-setting">
    <h3>页面名称</h3>
    <a-input v-model:value="data.name" placeholder="请输入页面名称" @change="handleChange" />
    <h3>页面描述</h3>
    <a-textarea
      v-model:value="data.description"
      placeholder="请输入页面描述"
      :auto-size="{ minRows: 3, maxRows: 5 }"
      @change="handleChange"
    />
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
.page-setting {
  width: 100%;
  height: 100%;
  padding: 16px;
}
</style>

<script lang="ts">
export default {
  name: 'PageSetting',
}
</script>
