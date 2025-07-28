<template>
  <div class="product-container" :class="`template-${showData.templateStyle}`">
    <!-- 商品分组标签 -->
    <div v-if="showData.groupData.length > 0" class="product-tabs">
      <div
        v-for="group in showData.groupData"
        :key="group.groupId"
        class="tab-item"
        :class="{ active: activeGroupId === group.groupId }"
        @click="switchGroup(group.groupId)"
      >
        {{ group.displayName || group.groupName }}
      </div>
    </div>

    <!-- 商品展示区域 -->
    <div class="product-display" :class="`display-${showData.displayStyle}`">
      <!-- 一大两小布局 -->
      <div v-if="showData.templateStyle === 'oneMainTwoSub'" class="layout-one-main-two-sub">
        <div class="main-product">
          <div class="product-card large" @click="handleProductClick(currentProducts[0])">
            <div class="product-image-container">
              <img
                v-if="currentProducts[0]?.imageUrl"
                :src="currentProducts[0].imageUrl"
                :alt="currentProducts[0].name"
                class="product-image"
              />
              <div v-else class="product-image placeholder"></div>
              <!-- 商品标签 -->
              <div v-if="showData.showTags && currentProducts[0]?.tags" class="product-tags">
                <span
                  v-for="tag in currentProducts[0].tags.slice(0, 2)"
                  :key="tag"
                  class="tag"
                  :class="getTagClass(tag)"
                >
                  {{ tag }}
                </span>
              </div>
              <!-- 秒杀倒计时 -->
              <div
                v-if="showData.enableSeckill && currentProducts[0]?.isSeckill"
                class="seckill-timer"
              >
                <span class="timer-label">秒杀</span>
                <span class="timer-text">{{ formatTime(currentProducts[0].seckillEndTime) }}</span>
              </div>
            </div>
            <div class="product-info">
              <div class="product-title">
                {{ currentProducts[0]?.name || '这里显示商品名称，最多显示1行' }}
              </div>
              <div class="product-desc">
                {{ currentProducts[0]?.description || '这里显示商品描述，最多显示1行' }}
              </div>
              <!-- 评分和销量 -->
              <div v-if="showData.showRating || showData.showSales" class="product-meta">
                <div v-if="showData.showRating && currentProducts[0]?.rating" class="rating">
                  <span class="stars">{{ getStars(currentProducts[0].rating) }}</span>
                  <span class="rating-text">{{ currentProducts[0].rating }}</span>
                </div>
                <div v-if="showData.showSales && currentProducts[0]?.sales" class="sales">
                  已售{{ formatSales(currentProducts[0].sales) }}
                </div>
              </div>
              <div class="product-footer">
                <div v-if="showData.showPrice" class="price-container">
                  <span class="product-price">¥{{ currentProducts[0]?.price || 99 }}</span>
                  <span v-if="currentProducts[0]?.originalPrice" class="original-price"
                    >¥{{ currentProducts[0].originalPrice }}</span
                  >
                </div>
                <div
                  v-if="showData.showCart"
                  class="cart-icon"
                  @click.stop="addToCart(currentProducts[0])"
                >
                  🛒
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="sub-products">
          <div
            v-for="(product, index) in currentProducts.slice(1, 3)"
            :key="product?.id || index"
            class="product-card small"
            @click="handleProductClick(product)"
          >
            <div class="product-image-container">
              <img
                v-if="product?.imageUrl"
                :src="product.imageUrl"
                :alt="product.name"
                class="product-image"
              />
              <div v-else class="product-image placeholder"></div>
              <!-- 商品标签 -->
              <div v-if="showData.showTags && product?.tags" class="product-tags">
                <span
                  v-for="tag in product.tags.slice(0, 1)"
                  :key="tag"
                  class="tag"
                  :class="getTagClass(tag)"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            <div class="product-info">
              <div class="product-title">
                {{ product?.name || '这里显示商品名称，最多显示2行' }}
              </div>
              <!-- 评分 -->
              <div v-if="showData.showRating && product?.rating" class="rating small">
                <span class="stars">{{ getStars(product.rating) }}</span>
                <span class="rating-text">{{ product.rating }}</span>
              </div>
              <div class="product-footer">
                <div v-if="showData.showPrice" class="price-container">
                  <span class="product-price">¥{{ product?.price || 99 }}</span>
                  <span v-if="product?.originalPrice" class="original-price"
                    >¥{{ product.originalPrice }}</span
                  >
                </div>
                <div v-if="showData.showCart" class="cart-icon" @click.stop="addToCart(product)">
                  🛒
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 两列布局 -->
      <div v-else-if="showData.templateStyle === 'twoColumns'" class="layout-two-columns">
        <div
          v-for="(product, index) in currentProducts.slice(0, 4)"
          :key="product?.id || index"
          class="product-card medium"
          @click="handleProductClick(product)"
        >
          <div class="product-image-container">
            <img
              v-if="product?.imageUrl"
              :src="product.imageUrl"
              :alt="product.name"
              class="product-image"
            />
            <div v-else class="product-image placeholder"></div>
            <!-- 商品标签 -->
            <div v-if="showData.showTags && product?.tags" class="product-tags">
              <span
                v-for="tag in product.tags.slice(0, 2)"
                :key="tag"
                class="tag"
                :class="getTagClass(tag)"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          <div class="product-info">
            <div class="product-title">{{ product?.name || '这里显示商品名称，最多显示2行' }}</div>
            <!-- 评分和销量 -->
            <div v-if="showData.showRating || showData.showSales" class="product-meta">
              <div v-if="showData.showRating && product?.rating" class="rating small">
                <span class="stars">{{ getStars(product.rating) }}</span>
                <span class="rating-text">{{ product.rating }}</span>
              </div>
              <div v-if="showData.showSales && product?.sales" class="sales small">
                {{ formatSales(product.sales) }}
              </div>
            </div>
            <div class="product-footer">
              <div v-if="showData.showPrice" class="price-container">
                <span class="product-price">¥{{ product?.price || 99 }}</span>
                <span v-if="product?.originalPrice" class="original-price"
                  >¥{{ product.originalPrice }}</span
                >
              </div>
              <div v-if="showData.showCart" class="cart-icon" @click.stop="addToCart(product)">
                🛒
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 大图模式 -->
      <div v-else-if="showData.templateStyle === 'largeImage'" class="layout-large-image">
        <div
          v-for="(product, index) in currentProducts.slice(0, 2)"
          :key="product?.id || index"
          class="product-card large-image"
          @click="handleProductClick(product)"
        >
          <div class="product-image-container">
            <img
              v-if="product?.imageUrl"
              :src="product.imageUrl"
              :alt="product.name"
              class="product-image"
            />
            <div v-else class="product-image placeholder"></div>
            <!-- 商品标签 -->
            <div v-if="showData.showTags && product?.tags" class="product-tags">
              <span
                v-for="tag in product.tags.slice(0, 2)"
                :key="tag"
                class="tag"
                :class="getTagClass(tag)"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          <div class="product-info">
            <div class="product-title">{{ product?.name || '这里显示商品名称，最多显示1行' }}</div>
            <div class="product-desc">
              {{ product?.description || '这里显示商品描述，最多显示1行' }}
            </div>
            <!-- 评分和销量 -->
            <div v-if="showData.showRating || showData.showSales" class="product-meta">
              <div v-if="showData.showRating && product?.rating" class="rating">
                <span class="stars">{{ getStars(product.rating) }}</span>
                <span class="rating-text">{{ product.rating }}</span>
              </div>
              <div v-if="showData.showSales && product?.sales" class="sales">
                已售{{ formatSales(product.sales) }}
              </div>
            </div>
            <div class="product-footer">
              <div v-if="showData.showPrice" class="price-container">
                <span class="product-price">¥{{ product?.price || 99 }}</span>
                <span v-if="product?.originalPrice" class="original-price"
                  >¥{{ product.originalPrice }}</span
                >
              </div>
              <div v-if="showData.showCart" class="cart-icon" @click.stop="addToCart(product)">
                🛒
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 列表模式 -->
      <div v-else-if="showData.templateStyle === 'list'" class="layout-list">
        <div
          v-for="(product, index) in currentProducts.slice(0, 3)"
          :key="product?.id || index"
          class="product-card list-item"
          @click="handleProductClick(product)"
        >
          <div class="product-image-container">
            <img
              v-if="product?.imageUrl"
              :src="product.imageUrl"
              :alt="product.name"
              class="product-image"
            />
            <div v-else class="product-image placeholder"></div>
            <!-- 商品标签 -->
            <div v-if="showData.showTags && product?.tags" class="product-tags">
              <span
                v-for="tag in product.tags.slice(0, 1)"
                :key="tag"
                class="tag"
                :class="getTagClass(tag)"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          <div class="product-info">
            <div class="product-title">{{ product?.name || '这里显示商品名称，最多显示2行' }}</div>
            <div class="product-desc">{{ product?.description || '这里显示商品描述...' }}</div>
            <!-- 评分和销量 -->
            <div v-if="showData.showRating || showData.showSales" class="product-meta">
              <div v-if="showData.showRating && product?.rating" class="rating">
                <span class="stars">{{ getStars(product.rating) }}</span>
                <span class="rating-text">{{ product.rating }}</span>
              </div>
              <div v-if="showData.showSales && product?.sales" class="sales">
                已售{{ formatSales(product.sales) }}
              </div>
            </div>
            <div class="product-footer">
              <div v-if="showData.showPrice" class="price-container">
                <span class="product-price">¥{{ product?.price || 99 }}</span>
                <span v-if="product?.originalPrice" class="original-price"
                  >¥{{ product.originalPrice }}</span
                >
              </div>
              <div v-if="showData.showCart" class="cart-icon" @click.stop="addToCart(product)">
                🛒
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Goods, GoodsItem } from '@/types/content/content'

const props = defineProps<{
  objData: Goods
}>()

const showData = ref<Goods>({
  goodsId: -1,
  componentId: -1,
  templateStyle: 'oneMainTwoSub',
  goodsList: [],
  groupData: [],
  displayStyle: 'noBorderWhite',
  showPrice: true,
  showCart: true,
  showRating: true,
  showSales: true,
  showTags: true,
  enableSeckill: false,
  autoPlay: false,
  playInterval: 3000,
})

const activeGroupId = ref(-1)

// 当前显示的商品列表
const currentProducts = computed(() => {
  if (showData.value.groupData.length === 0) {
    return showData.value.goodsList
  }

  const activeGroup = showData.value.groupData.find(
    (group) => group.groupId === activeGroupId.value,
  )
  if (!activeGroup) {
    return showData.value.goodsList
  }

  // 根据分组筛选商品
  return showData.value.goodsList.filter((product) => product.category === activeGroup.groupName)
})

const switchGroup = (groupId: number) => {
  activeGroupId.value = groupId
}

// 格式化销量显示
const formatSales = (sales: number) => {
  if (sales >= 10000) {
    return `${(sales / 10000).toFixed(1)}万`
  }
  return sales.toString()
}

// 生成星级评分
const getStars = (rating: number) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  let stars = '★'.repeat(fullStars)
  if (hasHalfStar) {
    stars += '☆'
  }
  return stars.padEnd(5, '☆')
}

// 获取标签样式类
const getTagClass = (tag: string) => {
  const tagMap: Record<string, string> = {
    热销: 'tag-hot',
    新品: 'tag-new',
    秒杀: 'tag-seckill',
    折扣: 'tag-discount',
    包邮: 'tag-free-shipping',
    '5G': 'tag-feature',
    徕卡: 'tag-feature',
    影像: 'tag-feature',
    智能: 'tag-feature',
    除螨: 'tag-feature',
    降噪: 'tag-feature',
    无线: 'tag-feature',
  }
  return tagMap[tag] || 'tag-default'
}

// 格式化倒计时
const formatTime = (endTime?: string) => {
  if (!endTime) return '00:00:00'

  const now = new Date().getTime()
  const end = new Date(endTime).getTime()
  const diff = end - now

  if (diff <= 0) return '已结束'

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// 商品点击事件
const handleProductClick = (product?: GoodsItem) => {
  if (!product) return
  console.log('点击商品:', product)
  // 这里可以添加跳转到商品详情页的逻辑
  // router.push(`/product/${product.id}`)
}

// 添加到购物车
const addToCart = (product?: GoodsItem) => {
  if (!product) return
  console.log('添加到购物车:', product)
  // 这里可以添加购物车逻辑
  // cartStore.addItem(product)
}

onMounted(() => {
  showData.value = { ...props.objData }
  if (showData.value.groupData.length > 0) {
    activeGroupId.value = showData.value.groupData[0].groupId
  }
})
</script>

<style scoped>
.product-container {
  width: 100%;
  box-sizing: border-box;
}

.product-container:hover {
  border: 1px dashed #1890ff;
}

/* 商品分组标签 */
.product-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 8px;
}

.tab-item {
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
  color: #666;
  font-size: 14px;
}

.tab-item:hover {
  background: #f0f8ff;
  color: #1890ff;
}

.tab-item.active {
  background: #1890ff;
  color: white;
}

/* 商品展示区域 */
.product-display {
  padding: 12px;
  border-radius: 6px;
  width: 100%;
  box-sizing: border-box;
}

/* 展示样式 */
.display-noBorderWhite {
  background: white;
}

.display-cardShadow {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.display-borderWhite {
  background: white;
  border: 1px solid #e8e8e8;
}

.display-noBorderTransparent {
  background: transparent;
}

/* 一大两小布局 */
.layout-one-main-two-sub {
  display: flex;
  gap: 8px;
  height: 300px;
  width: 100%;
}

.main-product {
  flex: 1;
  min-width: 0;
}

.sub-products {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

/* 两列布局 */
.layout-two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  width: 100%;
}

/* 大图模式 */
.layout-large-image {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

/* 列表模式 */
.layout-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

/* 商品卡片样式 */
.product-card {
  background: #f8f8f8;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid #e8e8e8;
  transition: box-shadow 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-card.large {
  height: 100%;
}

.product-card.small {
  height: calc(50% - 4px);
}

.product-card.medium {
  height: 220px;
}

.product-card.large-image {
  height: 280px;
}

.product-card.list-item {
  height: 120px;
  flex-direction: row;
}

/* 商品图片容器 */
.product-image-container {
  position: relative;
  flex: 1;
  min-height: 100px;
  overflow: hidden;
}

.list-item .product-image-container {
  width: 120px;
  flex: none;
}

/* 商品图片 */
.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-image.placeholder {
  background: #d0d0d0;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

/* 商品标签 */
.product-tags {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 2;
}

.tag {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  color: white;
  font-weight: 500;
  line-height: 1.2;
}

.tag-hot {
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
}

.tag-new {
  background: linear-gradient(45deg, #4ecdc4, #6bcf7f);
}

.tag-seckill {
  background: linear-gradient(45deg, #ff4757, #ff6b7a);
}

.tag-discount {
  background: linear-gradient(45deg, #ffa726, #ffcc02);
}

.tag-free-shipping {
  background: linear-gradient(45deg, #42a5f5, #64b5f6);
}

.tag-feature {
  background: linear-gradient(45deg, #ab47bc, #ba68c8);
}

.tag-default {
  background: linear-gradient(45deg, #78909c, #90a4ae);
}

/* 秒杀倒计时 */
.seckill-timer {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 71, 87, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  z-index: 2;
}

.timer-label {
  margin-right: 4px;
}

.timer-text {
  font-family: 'Courier New', monospace;
}

/* 商品信息 */
.product-info {
  padding: 12px;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 80px;
}

.list-item .product-info {
  flex: 1;
  padding: 12px 16px;
}

.product-title {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}

.large .product-title {
  -webkit-line-clamp: 1;
  max-height: 1.4em;
}

.small .product-title,
.medium .product-title,
.list-item .product-title {
  -webkit-line-clamp: 2;
  max-height: 2.8em;
}

.product-desc {
  font-size: 12px;
  color: #999;
  line-height: 1.3;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 商品元信息（评分、销量） */
.product-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 12px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating.small {
  font-size: 10px;
}

.stars {
  color: #ffa726;
  font-size: 12px;
  line-height: 1;
}

.rating.small .stars {
  font-size: 10px;
}

.rating-text {
  color: #666;
  font-weight: 500;
}

.sales {
  color: #999;
  font-size: 12px;
}

.sales.small {
  font-size: 10px;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

/* 价格容器 */
.price-container {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.product-price {
  font-size: 16px;
  color: #ff4444;
  font-weight: bold;
}

.original-price {
  font-size: 12px;
  color: #999;
  text-decoration: line-through;
}

.cart-icon {
  font-size: 18px;
  color: #ff4444;
  cursor: pointer;
  transition: transform 0.2s ease;
  padding: 4px;
  border-radius: 4px;
}

.cart-icon:hover {
  transform: scale(1.1);
  background: rgba(255, 68, 68, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .layout-one-main-two-sub {
    flex-direction: column;
    height: auto;
  }

  .sub-products {
    flex-direction: row;
    gap: 8px;
  }

  .product-card.small {
    height: 180px;
  }

  .layout-two-columns {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>

<script lang="ts">
export default {
  name: 'Product',
}
</script>
