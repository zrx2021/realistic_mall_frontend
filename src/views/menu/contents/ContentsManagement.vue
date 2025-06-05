<template>
  <a-flex :style="containerStyle" vertical gap="middle">
    <a-flex :style="boxStyle" justify="space-between" gap="middle">
      <a-button type="primary">新建页面</a-button>
      <a-flex style="width: 420px" gap="middle">
        <!-- 查询状态下拉框 -->
        <a-select :style="selectStyle" v-model:value="statusValue">
          <a-select-option value="1" style="color: #333">全部状态</a-select-option>
          <a-select-option value="2" style="color: #333">已发布</a-select-option>
          <a-select-option value="3" style="color: #333">未发布</a-select-option>
        </a-select>
        <!-- 搜索输入框 -->
        <a-input-search
          :style="searchStyle"
          v-model:value="searchValue"
          placeholder="请输入页面名称"
        />
      </a-flex>
    </a-flex>
    <a-flex :style="boxStyle" justify="space-around" vertical gap="middle">
      <a-button type="primary">Primary</a-button>
      <a-button type="primary">Primary</a-button>
      <a-button type="primary">Primary</a-button>
      <a-button type="primary">Primary</a-button>
    </a-flex>
  </a-flex>
</template>

<script lang="ts">
import { ref } from 'vue'

const statusValue = ref('1')
const searchValue = ref('')

export default {
  name: 'ContentsManagement',
}
</script>

<script lang="ts" setup>
import type { CSSProperties } from 'vue'

const searchStyle: CSSProperties = {
  float: 'right',
  width: '280px',
}

const selectStyle: CSSProperties = {
  float: 'left',
  width: '120px',
}

const containerStyle: CSSProperties = {
  width: '100%',
  margin: '20px 0',
  justifyContent: 'space-around',
  backgroundColor: '#F4F4F4',
}

const boxStyle: CSSProperties = {
  width: '80%',
  margin: '0 auto',
  padding: '12px',
  borderRadius: '6px',
  backgroundColor: '#fff',
}
</script>

<style scoped>
:deep(.ant-select-selector) {
  color: #333 !important;
}

:deep(.ant-select-selection-item) {
  color: #333 !important;
}

:deep(.ant-select-item-option-content) {
  color: #333;
}

:deep(.ant-select-item-option-selected) {
  color: #333;
  background-color: #e6f4ff !important;
}
</style>
