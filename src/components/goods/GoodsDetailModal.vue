<template>
  <a-modal
    v-model:open="open"
    title="商品详情"
    width="1200px"
    :footer="null"
    :destroyOnClose="true"
    :maskClosable="false"
  >
    <div v-if="goodsDetail" class="goods-detail-container">
      <!-- 基础信息区域 -->
      <a-card title="基础信息" size="small" style="margin-bottom: 16px">
        <a-row :gutter="[16, 16]">
          <a-col :span="8">
            <div class="detail-item">
              <span class="label">商品ID:</span>
              <span class="value">{{ goodsDetail.id }}</span>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="detail-item">
              <span class="label">SPU编码:</span>
              <span class="value code">{{ goodsDetail.spuCode }}</span>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="detail-item">
              <span class="label">商品类型:</span>
              <a-tag :color="getGoodsTypeColor(goodsDetail.goodsType)">
                {{ getGoodsTypeText(goodsDetail.goodsType) }}
              </a-tag>
            </div>
          </a-col>
          <a-col :span="24">
            <div class="detail-item">
              <span class="label">商品名称:</span>
              <span class="value title">{{ goodsDetail.name }}</span>
            </div>
          </a-col>
          <a-col :span="24" v-if="goodsDetail.subTitle">
            <div class="detail-item">
              <span class="label">副标题:</span>
              <span class="value subtitle">{{ goodsDetail.subTitle }}</span>
            </div>
          </a-col>
        </a-row>
      </a-card>

      <!-- 商品图片 -->
      <a-card title="商品图片" size="small" style="margin-bottom: 16px">
        <a-row :gutter="[12, 12]">
          <a-col :span="6" v-if="goodsDetail.mainImage">
            <div class="image-item">
              <AuthImage :src="goodsDetail.mainImage" alt="主图" class="goods-image" />
              <div class="image-label">主图</div>
            </div>
          </a-col>
          <a-col :span="6" v-for="(img, index) in goodsDetail.images?.slice(0, 7)" :key="index">
            <div class="image-item">
              <AuthImage :src="img" :alt="`商品图${index + 1}`" class="goods-image" />
              <div class="image-label">图{{ index + 1 }}</div>
            </div>
          </a-col>
        </a-row>
      </a-card>

      <!-- 分类和供应商信息 -->
      <a-card title="分类与供应商" size="small" style="margin-bottom: 16px">
        <a-row :gutter="[16, 16]">
          <a-col :span="8">
            <div class="detail-item">
              <span class="label">商品分类:</span>
              <span class="value">{{ goodsDetail.categoryName || '未分类' }}</span>
            </div>
          </a-col>
          <a-col :span="8" v-if="goodsDetail.brandName">
            <div class="detail-item">
              <span class="label">商品品牌:</span>
              <span class="value">{{ goodsDetail.brandName }}</span>
            </div>
          </a-col>
          <a-col :span="8" v-if="goodsDetail.supplierName">
            <div class="detail-item">
              <span class="label">供应商:</span>
              <span class="value">{{ goodsDetail.supplierName }}</span>
            </div>
          </a-col>
        </a-row>
      </a-card>

      <!-- 价格信息 -->
      <a-card title="价格信息" size="small" style="margin-bottom: 16px">
        <a-row :gutter="[16, 16]">
          <a-col :span="6">
            <div class="detail-item">
              <span class="label">销售价:</span>
              <span class="value price">¥{{ (goodsDetail.minPrice || 0).toFixed(2) }}</span>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="detail-item">
              <span class="label">市场价:</span>
              <span class="value">¥{{ (goodsDetail.marketPrice || 0).toFixed(2) }}</span>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="detail-item">
              <span class="label">成本价:</span>
              <span class="value">¥{{ (goodsDetail.costPrice || 0).toFixed(2) }}</span>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="detail-item">
              <span class="label">价格区间:</span>
              <span class="value">
                ¥{{ (goodsDetail.minPrice || 0).toFixed(2) }} - ¥{{
                  (goodsDetail.maxPrice || 0).toFixed(2)
                }}
              </span>
            </div>
          </a-col>
        </a-row>
      </a-card>

      <!-- 库存信息 -->
      <a-card title="库存信息" size="small" style="margin-bottom: 16px">
        <a-row :gutter="[16, 16]">
          <a-col :span="6">
            <div class="detail-item">
              <span class="label">总库存:</span>
              <span class="value" :class="{ 'stock-warning': isLowStock }">
                {{ goodsDetail.totalStock || 0 }}
              </span>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="detail-item">
              <span class="label">可用库存:</span>
              <span class="value">{{
                goodsDetail.availableStock || goodsDetail.totalStock || 0
              }}</span>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="detail-item">
              <span class="label">预警库存:</span>
              <span class="value">{{ goodsDetail.warningStock || 0 }}</span>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="detail-item">
              <span class="label">库存状态:</span>
              <a-tag :color="getStockStatusColor()">{{ getStockStatusText() }}</a-tag>
            </div>
          </a-col>
        </a-row>
      </a-card>

      <!-- 销售数据 -->
      <a-card title="销售数据" size="small" style="margin-bottom: 16px">
        <a-row :gutter="[16, 16]">
          <a-col :span="6">
            <div class="detail-item">
              <span class="label">销量:</span>
              <span class="value highlight">{{
                (goodsDetail.salesCount || 0).toLocaleString()
              }}</span>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="detail-item">
              <span class="label">浏览量:</span>
              <span class="value">{{ (goodsDetail.viewCount || 0).toLocaleString() }}</span>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="detail-item">
              <span class="label">收藏量:</span>
              <span class="value">{{ (goodsDetail.collectCount || 0).toLocaleString() }}</span>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="detail-item">
              <span class="label">评论数:</span>
              <span class="value">{{ goodsDetail.commentCount || 0 }}</span>
            </div>
          </a-col>
          <a-col :span="12">
            <div class="detail-item">
              <span class="label">好评率:</span>
              <span class="value">
                <a-progress
                  :percent="goodsDetail.goodCommentRate || 0"
                  :show-info="true"
                  size="small"
                  :format="(percent: number) => `${percent?.toFixed(1)}%`"
                />
              </span>
            </div>
          </a-col>
        </a-row>
      </a-card>

      <!-- 商品规格 -->
      <a-card title="商品规格" size="small" style="margin-bottom: 16px">
        <a-row :gutter="[16, 16]">
          <a-col :span="6">
            <div class="detail-item">
              <span class="label">商品单位:</span>
              <span class="value">{{ goodsDetail.unit || '件' }}</span>
            </div>
          </a-col>
          <a-col :span="6" v-if="goodsDetail.weight">
            <div class="detail-item">
              <span class="label">重量:</span>
              <span class="value">{{ goodsDetail.weight }}kg</span>
            </div>
          </a-col>
          <a-col :span="6" v-if="goodsDetail.volume">
            <div class="detail-item">
              <span class="label">体积:</span>
              <span class="value">{{ goodsDetail.volume }}m³</span>
            </div>
          </a-col>
          <a-col :span="6">
            <div class="detail-item">
              <span class="label">起购数量:</span>
              <span class="value"
                >{{ goodsDetail.minPurchase || 1 }}{{ goodsDetail.unit || '件' }}</span
              >
            </div>
          </a-col>
          <a-col :span="6" v-if="goodsDetail.purchaseLimit && goodsDetail.purchaseLimit > 0">
            <div class="detail-item">
              <span class="label">限购数量:</span>
              <span class="value warning"
                >{{ goodsDetail.purchaseLimit }}{{ goodsDetail.unit || '件' }}</span
              >
            </div>
          </a-col>
          <a-col :span="6">
            <div class="detail-item">
              <span class="label">发货时间:</span>
              <span class="value">{{ goodsDetail.deliveryTime || 24 }}小时</span>
            </div>
          </a-col>
        </a-row>
      </a-card>

      <!-- 商品标签 -->
      <a-card title="商品标签" size="small" style="margin-bottom: 16px">
        <div class="tags-container">
          <a-tag v-if="goodsDetail.isHot" color="red">热销</a-tag>
          <a-tag v-if="goodsDetail.isNew" color="green">新品</a-tag>
          <a-tag v-if="goodsDetail.isRecommend" color="blue">推荐</a-tag>
          <a-tag v-if="goodsDetail.isGift" color="purple">赠品</a-tag>
          <a-tag v-if="goodsDetail.isFreeShipping" color="orange">包邮</a-tag>
          <a-tag v-if="!hasAnyTag()" color="default">无标签</a-tag>
        </div>
      </a-card>

      <!-- 状态信息 -->
      <a-card title="状态信息" size="small" style="margin-bottom: 16px">
        <a-row :gutter="[16, 16]">
          <a-col :span="8">
            <div class="detail-item">
              <span class="label">商品状态:</span>
              <a-tag :color="getStatusColor(goodsDetail.status)">
                {{ getStatusText(goodsDetail.status) }}
              </a-tag>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="detail-item">
              <span class="label">审核状态:</span>
              <a-tag :color="getAuditStatusColor(goodsDetail.auditStatus)">
                {{ getAuditStatusText(goodsDetail.auditStatus) }}
              </a-tag>
            </div>
          </a-col>
          <a-col :span="8" v-if="goodsDetail.auditTime">
            <div class="detail-item">
              <span class="label">审核时间:</span>
              <span class="value">{{ formatDate(goodsDetail.auditTime) }}</span>
            </div>
          </a-col>
          <a-col :span="24" v-if="goodsDetail.auditReason">
            <div class="detail-item">
              <span class="label">审核意见:</span>
              <span class="value reason">{{ goodsDetail.auditReason }}</span>
            </div>
          </a-col>
        </a-row>
      </a-card>

      <!-- 时间信息 -->
      <a-card title="时间信息" size="small" style="margin-bottom: 16px">
        <a-row :gutter="[16, 16]">
          <a-col :span="8">
            <div class="detail-item">
              <span class="label">创建时间:</span>
              <span class="value">{{ formatDate(goodsDetail.createTime) }}</span>
            </div>
          </a-col>
          <a-col :span="8" v-if="goodsDetail.shelfTime">
            <div class="detail-item">
              <span class="label">上架时间:</span>
              <span class="value">{{ formatDate(goodsDetail.shelfTime) }}</span>
            </div>
          </a-col>
          <a-col :span="8" v-if="goodsDetail.updateTime">
            <div class="detail-item">
              <span class="label">更新时间:</span>
              <span class="value">{{ formatDate(goodsDetail.updateTime) }}</span>
            </div>
          </a-col>
        </a-row>
      </a-card>

      <!-- SEO信息 -->
      <a-card
        v-if="goodsDetail.seoTitle || goodsDetail.seoKeywords || goodsDetail.seoDescription"
        title="SEO信息"
        size="small"
        style="margin-bottom: 16px"
      >
        <a-row :gutter="[16, 16]">
          <a-col :span="24" v-if="goodsDetail.seoTitle">
            <div class="detail-item">
              <span class="label">SEO标题:</span>
              <span class="value">{{ goodsDetail.seoTitle }}</span>
            </div>
          </a-col>
          <a-col :span="24" v-if="goodsDetail.seoKeywords">
            <div class="detail-item">
              <span class="label">SEO关键词:</span>
              <span class="value">{{ goodsDetail.seoKeywords }}</span>
            </div>
          </a-col>
          <a-col :span="24" v-if="goodsDetail.seoDescription">
            <div class="detail-item">
              <span class="label">SEO描述:</span>
              <span class="value">{{ goodsDetail.seoDescription }}</span>
            </div>
          </a-col>
        </a-row>
      </a-card>

      <!-- 商品描述 -->
      <a-card v-if="goodsDetail.description" title="商品描述" size="small">
        <div class="description-content" v-html="goodsDetail.description"></div>
      </a-card>
    </div>

    <div v-else class="loading-container">
      <a-spin size="large" />
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import type { GoodsInfo } from '@/api/goods'
import { getGoodsDetail } from '@/api/goods'
import { message } from 'ant-design-vue'
import AuthImage from '@/components/common/AuthImage.vue'

// Props
interface Props {
  open: boolean
  goodsId?: number
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
})

// Emits
const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

// 数据
const goodsDetail = ref<GoodsInfo | null>(null)
const loading = ref(false)

// 计算属性
const open = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
})

const isLowStock = computed(() => {
  if (!goodsDetail.value) return false
  const totalStock = goodsDetail.value.totalStock || 0
  const warningStock = goodsDetail.value.warningStock || 0
  return totalStock <= warningStock && warningStock > 0
})

// 删除了不再使用的图片URL计算属性，现在直接使用AuthImage组件处理

// 监听弹窗打开
const handleOpen = async () => {
  if (props.goodsId) {
    await fetchGoodsDetail(props.goodsId)
  }
}

// 获取商品详情
const fetchGoodsDetail = async (id: number) => {
  loading.value = true
  try {
    goodsDetail.value = await getGoodsDetail(id)
    goodsDetail.value.images = JSON.parse(goodsDetail.value.images || '[]')
  } catch (error) {
    console.error('获取商品详情失败:', error)
    message.error('获取商品详情失败')
  } finally {
    loading.value = false
  }
}

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('zh-CN')
}

// 获取商品类型文本和颜色
const getGoodsTypeText = (type: number) => {
  const typeMap: Record<number, string> = {
    1: '实物商品',
    2: '虚拟商品',
    3: '服务商品',
  }
  return typeMap[type] || '未知'
}

const getGoodsTypeColor = (type: number) => {
  const colorMap: Record<number, string> = {
    1: 'blue',
    2: 'purple',
    3: 'green',
  }
  return colorMap[type] || 'default'
}

// 获取状态文本和颜色
const getStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    0: '已下架',
    1: '上架中',
    2: '库存不足自动下架',
    3: '审核中',
    4: '审核失败',
    5: '审核通过',
  }
  return statusMap[status] || '未知'
}

const getStatusColor = (status: number) => {
  const colorMap: Record<number, string> = {
    0: 'default',
    1: 'success',
    2: 'warning',
    3: 'processing',
    4: 'error',
    5: 'success',
  }
  return colorMap[status] || 'default'
}

// 获取审核状态文本和颜色
const getAuditStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    0: '待审核',
    1: '审核通过',
    2: '审核拒绝',
  }
  return statusMap[status] || '未知'
}

const getAuditStatusColor = (status: number) => {
  const colorMap: Record<number, string> = {
    0: 'default',
    1: 'success',
    2: 'error',
  }
  return colorMap[status] || 'default'
}

// 获取库存状态
const getStockStatusText = () => {
  if (!goodsDetail.value) return '-'
  const totalStock = goodsDetail.value.totalStock || 0
  if (totalStock === 0) return '缺货'
  if (isLowStock.value) return '库存不足'
  return '库存正常'
}

const getStockStatusColor = () => {
  if (!goodsDetail.value) return 'default'
  const totalStock = goodsDetail.value.totalStock || 0
  if (totalStock === 0) return 'error'
  if (isLowStock.value) return 'warning'
  return 'success'
}

// 检查是否有标签
const hasAnyTag = () => {
  if (!goodsDetail.value) return false
  return (
    goodsDetail.value.isHot ||
    goodsDetail.value.isNew ||
    goodsDetail.value.isRecommend ||
    goodsDetail.value.isGift ||
    goodsDetail.value.isFreeShipping
  )
}

// 监听弹窗状态变化
watch(
  () => props.open,
  (newVal) => {
    if (newVal) {
      handleOpen()
    } else {
      goodsDetail.value = null
    }
  },
)
</script>

<style scoped>
.goods-detail-container {
  max-height: 70vh;
  overflow-y: auto;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
}

.detail-item .label {
  width: 80px;
  flex-shrink: 0;
  color: #666;
  font-weight: 500;
  margin-right: 8px;
}

.detail-item .value {
  flex: 1;
  color: #333;
}

.detail-item .value.code {
  font-family: 'Courier New', monospace;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.detail-item .value.title {
  font-weight: 600;
  font-size: 16px;
  color: #1890ff;
}

.detail-item .value.subtitle {
  color: #666;
  font-style: italic;
}

.detail-item .value.price {
  color: #e74c3c;
  font-weight: 600;
  font-size: 16px;
}

.detail-item .value.highlight {
  color: #2ecc71;
  font-weight: 600;
}

.detail-item .value.warning {
  color: #f39c12;
  font-weight: 600;
}

.detail-item .value.stock-warning {
  color: #e74c3c;
  font-weight: 600;
}

.detail-item .value.reason {
  color: #e74c3c;
  background: #fef2f2;
  padding: 8px;
  border-radius: 4px;
  border-left: 4px solid #e74c3c;
}

.image-item {
  position: relative;
  text-align: center;
}

.goods-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
}

.image-label {
  position: absolute;
  bottom: 4px;
  left: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
}

.tags-container {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.description-content {
  max-height: 300px;
  overflow-y: auto;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

/* 美化滚动条 */
.goods-detail-container::-webkit-scrollbar {
  width: 6px;
}

.goods-detail-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.goods-detail-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.goods-detail-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .detail-item {
    flex-direction: column;
  }

  .detail-item .label {
    width: auto;
    margin-bottom: 4px;
  }

  .goods-image {
    height: 80px;
  }
}
</style>
