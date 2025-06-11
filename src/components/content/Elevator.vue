<template>
  <div class="title-container" ref="elevatorRef">
    <!-- 文字型 - 根据文本位置显示不同样式 -->
    <a-tabs
      v-if="showData.templateStyle === 'words'"
      :class="[showData.styleConfig?.textPosition === 'scroll' ? 'scroll-tabs' : '']"
      :tab-position="showData.styleConfig?.textPosition === 'scroll' ? 'top' : 'top'"
    >
      <a-tab-pane v-for="item in showData.tabData" :key="item.tabId" :tab="item.label"></a-tab-pane>
    </a-tabs>

    <!-- 图文型 -->
    <a-tabs
      v-if="showData.templateStyle === 'fixed'"
      type="card"
      :class="[showData.styleConfig?.textPosition === 'scroll' ? 'scroll-tabs' : '']"
      :tab-position="showData.styleConfig?.textPosition === 'scroll' ? 'top' : 'top'"
    >
      <a-tab-pane v-for="item in showData.tabData" :key="item.tabId">
        <template #tab>
          <img src="@/assets/logo.svg" alt="logo" class="tab-icon" />
          <span>{{ item.label }}</span>
        </template>
      </a-tab-pane>
    </a-tabs>

    <!-- 图片型 -->
    <a-tabs
      v-if="showData.templateStyle === 'image'"
      type="card"
      :class="[showData.styleConfig?.textPosition === 'scroll' ? 'scroll-tabs' : '']"
      :tab-position="showData.styleConfig?.textPosition === 'scroll' ? 'top' : 'top'"
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
import { onMounted, ref, computed, watch, nextTick } from 'vue'
import type { Elevator } from '@/types/content'

const elevatorRef = ref<HTMLElement | null>(null)
const showData = ref<Elevator>({
  elevatorId: -1,
  templateStyle: '',
  tabData: [],
})

const props = defineProps<{
  objData: Elevator
}>()

// 计算样式变量
const styles = computed(() => {
  const config = showData.value.styleConfig || {
    textPosition: 'dropdown',
    tabStyle: 'background',
    defaultTextColor: '#333333',
    activeTextColor: '#333333',
    activeBackgroundColor: '#FFC0CB',
    backgroundColor: '#FFFFFF',
  }

  return {
    '--tab-default-color': config.defaultTextColor,
    '--tab-active-color': config.activeTextColor,
    '--tab-active-bg-color': config.activeBackgroundColor,
    '--tab-bg-color': config.backgroundColor,
    '--tab-style': config.tabStyle,
  }
})

// 应用样式到tab元素
const applyTabStyles = () => {
  if (!elevatorRef.value) return

  nextTick(() => {
    // 查找所有tab元素
    const tabs = elevatorRef.value?.querySelectorAll('.ant-tabs-tab')
    if (!tabs?.length) return

    const tabStyle = showData.value.styleConfig?.tabStyle || 'background'

    // 为每个tab应用对应的样式
    tabs.forEach((tab) => {
      tab.setAttribute('data-style', tabStyle)
    })
  })
}

// 监听数据变化，重新应用样式
watch(
  () => showData.value.styleConfig,
  () => {
    applyTabStyles()
  },
  { deep: true },
)

onMounted(() => {
  showData.value = props.objData as Elevator
  applyTabStyles()
})

// 确保当tab渲染完成后应用样式
watch(
  () => showData.value.tabData,
  () => {
    applyTabStyles()
  },
  { deep: true },
)
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

/* 滚动样式 */
.scroll-tabs :deep(.ant-tabs-nav-wrap) {
  overflow-x: auto;
  justify-content: flex-start !important;
}

.scroll-tabs :deep(.ant-tabs-nav-list) {
  width: auto !important;
  flex-wrap: nowrap !important;
  justify-content: flex-start !important;
}

/* 非滚动样式 */
:deep(.ant-tabs-nav-wrap) {
  justify-content: center;
}

:deep(.ant-tabs-nav-list) {
  width: 100% !important;
  justify-content: space-around !important;
}

:deep(.ant-tabs-nav) {
  margin-bottom: 0 !important;
  border: none !important;
  background-color: v-bind('styles["--tab-bg-color"]');
}

:deep(.ant-tabs-nav::before) {
  display: none !important;
}

:deep(.ant-tabs-tab) {
  border: none !important;
  border-radius: 0 !important;
  background-color: transparent !important;
  color: v-bind('styles["--tab-default-color"]') !important;
  transition: all 0.3s;
}

/* 根据不同样式类型设置tabs的样式 */
/* 背景色样式 */
:deep(.ant-tabs-tab-active) {
  border-bottom: none !important;
  background-color: v-bind(
    'styles["--tab-style"] === "background" ? styles["--tab-active-bg-color"] : "transparent"'
  ) !important;
  color: v-bind('styles["--tab-active-color"]') !important;
}

/* 圆框样式 */
:deep(.ant-tabs-tab-active[data-style='round']) {
  border: 2px solid v-bind('styles["--tab-active-bg-color"]') !important;
  border-radius: 20px !important;
}

/* 方框样式 */
:deep(.ant-tabs-tab-active[data-style='square']) {
  border: 2px solid v-bind('styles["--tab-active-bg-color"]') !important;
}

/* 下划线样式 */
:deep(.ant-tabs-tab-active[data-style='underline']) {
  border-bottom: 2px solid v-bind('styles["--tab-active-bg-color"]') !important;
}

:deep(.ant-tabs-tab-btn) {
  color: inherit;
}

:deep(.ant-tabs-ink-bar) {
  /* 使用自定义样式时隐藏默认下划线 */
  display: v-bind('styles["--tab-style"] !== "background" ? "none" : "block"');
  background-color: v-bind('styles["--tab-active-bg-color"]');
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
