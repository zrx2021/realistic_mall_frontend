<template>
  <div class="page-setting">
    <h3>页面名称</h3>
    <a-input v-model:value="data.pageName" placeholder="请输入页面名称" @change="handleChange" />
    <h3>页面描述</h3>
    <a-textarea
      v-model:value="data.pageDescription"
      placeholder="请输入页面描述"
      :auto-size="{ minRows: 3, maxRows: 5 }"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Page } from '@/types/content'

const props = defineProps<{
  objData: Page
}>()

const data = ref<Page>({
  pageName: '出现错误',
  pageDescription: '出现错误',
})

const emits = defineEmits(['getNewPageData'])

const handleChange = () => {
  emits('getNewPageData', data.value)
}

onMounted(() => {
  console.log('props.objData', props.objData)
  data.value.pageName = props.objData.pageName
  data.value.pageDescription = props.objData.pageDescription
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
