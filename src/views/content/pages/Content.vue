<template>
  <a-flex :style="containerStyle" vertical gap="middle">
    <a-flex :style="boxStyle" justify="space-between" gap="middle">
      <a-button type="primary" @click="showTemplateSelector">新建页面</a-button>
      <a-flex style="width: 420px" gap="middle">
        <!-- 查询状态下拉框 -->
        <a-select :style="selectStyle" v-model:value="statusValue" @change="handleStatusChange">
          <a-select-option value="1" style="color: #333">全部状态</a-select-option>
          <a-select-option value="2" style="color: #333">已发布</a-select-option>
          <a-select-option value="3" style="color: #333">未发布</a-select-option>
        </a-select>
        <!-- 搜索输入框 -->
        <a-input-search
          :style="searchStyle"
          v-model:value="searchValue"
          placeholder="请输入页面名称"
          @search="handleSearch"
        />
      </a-flex>
    </a-flex>
    <a-flex :style="boxStyle" justify="space-around" vertical gap="middle">
      <a-table
        :columns="columns"
        :data-source="tableData"
        :pagination="pagination"
        @change="handleTableChange"
        :loading="loading"
      />
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { CSSProperties } from 'vue'
import { columns } from '@/tables/page'
import TemplateSelector from '@/components/dialog/TemplateSelector.vue'
import {
  getPageList,
  type PageItem,
  type ArticleQueryDTO,
  type PageParams,
} from '@/api/content/page'

const router = useRouter()
const statusValue = ref('1')
const searchValue = ref('')
const isTemplateDialogVisible = ref(false)
const tableData = ref<PageItem[]>([])
const loading = ref(false)

// 分页参数
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total: number) => `共 ${total} 条`,
  showSizeChanger: true,
  showQuickJumper: true,
})

// 获取页面数据
const fetchPageData = async () => {
  loading.value = true
  try {
    // 创建查询DTO
    const queryDTO: ArticleQueryDTO = {}

    // 只有当搜索值不为空时才添加到参数中
    if (searchValue.value) {
      queryDTO.articleTitle = searchValue.value
    }

    // 只有当状态不是"全部"时才添加到参数中
    if (statusValue.value !== '1') {
      queryDTO.status = statusValue.value === '2' ? 1 : 0
    }

    // 创建分页参数
    const pageParams: PageParams = {
      pageNumber: pagination.value.current,
      pageSize: pagination.value.pageSize,
    }

    const response = await getPageList(queryDTO, pageParams)
    const { content, totalElements, page, size } = response

    // 为每个数据项添加key字段，确保表格正常显示
    tableData.value = content.map((item) => ({
      ...item,
      key: item.id.toString(),
      // 确保description字段存在，后端返回的是空字符串时显示默认值
      description: item.description || '暂无描述',
    }))

    pagination.value.total = totalElements
    pagination.value.current = page + 1 // 后端分页从0开始，前端从1开始
    pagination.value.pageSize = size
  } catch (error) {
    console.error('获取页面数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 表格变化处理（分页、筛选、排序）
const handleTableChange = (pag: { current: number; pageSize: number }) => {
  pagination.value.current = pag.current
  pagination.value.pageSize = pag.pageSize
  fetchPageData()
}

// 状态变化处理
const handleStatusChange = () => {
  pagination.value.current = 1 // 重置到第一页
  fetchPageData()
}

// 搜索处理
const handleSearch = () => {
  pagination.value.current = 1 // 重置到第一页
  fetchPageData()
}

const showTemplateSelector = () => {
  isTemplateDialogVisible.value = true
}

const closeTemplateDialog = () => {
  isTemplateDialogVisible.value = false
}

const handleSelect = (templateId: number) => {
  console.log('选择的模板ID:', templateId)
  // 使用query参数跳转到编辑页面
  router.push({
    path: '/content/pages/edit',
    query: { templateId },
  })
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

// 组件挂载时获取数据
onMounted(() => {
  fetchPageData()
})
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
