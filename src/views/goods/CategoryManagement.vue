<template>
  <a-flex :style="containerStyle" vertical gap="middle">
    <!-- 顶部操作栏 -->
    <a-flex :style="boxStyle" justify="space-between" align="center">
      <a-flex align="center" gap="small">
        <a-button type="primary" @click="handleAddPrimaryCategory">新建一级分类</a-button>
        <a-tooltip 
          :title="isNewUnsavedCategory ? '请先保存新节点' : ''"
          :visible="isNewUnsavedCategory && showTooltip ? true : undefined"
        >
          <a-button
            v-if="selectedCategory && selectedCategory.level < 10"
            type="default"
            @click="handleAddSubCategory"
            :disabled="isNewUnsavedCategory"
            @mouseenter="showTooltip = true"
            @mouseleave="showTooltip = false"
          >
            新建子分类
          </a-button>
        </a-tooltip>
        <a-upload
          :show-upload-list="false"
          :before-upload="handleBeforeUpload"
          :custom-request="handleExcelImport"
          accept=".xlsx,.xls"
        >
          <a-button :loading="importLoading">
            <CloudUploadOutlined />
            导入Excel
          </a-button>
        </a-upload>
        <a-button @click="handleExcelExport" :loading="exportLoading">
          <DownloadOutlined />
          导出Excel
        </a-button>
      </a-flex>
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
                placeholder="请选择上级分类"
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
              <a-upload
                v-model:file-list="iconFileList"
                :custom-request="handleIconUpload"
                :before-upload="beforeIconUpload"
                list-type="picture-card"
                :max-count="1"
                accept="image/*"
                @remove="handleIconRemove"
                :show-upload-list="false"
              >
                <div v-if="!formData.icon">
                  <PlusOutlined />
                  <div style="margin-top: 8px">上传图标</div>
                </div>
                <div v-else class="custom-upload-preview">
                  <div class="upload-preview-item">
                    <AuthImage
                      :src="iconPreviewUrl"
                      alt="分类图标"
                      class="preview-image"
                      :force-auth="true"
                      :lazy="false"
                    />
                    <div class="upload-preview-actions">
                      <a-button size="small" class="remove-btn" @click.stop="handleIconRemove"
                        >移除</a-button
                      >
                    </div>
                  </div>
                </div>
              </a-upload>
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
import {
  SearchOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  PlusOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
} from '@ant-design/icons-vue'
import type { FormInstance } from 'ant-design-vue'
import {
  getCategoryList,
  addCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  importCategoriesFromExcel,
  exportCategoriesToExcel,
  type CategoryItem,
  type CategoryCreateParams,
} from '@/api/category'
import AuthImage from '@/components/common/AuthImage.vue'
import { getUniqueId } from '@/utils/uniqueId'

// 树形选择器选项类型
interface TreeSelectOption {
  value: number | null
  title: string
  key: number | null
  children?: TreeSelectOption[]
}

// 树节点数据类型
interface TreeNodeData {
  id: number | null
  title: string
  key: number | null
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
const importLoading = ref(false)
const exportLoading = ref(false)
const searchKeyword = ref('')
const selectedKeys = ref<(number | null)[]>([])
const expandedKeys = ref<(number | null)[]>([])

// 分类数据
const categoryList = ref<CategoryItem[]>([]) // 完整数据（包含根节点）
const rootCategory = ref<CategoryItem | null>(null) // 根节点引用
const selectedCategory = ref<CategoryItem | null>(null)
// 编辑状态
const isEdit = ref(false)
// 保存新建的分类ID
const newCategoryIds = ref<number[]>([])
// Tooltip显示状态
const showTooltip = ref(false)

// 计算当前选中的分类是否是未保存的新节点
const isNewUnsavedCategory = computed(() => {
  if (!selectedCategory.value || !selectedCategory.value.id) return false
  return newCategoryIds.value.includes(selectedCategory.value.id)
})

// 上传文件类型定义
interface UploadFile {
  uid: string
  name: string
  status: 'uploading' | 'done' | 'error' | 'removed'
  url?: string
}

// 文件上传相关
const iconFileList = ref<UploadFile[]>([])
const uploadLoading = ref(false)

// 表单相关
const formRef = ref<FormInstance>()
const formData = reactive({
  id: null as number | null,
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
    id: category.id ?? null,
    title: category.name,
    key: category.id ?? null,
    isActive: category.isActive,
    goodsCount: category.goodsCount || 0,
    level: category.level,
    parentId: category.parentId,
    children: category.children ? convertToTreeData(category.children) : undefined,
    // 叶子节点判断：level === 10 或没有子节点
    isLeaf: category.level === 10 || !category.children || category.children.length === 0,
  }))
}

// 获取显示用的分类列表（过滤掉根节点）
const getHideRootNodeCategories = (categories: CategoryItem[]): CategoryItem[] => {
  // 如果有根节点，返回其子节点；否则返回空数组
  if (rootCategory.value && rootCategory.value.children && rootCategory.value.children.length > 0) {
    return rootCategory.value.children
  }
  // 注意：不能在这里调用 message.error()，因为这个函数被 computed 调用，会导致无限循环
  return []
}

// 过滤后的树形数据
const filteredTreeData = computed(() => {
  const displayCategories = getHideRootNodeCategories(categoryList.value)
  
  if (!searchKeyword.value.trim()) {
    return convertToTreeData(displayCategories)
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

  return convertToTreeData(filterCategories(displayCategories))
})

// 图标缩略图（通过 AuthImage 组件自动处理路径转换）
const iconPreviewUrl = computed(() => {
  return formData.icon || ''
})

// 上级分类选项
const parentCategoryOptions = computed(() => {
  const options: TreeSelectOption[] = []
  
  // 如果有根节点，先添加根节点选项（用于一级分类）
  if (rootCategory.value) {
    options.push({
      value: rootCategory.value.id ?? null,
      title: rootCategory.value.name,
      key: rootCategory.value.id ?? null,
      children: undefined, // 根节点不显示子节点，避免递归
    })
  }
  
  // 构建其他分类的选项树
  const buildTreeOptions = (categories: CategoryItem[], excludeId?: number | null): TreeSelectOption[] => {
    return categories
      .filter((cat) => cat.level > 0 && cat.level <= 9 && cat.id !== excludeId) // 只显示1-9级作为父级选项，排除当前编辑的分类
      .map((cat) => ({
        value: cat.id ?? null,
        title: cat.name,
        key: cat.id ?? null,
        children: cat.children ? buildTreeOptions(cat.children, excludeId) : undefined,
      }))
  }
  
  // 添加其他分类选项
  const displayCategories = getHideRootNodeCategories(categoryList.value)
  options.push(...buildTreeOptions(displayCategories, selectedCategory.value?.id ?? null))
  
  return options
})

// 根据ID查找分类
const findCategoryById = (categories: CategoryItem[], id: number | null): CategoryItem | null => {
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

// 获取分类数据（所有层级，包含根节点）
const fetchCategoryData = async () => {
  loading.value = true
  try {
    // 从根节点（parentId=0）获取所有层级的分类数据
    const data = await getCategoryList(0)

    // 识别并保存根节点（第一层只有一个节点）
    if (data.length !== 1) {
      message.error('数据格式错误：根节点必须且只能有一个')
      return
    }
    
    if (data[0].level !== 0) {
      message.error('数据格式错误：根节点的 level 必须为 0')
      return
    }
    
    // 保存完整的数据（包含根节点）
    categoryList.value = data
    
    // rootCategory 必须指向 categoryList 中的根节点
    rootCategory.value = categoryList.value[0] 

    // 默认展开一级分类（界面上的一级分类，实际是level=1）
    const displayCategories = getHideRootNodeCategories(categoryList.value)
    const getFirstLevelKeys = (categories: CategoryItem[]): (number | null)[] => {
      return categories.filter((cat) => cat.level === 1).map((cat) => cat.id ?? null)
    }
    expandedKeys.value = getFirstLevelKeys(displayCategories)
  } catch (error) {
    console.error('获取分类数据失败:', error)
    message.error('获取分类数据失败')
  } finally {
    loading.value = false
  }
}

// 填充表单数据
const fillFormData = (category: CategoryItem) => {
  formData.id = category.id
  formData.name = category.name
  // 保持实际的 parentId（包括根节点 ID）
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
  formData.id = null
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
const handleTreeSelect = (selectedKeys: (number | null)[]) => {
  if (selectedKeys.length > 0) {
    const categoryId = selectedKeys[0] ?? null
    if (categoryId) {
      const category = findCategoryById(categoryList.value, categoryId)
      if (category) {
        selectedCategory.value = category
        fillFormData(category)
        isEdit.value = true
      }
    }
  } else {
    selectedCategory.value = null
    resetFormData()
    isEdit.value = false
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
const handleAddPrimaryCategory = () => {
  if (!rootCategory.value || !rootCategory.value.id) {
    message.error('未找到根分类节点')
    return
  }
  selectedCategory.value = null
  resetFormData()
  handleAddCategory(rootCategory.value.id, 1)
}

// 新建分类
const handleAddCategory = (parentId: number, level: number) => {
  const newId = getUniqueId()
  const newCategory: CategoryItem = {
    id: newId,
    name: '新建分类',
    parentId: parentId,
    level: level,
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
  }

  // 查找父分类并添加子节点
  const parentCategory = findCategoryById(categoryList.value, parentId)
  if (parentCategory) {
    if (!parentCategory.children) {
      parentCategory.children = []
    }
    parentCategory.children.push(newCategory)
    
    // 更新 hasChildren 标记
    parentCategory.hasChildren = true
  } else {
    message.error('未找到父分类')
    return
  }

  newCategoryIds.value.push(newId)
  selectedKeys.value = [newId]
  
  // 触发响应式更新（创建新数组引用，但保持对象引用不变）
  categoryList.value = [...categoryList.value]
  
  // 选中新建的分类
  selectedCategory.value = newCategory
  fillFormData(newCategory)
  isEdit.value = true
}

// 新建子分类
const handleAddSubCategory = () => {
  if (!selectedCategory.value) return
  if (!selectedCategory.value.id) return
  if (selectedCategory.value.level >= 10) return
  // 检查是否是未保存的新节点
  if (isNewUnsavedCategory.value) {
    message.warning('请先保存新节点')
    return
  }
  resetFormData()
  handleAddCategory(selectedCategory.value.id, selectedCategory.value.level + 1)
}

// 保存分类
const handleSave = async () => {
  if (formData.id === null) {
    message.error('请先新建分类')
    return
  }
  
  if (!rootCategory.value || !rootCategory.value.id) {
    message.error('未找到根分类节点')
    return
  }
  
  // 验证 parentId
  if (!formData.parentId) {
    message.error('请选择上级分类')
    return
  }
  
  try {
    await formRef.value?.validateFields()
    saveLoading.value = true

    const categoryData: CategoryCreateParams = {
      id: formData.id ?? null,
      name: formData.name,
      parentId: formData.parentId, // 直接使用 formData.parentId，不做转换
      level: formData.level,
      sortOrder: formData.sortOrder,
      icon: formData.icon,
      description: formData.description,
      isActive: formData.isActive,
      seoTitle: formData.seoTitle,
      seoKeywords: formData.seoKeywords,
      seoDescription: formData.seoDescription,
    }

    const isNewCategory = newCategoryIds.value.includes(formData.id)
    
    if (isNewCategory) {
      await addCategory(categoryData)
      // 保存成功后，从新建ID列表中移除
      newCategoryIds.value = newCategoryIds.value.filter(id => id !== formData.id)
      message.success('新建成功')
    } else {
      await updateCategory(categoryData)
      message.success('更新成功')
    }

    // 刷新数据
    await fetchCategoryData()
    
    // 如果是新建分类，清空选中状态和表单（因为临时ID已被替换）
    if (isNewCategory) {
      selectedKeys.value = []
      selectedCategory.value = null
      resetFormData()
    }
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

// Excel导入前验证
const handleBeforeUpload = (file: File) => {
  const isExcel =
    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.type === 'application/vnd.ms-excel' ||
    file.name.endsWith('.xlsx') ||
    file.name.endsWith('.xls')

  if (!isExcel) {
    message.error('只能上传Excel文件（.xlsx或.xls格式）')
    return false
  }

  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    message.error('文件大小不能超过 10MB')
    return false
  }

  return true
}

// 上传选项类型定义
interface UploadRequestOption {
  file: File
  onSuccess: (response: any) => void
  onError: (error: Error) => void
}

// Excel导入处理
const handleExcelImport = async (options: UploadRequestOption) => {
  const { file, onSuccess, onError } = options

  try {
    importLoading.value = true
    message.loading({ content: '正在导入分类数据，请稍候...', key: 'import', duration: 0 })

    // 调用导入接口，30秒超时
    const result = await importCategoriesFromExcel(file)

    message.success({ content: '导入成功！', key: 'import', duration: 2 })
    onSuccess(result)

    // 刷新分类数据
    await fetchCategoryData()
  } catch (error: any) {
    console.error('Excel导入失败:', error)
    
    // 判断是否是超时错误
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      message.error({ content: '导入超时（30秒），请检查文件大小或网络连接', key: 'import', duration: 3 })
    } else {
      message.error({ content: error.message || '导入失败，请检查文件格式', key: 'import', duration: 3 })
    }
    
    onError(error)
  } finally {
    importLoading.value = false
  }
}

// Excel导出处理
const handleExcelExport = async () => {
  try {
    exportLoading.value = true
    message.loading({ content: '正在导出分类数据，请稍候...', key: 'export', duration: 0 })

    // 调用导出接口
    const blob = await exportCategoriesToExcel()

    // 创建下载链接
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `商品分类_${new Date().getTime()}.xlsx`
    document.body.appendChild(link)
    link.click()

    // 清理
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    message.success({ content: '导出成功！', key: 'export', duration: 2 })
  } catch (error: any) {
    console.error('Excel导出失败:', error)
    
    // 判断是否是超时错误
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      message.error({ content: '导出超时（30秒），数据量过大', key: 'export', duration: 3 })
    } else {
      message.error({ content: error.message || '导出失败，请稍后重试', key: 'export', duration: 3 })
    }
  } finally {
    exportLoading.value = false
  }
}

// 文件上传前验证
const beforeIconUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件!')
    return false
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 上传选项类型定义
interface UploadOptions {
  file: File
  onSuccess: (response: string, file: File) => void
  onError: (error: Error, file: File) => void
  onProgress: (event: { percent: number }) => void
}

// 自定义上传处理
const handleIconUpload = async (options: UploadOptions) => {
  const { file, onSuccess, onError, onProgress } = options

  try {
    uploadLoading.value = true
    onProgress({ percent: 50 })

    const imageUrl = await uploadCategoryImage(file)
    formData.icon = imageUrl

    onProgress({ percent: 100 })
    onSuccess(imageUrl, file)
    message.success('图片上传成功')
  } catch (error) {
    console.error('上传失败:', error)
    const uploadError = error instanceof Error ? error : new Error('上传失败')
    onError(uploadError, file)
    message.error('图片上传失败')
  } finally {
    uploadLoading.value = false
  }
}

// 移除图片
const handleIconRemove = () => {
  formData.icon = ''
  iconFileList.value = []
  return true
}

// 监听选中的分类变化
watch(selectedCategory, (selectedCategory) => {
  if (selectedCategory) {
    selectedKeys.value = selectedCategory.id ? [selectedCategory.id ?? null] : []
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

:deep(.ant-upload-select-picture-card) {
  width: 104px;
  height: 104px;
}

:deep(.ant-upload-list-picture-card-container) {
  width: 104px;
  height: 104px;
}

/* 自定义上传预览样式 */
.custom-upload-preview {
  margin-top: 8px;
}

.upload-preview-item {
  position: relative;
  display: inline-block;
  width: 104px;
  height: 104px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fafafa;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-preview-actions {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.upload-preview-item:hover .upload-preview-actions {
  opacity: 1;
}

.remove-btn {
  color: #fff !important;
  border-color: transparent !important;
}

.remove-btn:hover {
  color: #ff4d4f !important;
  background-color: rgba(255, 255, 255, 0.2) !important;
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
