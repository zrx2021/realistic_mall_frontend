<template class="title-container">
  <a-tabs v-if="showData.type === 1" class="tabs-container" centered>
    <a-tab-pane
      v-for="item in showData.elevatorTabsData"
      :key="getUniqueId() + item.jumpUrl"
      :tab="item.label"
    ></a-tab-pane>
  </a-tabs>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getUniqueId } from '@/utils/uniqueId'
import type { Elevator } from '@/types/content'

const showData = ref<Elevator>({
  id: -1,
  type: -1,
  elevatorTabsData: [],
})

const props = defineProps<{
  objData: string
}>()

onMounted(() => {
  console.log('编辑区', props.objData)
  // TODO 绑定数据
  showData.value = JSON.parse(props.objData)
  console.log('data', showData.value)
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
