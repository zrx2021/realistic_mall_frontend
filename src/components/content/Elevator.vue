<template>
  <div class="title-container">
    <a-tabs v-if="showData.templateStyle === 'words'">
      <a-tab-pane v-for="item in showData.tabData" :key="item.tabId" :tab="item.label"></a-tab-pane>
    </a-tabs>
    <a-tabs v-if="showData.templateStyle === 'fixed'" type="card">
      <a-tab-pane v-for="item in showData.tabData" :key="item.tabId">
        <template #tab>
          <img src="@/assets/logo.svg" alt="logo" class="tab-icon" />
          <span>{{ item.label }}</span>
        </template>
      </a-tab-pane>
    </a-tabs>
    <a-tabs v-if="showData.templateStyle === 'image'" type="card">
      <a-tab-pane v-for="item in showData.tabData" :key="item.tabId">
        <template #tab>
          <img src="@/assets/logo.svg" alt="logo" class="tab-icon" />
        </template>
      </a-tab-pane>
    </a-tabs>
  </div>
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
})
</script>

<style scoped>
.title-container {
  height: 100%;
  min-width: 350px;
  box-sizing: border-box;
  border: 1px solid transparent;
}

.title-container:hover {
  border: 1px dashed #1890ff;
}

:deep(.ant-tabs-nav-wrap) {
}

:deep(.ant-tabs-nav-list) {
  width: 100% !important;
  justify-content: space-around !important;
}

:deep(.ant-tabs-nav) {
  margin-bottom: 0 !important;
  border: none !important;
}

:deep(.ant-tabs-nav::before) {
  display: none !important;
}

:deep(.ant-tabs-tab) {
  border: none !important;
  border-radius: 0 !important;
  background-color: transparent !important;
}

:deep(.ant-tabs-tab-active) {
  border-bottom: none !important;
  background-color: transparent !important;
}

.tab-icon {
  display: block;
  margin: 0px auto;
  width: 32px;
  height: 32px;
}
</style>

<script lang="ts">
export default {
  name: 'EditorElevator',
}
</script>
