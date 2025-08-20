<template>
  <a-flex :style="containerStyle" vertical gap="middle">
    <!-- 顶部操作栏 -->
    <a-flex :style="boxStyle" justify="space-between" align="center">
      <div>
        <a-button type="primary" @click="handleAddRootCategory">新建一级分类</a-button>
        <a-button
          v-if="selectedCategory && selectedCategory.level < 3"
          type="default"
          @click="handleAddSubCategory"
          style="margin-left: 8px"
        >
          新建子分类
        </a-button>
      </div>
      <a-input-search
        v-model:value="searchKeyword"
        placeholder="搜索分类名称"
        style="width: 300px"
        @search="handleSearch"
        allow-clear
      >
        <template #suffix>
          <SearchOutlined />
        </template>
      </a-input-search>
    </a-flex>

    <!-- 主要内容区域 -->
    <a-flex :style="boxStyle" gap="middle" style="min-height: 600px">
      <!-- 左侧分类树 -->
      <div class="category-tree-container">
        <a-spin :spinning="loading">
          <a-tree
            v-model:selectedKeys="selectedKeys"
            v-model:expandedKeys="expandedKeys"
            :tree-data="filteredTreeData"
            :show-icon="true"
            :show-line="true"
            :load-data="loadChildrenData"
            block-node
            @select="handleTreeSelect"
            @expand="handleTreeExpand"
          >
            <template #icon="{ expanded }">
              <FolderOpenOutlined v-if="expanded" />
              <FolderOutlined v-else />
            </template>
            <template #title="{ title, isActive, goodsCount }">
              <div class="tree-node-title">
                <span :class="{ 'inactive-category': !isActive }">{{ title }}</span>
                <a-tag v-if="goodsCount > 0" size="small" color="blue">{{ goodsCount }}</a-tag>
                <a-tag v-if="!isActive" size="small" color="red">已禁用</a-tag>
              </div>
            </template>
          </a-tree>
        </a-spin>
      </div>

      <!-- 右侧设置面板 -->
      <div class="category-settings-container">
        <a-card title="分类设置" :bordered="false">
          <template #extra>
            <a-space>
              <a-button
                v-if="selectedCategory"
                type="primary"
                @click="handleSave"
                :loading="saveLoading"
              >
                保存
              </a-button>
              <a-button v-if="selectedCategory && selectedCategory.id" danger @click="handleDelete">
                删除
              </a-button>
            </a-space>
          </template>

          <div v-if="!selectedCategory" class="empty-state">
            <a-empty description="请选择一个分类进行编辑" />
          </div>

          <a-form
            v-else
            ref="formRef"
            :model="formData"
            :rules="formRules"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
            layout="horizontal"
          >
            <!-- 基本信息 -->
            <a-divider orientation="left">基本信息</a-divider>

            <a-form-item label="分类名称" name="name" required>
              <a-input v-model:value="formData.name" placeholder="请输入分类名称" />
            </a-form-item>

            <a-form-item label="上级分类" name="parentId">
              <a-tree-select
                v-model:value="formData.parentId"
                :tree-data="parentCategoryOptions"
                placeholder="请选择上级分类（不选则为一级分类）"
                allow-clear
                tree-default-expand-all
                :disabled="isEdit && formData.level === 1"
              />
            </a-form-item>

            <a-form-item label="排序权重" name="sortOrder">
              <a-input-number
                v-model:value="formData.sortOrder"
                placeholder="数值越大越靠前"
                :min="0"
                :max="9999"
                style="width: 100%"
              />
            </a-form-item>

            <a-form-item label="分类图标" name="icon">
              <a-input v-model:value="formData.icon" placeholder="请输入图标URL" />
            </a-form-item>

            <a-form-item label="分类描述" name="description">
              <a-textarea
                v-model:value="formData.description"
                placeholder="请输入分类描述"
                :rows="3"
              />
            </a-form-item>

            <a-form-item label="启用状态" name="isActive">
              <a-switch
                v-model:checked="formData.isActive"
                checked-children="启用"
                un-checked-children="禁用"
              />
            </a-form-item>

            <!-- SEO设置 -->
            <a-divider orientation="left">SEO设置</a-divider>

            <a-form-item label="SEO标题" name="seoTitle">
              <a-input v-model:value="formData.seoTitle" placeholder="请输入SEO标题" />
            </a-form-item>

            <a-form-item label="SEO关键词" name="seoKeywords">
              <a-input v-model:value="formData.seoKeywords" placeholder="多个关键词用逗号分隔" />
            </a-form-item>

            <a-form-item label="SEO描述" name="seoDescription">
              <a-textarea
                v-model:value="formData.seoDescription"
                placeholder="请输入SEO描述"
                :rows="3"
              />
            </a-form-item>

            <!-- 系统信息（只读） -->
            <a-divider orientation="left">系统信息</a-divider>

            <a-form-item label="分类ID">
              <a-input :value="formData.id" disabled />
            </a-form-item>

            <a-form-item label="分类级别">
              <a-input :value="formData.level" disabled />
            </a-form-item>

            <a-form-item label="分类路径">
              <a-input :value="formData.path" disabled />
            </a-form-item>

            <a-form-item label="创建时间">
              <a-input :value="formData.createTime" disabled />
            </a-form-item>

            <a-form-item label="更新时间">
              <a-input :value="formData.updateTime" disabled />
            </a-form-item>
          </a-form>
        </a-card>
      </div>
    </a-flex>
  </a-flex>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import type { CSSProperties } from 'vue'
import { message } from 'ant-design-vue'
import { SearchOutlined, FolderOutlined, FolderOpenOutlined } from '@ant-design/icons-vue'
import type { FormInstance } from 'ant-design-vue'
import {
  getCategoryList,
  addCategory,
  updateCategory,
  deleteCategory,
  getSubCategories,
  type CategoryItem,
  type CategoryCreateParams,
} from '@/api/category'

// 树形选择器选项类型
interface TreeSelectOption {
  value: number
  title: string
  key: number
  children?: TreeSelectOption[]
}

// 树节点数据类型
interface TreeNodeData {
  title: string
  key: number
  children?: TreeNodeData[]
  isActive: boolean
  goodsCount: number
  level: number
  parentId: number | null
  isLeaf?: boolean
}

// 状态管理
const loading = ref(false)
const saveLoading = ref(false)
const searchKeyword = ref('')
const selectedKeys = ref<number[]>([])
const expandedKeys = ref<number[]>([])

// 分类数据
const categoryList = ref<CategoryItem[]>([])
const selectedCategory = ref<CategoryItem | null>(null)
const isEdit = ref(false)

// 表单相关
const formRef = ref<FormInstance>()
const formData = reactive({
  id: undefined as number | undefined,
  name: '',
  parentId: null as number | null,
  level: 1,
  path: '',
  sortOrder: 0,
  icon: '',
  description: '',
  isActive: true,
  seoTitle: '',
  seoKeywords: '',
  seoDescription: '',
  createTime: '',
  updateTime: '',
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 1, max: 50, message: '分类名称长度在1-50个字符', trigger: 'blur' },
  ],
  sortOrder: [
    { required: true, message: '请输入排序权重', trigger: 'blur' },
    { type: 'number', min: 0, max: 9999, message: '排序权重范围0-9999', trigger: 'blur' },
  ],
}

// 转换分类数据为树形数据
const convertToTreeData = (categories: CategoryItem[]): TreeNodeData[] => {
  return categories.map((category) => ({
    title: category.name,
    key: category.id,
    isActive: category.isActive,
    goodsCount: category.goodsCount || 0,
    level: category.level,
    parentId: category.parentId,
    children: category.children ? convertToTreeData(category.children) : undefined,
    // 支持异步加载：如果是二级分类且没有children，则标记为可加载
    isLeaf: category.level === 3 || (category.level === 2 && !category.hasChildren),
  }))
}

// 过滤后的树形数据
const filteredTreeData = computed(() => {
  if (!searchKeyword.value.trim()) {
    return convertToTreeData(categoryList.value)
  }

  const filterCategories = (categories: CategoryItem[]): CategoryItem[] => {
    const result: CategoryItem[] = []

    categories.forEach((category) => {
      const matchesKeyword = category.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
      const filteredChildren = category.children ? filterCategories(category.children) : []

      if (matchesKeyword || filteredChildren.length > 0) {
        result.push({
          ...category,
          children: filteredChildren.length > 0 ? filteredChildren : category.children,
        })
      }
    })

    return result
  }

  return convertToTreeData(filterCategories(categoryList.value))
})

// 上级分类选项
const parentCategoryOptions = computed(() => {
  const buildTreeOptions = (categories: CategoryItem[], excludeId?: number): TreeSelectOption[] => {
    return categories
      .filter((cat) => cat.level <= 2 && cat.id !== excludeId) // 只显示前两级作为父级选项，排除当前编辑的分类
      .map((cat) => ({
        value: cat.id,
        title: cat.name,
        key: cat.id,
        children: cat.children ? buildTreeOptions(cat.children, excludeId) : undefined,
      }))
  }
  return buildTreeOptions(categoryList.value, selectedCategory.value?.id)
})

// 根据ID查找分类
const findCategoryById = (categories: CategoryItem[], id: number): CategoryItem | null => {
  for (const category of categories) {
    if (category.id === id) {
      return category
    }
    if (category.children) {
      const found = findCategoryById(category.children, id)
      if (found) return found
    }
  }
  return null
}

// 获取分类数据（前两层）
const fetchCategoryData = async () => {
  loading.value = true
  try {
    const data = await getCategoryList()

    // 为每个分类添加异步加载标记
    const processCategories = (categories: CategoryItem[]): CategoryItem[] => {
      return categories.map((category) => ({
        ...category,
        // 如果是二级分类，标记可能有子节点（需要异步加载）
        hasChildren: category.level === 2,
        // 如果有子分类但children为空，则需要异步加载
        children:
          category.level === 1 && category.children
            ? processCategories(category.children)
            : undefined,
      }))
    }

    categoryList.value = processCategories(data)

    // 默认展开一级分类
    const getFirstLevelKeys = (categories: CategoryItem[]): number[] => {
      return categories.filter((cat) => cat.level === 1).map((cat) => cat.id)
    }
    expandedKeys.value = getFirstLevelKeys(data)
  } catch (error) {
    console.error('获取分类数据失败:', error)
    // 如果API调用失败，使用模拟数据
    const mockData: CategoryItem[] = [
      {
        id: 1,
        name: '数码家电',
        parentId: null,
        level: 1,
        path: '1',
        sortOrder: 100,
        icon: '',
        description: '数码家电分类',
        isActive: true,
        seoTitle: '',
        seoKeywords: '',
        seoDescription: '',
        createTime: '2035-09-19 9:39:39',
        goodsCount: 2,
        hasChildren: true,
        children: [
          {
            id: 8,
            name: '生活电器',
            parentId: 1,
            level: 2,
            path: '1,8',
            sortOrder: 90,
            icon: '',
            description: '生活电器分类',
            isActive: true,
            seoTitle: '',
            seoKeywords: '',
            seoDescription: '',
            createTime: '2035-09-19 9:39:39',
            goodsCount: 23,
            hasChildren: true,
            children: [
              {
                id: 16,
                name: '面条机',
                parentId: 8,
                level: 3,
                path: '1,8,16',
                sortOrder: 80,
                icon: '',
                description: '面条机分类',
                isActive: true,
                seoTitle: '',
                seoKeywords: '',
                seoDescription: '',
                createTime: '2035-09-19 9:39:39',
                goodsCount: 16,
                hasChildren: false,
              },
            ],
          },
        ],
      },
      {
        id: 5,
        name: '户外营销',
        parentId: null,
        level: 1,
        path: '5',
        sortOrder: 80,
        icon: '',
        description: '户外营销分类',
        isActive: false,
        seoTitle: '',
        seoKeywords: '',
        seoDescription: '',
        createTime: '2035-09-19 9:39:39',
        goodsCount: 5,
        hasChildren: false,
      },
    ]

    categoryList.value = mockData
    const getAllKeys = (categories: CategoryItem[]): number[] => {
      const keys: number[] = []
      categories.forEach((category) => {
        keys.push(category.id)
        if (category.children) {
          keys.push(...getAllKeys(category.children))
        }
      })
      return keys
    }
    expandedKeys.value = getAllKeys(mockData)
    message.warning('使用模拟数据，请检查后端接口')
  } finally {
    loading.value = false
  }
}

// 填充表单数据
const fillFormData = (category: CategoryItem) => {
  formData.id = category.id
  formData.name = category.name
  formData.parentId = category.parentId
  formData.level = category.level
  formData.path = category.path || ''
  formData.sortOrder = category.sortOrder
  formData.icon = category.icon || ''
  formData.description = category.description || ''
  formData.isActive = category.isActive
  formData.seoTitle = category.seoTitle || ''
  formData.seoKeywords = category.seoKeywords || ''
  formData.seoDescription = category.seoDescription || ''
  formData.createTime = category.createTime
  formData.updateTime = category.updateTime || ''
}

// 重置表单数据
const resetFormData = () => {
  formData.id = undefined
  formData.name = ''
  formData.parentId = null
  formData.level = 1
  formData.path = ''
  formData.sortOrder = 0
  formData.icon = ''
  formData.description = ''
  formData.isActive = true
  formData.seoTitle = ''
  formData.seoKeywords = ''
  formData.seoDescription = ''
  formData.createTime = ''
  formData.updateTime = ''
}

// 树节点选择
const handleTreeSelect = (
  selectedKeys: number[],
  info: { selected: boolean; selectedNodes: any[]; node: any; event: any },
) => {
  if (selectedKeys.length > 0) {
    const categoryId = selectedKeys[0]
    const category = findCategoryById(categoryList.value, categoryId)
    if (category) {
      selectedCategory.value = category
      fillFormData(category)
      isEdit.value = true
    }
  } else {
    selectedCategory.value = null
    resetFormData()
    isEdit.value = false
  }
}

// 异步加载子节点数据
const loadChildrenData = async (treeNode: any) => {
  const nodeKey = treeNode.key || treeNode.eventKey
  const category = findCategoryById(categoryList.value, nodeKey)

  if (!category || category.children) {
    return // 已经有子节点数据，不需要重复加载
  }

  try {
    const subCategories = await getSubCategories(nodeKey)

    // 更新分类数据
    const updateCategoryChildren = (categories: CategoryItem[]): CategoryItem[] => {
      return categories.map((cat) => {
        if (cat.id === nodeKey) {
          return {
            ...cat,
            children: subCategories.map((sub) => ({
              ...sub,
              hasChildren: false, // 三级分类没有子节点
            })),
            hasChildren: subCategories.length > 0,
          }
        }
        if (cat.children) {
          return {
            ...cat,
            children: updateCategoryChildren(cat.children),
          }
        }
        return cat
      })
    }

    categoryList.value = updateCategoryChildren(categoryList.value)
  } catch (error) {
    console.error('加载子分类失败:', error)
    message.error('加载子分类失败')
  }
}

// 树节点展开
const handleTreeExpand = (expandedKeys: number[]) => {
  // 这里可以添加额外的展开逻辑
}

// 搜索处理
const handleSearch = (value: string) => {
  searchKeyword.value = value
}

// 新建一级分类
const handleAddRootCategory = () => {
  selectedCategory.value = null
  resetFormData()
  formData.level = 1
  formData.parentId = null
  isEdit.value = false
  selectedKeys.value = []
}

// 新建子分类
const handleAddSubCategory = () => {
  if (!selectedCategory.value) return

  const newCategory = {
    id: 0, // 新建时ID为0
    name: '',
    parentId: selectedCategory.value.id,
    level: selectedCategory.value.level + 1,
    path: '',
    sortOrder: 0,
    icon: '',
    description: '',
    isActive: true,
    seoTitle: '',
    seoKeywords: '',
    seoDescription: '',
    createTime: '',
    updateTime: '',
  } as CategoryItem

  selectedCategory.value = newCategory
  fillFormData(newCategory)
  isEdit.value = false
  selectedKeys.value = []
}

// 保存分类
const handleSave = async () => {
  try {
    await formRef.value?.validateFields()
    saveLoading.value = true

    const categoryData: CategoryCreateParams = {
      name: formData.name,
      parentId: formData.parentId,
      level: formData.level,
      sortOrder: formData.sortOrder,
      icon: formData.icon,
      description: formData.description,
      isActive: formData.isActive,
      seoTitle: formData.seoTitle,
      seoKeywords: formData.seoKeywords,
      seoDescription: formData.seoDescription,
    }

    if (isEdit.value && formData.id) {
      await updateCategory(formData.id, categoryData)
      message.success('更新成功')
    } else {
      await addCategory(categoryData)
      message.success('新建成功')
    }

    await fetchCategoryData()
  } catch (error) {
    console.error('保存失败:', error)
    message.error('保存失败')
  } finally {
    saveLoading.value = false
  }
}

// 删除分类
const handleDelete = async () => {
  if (!selectedCategory.value || !selectedCategory.value.id) return

  if (selectedCategory.value.children && selectedCategory.value.children.length > 0) {
    message.warning('该分类下存在子分类，不能删除')
    return
  }

  if (selectedCategory.value.goodsCount && selectedCategory.value.goodsCount > 0) {
    message.warning('该分类下存在商品，不能删除')
    return
  }

  try {
    await deleteCategory(selectedCategory.value.id)
    message.success('删除成功')
    selectedCategory.value = null
    resetFormData()
    selectedKeys.value = []
    await fetchCategoryData()
  } catch (error) {
    console.error('删除失败:', error)
    message.error('删除失败')
  }
}

// 监听选中的分类变化
watch(selectedCategory, (newCategory) => {
  if (newCategory) {
    selectedKeys.value = [newCategory.id]
  }
})

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
  fetchCategoryData()
})
</script>

<script lang="ts">
export default {
  name: 'CategoryManagement',
}
</script>

<style scoped>
.category-tree-container {
  width: 300px;
  min-width: 300px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  padding: 16px;
  background-color: #fafafa;
}

.category-settings-container {
  flex: 1;
  min-width: 500px;
}

.tree-node-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.inactive-category {
  color: #999;
  text-decoration: line-through;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

:deep(.ant-tree) {
  background: transparent;
}

:deep(.ant-tree .ant-tree-node-content-wrapper) {
  border-radius: 4px;
  transition: all 0.3s;
}

:deep(.ant-tree .ant-tree-node-content-wrapper:hover) {
  background-color: #e6f4ff;
}

:deep(.ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected) {
  background-color: #bae0ff;
}

:deep(.ant-tree-title) {
  width: 100%;
}

:deep(.ant-card-head-title) {
  font-weight: 600;
}

:deep(.ant-divider-horizontal.ant-divider-with-text-left) {
  margin: 24px 0 16px 0;
}

:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-form-item-label) {
  font-weight: 500;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .category-tree-container {
    width: 250px;
    min-width: 250px;
  }

  .category-settings-container {
    min-width: 400px;
  }
}

@media (max-width: 768px) {
  .category-tree-container {
    width: 100%;
    min-width: auto;
    margin-bottom: 16px;
  }

  .category-settings-container {
    width: 100%;
    min-width: auto;
  }
}
</style>
