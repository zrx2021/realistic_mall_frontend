<template>
  <a-modal
    v-model:open="localOpen"
    :title="isEdit ? '编辑商品' : '新建商品'"
    :width="1000"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :destroyOnClose="true"
  >
    <a-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
      layout="horizontal"
    >
      <!-- 基本信息 -->
      <a-divider orientation="left">基本信息</a-divider>

      <a-form-item label="SPU编码" name="spuCode" required>
        <a-input
          v-model:value="formData.spuCode"
          allow-clear
          :disabled="isEdit"
        />
      </a-form-item>

      <a-form-item label="商品名称" name="name" required>
        <a-input
          v-model:value="formData.name"
          placeholder="请输入商品名称"
          allow-clear
          :maxlength="255"
          show-count
        />
      </a-form-item>

      <a-form-item label="商品副标题" name="subTitle">
        <a-input
          v-model:value="formData.subTitle"
          placeholder="请输入商品副标题/卖点"
          allow-clear
          :maxlength="500"
          show-count
        />
      </a-form-item>

      <a-form-item label="商品类型" name="goodsType" required>
        <a-radio-group v-model:value="formData.goodsType">
          <a-radio :value="1">实物商品</a-radio>
          <a-radio :value="2">虚拟商品</a-radio>
          <a-radio :value="3">服务商品</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="商品分类" name="categoryId" required>
        <a-tree-select
          v-model:value="formData.categoryId"
          placeholder="请选择商品分类"
          style="width: 100%"
          allow-clear
          :tree-data="categoryOptions"
          :field-names="{ label: 'name', value: 'id', children: 'children' }"
        />
      </a-form-item>

      <a-form-item label="商品品牌" name="brandId">
        <a-select
          v-model:value="formData.brandId"
          placeholder="请选择品牌"
          allow-clear
          show-search
          :filter-option="filterBrandOption"
        >
          <a-select-option v-for="brand in brandOptions" :key="brand.id" :value="brand.id">
            {{ brand.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="供应商" name="supplierId">
        <a-select
          v-model:value="formData.supplierId"
          placeholder="请选择供应商（可选）"
          allow-clear
          show-search
        >
          <a-select-option v-for="supplier in supplierOptions" :key="supplier.id" :value="supplier.id">
            {{ supplier.name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <!-- 价格信息 -->
      <a-divider orientation="left">价格信息</a-divider>

      <a-form-item label="市场价" name="marketPrice" required>
        <a-input-number
          v-model:value="formData.marketPrice"
          placeholder="请输入市场价"
          :min="0"
          :precision="2"
          style="width: 100%"
          :formatter="(value: string | number) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :parser="(value: string) => value!.replace(/¥\s?|(,*)/g, '')"
        />
      </a-form-item>

      <a-form-item label="销售价格" name="minPrice" required>
        <a-input-number
          v-model:value="formData.minPrice"
          placeholder="请输入销售价格"
          :min="0"
          :precision="2"
          style="width: 100%"
          :formatter="(value: string | number) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :parser="(value: string) => value!.replace(/¥\s?|(,*)/g, '')"
        />
      </a-form-item>

      <a-form-item label="成本价" name="costPrice">
        <a-input-number
          v-model:value="formData.costPrice"
          placeholder="请输入成本价"
          :min="0"
          :precision="2"
          style="width: 100%"
          :formatter="(value: string | number) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
          :parser="(value: string) => value!.replace(/¥\s?|(,*)/g, '')"
        />
      </a-form-item>

      <!-- 库存信息 -->
      <a-divider orientation="left">库存信息</a-divider>

      <a-form-item label="商品库存" name="totalStock" required>
        <a-input-number
          v-model:value="formData.totalStock"
          placeholder="请输入商品库存"
          :min="0"
          style="width: 100%"
        />
      </a-form-item>

      <a-form-item label="库存预警值" name="warningStock">
        <a-input-number
          v-model:value="formData.warningStock"
          placeholder="库存低于此值时预警"
          :min="0"
          style="width: 100%"
        />
      </a-form-item>

      <!-- 商品规格 -->
      <a-divider orientation="left">商品规格</a-divider>

      <a-form-item label="商品单位" name="unit" required>
        <a-input v-model:value="formData.unit" placeholder="如：件、台、盒等" allow-clear />
      </a-form-item>

      <a-form-item label="商品重量" name="weight">
        <a-input-number
          v-model:value="formData.weight"
          placeholder="单位：kg"
          :min="0"
          :precision="3"
          style="width: 100%"
          addon-after="kg"
        />
      </a-form-item>

      <a-form-item label="商品体积" name="volume">
        <a-input-number
          v-model:value="formData.volume"
          placeholder="单位：m³"
          :min="0"
          :precision="3"
          style="width: 100%"
          addon-after="m³"
        />
      </a-form-item>

      <a-form-item label="起购数量" name="minPurchase">
        <a-input-number
          v-model:value="formData.minPurchase"
          placeholder="最少购买数量"
          :min="1"
          style="width: 100%"
        />
      </a-form-item>

      <a-form-item label="限购数量" name="purchaseLimit">
        <a-input-number
          v-model:value="formData.purchaseLimit"
          placeholder="0表示不限购"
          :min="0"
          style="width: 100%"
        />
        <div style="color: #999; font-size: 12px; margin-top: 4px">
          0表示不限购
        </div>
      </a-form-item>

      <!-- 商品标签 -->
      <a-divider orientation="left">商品标签</a-divider>

      <a-form-item label="商品标签" name="tags">
        <a-checkbox-group v-model:value="formData.tags">
          <a-checkbox value="isHot">热销</a-checkbox>
          <a-checkbox value="isNew">新品</a-checkbox>
          <a-checkbox value="isRecommend">推荐</a-checkbox>
          <a-checkbox value="isGift">赠品</a-checkbox>
        </a-checkbox-group>
      </a-form-item>

      <a-form-item label="是否包邮" name="isFreeShipping">
        <a-switch
          v-model:checked="formData.isFreeShipping"
          checked-children="包邮"
          un-checked-children="不包邮"
        />
      </a-form-item>

      <a-form-item label="运费模板" name="shippingTemplateId" v-if="!formData.isFreeShipping">
        <a-select
          v-model:value="formData.shippingTemplateId"
          placeholder="请选择运费模板"
          allow-clear
        >
          <a-select-option :value="1">默认运费模板</a-select-option>
          <a-select-option :value="2">偏远地区运费模板</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="发货时间" name="deliveryTime">
        <a-input-number
          v-model:value="formData.deliveryTime"
          placeholder="承诺发货时间"
          :min="0"
          style="width: 100%"
          addon-after="小时"
        />
      </a-form-item>

      <!-- 商品图片 -->
      <a-divider orientation="left">商品图片</a-divider>

      <a-form-item label="商品主图" name="mainImage">
        <div style="color: #999; font-size: 12px; margin-bottom: 8px">
          建议尺寸：800x800像素，支持 JPG、PNG 格式，大小不超过 2MB
        </div>
        <div class="image-upload-container">
          <!-- 已上传的主图 -->
          <div v-if="formData.mainImage" class="image-preview-item">
            <AuthImage
              :src="formData.mainImage"
              alt="商品主图"
              class="preview-image"
              :force-auth="true"
            />
            <div class="image-actions">
              <a-button size="small" danger @click="handleMainImageRemove">删除</a-button>
            </div>
          </div>
          <!-- 上传按钮 -->
          <a-upload
            v-else
            :show-upload-list="false"
            accept="image/*"
            :custom-request="handleMainImageUpload"
            :before-upload="beforeImageUpload"
          >
            <div class="upload-button">
              <a-spin v-if="mainImageUploading" />
              <plus-outlined v-else />
              <div style="margin-top: 8px">
                {{ mainImageUploading ? '上传中...' : '上传主图' }}
              </div>
            </div>
          </a-upload>
        </div>
      </a-form-item>

      <a-form-item label="商品图片" name="images">
        <div style="color: #999; font-size: 12px; margin-bottom: 8px">
          最多上传8张，建议尺寸：800x800像素，可拖拽排序
        </div>
        <div class="images-upload-container">
          <!-- 已上传的图片列表 -->
          <div
            v-for="(image, index) in formData.images"
            :key="index"
            class="image-preview-item"
          >
            <AuthImage
              :src="image"
              :alt="`商品图${index + 1}`"
              class="preview-image"
              :force-auth="true"
            />
            <div class="image-actions">
              <a-button
                size="small"
                type="text"
                :disabled="index === 0"
                @click="handleImageMoveLeft(index)"
                title="左移"
              >
                <template #icon>
                  <left-outlined />
                </template>
              </a-button>
              <a-button
                size="small"
                type="text"
                :disabled="index === formData.images.length - 1"
                @click="handleImageMoveRight(index)"
                title="右移"
              >
                <template #icon>
                  <right-outlined />
                </template>
              </a-button>
              <a-button size="small" danger @click="handleImageRemove(index)">删除</a-button>
            </div>
            <div class="image-order-badge">{{ index + 1}}</div>
          </div>
          <!-- 上传按钮 -->
          <a-upload
            v-if="formData.images.length < 8"
            :show-upload-list="false"
            accept="image/*"
            :custom-request="handleImagesUpload"
            :before-upload="beforeImageUpload"
          >
            <div class="upload-button">
              <a-spin v-if="imagesUploading" />
              <plus-outlined v-else />
              <div style="margin-top: 8px">
                {{ imagesUploading ? '上传中...' : '上传图片' }}
              </div>
            </div>
          </a-upload>
        </div>
      </a-form-item>

      <!-- 商品描述 -->
      <a-divider orientation="left">商品描述</a-divider>

      <a-form-item label="商品描述" name="description">
        <a-textarea
          v-model:value="formData.description"
          placeholder="请输入商品详细描述"
          :rows="6"
          :maxlength="5000"
          show-count
          allow-clear
        />
        <div style="color: #999; font-size: 12px; margin-top: 4px">
          后续可使用富文本编辑器
        </div>
      </a-form-item>

      <a-form-item label="移动端描述" name="mobileDescription">
        <a-textarea
          v-model:value="formData.mobileDescription"
          placeholder="移动端商品描述（可选）"
          :rows="4"
          :maxlength="3000"
          show-count
          allow-clear
        />
      </a-form-item>

      <!-- SEO信息 -->
      <a-divider orientation="left">SEO优化（可选）</a-divider>

      <a-form-item label="SEO标题" name="seoTitle">
        <a-input
          v-model:value="formData.seoTitle"
          placeholder="搜索引擎显示标题"
          allow-clear
          :maxlength="200"
          show-count
        />
      </a-form-item>

      <a-form-item label="SEO关键词" name="seoKeywords">
        <a-input
          v-model:value="formData.seoKeywords"
          placeholder="多个关键词用逗号分隔"
          allow-clear
          :maxlength="500"
          show-count
        />
      </a-form-item>

      <a-form-item label="SEO描述" name="seoDescription">
        <a-textarea
          v-model:value="formData.seoDescription"
          placeholder="搜索引擎显示描述"
          :rows="3"
          :maxlength="500"
          show-count
          allow-clear
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons-vue'
import type { FormInstance } from 'ant-design-vue'
import {
  addGoods,
  updateGoods,
  getGoodsDetail,
  getGoodsCategories,
  getGoodsBrands,
  getGoodsSuppliers,
  uploadGoodsImage,
  type CategoryOption,
  type BrandOption,
  type SupplierOption,
  type GoodsInfo,
} from '@/api/goods'
import AuthImage from '@/components/common/AuthImage.vue'

// Props 定义
interface Props {
  open: boolean
  goodsId?: number | null
}

// Emits 定义
interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'success'): void
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  goodsId: null,
})

const emit = defineEmits<Emits>()

// 表单引用
const formRef = ref<FormInstance>()
const confirmLoading = ref(false)
const loading = ref(false)

// 是否为编辑模式
const isEdit = computed(() => !!props.goodsId)

// 本地 open 状态，实现双向绑定
const localOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

// 商品表单数据
const formData = reactive({
  spuCode: '',
  name: '',
  subTitle: '',
  goodsType: 1,
  categoryId: undefined as number | undefined,
  brandId: undefined as number | undefined,
  supplierId: undefined as number | undefined,
  marketPrice: 0,
  minPrice: 0,
  maxPrice: 0,
  costPrice: 0,
  totalStock: 0,
  warningStock: 10,
  unit: '件',
  weight: undefined as number | undefined,
  volume: undefined as number | undefined,
  minPurchase: 1,
  purchaseLimit: 0,
  tags: [] as string[],
  deliveryTime: 24,
  isFreeShipping: false,
  shippingTemplateId: undefined as number | undefined,
  mainImage: '',
  images: [] as string[],
  description: '',
  mobileDescription: '',
  seoTitle: '',
  seoKeywords: '',
  seoDescription: '',
  isHot: false,
  isNew: false,
  isRecommend: false,
  isGift: false,
})

// 分类选项
const categoryOptions = ref<CategoryOption[]>([])
// 品牌选项
const brandOptions = ref<BrandOption[]>([])
// 供应商选项
const supplierOptions = ref<SupplierOption[]>([])

// 图片上传相关
const mainImageUploading = ref(false)
const imagesUploading = ref(false)

// 表单验证规则
const formRules = {
  spuCode: [{ required: true, message: '请输入SPU编码', trigger: 'blur' }],
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 1, max: 200, message: '商品名称长度在1-200个字符', trigger: 'blur' },
  ],
  goodsType: [{ required: true, message: '请选择商品类型', trigger: 'change' }],
  categoryId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  marketPrice: [{ required: true, message: '请输入市场价', trigger: 'blur' }],
  minPrice: [{ required: true, message: '请输入销售价格', trigger: 'blur' }],
  totalStock: [{ required: true, message: '请输入商品库存', trigger: 'blur' }],
  unit: [{ required: true, message: '请输入商品单位', trigger: 'blur' }],
}

// 品牌筛选
const filterBrandOption = (input: string, option: { value: number; children: string }) => {
  return option.children.toLowerCase().includes(input.toLowerCase())
}

// 获取分类列表
const fetchCategories = async () => {
  try {
    const categories = await getGoodsCategories()
    categoryOptions.value = categories
  } catch (error) {
    console.error('获取分类列表失败:', error)
    message.error('获取分类列表失败')
  }
}

// 获取品牌列表
const fetchBrands = async () => {
  try {
    const brands = await getGoodsBrands()
    brandOptions.value = brands
  } catch (error) {
    console.error('获取品牌列表失败:', error)
    message.error('获取品牌列表失败')
  }
}

// 获取供应商列表
const fetchSuppliers = async () => {
  try {
    const suppliers = await getGoodsSuppliers()
    supplierOptions.value = suppliers
  } catch (error) {
    console.error('获取供应商列表失败:', error)
    // 供应商是可选的，失败不提示错误
    console.warn('供应商列表加载失败，使用空列表')
  }
}

// 文件上传前验证
const beforeImageUpload = (file: File) => {
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

// 定义上传选项类型
interface UploadOptions {
  file: File
  onSuccess: (response: any, file: File) => void
  onError: (error: Error, file: File) => void
  onProgress: (event: { percent: number }) => void
}

// 上传主图
const handleMainImageUpload = async (options: UploadOptions) => {
  const { file, onSuccess, onError, onProgress } = options

  try {
    mainImageUploading.value = true
    onProgress({ percent: 50 })

    const imageUrl = await uploadGoodsImage(file, 'goods')
    formData.mainImage = imageUrl

    onProgress({ percent: 100 })
    onSuccess(imageUrl, file)
    message.success('主图上传成功')
  } catch (error) {
    console.error('主图上传失败:', error)
    const uploadError = error instanceof Error ? error : new Error('主图上传失败')
    onError(uploadError, file)
    message.error('主图上传失败')
  } finally {
    mainImageUploading.value = false
  }
}

// 删除主图
const handleMainImageRemove = () => {
  formData.mainImage = ''
}

// 上传商品图片
const handleImagesUpload = async (options: UploadOptions) => {
  const { file, onSuccess, onError, onProgress } = options

  if (formData.images.length >= 8) {
    message.warning('最多只能上传8张商品图片')
    onError(new Error('最多只能上传8张商品图片'), file)
    return
  }

  try {
    imagesUploading.value = true
    onProgress({ percent: 50 })

    const imageUrl = await uploadGoodsImage(file, 'goods')
    formData.images.push(imageUrl)

    onProgress({ percent: 100 })
    onSuccess(imageUrl, file)
    message.success('图片上传成功')
  } catch (error) {
    console.error('图片上传失败:', error)
    const uploadError = error instanceof Error ? error : new Error('图片上传失败')
    onError(uploadError, file)
    message.error('图片上传失败')
  } finally {
    imagesUploading.value = false
  }
}

// 删除商品图片
const handleImageRemove = (index: number) => {
  formData.images.splice(index, 1)
}

// 图片排序 - 向左移动
const handleImageMoveLeft = (index: number) => {
  if (index > 0) {
    const temp = formData.images[index]
    formData.images[index] = formData.images[index - 1]
    formData.images[index - 1] = temp
  }
}

// 图片排序 - 向右移动
const handleImageMoveRight = (index: number) => {
  if (index < formData.images.length - 1) {
    const temp = formData.images[index]
    formData.images[index] = formData.images[index + 1]
    formData.images[index + 1] = temp
  }
}

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    spuCode: '',
    name: '',
    subTitle: '',
    goodsType: 1,
    categoryId: undefined,
    brandId: undefined,
    supplierId: undefined,
    marketPrice: 0,
    minPrice: 0,
    maxPrice: 0,
    costPrice: 0,
    totalStock: 0,
    warningStock: 10,
    unit: '件',
    weight: undefined,
    volume: undefined,
    minPurchase: 1,
    purchaseLimit: 0,
    tags: [],
    deliveryTime: 24,
    isFreeShipping: false,
    shippingTemplateId: undefined,
    mainImage: '',
    images: [],
    description: '',
    mobileDescription: '',
    seoTitle: '',
    seoKeywords: '',
    seoDescription: '',
    isHot: false,
    isNew: false,
    isRecommend: false,
    isGift: false,
  })
  formRef.value?.resetFields()
}

// 填充表单数据
const fillFormData = (data: GoodsInfo) => {
  // 处理标签
  const tags: string[] = []
  if (data.isHot) tags.push('isHot')
  if (data.isNew) tags.push('isNew')
  if (data.isRecommend) tags.push('isRecommend')
  if (data.isGift) tags.push('isGift')

  Object.assign(formData, {
    spuCode: data.spuCode || '',
    name: data.name || '',
    subTitle: data.subTitle || '',
    goodsType: data.goodsType || 1,
    categoryId: data.categoryId,
    brandId: data.brandId,
    supplierId: data.supplierId,
    marketPrice: data.marketPrice || 0,
    minPrice: data.minPrice || 0,
    maxPrice: data.maxPrice || 0,
    costPrice: data.costPrice || 0,
    totalStock: data.totalStock || 0,
    warningStock: data.warningStock || 0,
    unit: data.unit || '件',
    weight: data.weight,
    volume: data.volume,
    minPurchase: data.minPurchase || 1,
    purchaseLimit: data.purchaseLimit || 0,
    tags: tags,
    deliveryTime: data.deliveryTime || 24,
    isFreeShipping: data.isFreeShipping || false,
    shippingTemplateId: data.shippingTemplateId,
    mainImage: data.mainImage || '',
    images: JSON.parse(data.images || '[]'),
    description: data.description || '',
    mobileDescription: data.mobileDescription || '',
    seoTitle: data.seoTitle || '',
    seoKeywords: data.seoKeywords || '',
    seoDescription: data.seoDescription || '',
    isHot: data.isHot || false,
    isNew: data.isNew || false,
    isRecommend: data.isRecommend || false,
    isGift: data.isGift || false,
  })
}

// 获取商品详情
const fetchGoodsDetail = async (id: number) => {
  loading.value = true
  try {
    const detail = await getGoodsDetail(id)
    fillFormData(detail)
  } catch (error) {
    console.error('获取商品详情失败:', error)
    message.error('获取商品详情失败')
  } finally {
    loading.value = false
  }
}

// 确定按钮处理
const handleOk = async () => {
  try {
    await formRef.value?.validateFields()
    confirmLoading.value = true

    // 处理标签
    const tags = formData.tags
    const goodsData = {
      id: props.goodsId || undefined,
      spuCode: formData.spuCode || undefined, // 空字符串转为undefined
      name: formData.name,
      subTitle: formData.subTitle || undefined,
      goodsType: formData.goodsType,
      categoryId: formData.categoryId!,
      brandId: formData.brandId,
      supplierId: formData.supplierId,
      marketPrice: formData.marketPrice,
      minPrice: formData.minPrice,
      maxPrice: formData.minPrice, // 暂时使用相同的价格
      costPrice: formData.costPrice,
      totalStock: formData.totalStock,
      availableStock: formData.totalStock,
      warningStock: formData.warningStock,
      unit: formData.unit,
      weight: formData.weight,
      volume: formData.volume,
      minPurchase: formData.minPurchase,
      purchaseLimit: formData.purchaseLimit,
      deliveryTime: formData.deliveryTime,
      isFreeShipping: formData.isFreeShipping,
      shippingTemplateId: formData.shippingTemplateId,
      mainImage: formData.mainImage || undefined,
      images: formData.images.length > 0 ? JSON.stringify(formData.images) : undefined,
      description: formData.description || undefined,
      mobileDescription: formData.mobileDescription || undefined,
      seoTitle: formData.seoTitle || undefined,
      seoKeywords: formData.seoKeywords || undefined,
      seoDescription: formData.seoDescription || undefined,
      isHot: tags.includes('isHot'),
      isNew: tags.includes('isNew'),
      isRecommend: tags.includes('isRecommend'),
      isGift: tags.includes('isGift'),
      status: 0, // 默认下架状态
      auditStatus: 0, // 待审核
    }

    if (isEdit.value && props.goodsId) {
      await updateGoods(goodsData)
      message.success('商品更新成功')
    } else {
      await addGoods(goodsData as any)
      message.success('商品创建成功')
    }

    emit('success')
    localOpen.value = false
    resetForm()
  } catch (error) {
    console.error('保存失败:', error)
    if (error instanceof Error && error.message && !error.message.includes('validate')) {
      message.error('保存失败: ' + error.message)
    }
  } finally {
    confirmLoading.value = false
  }
}

// 取消按钮处理
const handleCancel = () => {
  localOpen.value = false
  resetForm()
}

// 监听弹窗打开状态
watch(
  () => props.open,
  async (newVal) => {
    if (newVal) {
      // 加载分类、品牌和供应商数据
      await Promise.all([fetchCategories(), fetchBrands()])

      if (isEdit.value && props.goodsId) {
        // 编辑模式：加载商品详情
        await fetchGoodsDetail(props.goodsId)
      } else {
        // 新建模式：重置表单
        resetForm()
      }
    }
  },
)

// 组件挂载时加载分类、品牌和供应商
onMounted(() => {
  fetchCategories()
  fetchBrands()
})
</script>

<style scoped>
:deep(.ant-divider-horizontal.ant-divider-with-text-left) {
  margin: 24px 0 16px 0;
}

:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-form-item-label) {
  font-weight: 500;
}

/* 图片上传容器 */
.image-upload-container {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.images-upload-container {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* 图片预览项 */
.image-preview-item {
  position: relative;
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
  display: block;
}

/* 图片操作按钮 */
.image-actions {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-preview-item:hover .image-actions {
  opacity: 1;
}

.image-actions .ant-btn {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.3);
}

.image-actions .ant-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.image-actions .ant-btn-dangerous {
  color: #fff;
  background-color: rgba(255, 77, 79, 0.8);
  border-color: transparent;
}

.image-actions .ant-btn-dangerous:hover {
  background-color: rgba(255, 77, 79, 1);
}

/* 图片序号标记 */
.image-order-badge {
  position: absolute;
  top: 4px;
  left: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

/* 上传按钮 */
.upload-button {
  width: 104px;
  height: 104px;
  border: 1px dashed #d9d9d9;
  border-radius: 8px;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  color: rgba(0, 0, 0, 0.45);
}

.upload-button:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.upload-button .anticon {
  font-size: 24px;
}
</style>

