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
        <!-- 商品名称/SPU编码搜索 -->
        <a-flex gap="small" align="center" style="margin-right: 16px">
          <span class="search-label">商品名称</span>
          <a-input
            v-model:value="searchForm.name"
            placeholder="请输入商品名称/SPU编码"
            style="width: 200px"
            allow-clear
          />
        </a-flex>

        <!-- 商品分类 -->
        <a-flex gap="small" align="center" style="margin-right: 16px">
          <span class="search-label">商品分类</span>
          <a-tree-select
            v-model:value="searchForm.categoryId"
            placeholder="全部分类"
            style="width: 200px"
            allow-clear
            multiple
            :max-tag-count="2"
            :loading="metadataLoading"
            :tree-data="treeSelectCategories"
            :load-data="loadChildrenData"
            :show-search="true"
            :filter-tree-node="filterTreeNode"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          />
        </a-flex>

        <!-- 商品品牌 -->
        <a-flex gap="small" align="center" style="margin-right: 16px">
          <span class="search-label">商品品牌</span>
          <a-select
            v-model:value="searchForm.brandId"
            placeholder="请选择品牌"
            style="width: 200px"
            allow-clear
            mode="multiple"
            :max-tag-count="2"
            :loading="brandLoading"
            show-search
            :filter-option="false"
            :not-found-content="brandLoading ? '加载中...' : '暂无数据'"
            @search="handleBrandSearch"
            @focus="handleBrandFocus"
          >
            <a-select-option v-for="brand in brandOptions" :key="brand.id" :value="brand.id">
              {{ brand.name }}
            </a-select-option>
          </a-select>
        </a-flex>

        <!-- 商品类型 -->
        <a-flex gap="small" align="center" style="margin-right: 16px">
          <span class="search-label">商品类型</span>
          <a-select
            v-model:value="searchForm.goodsType"
            placeholder="全部类型"
            style="width: 100px"
            allow-clear
          >
            <a-select-option
              v-for="type in metadata.goodsTypes"
              :key="type.value"
              :value="type.value"
            >
              {{ type.label }}
            </a-select-option>
          </a-select>
        </a-flex>
      </a-flex>

      <!-- 第二行：价格和库存条件 -->
      <a-flex gap="middle" align="center" wrap="wrap" class="search-form-row">
        <!-- 售价区间 -->
        <a-flex gap="small" align="center" style="margin-right: 16px">
          <span class="search-label">售价区间</span>
          <a-input-number
            v-model:value="searchForm.minPrice"
            placeholder="最低价"
            style="width: 100px"
            :min="0"
            :max="1000000"
            :step="0.01"
            string-mode
            :status="searchForm.minPrice > searchForm.maxPrice ? 'error' : ''"
            @change="handlePriceChange"
          />
          <span style="margin: 0 4px; color: #999; line-height: 32px">-</span>
          <a-input-number
            v-model:value="searchForm.maxPrice"
            placeholder="最高价"
            style="width: 100px"
            :min="0"
            :max="1000000"
            :step="0.01"
            string-mode
            :status="searchForm.minPrice > searchForm.maxPrice ? 'error' : ''"
            @change="handlePriceChange"
          />
        </a-flex>

        <!-- 库存筛选 -->
        <a-flex gap="small" align="center" style="margin-right: 16px">
          <span class="search-label">库存状态</span>
          <a-select
            v-model:value="searchForm.stockStatus"
            placeholder="全部库存"
            style="width: 120px"
            allow-clear
          >
            <a-select-option value="normal">库存正常</a-select-option>
            <a-select-option value="low">库存不足</a-select-option>
            <a-select-option value="out">库存为0</a-select-option>
          </a-select>
        </a-flex>

        <a-flex gap="small" align="center" style="margin-right: 16px">
          <span class="search-label">库存范围</span>
          <a-input-number
            v-model:value="searchForm.minStock"
            placeholder="最低库存"
            :min="0"
            :max="1000000"
            :step="1"
            style="width: 100px"
          />
          <span style="margin: 0 4px; color: #999; line-height: 32px">-</span>
          <a-input-number
            v-model:value="searchForm.maxStock"
            placeholder="最高库存"
            :min="0"
            :max="1000000"
            :step="1"
            style="width: 100px"
          />
        </a-flex>

        <!-- 审核状态 -->
        <a-flex gap="small" align="center" style="margin-right: 16px">
          <span class="search-label">审核状态</span>
          <a-select
            v-model:value="searchForm.auditStatus"
            placeholder="全部状态"
            style="width: 100px"
            allow-clear
          >
            <a-select-option
              v-for="status in metadata.auditStatusOptions"
              :key="status.value"
              :value="status.value"
            >
              {{ status.label }}
            </a-select-option>
          </a-select>
        </a-flex>
      </a-flex>

      <!-- 第三行：标签和时间筛选 -->
      <a-flex gap="middle" align="center" wrap="wrap" class="search-form-row">
        <!-- 商品标签 -->
        <a-flex gap="small" align="center" style="margin-right: 16px">
          <span class="search-label">商品标签</span>
          <a-checkbox-group v-model:value="searchForm.tags" style="display: flex; gap: 12px">
            <a-checkbox value="isHot">热销</a-checkbox>
            <a-checkbox value="isNew">新品</a-checkbox>
            <a-checkbox value="isRecommend">推荐</a-checkbox>
            <a-checkbox value="isFreeShipping">包邮</a-checkbox>
          </a-checkbox-group>
        </a-flex>
      </a-flex>

      <!-- 第四行：时间筛选和操作按钮 -->
      <a-flex justify="space-between" align="center" class="search-form-row">
        <a-flex gap="small" align="center">
          <span class="search-label">上架时间</span>
          <a-range-picker
            v-model:value="searchForm.shelfTimeRange"
            style="width: 240px"
            format="YYYY-MM-DD"
            :placeholder="['开始时间', '结束时间']"
          />

          <span class="search-label" style="margin-left: 16px">创建时间</span>
          <a-range-picker
            v-model:value="searchForm.createTimeRange"
            style="width: 240px"
            format="YYYY-MM-DD"
            :placeholder="['开始时间', '结束时间']"
          />
        </a-flex>

        <a-flex gap="middle">
          <a-button @click="toggleAdvancedSearch">
            {{ showAdvancedSearch ? '收起' : '高级搜索' }}
          </a-button>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
          <a-button @click="handleReset">重置</a-button>
        </a-flex>
      </a-flex>

      <!-- 高级搜索条件（可折叠） -->
      <div v-if="showAdvancedSearch" class="advanced-search">
        <a-divider>高级搜索</a-divider>
        <a-flex gap="middle" align="center" wrap="wrap" class="search-form-row">
          <!-- 销量区间 -->
          <a-flex gap="small" align="center" style="margin-right: 16px">
            <span class="search-label">销量区间</span>
            <a-input
              v-model:value="searchForm.minSalesCount"
              placeholder="最低销量"
              style="width: 100px"
              type="number"
            />
            <span style="margin: 0 4px; color: #999; line-height: 32px">-</span>
            <a-input
              v-model:value="searchForm.maxSalesCount"
              placeholder="最高销量"
              style="width: 100px"
              type="number"
            />
          </a-flex>

          <!-- 好评率 -->
          <a-flex gap="small" align="center" style="margin-right: 16px">
            <span class="search-label">好评率</span>
            <a-select
              v-model:value="searchForm.commentRateRange"
              placeholder="全部"
              style="width: 120px"
              allow-clear
            >
              <a-select-option value="high">95%以上</a-select-option>
              <a-select-option value="medium">90%-95%</a-select-option>
              <a-select-option value="low">90%以下</a-select-option>
            </a-select>
          </a-flex>

          <!-- 浏览量 -->
          <a-flex gap="small" align="center" style="margin-right: 16px">
            <span class="search-label">浏览量</span>
            <a-input
              v-model:value="searchForm.minViewCount"
              placeholder="最低浏览量"
              style="width: 120px"
              type="number"
            />
          </a-flex>
        </a-flex>
      </div>
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
        :scroll="{ x: 1800 }"
        :customRow="
          (record: GoodsItem) => ({
            onDblclick: () => handleViewDetail(record),
          })
        "
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
          @change="handlePageChange"
          @showSizeChange="handlePageSizeChange"
          size="small"
        />
      </a-flex>
    </a-flex>

    <!-- 商品详情弹窗 -->
    <GoodsDetailModal v-model:open="detailModalOpen" :goods-id="currentGoodsId" />

    <!-- 商品新建/编辑弹窗 -->
    <GoodsAddEditModal v-model:open="addEditModalOpen" :goods-id="currentEditGoodsId" @success="handleAddEditSuccess" />
  </a-flex>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import type { CSSProperties } from 'vue'

import { columns, mockData, type GoodsItem } from '@/tables/goods'
import { message } from 'ant-design-vue'
import type { Dayjs } from 'dayjs'
import GoodsDetailModal from '@/components/goods/GoodsDetailModal.vue'
import GoodsAddEditModal from '@/components/goods/GoodsAddEditModal.vue'
import {
  getGoodsList,
  batchDeleteGoods,
  batchOnlineGoods,
  batchOfflineGoods,
  exportGoods,
  getGoodsCategories,
  getGoodsCategorySubTree,
  getGoodsBrands,
  type GoodsQueryParams,
  type CategoryOption,
  type BrandOption,
} from '@/api/goods'

// 搜索表单
const searchForm = reactive({
  // 基础搜索
  name: '',
  categoryId: [] as number[],
  brandId: [] as number[],
  goodsType: undefined as number | undefined,

  // 价格库存
  minPrice: '',
  maxPrice: '',
  stockStatus: '',
  minStock: '',
  maxStock: '',
  auditStatus: undefined as number | undefined,

  // 标签
  tags: [] as string[],

  // 时间范围
  shelfTimeRange: null as [Dayjs, Dayjs] | null,
  createTimeRange: null as [Dayjs, Dayjs] | null,

  // 高级搜索
  minSalesCount: '',
  maxSalesCount: '',
  commentRateRange: '',
  minViewCount: '',
})

// 高级搜索展开状态
const showAdvancedSearch = ref(false)

// 元数据
const metadata = ref({
  categories: [] as CategoryOption[],
  brands: [] as BrandOption[],
  suppliers: [] as { id: number; name: string }[],
  goodsTypes: [
    { value: 1, label: '实物' },
    { value: 2, label: '虚拟' },
    { value: 3, label: '服务' },
  ],
  statusOptions: [
    { value: 0, label: '已下架' },
    { value: 1, label: '上架中' },
    { value: 2, label: '库存下架' },
    { value: 3, label: '审核中' },
    { value: 4, label: '审核失败' },
    { value: 5, label: '审核通过' },
  ],
  auditStatusOptions: [
    { value: 0, label: '待审核' },
    { value: 1, label: '审核通过' },
    { value: 2, label: '审核拒绝' },
  ],
})

const metadataLoading = ref(false)

// 品牌相关状态
const brandLoading = ref(false)
const brandSearchKeyword = ref('')
const brandOptions = ref<BrandOption[]>([])

// 防抖搜索品牌
let brandSearchTimer: ReturnType<typeof setTimeout> | null = null

// 获取品牌列表
const fetchBrands = async (keyword?: string) => {
  brandLoading.value = true
  try {
    const brands = await getGoodsBrands(keyword ? { keyword } : undefined)
    brandOptions.value = brands
    metadata.value.brands = brands
  } catch (error) {
    console.error('获取品牌列表失败:', error)
    // 使用默认品牌数据
    const defaultBrands = [
      { id: 1, name: '格兰仕' },
      { id: 2, name: '苹果' },
      { id: 3, name: 'Nike' },
      { id: 4, name: '三只松鼠' },
      { id: 5, name: '戴森' },
      { id: 6, name: '小米' },
      { id: 7, name: '华为' },
      { id: 8, name: '美的' },
    ]
    brandOptions.value = defaultBrands
    metadata.value.brands = defaultBrands
  } finally {
    brandLoading.value = false
  }
}

// 品牌搜索处理
const handleBrandSearch = (value: string) => {
  brandSearchKeyword.value = value

  // 清除之前的定时器
  if (brandSearchTimer) {
    clearTimeout(brandSearchTimer)
  }

  // 设置防抖延迟
  brandSearchTimer = setTimeout(() => {
    fetchBrands(value)
  }, 300)
}

// 品牌下拉框获得焦点时加载初始数据
const handleBrandFocus = () => {
  if (brandOptions.value.length === 0) {
    fetchBrands()
  }
}

// 计算转换后的分类数据
const treeSelectCategories = computed(() => {
  return transformCategoriesForTreeSelect(metadata.value.categories || [])
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

// 详情弹窗相关
const detailModalOpen = ref(false)
const currentGoodsId = ref<number>()

// 新建/编辑弹窗相关
const addEditModalOpen = ref(false)
const currentEditGoodsId = ref<number | null>(null)

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
    if (searchForm.categoryId && searchForm.categoryId.length > 0) {
      queryParams.categoryId = searchForm.categoryId
    }
    if (searchForm.brandId && searchForm.brandId.length > 0) {
      queryParams.brandId = searchForm.brandId
    }
    if (searchForm.goodsType) queryParams.goodsType = searchForm.goodsType
    if (searchForm.minPrice) queryParams.minPrice = Number(searchForm.minPrice)
    if (searchForm.maxPrice) queryParams.maxPrice = Number(searchForm.maxPrice)
    if (searchForm.minStock) queryParams.minStock = Number(searchForm.minStock)
    if (searchForm.maxStock) queryParams.maxStock = Number(searchForm.maxStock)
    if (searchForm.auditStatus !== undefined) queryParams.auditStatus = searchForm.auditStatus

    // 标签筛选
    if (searchForm.tags.includes('isHot')) queryParams.isHot = true
    if (searchForm.tags.includes('isNew')) queryParams.isNew = true
    if (searchForm.tags.includes('isRecommend')) queryParams.isRecommend = true
    if (searchForm.tags.includes('isFreeShipping')) queryParams.isFreeShipping = true

    // 时间筛选
    if (searchForm.shelfTimeRange) {
      queryParams.shelfStartTime = searchForm.shelfTimeRange[0].format('YYYY-MM-DD')
      queryParams.shelfEndTime = searchForm.shelfTimeRange[1].format('YYYY-MM-DD')
    }
    if (searchForm.createTimeRange) {
      queryParams.createStartTime = searchForm.createTimeRange[0].format('YYYY-MM-DD')
      queryParams.createEndTime = searchForm.createTimeRange[1].format('YYYY-MM-DD')
    }

    // 高级搜索条件
    if (searchForm.minSalesCount) queryParams.minSalesCount = Number(searchForm.minSalesCount)
    if (searchForm.maxSalesCount) queryParams.maxSalesCount = Number(searchForm.maxSalesCount)
    if (searchForm.minViewCount) queryParams.minViewCount = Number(searchForm.minViewCount)

    // 好评率筛选
    if (searchForm.commentRateRange === 'high') queryParams.minGoodCommentRate = 95
    else if (searchForm.commentRateRange === 'medium') {
      queryParams.minGoodCommentRate = 90
      // 这里可以添加最大好评率限制，暂时省略
    } else if (searchForm.commentRateRange === 'low') {
      // 90%以下，可以设置最大值
    }

    // 库存状态处理
    if (searchForm.stockStatus === 'out') {
      queryParams.maxStock = 0
    } else if (searchForm.stockStatus === 'low') {
      queryParams.isLowStock = true
    }

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
    tableData.value = response.content.map((item, index) => ({
      ...item,
      // 如果id为null，使用spuCode或索引作为key
      key: item.id ? String(item.id) : item.spuCode || String(index),
      // 确保id有值，如果为null则使用索引+1
      id: item.id || index + 1,
      // 确保images是数组格式
      images: JSON.parse(item.images || '[]')
    }))

    pagination.value.total = response.totalElements
    pagination.value.current = response.page
    // 不要使用后端返回的size，保持用户设置的pageSize不变
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

const handlePriceChange = () => {
  if (searchForm.minPrice && searchForm.maxPrice) {
    // 精确到两位小数，如果超过两位，则截取前两位
    const minPriceDecimalLength = searchForm.minPrice.split('.')[1]?.length || 0
    const maxPriceDecimalLength = searchForm.maxPrice.split('.')[1]?.length || 0
    if (minPriceDecimalLength > 2) searchForm.minPrice = searchForm.minPrice.substring(0, 2)
    if (maxPriceDecimalLength > 2) searchForm.maxPrice = searchForm.maxPrice.substring(0, 2)
  }
}

// 表格变化处理
const handleTableChange = (pag: { current: number; pageSize: number }) => {
  pagination.value.current = pag.current
  pagination.value.pageSize = pag.pageSize
  fetchGoodsData()
}

// 分页页码变化处理
const handlePageChange = (page: number, pageSize: number) => {
  pagination.value.current = page
  pagination.value.pageSize = pageSize
  fetchGoodsData()
}

// 分页大小变化处理
const handlePageSizeChange = (current: number, size: number) => {
  pagination.value.current = 1 // 改变页面大小时重置到第一页
  pagination.value.pageSize = size
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
  // 重置基础搜索
  searchForm.name = ''
  searchForm.categoryId = []
  searchForm.brandId = []
  searchForm.goodsType = undefined

  // 重置价格库存
  searchForm.minPrice = ''
  searchForm.maxPrice = ''
  searchForm.stockStatus = ''
  searchForm.minStock = ''
  searchForm.maxStock = ''
  searchForm.auditStatus = undefined

  // 重置标签
  searchForm.tags = []

  // 重置时间
  searchForm.shelfTimeRange = null
  searchForm.createTimeRange = null

  // 重置高级搜索
  searchForm.minSalesCount = ''
  searchForm.maxSalesCount = ''
  searchForm.commentRateRange = ''
  searchForm.minViewCount = ''

  pagination.value.current = 1
  fetchGoodsData()
}

// 切换高级搜索
const toggleAdvancedSearch = () => {
  showAdvancedSearch.value = !showAdvancedSearch.value
}

// TreeSelect过滤函数
const filterTreeNode = (searchValue: string, treeNode: { title: string }) => {
  return treeNode.title.toLowerCase().includes(searchValue.toLowerCase())
}

// 异步加载子分类数据
const loadChildrenData = async (treeNode: {
  dataRef: { children?: unknown[]; isLeaf?: boolean }
  value: number
}) => {
  const { dataRef, value } = treeNode

  // 如果已经有子节点数据，则不再加载
  if (dataRef.children && dataRef.children.length > 0) {
    return
  }

  try {
    // 调用API获取子分类
    const subCategories = await getGoodsCategorySubTree(value)

    // 如果没有子分类，标记为叶子节点
    if (!subCategories || subCategories.length === 0) {
      dataRef.isLeaf = true
      dataRef.children = []
      return
    }

    // 转换为TreeSelect格式
    const transformedChildren = transformCategoriesForTreeSelect(subCategories)

    // 更新原始数据
    dataRef.children = transformedChildren

    // 为第三层分类标记为叶子节点（假设只有三层分类结构）
    transformedChildren.forEach((child: { children?: unknown[]; isLeaf?: boolean }) => {
      child.isLeaf = true // 第三层分类直接标记为叶子节点
    })

    // 触发重新渲染
    metadata.value.categories = [...metadata.value.categories]
  } catch (error) {
    console.error('加载子分类失败:', error)
    // 出错时也标记为叶子节点，避免重复尝试
    dataRef.isLeaf = true
    dataRef.children = []
  }
}

// 转换分类数据为TreeSelect格式
const transformCategoriesForTreeSelect = (
  categories: CategoryOption[],
): Array<CategoryOption & { value: number; title: string; isLeaf?: boolean }> => {
  return categories.map((category) => ({
    ...category,
    value: category.id,
    title: category.name,
    children: category.children ? transformCategoriesForTreeSelect(category.children) : undefined,
    // 如果没有children或children为空，但又不是根节点（有parentId），则可能有子节点需要异步加载
    isLeaf: category.children ? category.children.length === 0 : false,
  }))
}

// 获取元数据
const fetchMetadata = async () => {
  metadataLoading.value = true
  try {
    // 只获取分类树数据
    const categoryTree = await getGoodsCategories()

    // 设置分类数据，其他元数据使用默认值
    metadata.value = {
      ...metadata.value,
      categories: categoryTree,
    }
  } catch (error) {
    console.error('获取元数据失败:', error)
    // 如果API调用失败，使用模拟数据（保持TreeSelect格式）
    metadata.value = {
      categories: [
        {
          id: 1,
          name: '家用电器',
          parentId: 0,
          children: [
            { id: 8, name: '大家电', parentId: 1 },
            { id: 18, name: '小家电', parentId: 1 },
          ],
        },
        {
          id: 5,
          name: '数码电子',
          parentId: 0,
          children: [
            { id: 6, name: '数码配件', parentId: 5 },
            { id: 16, name: '智能穿戴', parentId: 5 },
            { id: 24, name: '手机数码', parentId: 24 },
          ],
        },
        {
          id: 21,
          name: '服装鞋帽',
          parentId: 0,
          children: [
            { id: 22, name: '服装', parentId: 21 },
            { id: 27, name: '运动鞋', parentId: 21 },
          ],
        },
        {
          id: 11,
          name: '食品饮料',
          parentId: 0,
          children: [
            { id: 12, name: '休闲零食', parentId: 11 },
            { id: 25, name: '茶酒饮料', parentId: 11 },
          ],
        },
      ],
      brands: [],
      suppliers: [
        { id: 1, name: '格兰仕供应商' },
        { id: 2, name: '苹果授权供应商' },
        { id: 3, name: '耐克供应商' },
        { id: 4, name: '三只松鼠供应商' },
        { id: 5, name: '戴森供应商' },
      ],
      goodsTypes: [
        { value: 1, label: '实物' },
        { value: 2, label: '虚拟' },
        { value: 3, label: '服务' },
      ],
      statusOptions: [
        { value: 0, label: '已下架' },
        { value: 1, label: '上架中' },
        { value: 2, label: '库存下架' },
        { value: 3, label: '审核中' },
        { value: 4, label: '审核失败' },
        { value: 5, label: '审核通过' },
      ],
      auditStatusOptions: [
        { value: 0, label: '待审核' },
        { value: 1, label: '审核通过' },
        { value: 2, label: '审核拒绝' },
      ],
    }
    message.warning('使用模拟数据，请检查后端接口')
  } finally {
    metadataLoading.value = false
  }
}

// 查看商品详情
const handleViewDetail = (record: GoodsItem) => {
  currentGoodsId.value = record.id
  detailModalOpen.value = true
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
  currentEditGoodsId.value = null
  addEditModalOpen.value = true
}

// 编辑商品
const handleEditGoods = (record: GoodsItem) => {
  currentEditGoodsId.value = record.id
  addEditModalOpen.value = true
}

// 新建/编辑成功回调
const handleAddEditSuccess = () => {
  fetchGoodsData()
}

// 导出
const handleExport = async () => {
  try {
    const queryParams: GoodsQueryParams = {}
    // 添加当前的搜索条件
    if (searchForm.name) queryParams.name = searchForm.name
    if (searchForm.categoryId && searchForm.categoryId.length > 0) {
      queryParams.categoryId = searchForm.categoryId
    }
    if (searchForm.brandId && searchForm.brandId.length > 0) {
      queryParams.brandId = searchForm.brandId
    }

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

// 监听详情查看事件
const handleGoodsDetailEvent = (event: Event) => {
  const customEvent = event as CustomEvent
  const record = customEvent.detail
  handleViewDetail(record)
}

// 监听编辑商品事件
const handleGoodsEditEvent = (event: Event) => {
  const customEvent = event as CustomEvent
  const record = customEvent.detail
  handleEditGoods(record)
}

// 组件挂载时获取数据
onMounted(async () => {
  try {
    // 并行获取元数据、品牌数据和商品数据
    await Promise.all([fetchMetadata(), fetchBrands(), fetchGoodsData()])
  } catch (error) {
    console.error('数据初始化失败:', error)
  }

  // 监听自定义事件
  window.addEventListener('view-goods-detail', handleGoodsDetailEvent as EventListener)
  window.addEventListener('edit-goods', handleGoodsEditEvent as EventListener)
})

// 组件卸载时清理事件监听
onUnmounted(() => {
  // 清理事件监听
  window.removeEventListener('view-goods-detail', handleGoodsDetailEvent as EventListener)
  window.removeEventListener('edit-goods', handleGoodsEditEvent as EventListener)

  // 清理定时器
  if (brandSearchTimer) {
    clearTimeout(brandSearchTimer)
    brandSearchTimer = null
  }
})
</script>

<style scoped>
/* 搜索标签样式 */
.search-label {
  white-space: nowrap;
  color: #666;
  width: 80px;
  text-align: right;
  line-height: 32px;
  font-weight: 500;
}

/* 高级搜索区域样式 */
.advanced-search {
  background: #fafafa;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
  margin-top: 12px;
}

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
