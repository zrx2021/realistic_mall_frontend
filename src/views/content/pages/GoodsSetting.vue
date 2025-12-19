<template>
  <div class="setting-panel">
    <section class="setting-section">
      <div class="section-header">
        <span class="section-title">选择样式模板</span>
        <span class="section-subtitle">当前模式：{{ currentTemplateLabel }}</span>
      </div>

      <div class="template-selector">
        <div
          v-for="template in templateOptions"
          :key="template.value"
          class="template-option"
          :class="{ active: data.templateStyle === template.value }"
          @click="selectTemplate(template.value)"
        >
          <div class="template-icon">
            <div class="icon-placeholder">{{ template.icon }}</div>
          </div>
          <div class="template-label">{{ template.label }}</div>
        </div>
      </div>
    </section>

    <div class="setting-divider" role="presentation"></div>

    <section class="setting-section">
      <div class="section-header">
        <span class="section-title">商品内容</span>
        <span class="section-subtitle">选择具体商品或引用商品分组进行展示</span>
      </div>

      <div class="style-setting-item">
        <span class="setting-item-label">是否开启分组</span>
        <a-switch v-model:checked="data.enableGroup"/>
      </div>

      <a-tabs v-model:activeKey="activeTab" class="setting-tabs" @change="handleTabChange">
        <a-tab-pane key="goods" tab="商品">
          <div class="goods-selection">
            <div class="goods-item-placeholder">
              <div class="goods-placeholder"></div>
              <div class="goods-placeholder"></div>
              <div class="add-goods-btn" @click="addGoods">
                <plus-outlined />
              </div>
            </div>
          </div>
        </a-tab-pane>

        <a-tab-pane key="groups" tab="商品分组">
          <div class="groups-section">
            <div class="section-header">
              <span class="section-title">添加商品分组</span>
              <span class="section-subtitle">最多添加10个分组</span>
            </div>

            <div class="groups-list">
              <div v-for="(group, index) in data.groupData" :key="group.id" class="group-item">
                <!-- <div class="group-header">

                </div> -->

                <div class="group-setting">
                  <div class="setting-row">
                    <span class="group-name">分组</span>
                    <a-tree-select
                      v-model:value="group.goodsCategoryId"
                      style="width: 200px"
                      allow-clear
                      :max-tag-count="2"
                      :loading="metadataLoading"
                      :tree-data="treeSelectCategories"
                      :load-data="loadChildrenData"
                      :show-search="true"
                      :filter-tree-node="filterTreeNode"
                      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                      @change="(value: number) => handleCategoryChange(value, index)"
                    />
                  </div>

                  <div class="setting-row">
                    <span class="setting-label">显示名称</span>
                    <a-input
                      v-model:value="group.displayName"
                      placeholder="请输入"
                      class="setting-input"
                      @blur="handleChange"
                    />
                  </div>

                  <div class="setting-row">
                    <span class="setting-label">显示个数</span>
                  </div>

                  <div class="setting-row">
                    <a-radio-group
                      v-model:value="group.displayType"
                      class="setting-radio-group"
                      @change="handleDisplayTypeChange(index)"
                    >
                      <a-radio value="custom">
                        <a-input-number
                          v-model:value="group.displayCount"
                          :min="1"
                          :max="100"
                          :disabled="group.displayType !== 'custom'"
                          placeholder="请输入"
                          size="small"
                          @change="handleChange"
                        />
                      </a-radio>
                      <a-radio value="all">全部</a-radio>
                    </a-radio-group>
                  </div>
                </div>
              </div>

              <a-button
                type="primary"
                class="add-group-btn"
                @click="addGroup"
                :disabled="data.groupData.length >= 10"
              >
                添加商品分组
              </a-button>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </section>

    <div class="setting-divider" role="presentation"></div>

    <section class="setting-section">
      <div class="section-header">
        <span class="section-title">展示样式</span>
        <span class="section-subtitle">统一控制卡片的边框、背景等视觉效果</span>
      </div>
      <div class="display-style-options">
        <div
          v-for="style in displayStyleOptions"
          :key="style.value"
          class="style-option"
          :class="{ active: data.displayStyle === style.value }"
          @click="selectDisplayStyle(style.value)"
        >
          {{ style.label }}
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import type { Goods, GoodsGroup, GoodsItem } from '@/types/content/content'
import { getUniqueId } from '@/utils/uniqueId'
import { message } from 'ant-design-vue'
import { getGoodsByCategoryId, getGoodsCategories, getGoodsCategorySubTree, type CategoryOption, type GoodsInfo } from '@/api/goods'

const props = defineProps<{
  objData: Goods
}>()

const emits = defineEmits(['update:objData'])

const categoryTree = ref<CategoryOption[]>([])

const goodsListLoading = ref(false)

// 分组是否正在加载
const metadataLoading = ref(false)

// TreeSelect过滤函数
const filterTreeNode = (searchValue: string, treeNode: { title: string }) => {
  return treeNode.title.toLowerCase().includes(searchValue.toLowerCase())
}

// 计算转换后的分类数据
const treeSelectCategories = computed(() => {
  return transformCategoriesForTreeSelect(categoryTree.value || [])
})

// 转换分组数据为TreeSelect格式
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

const findCategoryNameById = (id: number, categories: CategoryOption[]): string | null => {
  for (const category of categories) {
    if (category.id === id) {
      return category.name
    }
    if (category.children && category.children.length > 0) {
      const found = findCategoryNameById(id, category.children)
      if (found) return found
    }
  }
  return null
}

const handleCategoryChange = async (categoryId: number | undefined, index: number) => {
  if (!categoryId) {
    return
  }

  const group = data.value.groupData[index]

  // 1. 自动填充显示名称
  const categoryName = findCategoryNameById(categoryId, categoryTree.value)
  if (categoryName && (!group.displayName || group.displayName.trim() === '')) {
    data.value.groupData[index].displayName = categoryName
  }

  data.value.goodsList = []

  const pageSize = group.displayType === 'all' ? 20 : group.displayCount || 10

  goodsListLoading.value = true

  const response = await getGoodsByCategoryId(categoryId, 0, pageSize)

  const goodsItemList: GoodsItem[] = response.content.map((goodsInfo: GoodsInfo) => ({
        id: goodsInfo.id,
        name: goodsInfo.name,
        description: goodsInfo.subTitle || '',
        price: goodsInfo.minPrice, // 使用最低售价
        originalPrice: goodsInfo.marketPrice, // 市场价作为原价
        imageUrl: goodsInfo.mainImage || '', // 主图
        stock: goodsInfo.totalStock, // 总库存
        sales: goodsInfo.salesCount, // 销量
        rating: goodsInfo.goodCommentRate, // 好评率
        tags: [], // 暂时没有标签数据
        discount: goodsInfo.marketPrice > 0
          ? Math.round((1 - goodsInfo.minPrice / goodsInfo.marketPrice) * 100)
          : 0,
        isHot: goodsInfo.isHot,
        isNew: goodsInfo.isNew,
        categoryIds: [goodsInfo.categoryId], // 分类ID数组
      }))

  data.value.goodsList = goodsItemList


  handleChange()
}

const fetchGoodsCategories = async () => {
  categoryTree.value = await getGoodsCategories();
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
    categoryTree.value = [...categoryTree.value]
  } catch (error) {
    console.error('加载子分类失败:', error)
    // 出错时也标记为叶子节点，避免重复尝试
    dataRef.isLeaf = true
    dataRef.children = []
  }
}

const data = ref<Goods>({
  goodsId: -1,
  componentId: -1,
  templateStyle: 'oneMainTwoSub', // 一大两小
  goodsList: [],
  groupData: [],
  displayStyle: 'noBorderWhite', // 无边白底
  showPrice: true,
  showCart: true,
  showRating: true,
  showSales: true,
  showTags: true,
  enableSeckill: false,
  enableGroup: true
})

const activeTab = ref('groups') // 默认显示商品分组

// 样式模板选项
const templateOptions = ref([
  { value: 'oneMainTwoSub', label: '一大两小', icon: '🖼️' },
  { value: 'twoColumns', label: '两列', icon: '📖' },
  { value: 'largeImage', label: '大图模式', icon: '🗂️' },
  { value: 'list', label: '列表', icon: '☰' },
])

// 计算当前选中的模板标签
const currentTemplateLabel = computed(() => {
  const currentTemplate = templateOptions.value.find(
    (template) => template.value === data.value.templateStyle,
  )
  return currentTemplate?.label || '未知模式'
})

// 展示样式选项
const displayStyleOptions = ref([
  { value: 'noBorderWhite', label: '无边白底' },
  { value: 'cardShadow', label: '卡片投影' },
  { value: 'borderWhite', label: '描边白底' },
  { value: 'noBorderTransparent', label: '无边透明底' },
])

const handleChange = () => {
  emits('update:objData', data.value)
}

const selectTemplate = (templateValue: string) => {
  console.log('templateValue', templateValue)
  data.value.templateStyle = templateValue
  handleChange()
}

const selectDisplayStyle = (styleValue: string) => {
  data.value.displayStyle = styleValue
  handleChange()
}

const handleTabChange = (key: string) => {
  activeTab.value = key
}

const addGroup = () => {
  if (data.value.groupData.length >= 10) {
    message.error('最多添加10个分组')
    return
  }

  const newGroup: GoodsGroup & { displayName?: string; displayType?: string } = {
    id: getUniqueId(),
    componentId: -1,
    goodsCategoryId: -1,
    // goodsCategoryName: `${data.value.groupData.length === 0 ? '家居生活' : '数码影音'}`,
    displayCount: 10,
    displayName: '',
    displayType: 'custom',
  }

  data.value.groupData.push(newGroup)
  handleChange()
}

const handleDisplayTypeChange = (index: number) => {
  const group = data.value.groupData[index]
  if (group.displayType === 'all') {
    group.displayCount = 0 // 全部时设为0
  } else {
    group.displayCount = 10 // 默认显示10个
  }
  handleChange()
}

const addGoods = () => {
  // 添加商品的逻辑，暂时留空
  message.info('添加商品功能待实现')
}

onMounted(() => {
  data.value = { ...props.objData }

  // 如果没有分组数据，添加默认分组
  if (data.value.groupData.length === 0) {
    addGroup()
    // 添加第二个默认分组
    const secondGroup: GoodsGroup & { displayName?: string; displayType?: string } = {
      id: getUniqueId(),
      componentId: -1,
      goodsCategoryId: -1,
      // goodsCategoryName: '数码影音',
      displayCount: 10,
      displayName: '',
      displayType: 'custom',
    }
    data.value.groupData.push(secondGroup)
  }
  fetchGoodsCategories()
})
</script>

<style scoped>
.setting-panel {
  width: 100%;
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #fff;
  overflow-y: auto;
}

.setting-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f1f1f;
}

.section-subtitle {
  font-size: 12px;
  color: #8c8c8c;
}

.setting-divider {
  height: 1px;
  background-color: #f0f0f0;
}

.setting-tabs {
  margin-top: -8px;
}

:deep(.ant-tabs-nav) {
  margin-bottom: 16px !important;
}

:deep(.ant-input),
:deep(.ant-input-number),
:deep(.ant-input-number-input),
:deep(.ant-select-selector) {
  border-radius: 6px;
  border-color: #d9d9d9 !important;
  min-height: 36px;
}

/* 样式模板选择器 */
.template-selector {
  display: flex;
  gap: 8px;
  padding: 16px 0;
  justify-content: space-between;
}

.template-option {
  flex: 1;
  height: 80px;
  border: 2px solid #e8e8e8;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  gap: 4px;
}

.template-option:hover {
  border-color: #1890ff;
  background: #f0f8ff;
}

.template-option.active {
  border-color: #1890ff;
  background: #e6f7ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.template-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-placeholder {
  font-size: 20px;
  color: #666;
}

.template-option.active .icon-placeholder {
  color: #1890ff;
}

.template-label {
  font-size: 12px;
  color: #666;
  text-align: center;
  line-height: 1.2;
}

.template-option.active .template-label {
  color: #1890ff;
  font-weight: 500;
}

/* 商品选择区域 */
.goods-selection {
  padding: 16px 0;
}

.goods-item-placeholder {
  display: flex;
  gap: 12px;
  align-items: center;
}

.goods-placeholder {
  width: 80px;
  height: 80px;
  background: #f0f0f0;
  border-radius: 4px;
  border: 1px dashed #d9d9d9;
}

.add-goods-btn {
  width: 80px;
  height: 80px;
  border: 2px dashed #1890ff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #1890ff;
  font-size: 24px;
  transition: all 0.3s;
}

.add-goods-btn:hover {
  background: #f0f8ff;
  border-color: #40a9ff;
}

/* 商品分组样式 */
.groups-section {
  padding: 16px 0;
}

.groups-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.group-item {
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 16px;
  background: #fafafa;
}

.group-header {
  margin-bottom: 12px;
}

.group-name {
  color: #666;
  font-size: 14px;
}

.group-name-value {
  color: #1890ff;
  font-weight: 500;
  margin-left: 8px;
}

.group-setting {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.setting-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.setting-label {
  min-width: 80px;
  color: #595959;
  font-size: 14px;
  font-weight: 500;
}

.setting-input {
  flex: 1;
  min-width: 0;
  max-width: 260px;
}

.count-input {
  width: 20px;
}

.setting-radio-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.add-group-btn {
  width: 100%;
  height: 40px;
  border: 2px dashed #1890ff;
  background: transparent;
  color: #1890ff;
  border-radius: 6px;
  font-size: 14px;
}

.add-group-btn:hover:not(:disabled) {
  background: #f0f8ff;
  border-color: #40a9ff;
}

.add-group-btn:disabled {
  border-color: #d9d9d9;
  color: #d9d9d9;
  cursor: not-allowed;
}

/* 展示样式选项 */
.display-style-options {
  display: flex;
  gap: 8px;
  padding: 16px 0;
  flex-wrap: wrap;
}

.style-option {
  flex: 1;
  min-width: 120px;
  height: 40px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #fafafa;
  font-size: 14px;
  color: #666;
}

.style-option:hover {
  border-color: #1890ff;
  color: #1890ff;
  background: #f0f8ff;
}

.style-option.active {
  border-color: #1890ff;
  color: #1890ff;
  background: #e6f7ff;
  font-weight: 500;
}

/* Ant Design 组件样式覆盖 */
:deep(.ant-tabs-tab) {
  font-size: 14px;
}

:deep(.ant-tabs-content-holder) {
  padding-top: 16px;
}

:deep(.ant-radio-wrapper) {
  display: flex;
  align-items: center;
  margin-right: 16px;
}

:deep(.ant-radio) {
  margin-right: 8px;
}

:deep(.ant-input-number) {
  width: 100px;
}
</style>

<script lang="ts">
export default {
  name: 'GoodsSetting',
}
</script>
