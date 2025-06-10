<template class="title-container">
  <a-tabs v-if="showData.templateStyle === 'words'" class="tabs-container" centered>
    <a-tab-pane v-for="item in showData.tabData" :key="item.tabId" :tab="item.label"></a-tab-pane>
  </a-tabs>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Elevator } from '@/types/content'

const showData = ref<Elevator>({
  elevatorId: -1,
  templateStyle: '',
  tabData: [],
})

const props = defineProps<{
  objData: Elevator
}>()

onMounted(() => {
  showData.value = props.objData as Elevator
  console.log('showData', showData.value)
})
</script>

<style scoped>
.tabs-container {
  min-width: 350px;
  box-sizing: border-box;
  border: 1px solid transparent;
}

.tabs-container:hover {
  border: 1px dashed #1890ff;
}
</style>

<script lang="ts">
export default {
  name: 'EditorElevator',
}
</script>
