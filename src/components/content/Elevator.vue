<template>
  <a-tabs v-if="props.objData.type === 1">
    <a-tab-pane
      v-for="item in props.objData.target"
      :key="getUniqueId() + item.jumpUrl"
      :tab="item.label"
    ></a-tab-pane>
  </a-tabs>
</template>

<script setup lang="ts">
import { getUniqueId } from '@/utils/uniqueId'
import type { objData, TabList } from '@/types/content'
import { reactive } from 'vue'

const props = withDefaults(defineProps<objData>(), {
  objData: () =>
    reactive<TabList>({
      id: getUniqueId(),
      type: 1,
      target: [
        { label: '导航1', jumpUrl: '' },
        { label: '导航2', jumpUrl: '' },
        { label: '导航3', jumpUrl: '' },
        { label: '导航4', jumpUrl: '' },
      ],
    }),
})
</script>

<style scoped></style>

<script lang="ts">
export default {
  name: 'EditorElevator',
}
</script>
