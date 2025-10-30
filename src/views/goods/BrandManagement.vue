<template>
  <a-flex :style="containerStyle" vertical gap="middle">
    <!-- 顶部操作栏 -->
    <a-flex :style="boxStyle" justify="space-between" align="center">
      <a-space style="line-height: 32px;">
        <a-button type="primary" @click="handleCreateBrand">新建品牌</a-button>
        <a-button @click="handleExport">导出</a-button>
      </a-space>
      <a-input-search
        v-model:value="searchKeyword"
        placeholder="搜索品牌名称"
        style="width: 300px"
        @search="handleSearch"
        allow-clear
      />
    </a-flex>

    <!-- 品牌列表表格 -->
    <a-flex :style="boxStyle" vertical gap="middle">
      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total: number) => `共 ${total} 条`,
          pageSizeOptions: ['10', '20', '50', '100'],
        }"
        @change="handleTableChange"
        size="middle"
        :row-key="(record: BrandItem) => record.id"
      >
        <!-- 品牌LOGO -->
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'logo'">
            <AuthImage
              v-if="record.logo"
              :src="getLogoUrl(record.logo)"
              :alt="record.name"
              class="brand-logo"
              :force-auth="true"
              :lazy="false"
            />
            <span v-else style="color: #999">-</span>
          </template>

          <!-- 品牌名称 -->
          <template v-else-if="column.key === 'name'">
            <div>
              <div style="font-weight: 500">{{ record.name }}</div>
              <div v-if="record.englishName" style="color: #999; font-size: 12px">
                {{ record.englishName }}
              </div>
            </div>
          </template>

          <!-- 启用状态 -->
          <template v-else-if="column.key === 'isActive'">
            <a-switch
              :checked="record.isActive"
              @change="(checked: boolean) => handleStatusChange(record, checked)"
              checked-children="启用"
              un-checked-children="禁用"
            />
          </template>

          <!-- 操作列 -->
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
              <a-popconfirm
                title="确定要删除这个品牌吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDelete(record)"
              >
                <a-button type="link" size="small" danger>删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-flex>

    <!-- 品牌添加/编辑弹窗 -->
    <BrandAddEditModal
      v-model:open="modalOpen"
      :brand-id="currentBrandId"
      :brand-data="currentBrandData"
      @success="handleModalSuccess"
    />
  </a-flex>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, type CSSProperties } from 'vue'
import { message } from 'ant-design-vue'
import type { TableColumnsType, TableProps } from 'ant-design-vue'
import BrandAddEditModal, { type BrandFormData } from '@/components/goods/BrandAddEditModal.vue'
import AuthImage from '@/components/common/AuthImage.vue'
import {
  getBrandList,
  deleteBrand,
  updateBrandStatus,
  exportBrands,
  type BrandQueryParams,
} from '@/api/brand'

// 品牌数据接口
interface BrandItem {
  id: number
  name: string
  englishName?: string
  logo?: string
  description?: string
  website?: string
  country?: string
  sortOrder: number
  isActive: boolean
  createdBy?: number
  updatedBy?: number
  createdTime?: string
  updatedTime?: string
}

// 状态管理
const loading = ref(false)
const searchKeyword = ref('')
const modalOpen = ref(false)
const currentBrandId = ref<number | null>(null)
const currentBrandData = ref<BrandFormData | null>(null)

// 表格数据
const tableData = ref<BrandItem[]>([])

// 分页参数
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})

// 表格列定义
const columns: TableColumnsType = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
    align: 'center',
  },
  {
    title: '品牌LOGO',
    dataIndex: 'logo',
    key: 'logo',
    width: 100,
    align: 'center',
  },
  {
    title: '品牌名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: '品牌国家',
    dataIndex: 'country',
    key: 'country',
    width: 120,
    align: 'center',
  },
  {
    title: '品牌官网',
    dataIndex: 'website',
    key: 'website',
    width: 200,
    ellipsis: true,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '品牌描述',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
    customRender: ({ text }) => text || '-',
  },
  {
    title: '排序',
    dataIndex: 'sortOrder',
    key: 'sortOrder',
    width: 80,
    align: 'center',
    sorter: (a: BrandItem, b: BrandItem) => a.sortOrder - b.sortOrder,
  },
  {
    title: '状态',
    dataIndex: 'isActive',
    key: 'isActive',
    width: 100,
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    key: 'createdTime',
    width: 180,
    sorter: (a: BrandItem, b: BrandItem) =>
      new Date(a.createdTime || 0).getTime() - new Date(b.createdTime || 0).getTime(),
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    align: 'center',
    fixed: 'right',
  },
]

// 获取LOGO URL（通过 AuthImage 组件自动处理路径转换）
const getLogoUrl = (logo: string) => {
  return logo || ''
}

// 模拟数据
const mockBrands: BrandItem[] = [
  {
    id: 1,
    name: '苹果',
    englishName: 'Apple',
    logo: '',
    description: '美国知名科技公司，主要产品包括iPhone、iPad、Mac等',
    website: 'https://www.apple.com',
    country: '美国',
    sortOrder: 100,
    isActive: true,
    createdTime: '2024-01-01 10:00:00',
    updatedTime: '2024-01-01 10:00:00',
  },
  {
    id: 2,
    name: '华为',
    englishName: 'HUAWEI',
    logo: '',
    description: '中国领先的ICT（信息与通信）基础设施和智能终端提供商',
    website: 'https://www.huawei.com',
    country: '中国',
    sortOrder: 95,
    isActive: true,
    createdTime: '2024-01-02 10:00:00',
    updatedTime: '2024-01-02 10:00:00',
  },
  {
    id: 3,
    name: '小米',
    englishName: 'Xiaomi',
    logo: '',
    description: '以手机、智能硬件和IoT平台为核心的互联网公司',
    website: 'https://www.mi.com',
    country: '中国',
    sortOrder: 90,
    isActive: true,
    createdTime: '2024-01-03 10:00:00',
    updatedTime: '2024-01-03 10:00:00',
  },
  {
    id: 4,
    name: 'Nike',
    englishName: 'Nike',
    logo: '',
    description: '全球著名的体育运动品牌',
    website: 'https://www.nike.com',
    country: '美国',
    sortOrder: 85,
    isActive: true,
    createdTime: '2024-01-04 10:00:00',
    updatedTime: '2024-01-04 10:00:00',
  },
  {
    id: 5,
    name: '戴森',
    englishName: 'Dyson',
    logo: '',
    description: '英国知名家电品牌，专注于吸尘器、空气净化器等产品',
    website: 'https://www.dyson.com',
    country: '英国',
    sortOrder: 80,
    isActive: true,
    createdTime: '2024-01-05 10:00:00',
    updatedTime: '2024-01-05 10:00:00',
  },
  {
    id: 6,
    name: '三只松鼠',
    englishName: 'Three Squirrels',
    logo: '',
    description: '中国知名零食品牌',
    website: 'https://www.3songshu.com',
    country: '中国',
    sortOrder: 75,
    isActive: false,
    createdTime: '2024-01-06 10:00:00',
    updatedTime: '2024-01-06 10:00:00',
  },
]

// 获取品牌列表数据
const fetchBrandData = async () => {
  loading.value = true
  try {
    const queryParams: BrandQueryParams = {
      ...(searchKeyword.value && { keyword: searchKeyword.value }),
      pageNumber: pagination.current - 1,
      pageSize: pagination.pageSize,
    }

    const response = await getBrandList(queryParams)
    tableData.value = response.content
    pagination.total = response.totalElements
    pagination.current = response.page
  } catch (error) {
    console.error('获取品牌数据失败:', error)
    
    // 如果API调用失败，使用模拟数据
    const filtered = searchKeyword.value
      ? mockBrands.filter(
          (brand) =>
            brand.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
            brand.englishName?.toLowerCase().includes(searchKeyword.value.toLowerCase()),
        )
      : mockBrands

    tableData.value = filtered
    pagination.total = filtered.length
    message.warning('使用模拟数据，请检查后端接口')
  } finally {
    loading.value = false
  }
}

// 表格变化处理
const handleTableChange: TableProps['onChange'] = (pag, filters, sorter) => {
  if (pag.current) {
    pagination.current = pag.current
  }
  if (pag.pageSize) {
    pagination.pageSize = pag.pageSize
  }
  fetchBrandData()
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  fetchBrandData()
}

// 新建品牌
const handleCreateBrand = () => {
  currentBrandId.value = null
  currentBrandData.value = null
  modalOpen.value = true
}

// 编辑品牌
const handleEdit = (record: BrandItem) => {
  currentBrandId.value = record.id
  currentBrandData.value = {
    id: record.id,
    name: record.name,
    englishName: record.englishName,
    logo: record.logo,
    description: record.description,
    website: record.website,
    country: record.country,
    sortOrder: record.sortOrder,
    isActive: record.isActive,
    createdTime: record.createdTime,
    updatedTime: record.updatedTime,
  }
  modalOpen.value = true
}

// 删除品牌
const handleDelete = async (record: BrandItem) => {
  try {
    await deleteBrand(record.id)
    message.success('品牌删除成功')
    fetchBrandData()
  } catch (error) {
    console.error('删除品牌失败:', error)
    message.error('删除品牌失败')
  }
}

// 状态切换
const handleStatusChange = async (record: BrandItem, checked: boolean) => {
  try {
    await updateBrandStatus(record.id, checked)
    record.isActive = checked
    message.success(`品牌已${checked ? '启用' : '禁用'}`)
  } catch (error) {
    console.error('更新品牌状态失败:', error)
    message.error('更新品牌状态失败')
    // 恢复原状态
    record.isActive = !checked
  }
}

// 导出
const handleExport = async () => {
  try {
    await exportBrands({ keyword: searchKeyword.value })
    message.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    message.error('导出失败')
  }
}

// 弹窗成功回调
const handleModalSuccess = () => {
  fetchBrandData()
}

// 页面居中容器样式
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
  fetchBrandData()
})
</script>

<style scoped>
.brand-logo {
  width: 60px;
  height: 60px;
  object-fit: contain;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
}

:deep(.ant-table-wrapper) {
  width: 100%;
}

:deep(.ant-table) {
  font-size: 14px;
}

:deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 600;
}

:deep(.ant-table-tbody > tr:hover) {
  background-color: #fafafa;
}
</style>

<script lang="ts">
export default {
  name: 'BrandManagement',
}
</script>
