<template>
  <a-modal
    :open="open"
    :title="isEdit ? '编辑品牌' : '新建品牌'"
    :width="800"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      layout="horizontal"
    >
      <!-- 基本信息 -->
      <a-divider orientation="left">基本信息</a-divider>

      <a-form-item label="品牌名称" name="name" required>
        <a-input v-model:value="formData.name" placeholder="请输入品牌名称" allow-clear />
      </a-form-item>

      <a-form-item label="品牌英文名" name="englishName">
        <a-input
          v-model:value="formData.englishName"
          placeholder="请输入品牌英文名称"
          allow-clear
        />
      </a-form-item>

      <a-form-item label="品牌LOGO" name="logo">
        <a-upload
          v-model:file-list="logoFileList"
          :custom-request="handleLogoUpload"
          :before-upload="beforeLogoUpload"
          list-type="picture-card"
          :max-count="1"
          accept="image/*"
          @remove="handleLogoRemove"
          :show-upload-list="false"
        >
          <div v-if="!formData.logo">
            <PlusOutlined />
            <div style="margin-top: 8px">上传LOGO</div>
          </div>
          <div v-else class="custom-upload-preview">
            <div class="upload-preview-item">
              <AuthImage
                :src="logoPreviewUrl"
                alt="品牌LOGO"
                class="preview-image"
                :force-auth="true"
              />
              <div class="upload-preview-actions">
                <a-button size="small" class="remove-btn" @click.stop="handleLogoRemove"
                  >移除</a-button
                >
              </div>
            </div>
          </div>
        </a-upload>
        <div style="color: #999; font-size: 12px; margin-top: 8px">
          建议尺寸：200x200像素，支持 JPG、PNG 格式，大小不超过 2MB
        </div>
      </a-form-item>

      <a-form-item label="品牌描述" name="description">
        <a-textarea
          v-model:value="formData.description"
          placeholder="请输入品牌描述"
          :rows="4"
          :maxlength="500"
          show-count
          allow-clear
        />
      </a-form-item>

      <!-- 扩展信息 -->
      <a-divider orientation="left">扩展信息</a-divider>

      <a-form-item label="品牌官网" name="website">
        <a-input
          v-model:value="formData.website"
          placeholder="请输入品牌官网地址，如：https://www.example.com"
          allow-clear
        />
      </a-form-item>

      <a-form-item label="品牌国家" name="country">
        <a-select
          v-model:value="formData.country"
          placeholder="请选择品牌所属国家/地区"
          show-search
          allow-clear
          :filter-option="filterCountryOption"
        >
          <a-select-option v-for="country in countryOptions" :key="country" :value="country">
            {{ country }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="排序权重" name="sortOrder">
        <a-input-number
          v-model:value="formData.sortOrder"
          placeholder="数值越大越靠前"
          :min="0"
          :max="9999"
          style="width: 100%"
        />
        <div style="color: #999; font-size: 12px; margin-top: 4px">
          数值越大，品牌在列表中的排序越靠前
        </div>
      </a-form-item>

      <a-form-item label="启用状态" name="isActive">
        <a-switch
          v-model:checked="formData.isActive"
          checked-children="启用"
          un-checked-children="禁用"
        />
        <div style="color: #999; font-size: 12px; margin-top: 4px">
          禁用后，该品牌将不会在前台显示
        </div>
      </a-form-item>

      <!-- 系统信息（编辑时显示） -->
      <template v-if="isEdit">
        <a-divider orientation="left">系统信息</a-divider>

        <a-form-item label="品牌ID">
          <a-input :value="formData.id" disabled />
        </a-form-item>

        <a-form-item label="创建时间">
          <a-input :value="formData.createdTime" disabled />
        </a-form-item>

        <a-form-item label="更新时间">
          <a-input :value="formData.updatedTime" disabled />
        </a-form-item>
      </template>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import type { FormInstance } from 'ant-design-vue'
import AuthImage from '@/components/common/AuthImage.vue'
import { addBrand, updateBrand, uploadBrandLogo } from '@/api/brand'

// 表单验证规则类型
interface Rule {
  required?: boolean
  message?: string
  trigger?: string | string[]
  min?: number
  max?: number
  type?: string
  pattern?: RegExp
}

// Props 定义
interface Props {
  open: boolean
  brandId?: number | null
  brandData?: BrandFormData | null
}

// Emits 定义
interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'success'): void
}

// 品牌表单数据接口
export interface BrandFormData {
  id?: number
  name: string
  englishName?: string
  logo?: string
  description?: string
  website?: string
  country?: string
  sortOrder: number
  isActive: boolean
  createdTime?: string
  updatedTime?: string
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  brandId: null,
  brandData: null,
})

const emit = defineEmits<Emits>()

// 表单引用
const formRef = ref<FormInstance>()
const confirmLoading = ref(false)

// 是否为编辑模式
const isEdit = computed(() => !!props.brandId || !!props.brandData?.id)

// 上传文件列表
interface UploadFile {
  uid: string
  name: string
  status: 'uploading' | 'done' | 'error' | 'removed'
  url?: string
}

const logoFileList = ref<UploadFile[]>([])

// 表单数据
const formData = reactive<BrandFormData>({
  name: '',
  englishName: '',
  logo: '',
  description: '',
  website: '',
  country: '',
  sortOrder: 0,
  isActive: true,
})

// 国家/地区选项
const countryOptions = [
  '中国',
  '美国',
  '日本',
  '韩国',
  '德国',
  '法国',
  '英国',
  '意大利',
  '西班牙',
  '荷兰',
  '瑞士',
  '瑞典',
  '丹麦',
  '芬兰',
  '挪威',
  '澳大利亚',
  '新西兰',
  '加拿大',
  '巴西',
  '印度',
  '新加坡',
  '马来西亚',
  '泰国',
  '越南',
  '其他',
]

// 国家筛选函数
const filterCountryOption = (input: string, option: { value: string }) => {
  return option.value.toLowerCase().includes(input.toLowerCase())
}

// 表单验证规则
const formRules: Record<string, Rule[]> = {
  name: [
    { required: true, message: '请输入品牌名称', trigger: 'blur' },
    { min: 1, max: 100, message: '品牌名称长度在1-100个字符', trigger: 'blur' },
  ],
  englishName: [{ max: 200, message: '英文名称长度不能超过200个字符', trigger: 'blur' }],
  description: [{ max: 500, message: '描述长度不能超过500个字符', trigger: 'blur' }],
  website: [
    { max: 255, message: 'URL长度不能超过255个字符', trigger: 'blur' },
    {
      pattern: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
      message: '请输入有效的网址',
      trigger: 'blur',
    },
  ],
  country: [{ max: 50, message: '国家名称长度不能超过50个字符', trigger: 'blur' }],
  sortOrder: [
    { required: true, message: '请输入排序权重', trigger: 'blur' },
    { type: 'number', min: 0, max: 9999, message: '排序权重范围0-9999', trigger: 'blur' },
  ],
}

// LOGO预览URL
const logoPreviewUrl = computed(() => {
  const src = formData.logo || ''
  if (!src) return ''

  // 绝对地址 -> 取 pathname，并移除前导 /api
  if (src.startsWith('http://') || src.startsWith('https://')) {
    try {
      const url = new URL(src)
      const pathname = url.pathname || ''
      return pathname.startsWith('/api/') ? pathname.slice(4) : pathname
    } catch (e) {
      // 非法 URL，继续按下方逻辑处理
    }
  }

  // 以 /api/ 开头 -> 去掉 /api 前缀
  if (src.startsWith('/api/')) {
    return src.slice(4)
  }

  // 已是标准后端文件访问路径
  if (src.startsWith('/file/image/')) {
    return src
  }

  // 去掉可能缺失的前导斜杠
  if (src.startsWith('file/image/')) {
    return `/${src}`
  }

  // 仅携带了分类段
  if (src.startsWith('goods/brands/') || src.startsWith('goods%20brands/')) {
    return `/file/image/${src}`
  }

  // 纯文件路径（如 '2025/08/21/xxx.png'）
  return `/file/image/goods/brands/${src}`
})

// 文件上传前验证
const beforeLogoUpload = (file: File) => {
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
const handleLogoUpload = async (options: UploadOptions) => {
  const { file, onSuccess, onError, onProgress } = options

  try {
    onProgress({ percent: 50 })

    // 调用真实的上传 API
    const imageUrl = await uploadBrandLogo(file)
    formData.logo = imageUrl

    onProgress({ percent: 100 })
    onSuccess(imageUrl, file)
    message.success('图片上传成功')
  } catch (error) {
    console.error('上传失败:', error)
    const uploadError = error instanceof Error ? error : new Error('上传失败')
    onError(uploadError, file)
    message.error('图片上传失败')
  }
}

// 移除LOGO
const handleLogoRemove = () => {
  formData.logo = ''
  logoFileList.value = []
  return true
}

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    name: '',
    englishName: '',
    logo: '',
    description: '',
    website: '',
    country: '',
    sortOrder: 0,
    isActive: true,
  })
  logoFileList.value = []
  formRef.value?.resetFields()
}

// 填充表单数据
const fillFormData = (data: BrandFormData) => {
  Object.assign(formData, {
    id: data.id,
    name: data.name || '',
    englishName: data.englishName || '',
    logo: data.logo || '',
    description: data.description || '',
    website: data.website || '',
    country: data.country || '',
    sortOrder: data.sortOrder || 0,
    isActive: data.isActive !== undefined ? data.isActive : true,
    createdTime: data.createdTime || '',
    updatedTime: data.updatedTime || '',
  })
}

// 确定按钮处理
const handleOk = async () => {
  try {
    await formRef.value?.validateFields()
    confirmLoading.value = true

    const brandData = {
      name: formData.name,
      englishName: formData.englishName,
      logo: formData.logo,
      description: formData.description,
      website: formData.website,
      country: formData.country,
      sortOrder: formData.sortOrder,
      isActive: formData.isActive,
    }

    if (isEdit.value && formData.id) {
      await updateBrand(formData.id, brandData)
      message.success('品牌更新成功')
    } else {
      await addBrand(brandData)
      message.success('品牌创建成功')
    }

    emit('success')
    emit('update:open', false)
    resetForm()
  } catch (error) {
    console.error('保存失败:', error)
    // 如果是表单验证错误，不显示错误提示
    if (error instanceof Error && error.message && !error.message.includes('validate')) {
      message.error('保存失败: ' + error.message)
    }
  } finally {
    confirmLoading.value = false
  }
}

// 取消按钮处理
const handleCancel = () => {
  emit('update:open', false)
  resetForm()
}

// 监听弹窗打开状态
watch(
  () => props.open,
  (newVal) => {
    if (newVal) {
      if (props.brandData) {
        fillFormData(props.brandData)
      } else {
        resetForm()
      }
    }
  },
)
</script>

<style scoped>
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
</style>

