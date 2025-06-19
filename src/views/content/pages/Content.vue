<template>
  <a-flex :style="containerStyle" vertical gap="middle">
    <a-flex :style="boxStyle" justify="space-between" gap="middle">
      <a-button type="primary" @click="showTemplateSelector">新建页面</a-button>
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
      <a-table :columns="columns" :data-source="tableData" :pagination="pagination" />
    </a-flex>
  </a-flex>

  <!-- 模板选择器 -->
  <template-selector
    :isVisable="isTemplateDialogVisible"
    @getSelectedId="handleSelect"
    @closeDialog="closeTemplateDialog"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { CSSProperties } from 'vue'
import { columns, data as tableData } from '@/tables/page'
import TemplateSelector from '@/components/dialog/TemplateSelector.vue'

const router = useRouter()
const statusValue = ref('1')
const searchValue = ref('')
const isTemplateDialogVisible = ref(false)

const showTemplateSelector = () => {
  isTemplateDialogVisible.value = true
}

const closeTemplateDialog = () => {
  isTemplateDialogVisible.value = false
}

const handleSelect = (templateId: string) => {
  console.log('选择的模板ID:', templateId)
  // 这里可以根据模板ID进行相应的处理
  router.push({
    path: '/content/pages/edit',
    query: { templateId },
  })
}

const pagination = {
  total: tableData.length,
  pageSize: 10,
  showTotal: (total: number) => `共 ${total} 条`,
  showSizeChanger: true,
  showQuickJumper: true,
}

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

:deep(.ant-table-wrapper) {
  width: 100%;
}

:deep(.ant-table-pagination) {
  margin: 16px 0 0 0 !important;
}
</style>

<script lang="ts">
export default {
  name: 'ContentPage',
}
</script>
