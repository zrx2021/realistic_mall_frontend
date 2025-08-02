<template class="title-container">
  <h3 v-text="showData"></h3>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { TextComponent } from '@/types/content/content'

const props = defineProps<{
  objData: string | TextComponent
}>()

const showData = ref('无法加载')

onMounted(() => {
  if (typeof props.objData === 'string') {
    showData.value = props.objData
  } else {
    showData.value = props.objData.titleContent
  }
})

watch(
  () => props.objData,
  (newVal) => {
    if (typeof newVal === 'string') {
      showData.value = newVal
    } else {
      showData.value = newVal.titleContent
    }
  },
)
</script>

<style scoped>
.title-container {
  box-sizing: border-box;
  width: 100%;
}

h3:hover {
  border: 1px dashed #1890ff;
}

h3 {
  margin: 0;
  height: 32px;
  width: 100%;
  /* max-width: 360px; */
  padding: 0 12px;
  font-size: 15px;
  line-height: 32px;
  color: #333;
  text-align: left;
  border: 1px solid transparent;
  box-sizing: border-box;
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

<script lang="ts">
export default {
  name: 'EditorTitle',
}
</script>
