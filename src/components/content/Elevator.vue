<template>
  <div class="navtab-container">
    <a-tabs
      v-if="showData.templateStyle === 'words'"
      class="navtab-tabs"
      :class="[
        `fill-type-${showData.fillType}`,
        `fill-shape-${showData.fillShape}`,
        { 'justify-around': showData.tabData.length <= 4 },
        { 'custom-style': showData.customStyle },
      ]"
      :tab-position="showData.tabsPosition"
      :items="showData.tabData"
      v-model:activeKey="activeKey"
    >
      <a-tab-pane v-for="item in showData.tabData" :key="item.tabId" :tab="item.label"></a-tab-pane>
    </a-tabs>
    <a-tabs
      v-if="showData.templateStyle === 'fixed'"
      type="card"
      class="navtab-tabs"
      :class="[
        `fill-type-${showData.fillType}`,
        `fill-shape-${showData.fillShape}`,
        { 'justify-around': showData.tabData.length <= 4 },
        { 'custom-style': showData.customStyle },
      ]"
      :tab-position="showData.tabsPosition"
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
      :class="[
        `fill-type-${showData.fillType}`,
        `fill-shape-${showData.fillShape}`,
        { 'justify-around': showData.tabData.length <= 4 },
        { 'custom-style': showData.customStyle },
      ]"
      :tab-position="showData.tabsPosition"
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
import { onMounted, ref, computed } from 'vue'
import type { Elevator } from '@/types/content'

const showData = ref<Elevator>({
  elevatorId: -1,
  templateStyle: '',
  tabData: [],
  tabsPosition: 'top',
  colorSetting: [],
  fillType: '',
  fillShape: '',
  borderRadius: 0,
  borderSize: 1,
  customStyle: false,
  paddingVertical: 0,
  paddingHorizontal: 0,
  marginVertical: 0,
  marginHorizontal: 0,
})

const activeKey = ref(-1)
const props = defineProps<{
  objData: Elevator
}>()

const activeColor = computed(() => {
  const colorSetting = showData.value.colorSetting?.find((item) => item.name === 'activeColor')
  return colorSetting?.value || '#000000'
})

const activeBgColor = computed(() => {
  const colorSetting = showData.value.colorSetting?.find((item) => item.name === 'activeBgColor')
  return colorSetting?.value || '#ffffff'
})

const inactiveColor = computed(() => {
  const colorSetting = showData.value.colorSetting?.find((item) => item.name === 'inactiveColor')
  return colorSetting?.value || '#666666'
})

const inactiveBgColor = computed(() => {
  const colorSetting = showData.value.colorSetting?.find((item) => item.name === 'inactiveBgColor')
  return colorSetting?.value || '#ffffff'
})

const navBgColor = computed(() => {
  const colorSetting = showData.value.colorSetting?.find((item) => item.name === 'navBgColor')
  return colorSetting?.value || '#ffffff'
})

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

:deep(.ant-tabs-nav) {
  margin-bottom: 0 !important;
  background-color: v-bind(navBgColor) !important;
}

:deep(.ant-tabs-tab) {
  border: 0 !important;
}

/* 基础样式 */
.navtab-tabs :deep(.ant-tabs-tab) {
  color: v-bind(inactiveColor) !important;
  background-color: v-bind(inactiveBgColor) !important;
  border: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* 自定义样式 */
.navtab-tabs.custom-style :deep(.ant-tabs-tab) {
  padding: v-bind(
    'showData.paddingVertical + "px " + showData.paddingHorizontal + "px"'
  ) !important;
  margin: v-bind('showData.marginVertical + "px " + showData.marginHorizontal + "px"') !important;
}

/* 布局样式 */
.navtab-tabs.justify-around :deep(.ant-tabs-nav-list) {
  width: 375px !important;
  justify-content: space-around !important;
}

/* 填充类型样式 */
.navtab-tabs.fill-type-none :deep(.ant-tabs-tab) {
  background-color: transparent !important;
  border: 1px solid transparent !important;
}

.navtab-tabs.fill-type-background :deep(.ant-tabs-tab-active) {
  background-color: v-bind(activeBgColor) !important;
  border: 1px solid transparent !important;
}

.navtab-tabs.fill-type-border :deep(.ant-tabs-tab-active) {
  border: v-bind('showData.borderSize + "px solid " + activeBgColor') !important;
  background-color: transparent !important;
}

.navtab-tabs.fill-type-underline :deep(.ant-tabs-tab:not(.ant-tabs-tab-active)) {
  border: 1px solid transparent !important;
  background-color: transparent !important;
}

.navtab-tabs.fill-type-background :deep(.ant-tabs-tab:not(.ant-tabs-tab-active)) {
  background-color: v-bind(inactiveBgColor) !important;
  border: 1px solid transparent !important;
}

.navtab-tabs.fill-type-border :deep(.ant-tabs-tab:not(.ant-tabs-tab-active)) {
  border: v-bind('showData.borderSize + "px solid " + inactiveBgColor') !important;
  background-color: transparent !important;
}

.navtab-tabs.fill-type-underline :deep(.ant-tabs-tab-active) {
  border: 1px solid transparent !important;
  background-color: transparent !important;
}

.navtab-tabs:not(.fill-type-underline) :deep(.ant-tabs-ink-bar) {
  visibility: hidden !important;
}

:deep(.ant-tabs-ink-bar) {
  background-color: v-bind(activeBgColor) !important;
}

/* 填充形状样式 */
.navtab-tabs.fill-shape-none :deep(.ant-tabs-tab) {
  border-radius: 0 !important;
  background-color: transparent !important;
}

.navtab-tabs.fill-shape-circle :deep(.ant-tabs-tab) {
  border-radius: 50% !important;
}

.navtab-tabs.fill-shape-square :deep(.ant-tabs-tab) {
  border-radius: 0 !important;
}

.navtab-tabs.fill-shape-underline :deep(.ant-tabs-tab-active) {
  border-bottom: 2px solid v-bind(activeColor) !important;
}

.navtab-tabs.fill-shape-circle-square :deep(.ant-tabs-tab) {
  border-radius: v-bind('showData.borderRadius + "px"') !important;
}

/* 文字颜色 */
.navtab-tabs :deep(.ant-tabs-tab-active .ant-tabs-tab-btn) {
  color: v-bind(activeColor) !important;
}

/* 背景颜色 */
.navtab-tabs.fill-type-background :deep(.ant-tabs-tab-active) {
  background-color: v-bind(activeBgColor) !important;
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
