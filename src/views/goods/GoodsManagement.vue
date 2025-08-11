<template>
  <a-flex :style="containerStyle" vertical gap="middle">
    <!-- 顶部按钮操作栏 -->
    <a-flex :style="boxStyle" justify="flex-start" gap="middle">
      <a-button type="primary" @click="handleAddGoods">新建商品</a-button>
      <a-button @click="handleExport">导出</a-button>
    </a-flex>

    <!-- 搜索条件区域 -->
    <a-flex :style="boxStyle" vertical gap="small">
      <!-- 第一行：基本搜索条件 -->
      <a-flex gap="middle" align="center" wrap="wrap" class="search-form-row">
        <!-- 商品名称搜索 -->
        <a-flex gap="small" align="center" style="margin-right: 16px">
          <span
            style="
              white-space: nowrap;
              color: #666;
              width: 60px;
              text-align: right;
              line-height: 40px;
            "
            >商品名称</span
          >
          <a-input
            v-model:value="searchForm.name"
            placeholder="请输入商品名称/ID"
            style="width: 180px"
            allow-clear
          />
        </a-flex>

        <!-- 商品分组 -->
        <a-flex gap="small" align="center" style="margin-right: 16px">
          <span
            style="
              white-space: nowrap;
              color: #666;
              width: 60px;
              text-align: right;
              line-height: 40px;
            "
            >商品分组</span
          >
          <a-select
            v-model:value="searchForm.category"
            placeholder="全部"
            style="width: 120px"
            allow-clear
          >
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="家用电器">家用电器</a-select-option>
            <a-select-option value="数码产品">数码产品</a-select-option>
            <a-select-option value="服装鞋帽">服装鞋帽</a-select-option>
            <a-select-option value="食品饮料">食品饮料</a-select-option>
          </a-select>
        </a-flex>

        <!-- 商品价格 -->
        <a-flex gap="small" align="center" style="margin-right: 16px">
          <span
            style="
              white-space: nowrap;
              color: #666;
              width: 60px;
              text-align: right;
              line-height: 40px;
            "
            >商品价格</span
          >
          <a-input
            v-model:value="searchForm.minPrice"
            placeholder="最低售价"
            style="width: 100px"
            type="number"
          />
          <span style="margin: 0 4px; color: #999; line-height: 40px">-</span>
          <a-input
            v-model:value="searchForm.maxPrice"
            placeholder="最高售价"
            style="width: 100px"
            type="number"
          />
        </a-flex>

        <!-- 库存 -->
        <a-flex gap="small" align="center">
          <span
            style="
              white-space: nowrap;
              color: #666;
              width: 40px;
              text-align: right;
              line-height: 40px;
            "
            >库存</span
          >
          <a-select
            v-model:value="searchForm.inventoryType"
            placeholder="最小库存"
            style="width: 100px"
            allow-clear
          >
            <a-select-option value="">最小库存</a-select-option>
            <a-select-option value="low">库存不足</a-select-option>
            <a-select-option value="normal">库存正常</a-select-option>
            <a-select-option value="high">库存充足</a-select-option>
          </a-select>
          <a-select
            v-model:value="searchForm.inventoryRange"
            placeholder="最大库存"
            style="width: 100px"
            allow-clear
          >
            <a-select-option value="">最大库存</a-select-option>
            <a-select-option value="100">100以下</a-select-option>
            <a-select-option value="500">500以下</a-select-option>
            <a-select-option value="1000">1000以下</a-select-option>
            <a-select-option value="unlimited">不限</a-select-option>
          </a-select>
        </a-flex>
      </a-flex>

      <!-- 第二行：上架时间和操作按钮 -->
      <a-flex justify="space-between" align="center" class="search-form-row">
        <a-flex gap="small" align="center">
          <span
            style="
              white-space: nowrap;
              color: #666;
              width: 60px;
              text-align: right;
              line-height: 40px;
            "
            >上架时间</span
          >
          <a-date-picker
            v-model:value="searchForm.startTime"
            placeholder="请选择时间"
            style="width: 150px"
            format="YYYY-MM-DD"
          />
        </a-flex>
        <a-flex gap="middle">
          <a-button type="primary" size="middle" @click="handleSearch">搜索</a-button>
          <a-button size="middle" @click="handleReset">重置</a-button>
        </a-flex>
      </a-flex>
    </a-flex>

    <!-- 商品列表表格 -->
    <a-flex :style="boxStyle" justify="space-around" vertical gap="middle">
      <!-- 商品状态标签页 -->
      <a-tabs v-model:activeKey="activeTab" @change="handleTabChange" type="card">
        <a-tab-pane key="all" tab="全部"> </a-tab-pane>
        <a-tab-pane key="online" tab="上架中 (36)"> </a-tab-pane>
        <a-tab-pane key="offline" tab="已下架 (6)"> </a-tab-pane>
        <a-tab-pane key="reviewing" tab="审核中 (9)"> </a-tab-pane>
        <a-tab-pane key="review_failed" tab="审核失败 (5)"> </a-tab-pane>
        <a-tab-pane key="review_passed" tab="审核通过 (3)"> </a-tab-pane>
      </a-tabs>
      <a-table
        :columns="columns"
        :data-source="tableData"
        :pagination="false"
        :loading="loading"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
          onSelectAll: onSelectAll,
          type: 'checkbox',
          fixed: true,
          columnWidth: 50,
          getCheckboxProps: (record: GoodsItem) => ({
            disabled: false,
            name: record.name,
          }),
        }"
        @change="handleTableChange"
        size="middle"
      />

      <!-- 底部批量操作和分页 -->
      <a-flex
        justify="space-between"
        align="center"
        style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #f0f0f0"
      >
        <a-flex gap="middle" align="center">
          <!-- 选择状态显示 -->
          <a-flex gap="small" align="center">
            <span style="color: #666; font-size: 14px">
              已选择
              <span style="color: #1890ff; font-weight: 500">{{ selectedRowKeys.length }}</span> 项
            </span>
            <a-button
              v-if="selectedRowKeys.length > 0"
              type="link"
              size="small"
              @click="selectedRowKeys = []"
              style="padding: 0; height: auto"
            >
              清空
            </a-button>
          </a-flex>

          <!-- 批量操作按钮 -->
          <a-flex gap="small" v-if="selectedRowKeys.length > 0">
            <a-button
              type="primary"
              size="small"
              :disabled="selectedRowKeys.length === 0"
              @click="handleBatchOnline"
            >
              批量上架
            </a-button>
            <a-button
              size="small"
              :disabled="selectedRowKeys.length === 0"
              @click="handleBatchOffline"
            >
              批量下架
            </a-button>
            <a-button
              danger
              size="small"
              :disabled="selectedRowKeys.length === 0"
              @click="handleBatchDelete"
            >
              批量删除
            </a-button>
          </a-flex>
        </a-flex>

        <!-- 分页器 -->
        <a-pagination
          v-model:current="pagination.current"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :show-total="(total: number) => `共 ${total} 条`"
          show-size-changer
          show-quick-jumper
          :page-size-options="['10', '20', '50', '100']"
          @change="handleTableChange"
          size="small"
        />
      </a-flex>
    </a-flex>
  </a-flex>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import type { CSSProperties } from 'vue'

import { columns, mockData, type GoodsItem } from '@/tables/goods'
import { message } from 'ant-design-vue'
import type { Dayjs } from 'dayjs'
import {
  getGoodsList,
  batchDeleteGoods,
  batchOnlineGoods,
  batchOfflineGoods,
  exportGoods,
  type GoodsQueryParams,
} from '@/api/goods'

// 搜索表单
const searchForm = reactive({
  name: '',
  category: '',
  minPrice: '',
  maxPrice: '',
  inventoryType: '',
  inventoryRange: '',
  startTime: null as Dayjs | null,
})

// 当前激活的标签页
const activeTab = ref('all')

// 表格数据
const tableData = ref<GoodsItem[]>([])
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

// 多选相关
const selectedRowKeys = ref<string[]>([])

// 获取商品数据
const fetchGoodsData = async () => {
  loading.value = true
  try {
    // 构建查询参数
    const queryParams: GoodsQueryParams = {
      pageNumber: pagination.value.current - 1, // 后端分页从0开始
      pageSize: pagination.value.pageSize,
    }

    // 添加搜索条件
    if (searchForm.name) queryParams.name = searchForm.name
    if (searchForm.category) queryParams.category = searchForm.category
    if (searchForm.minPrice) queryParams.minPrice = Number(searchForm.minPrice)
    if (searchForm.maxPrice) queryParams.maxPrice = Number(searchForm.maxPrice)
    if (searchForm.startTime) queryParams.startTime = searchForm.startTime.format('YYYY-MM-DD')

    // 根据当前标签页设置状态
    switch (activeTab.value) {
      case 'online':
        queryParams.status = 1
        break
      case 'offline':
        queryParams.status = 0
        break
      case 'reviewing':
        queryParams.status = 3
        break
      case 'review_failed':
        queryParams.status = 4
        break
      case 'review_passed':
        queryParams.status = 5
        break
    }

    const response = await getGoodsList(queryParams)

    // 处理响应数据
    tableData.value = response.content.map((item) => ({
      ...item,
      key: String(item.id),
    }))

    pagination.value.total = response.totalElements
    pagination.value.current = response.page + 1
    pagination.value.pageSize = response.size
  } catch (error) {
    console.error('获取商品数据失败:', error)
    // 如果API调用失败，使用模拟数据
    tableData.value = mockData.map((item, index) => ({
      ...item,
      key: String(index + 1),
    }))
    pagination.value.total = mockData.length
  } finally {
    loading.value = false
  }
}

// 表格变化处理
const handleTableChange = (pag: { current: number; pageSize: number }) => {
  pagination.value.current = pag.current
  pagination.value.pageSize = pag.pageSize
  fetchGoodsData()
}

// 标签页切换
const handleTabChange = (key: string) => {
  activeTab.value = key
  pagination.value.current = 1
  fetchGoodsData()
}

// 搜索
const handleSearch = () => {
  pagination.value.current = 1
  fetchGoodsData()
}

// 重置
const handleReset = () => {
  searchForm.name = ''
  searchForm.category = ''
  searchForm.minPrice = ''
  searchForm.maxPrice = ''
  searchForm.inventoryType = ''
  searchForm.inventoryRange = ''
  searchForm.startTime = null
  pagination.value.current = 1
  fetchGoodsData()
}

// 多选逻辑
const onSelectChange = (keys: string[]) => {
  selectedRowKeys.value = keys
}

const onSelectAll = (selected: boolean, selectedRows: GoodsItem[], changeRows: GoodsItem[]) => {
  console.log('全选状态:', selected, '选中行:', selectedRows, '变更行:', changeRows)
}

// 新建商品
const handleAddGoods = () => {
  message.info('新建商品功能开发中...')
}

// 导出
const handleExport = async () => {
  try {
    const queryParams: GoodsQueryParams = {}
    // 添加当前的搜索条件
    if (searchForm.name) queryParams.name = searchForm.name
    if (searchForm.category) queryParams.category = searchForm.category

    await exportGoods(queryParams)
    message.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    message.error('导出失败')
  }
}

// 批量上架
const handleBatchOnline = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请选择要操作的商品')
    return
  }

  try {
    const ids = selectedRowKeys.value.map((key) => Number(key))
    await batchOnlineGoods(ids)
    message.success(`成功上架 ${selectedRowKeys.value.length} 个商品`)
    selectedRowKeys.value = []
    fetchGoodsData()
  } catch (error) {
    console.error('批量上架失败:', error)
    message.error('批量上架失败')
  }
}

// 批量下架
const handleBatchOffline = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请选择要操作的商品')
    return
  }

  try {
    const ids = selectedRowKeys.value.map((key) => Number(key))
    await batchOfflineGoods(ids)
    message.success(`成功下架 ${selectedRowKeys.value.length} 个商品`)
    selectedRowKeys.value = []
    fetchGoodsData()
  } catch (error) {
    console.error('批量下架失败:', error)
    message.error('批量下架失败')
  }
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请选择要删除的商品')
    return
  }

  try {
    const ids = selectedRowKeys.value.map((key) => Number(key))
    await batchDeleteGoods(ids)
    message.success(`成功删除 ${selectedRowKeys.value.length} 个商品`)
    selectedRowKeys.value = []
    fetchGoodsData()
  } catch (error) {
    console.error('批量删除失败:', error)
    message.error('批量删除失败')
  }
}

// 样式
const containerStyle: CSSProperties = {
  width: '100%',
  margin: '20px 0',
  justifyContent: 'space-around',
  backgroundColor: '#F4F4F4',
}

const boxStyle: CSSProperties = {
  width: '95%',
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '16px',
  borderRadius: '6px',
  backgroundColor: '#fff',
  boxSizing: 'border-box',
}

// 组件挂载时获取数据
onMounted(() => {
  fetchGoodsData()
})
</script>

<style scoped>
:deep(.ant-select-selector) {
  color: #333 !important;
}

:deep(.ant-select-selection-item) {
  color: #333 !important;
}

:deep(.ant-table-wrapper) {
  width: 100%;
}

:deep(.ant-table-pagination) {
  margin: 16px 0 0 0 !important;
}

:deep(.ant-tabs-tab) {
  padding: 12px 16px !important;
}

:deep(.ant-input-number) {
  width: 100%;
}

:deep(.ant-checkbox-wrapper) {
  margin-right: 16px;
}

/* 修复flex布局相关的样式 */
:deep(.ant-flex) {
  display: flex !important;
}

/* 优化响应式布局 */
@media (max-width: 1400px) {
  :deep(.ant-flex[style*='max-width: 1200px']) {
    flex-wrap: wrap;
  }
}

/* 修复表格内的图片显示 */
:deep(.ant-table-tbody) img {
  display: block;
  object-fit: cover;
}

/* 优化分页器样式 */
:deep(.ant-pagination) {
  margin-top: 16px !important;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

/* 修复标签页样式 */
:deep(.ant-tabs-content-holder) {
  padding: 0;
}

/* 优化搜索条件区域样式 */
:deep(.ant-input),
:deep(.ant-select-selector),
:deep(.ant-picker) {
  border-radius: 4px;
}

/* 统一搜索条件标签宽度 */
:deep(.ant-flex) span[style*='text-align: right'] {
  display: inline-block;
  font-weight: 500;
}

/* 优化搜索区域的间距 */
.search-form-row {
  margin-bottom: 12px;
  gap: 16px !important;
}

.search-form-row:last-child {
  margin-bottom: 0;
}

/* 响应式布局优化 */
@media (max-width: 1200px) {
  .search-form-row {
    gap: 12px !important;
  }

  :deep(.ant-flex[style*='margin-right: 16px']) {
    margin-right: 12px !important;
    margin-bottom: 8px;
  }
}

@media (max-width: 768px) {
  .search-form-row {
    flex-direction: column;
    align-items: flex-start !important;
  }

  :deep(.ant-flex[style*='margin-right']) {
    margin-right: 0 !important;
    width: 100%;
  }
}

/* 多选功能样式优化 */
:deep(.ant-table-selection-column) {
  padding-left: 16px !important;
  padding-right: 8px !important;
}

:deep(.ant-checkbox-wrapper) {
  margin: 0 !important;
}

/* 批量操作区域样式 */
:deep(.ant-btn-sm) {
  height: 24px;
  padding: 0 8px;
  font-size: 12px;
  border-radius: 3px;
}

:deep(.ant-btn-primary.ant-btn-sm) {
  background: #1890ff;
  border-color: #1890ff;
}

:deep(.ant-btn-danger.ant-btn-sm) {
  color: #ff4d4f;
  border-color: #ff4d4f;
}

:deep(.ant-btn-danger.ant-btn-sm:hover) {
  color: #fff;
  background: #ff4d4f;
  border-color: #ff4d4f;
}

/* 分页器小尺寸样式 */
:deep(.ant-pagination.ant-pagination-small) {
  font-size: 12px;
}

:deep(.ant-pagination.ant-pagination-small .ant-pagination-item) {
  min-width: 24px;
  height: 24px;
  line-height: 22px;
}

/* 选择状态显示优化 */
.selection-info {
  background: #f6f8fa;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

/* 表格行选择样式优化 */
:deep(.ant-table-tbody > tr.ant-table-row-selected) {
  background-color: #e6f4ff !important;
}

:deep(.ant-table-tbody > tr.ant-table-row-selected:hover) {
  background-color: #bae0ff !important;
}

:deep(.ant-table-tbody > tr:hover) {
  background-color: #fafafa;
}

/* 表格选择列样式 */
:deep(.ant-table-selection-column .ant-checkbox-wrapper) {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 优化复选框样式 */
:deep(.ant-checkbox-inner) {
  border-radius: 3px;
  transition: all 0.3s;
}

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: #1890ff;
  border-color: #1890ff;
}

:deep(.ant-checkbox:hover .ant-checkbox-inner) {
  border-color: #1890ff;
}

/* 批量操作按钮动画 */
:deep(.ant-btn-sm) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
}

:deep(.ant-btn-sm:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>

<script lang="ts">
export default {
  name: 'GoodsManagement',
}
</script>
