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
                @error="handleImageError"
              />
              <div v-else class="product-image placeholder">
                <div class="placeholder-content">
                  <div class="placeholder-icon">
                    {{ getCategoryIcon(currentProducts[0]?.category || '') }}
                  </div>
                  <div class="placeholder-text">{{ currentProducts[0]?.name || '商品图片' }}</div>
                </div>
              </div>
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
              <div class="product-title on-main-two-sub">
                {{ currentProducts[0]?.name || '这里显示商品名称，最多显示1行' }}
              </div>
              <div class="product-desc on-main-two-sub">
                {{ currentProducts[0]?.description || '这里显示商品描述，最多显示1行' }}
              </div>
              <!-- 评分和销量 -->
              <div
                v-if="showData.showRating || showData.showSales"
                class="product-meta on-main-two-sub"
              >
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
            class="product-card on-main-two-sub"
            @click="handleProductClick(product)"
          >
            <div class="product-image-container">
              <img
                v-if="product?.imageUrl"
                :src="product.imageUrl"
                :alt="product.name"
                class="product-image"
                @error="handleImageError"
              />
              <div v-else class="product-image placeholder">
                <div class="placeholder-content">
                  <div class="placeholder-icon">{{ getCategoryIcon(product?.category || '') }}</div>
                  <div class="placeholder-text">{{ product?.name || '商品图片' }}</div>
                </div>
              </div>
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
          class="product-card"
          @click="handleProductClick(product)"
        >
          <div class="product-image-container">
            <img
              v-if="product?.imageUrl"
              :src="product.imageUrl"
              :alt="product.name"
              class="product-image"
              @error="handleImageError"
            />
            <div v-else class="product-image placeholder">
              <div class="placeholder-content">
                <div class="placeholder-icon">{{ getCategoryIcon(product?.category || '') }}</div>
                <div class="placeholder-text">{{ product?.name || '商品图片' }}</div>
              </div>
            </div>
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
          <div class="product-info two-columns">
            <div class="product-title two-columns">
              {{ product?.name || '这里显示商品名称，最多显示2行' }}
            </div>
            <!-- 评分和销量 -->
            <div v-if="showData.showRating || showData.showSales" class="product-meta two-columns">
              <div v-if="showData.showRating && product?.rating" class="rating two-columns">
                <span class="stars">{{ getStars(product.rating) }}</span>
                <span class="rating-text">{{ product.rating }}</span>
              </div>
              <div v-if="showData.showSales && product?.sales" class="sales two-columns">
                已售{{ formatSales(product.sales) }}
              </div>
            </div>
            <div class="product-footer">
              <div v-if="showData.showPrice" class="price-container">
                <span class="product-price two-columns">¥{{ product?.price || 99 }}</span>
                <span v-if="product?.originalPrice" class="original-price"
                  >¥{{ product.originalPrice }}</span
                >
              </div>
              <div
                v-if="showData.showCart"
                class="cart-icon two-columns"
                @click.stop="addToCart(product)"
              >
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
              @error="handleImageError"
            />
            <div v-else class="product-image placeholder">
              <div class="placeholder-content">
                <div class="placeholder-icon">{{ getCategoryIcon(product?.category || '') }}</div>
                <div class="placeholder-text">{{ product?.name || '商品图片' }}</div>
              </div>
            </div>
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
            <div class="product-title largeImage">
              {{ product?.name || '这里显示商品名称，最多显示1行' }}
            </div>
            <div class="product-desc largeImage">
              {{ product?.description || '这里显示商品描述，最多显示1行' }}
            </div>
            <!-- 评分和销量 -->
            <div v-if="showData.showRating || showData.showSales" class="product-meta largeImage">
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
              @error="handleImageError"
            />
            <div v-else class="product-image placeholder">
              <div class="placeholder-content">
                <div class="placeholder-icon">{{ getCategoryIcon(product?.category || '') }}</div>
                <div class="placeholder-text">{{ product?.name || '商品图片' }}</div>
              </div>
            </div>
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

    <!-- 无限滚动状态提示 -->
    <div class="infinite-scroll-status" v-if="currentProducts.length > 0">
      <div v-if="isLoading" class="loading-indicator">
        <div class="loading-spinner"></div>
        <span>加载更多商品中...</span>
      </div>
      <div v-else-if="!hasMoreProducts" class="no-more-indicator">
        <span>已显示全部商品</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
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

// 无限滚动相关状态
const currentPage = ref(1)
const pageSize = ref(10) // 每页加载10个商品
const isLoading = ref(false)

// 获取所有可用商品（不分页）
const allAvailableProducts = computed(() => {
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

// 检查是否还有更多商品
const hasMoreProducts = computed(() => {
  const totalProducts = allAvailableProducts.value.length
  const endIndex = currentPage.value * pageSize.value
  return endIndex < totalProducts
})

// 当前显示的商品列表（支持分页）
const currentProducts = computed(() => {
  const endIndex = currentPage.value * pageSize.value
  return allAvailableProducts.value.slice(0, endIndex)
})

const switchGroup = (groupId: number) => {
  activeGroupId.value = groupId
  // 切换分组时重置分页
  currentPage.value = 1
}

// 加载更多商品
const loadMoreProducts = () => {
  if (isLoading.value || !hasMoreProducts.value) {
    return
  }

  isLoading.value = true

  // 模拟加载延迟（可选）
  setTimeout(() => {
    currentPage.value += 1
    isLoading.value = false
  }, 300)
}

// 防抖计时器
let scrollTimer: number | null = null

// 滚动监听器（防抖优化）
const handleScroll = () => {
  if (scrollTimer) {
    clearTimeout(scrollTimer)
  }

  scrollTimer = setTimeout(() => {
    // 检查窗口滚动
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    // 计算滚动百分比
    const scrollPercentage = (scrollTop + windowHeight) / documentHeight
    console.log('scrollPercentage', scrollPercentage)

    // 当滚动到底部90%时加载更多
    if (scrollPercentage > 0.9 && hasMoreProducts.value && !isLoading.value) {
      loadMoreProducts()
    }
  }, 100) // 100ms防抖
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

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  // 可以在这里设置默认图片或显示占位符
}

// 根据商品类别获取图标
const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, string> = {
    数码影音: '📱',
    家居生活: '🏠',
    服装美妆: '👗',
    食品饮料: '🍎',
  }
  return iconMap[category] || '📦'
}

// 监听props变化并更新showData
watch(
  () => props.objData,
  async (newObjData: Goods) => {
    await nextTick()
    showData.value = { ...newObjData }
    if (showData.value.groupData.length > 0) {
      activeGroupId.value = showData.value.groupData[0].groupId
    }
    // 重置分页状态
    currentPage.value = 1
  },
  { deep: true },
)

// 监听分组变化，重置分页
watch(
  () => activeGroupId.value,
  () => {
    currentPage.value = 1
  },
)

onMounted(() => {
  showData.value = { ...props.objData }
  if (showData.value.groupData.length > 0) {
    activeGroupId.value = showData.value.groupData[0].groupId
  }

  // 添加滚动监听器
  const container = document.querySelector('.product-container')
  if (container) {
    container.addEventListener('scroll', handleScroll)
  }
  // 也监听窗口滚动（以防组件内部没有滚动条）
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  // 清理滚动监听器
  const container = document.querySelector('.product-container')
  if (container) {
    container.removeEventListener('scroll', handleScroll)
  }
  window.removeEventListener('scroll', handleScroll)

  // 清理防抖计时器
  if (scrollTimer) {
    clearTimeout(scrollTimer)
    scrollTimer = null
  }
})
</script>

<style scoped>
.product-container {
  width: 100%;
  max-width: 375px;
  box-sizing: border-box;
  overflow: hidden;
}

.product-container:hover {
  border: 1px dashed #1890ff;
}

/* 商品分组标签 */
.product-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px;
  background: #fafafa;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  flex-wrap: wrap;
  justify-content: center;
}

.tab-item {
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 20px;
  transition: all 0.3s ease;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  border: 2px solid transparent;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  min-width: 80px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.tab-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s;
}

.tab-item:hover::before {
  left: 100%;
}

.tab-item:hover {
  background: #f0f8ff;
  color: #1890ff;
  border-color: #1890ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
}

.tab-item.active {
  background: linear-gradient(135deg, #1890ff, #40a9ff);
  color: white;
  border-color: #1890ff;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(24, 144, 255, 0.3);
}

.tab-item.active:hover {
  background: linear-gradient(135deg, #40a9ff, #1890ff);
  transform: translateY(-2px);
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
  height: 360px;
  width: 100%;
  max-width: 359px;
  padding: 8px;
  background: #fafafa;
  border-radius: 12px;
  box-sizing: border-box;
}

.main-product {
  flex: 1;
  min-width: 0;
  max-width: 200px;
}

.sub-products {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  max-width: 200px;
}

/* 两列布局 */
.layout-two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  width: 100%;
  max-width: 359px;
  padding: 8px;
  background: #fafafa;
  border-radius: 12px;
  box-sizing: border-box;
}

/* 大图模式 */
.layout-large-image {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 359px;
  padding: 8px;
  background: #fafafa;
  border-radius: 12px;
  box-sizing: border-box;
}

/* 列表模式 */
.layout-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 359px;
  padding: 8px;
  background: #fafafa;
  border-radius: 12px;
  box-sizing: border-box;
}

/* 商品卡片样式 */
.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
}

.product-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.05), rgba(64, 169, 255, 0.05));
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.product-card:hover::before {
  opacity: 1;
}

.product-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
  border-color: #e6f7ff;
}

.product-card.large {
  height: 100%;
}

.product-card.small,
.sub-products .product-card,
.product-card.on-main-two-sub {
  height: calc(50% - 6px);
  min-height: 160px;
}

/* 确保标题在一大两小布局的主商品区域显示为一行 */
.main-product .product-title.on-main-two-sub {
  -webkit-line-clamp: 1;
  max-height: 1.5em;
  font-size: 16px;
  font-weight: 600;
}

/* 主商品区域的价格样式 */
.main-product .product-price {
  font-size: 18px;
  font-weight: 700;
}

.product-card.medium {
  height: 260px;
}

.product-card.large-image {
  height: 320px;
}

.product-card.list-item {
  height: 140px;
  flex-direction: row;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.product-card.list-item:hover {
  border-color: #3498db;
  box-shadow: 0 4px 20px rgba(52, 152, 219, 0.15);
  transform: translateY(-2px);
}

/* 商品图片容器 */
.product-image-container {
  position: relative;
  flex: 1;
  min-height: 120px;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 8px 8px 0 0;
}

.sub-products .product-image-container {
  min-height: 90px;
  flex: 1.2;
}

.small .product-image-container {
  min-height: 90px;
  flex: 1.2;
}

.list-item .product-image-container {
  width: 140px;
  flex: none;
  border-radius: 12px 0 0 12px;
  min-height: auto;
  background: linear-gradient(45deg, #f8f9fa, #e9ecef);
  position: relative;
  overflow: hidden;
}

.list-item .product-image-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(52, 152, 219, 0.05) 100%);
  pointer-events: none;
}

/* 商品图片 */
.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: all 0.4s ease;
  padding: 8px;
  box-sizing: border-box;
}

.product-image.placeholder {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  font-size: 14px;
  font-weight: 500;
  border: 2px dashed #dee2e6;
}

.placeholder-content {
  text-align: center;
  padding: 16px;
}

.placeholder-icon {
  font-size: 32px;
  margin-bottom: 8px;
  opacity: 0.6;
}

.placeholder-text {
  font-size: 12px;
  color: #6c757d;
  line-height: 1.3;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-card.small .placeholder-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.product-card.small .placeholder-text {
  font-size: 10px;
}

.product-card:hover .product-image {
  transform: scale(1.08);
  filter: brightness(1.05);
}

/* 为不同尺寸的卡片调整图片样式 */
.product-card.large .product-image {
  padding: 12px;
}

.product-card.small .product-image {
  padding: 4px;
}

.product-card.list-item .product-image {
  padding: 8px;
  object-fit: cover;
}

/* 商品标签 */
.product-tags {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 3;
}

.tag {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  color: white;
  font-weight: 600;
  line-height: 1.2;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.tag:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
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
  padding: 16px;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100px;
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.product-info.two-columns {
  padding: 12px;
}

.product-info.two-columns .stars {
  font-size: 14px;
}

.sub-products .product-info {
  padding: 8px;
  min-height: 75px;
}

.product-card.large .product-info {
  padding: 16px;
  min-height: 120px;
}

.product-card.large-image .product-info {
  padding: 16px;
  min-height: 100px;
}

.list-item .product-info {
  flex: 1;
  padding: 16px 20px;
  min-height: auto;
}

.product-title {
  font-size: 15px;
  color: #2c3e50;
  line-height: 1.5;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 3em;
  word-wrap: break-word;
  word-break: break-word;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.product-title.largeImage {
  -webkit-line-clamp: 1;
  max-height: 1.5em;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 6px;
  font-weight: 600;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-title.on-main-two-sub {
  -webkit-line-clamp: 1;
  max-height: 1.5em;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 6px;
  font-weight: 600;
}

.sub-products .product-title {
  -webkit-line-clamp: 2;
  max-height: 2.4em;
  font-size: 12px;
  margin-bottom: 4px;
  line-height: 1.2;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.sub-products .product-desc {
  font-size: 10px;
  margin-bottom: 4px;
  display: none; /* 在小卡片中隐藏描述以节省空间 */
}

.product-title.two-columns {
  -webkit-line-clamp: 2;
  max-height: 3em;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 6px;
  font-weight: 600;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-title.on-main-two-sub {
  -webkit-line-clamp: 2;
  max-height: 2.4em;
  font-size: 12px;
  margin-bottom: 3px;
  line-height: 1.2;
}

.list-item .product-title {
  -webkit-line-clamp: 1;
  max-height: 1.4em;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.4;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  word-break: break-word;
  transition: color 0.3s ease;
}

.list-item:hover .product-title {
  color: #3498db;
}

.list-item .product-desc {
  font-size: 12px;
  color: #999;
  line-height: 1.3;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 1.3em;
}

.list-item .product-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  margin-bottom: 4px;
}

.list-item .rating {
  display: flex;
  align-items: center;
  gap: 3px;
}

.list-item .rating .stars {
  font-size: 12px;
}

.list-item .rating-text {
  font-size: 11px;
}

.list-item .sales {
  font-size: 11px;
  color: #999;
}

.list-item .product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.list-item .product-price {
  font-size: 16px;
  font-weight: 700;
  color: #e74c3c;
}

.list-item .original-price {
  font-size: 12px;
  color: #95a5a6;
  text-decoration: line-through;
  margin-left: 6px;
}

.list-item .cart-icon {
  font-size: 18px;
  width: 32px;
  height: 32px;
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

.product-desc.largeImage {
  font-size: 12px;
  color: #999;
  line-height: 1.3;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-desc.on-main-two-sub {
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
  font-size: 12px;
}

.product-meta.largeImage {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  margin-bottom: 8px;
}

.product-meta.two-columns {
  display: flex;
  align-items: center;
  margin: 4px;
  font-size: 12px;
}

.product-meta.on-main-two-sub {
  display: flex;
  align-items: center;
  font-size: 12px;
  margin-bottom: 8px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating.two-columns .stars {
  font-size: 14px;
}

.sub-products .rating .stars {
  font-size: 12px;
}

.product-card.large .rating .stars {
  font-size: 14px;
}

.product-card.large-image .rating .stars {
  font-size: 14px;
}

.stars {
  color: #ffa726;
  line-height: 1;
}

.rating-text {
  color: #666;
  font-weight: 500;
}

.sub-products .rating-text {
  font-size: 10px;
}

.product-card.large .rating-text {
  font-size: 12px;
}

.product-card.large-image .rating-text {
  font-size: 12px;
}

.sales {
  color: #999;
}

.sales.two-columns {
  font-size: 12px;
}

.sub-products .sales {
  font-size: 10px;
}

.product-card.large .sales {
  font-size: 12px;
}

.product-card.large-image .sales {
  font-size: 12px;
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
  gap: 3px;
  flex: 1;
}

.small .price-container,
.sub-products .price-container {
  gap: 3px;
}

.product-price {
  color: #e74c3c;
  font-weight: 700;
  font-family: 'Arial', sans-serif;
  letter-spacing: 0.5px;
}

.product-price.two-columns {
  font-size: 14px;
}

.product-card.large .product-price {
  font-size: 12px;
}

.sub-products .product-price {
  font-size: 12px;
}

.product-card.large-image .product-price {
  font-size: 16px;
}

.original-price {
  font-size: 13px;
  color: #95a5a6;
  text-decoration: line-through;
  /* margin-left: 8px; */
  font-weight: 400;
}

.small .original-price,
.sub-products .original-price {
  font-size: 11px;
  margin-left: 4px;
}

.cart-icon {
  font-size: 20px;
  color: #e74c3c;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 50%;
  background: rgba(231, 76, 60, 0.1);
  border: 2px solid transparent;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  box-sizing: border-box;
}

.cart-icon.two-columns {
  font-size: 18px;
  padding: 5px;
}

.cart-icon:hover {
  transform: scale(1.15) rotate(5deg);
  background: rgba(231, 76, 60, 0.2);
  border-color: #e74c3c;
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

.small .cart-icon,
.sub-products .cart-icon {
  font-size: 14px;
  padding: 4px;
  min-width: 24px;
  min-height: 24px;
  width: 24px;
  height: 24px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .product-tabs {
    padding: 12px;
    gap: 8px;
  }

  .tab-item {
    padding: 8px 16px;
    font-size: 13px;
    min-width: 70px;
  }

  .layout-one-main-two-sub {
    flex-direction: column;
    height: auto;
    gap: 8px;
    padding: 6px;
  }

  .main-product {
    flex: none;
  }

  .sub-products {
    flex-direction: row;
    gap: 8px;
  }

  .product-card.small,
  .sub-products .product-card,
  .product-card.on-main-two-sub {
    height: 200px;
  }

  .layout-two-columns {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 6px;
  }

  .layout-large-image,
  .layout-list {
    padding: 6px;
    gap: 8px;
  }

  .product-info {
    padding: 12px;
  }

  .list-item .product-info {
    padding: 12px 16px;
  }

  .product-image-container {
    min-height: 100px;
  }

  .list-item .product-image-container {
    width: 120px;
  }
}

/* 无限滚动状态样式 */
.infinite-scroll-status {
  padding: 20px;
  text-align: center;
  width: 100%;
}

.loading-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #666;
  font-size: 14px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.no-more-indicator {
  color: #999;
  font-size: 14px;
  padding: 10px;
  border-top: 1px solid #f0f0f0;
}

.no-more-indicator span {
  background: #fafafa;
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #e8e8e8;
}
</style>

<script lang="ts">
export default {
  name: 'Product',
}
</script>
