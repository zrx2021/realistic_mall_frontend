<template>
  <div class="navtab-container">
    <a-tabs
      v-if="showData.templateStyle === 'words'"
      class="navtab-tabs"
      :tab-position="showData.styleConfig?.tabsPosition"
      :items="showData.tabData"
      v-model:activeKey="activeKey"
    >
      <a-tab-pane v-for="item in showData.tabData" :key="item.tabId" :tab="item.label"></a-tab-pane>
    </a-tabs>
    <a-tabs
      v-if="showData.templateStyle === 'fixed'"
      type="card"
      class="navtab-tabs"
      :tab-position="showData.styleConfig?.tabsPosition"
      :items="showData.tabData"
      v-model:activeKey="activeKey"
    >
      <a-tab-pane v-for="item in showData.tabData" :key="item.tabId">
        <template #tab>
          <img src="@/assets/logo.svg" alt="logo" class="tab-icon" />
          <span>{{ item.label }}</span>
        </template>
      </a-tab-pane>
    </a-tabs>
    <a-tabs
      v-if="showData.templateStyle === 'image'"
      type="card"
      class="navtab-tabs"
      :tab-position="showData.styleConfig?.tabsPosition"
      :items="showData.tabData"
      v-model:activeKey="activeKey"
    >
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
  styleConfig: {
    tabsPosition: 'top',
  },
})

const activeKey = ref(-1)
const props = defineProps<{
  objData: Elevator
}>()

onMounted(() => {
  showData.value = props.objData as Elevator
  activeKey.value = showData.value.tabData[0].tabId
})
</script>

<style scoped>
.navtab-container {
  height: 100%;
  width: 375px;
  min-width: 350px;
  box-sizing: border-box;
  border: 1px solid transparent;
}

.navtab-container:hover {
  border: 1px dashed #1890ff;
}

:deep(.ant-tabs-nav-wrap) {
  justify-content: space-around;
}

.navtab-tabs[tab-position='left'] {
  overflow-x: scroll;
}

:deep(.ant-tabs-nav) {
  margin-bottom: 0 !important;
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
