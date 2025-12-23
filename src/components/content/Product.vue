<template>
  <div
    ref="productContainerRef"
    class="product-container"
    :class="[`template-${showData.templateStyle}`, `env-${environment}`, environmentClass]"
  >
    <!-- 商品分组标签 -->
    <div
      v-if="showData.groupData.length > 0"
      ref="productTabsRef"
      class="product-tabs"
      :class="{
        'is-sticky': isTabsSticky,
        'is-transitioning': isTransitioning,
        unsticking: !isTabsSticky && isTransitioning,
      }"
    >
      <div
        v-for="group in showData.groupData"
        :key="group.id"
        class="tab-item"
        :class="{ active: activeGroupId === group.id }"
        @click="switchGroup(group.id)"
      >
        <!-- {{ group.displayName || group.goodsCategoryName }} -->
        {{ group.displayName }}
      </div>
    </div>

    <!-- 商品展示区域 -->
    <div
      ref="productDisplayRef"
      class="product-display"
      :class="[
        `display-${showData.displayStyle}`,
        { 'has-sticky-padding': isTabsSticky || isTransitioning },
      ]"
      :style="{
        paddingTop: isTabsSticky
          ? `${stickyTabsHeight}px`
          : isTransitioning
            ? `${stickyTabsHeight}px`
            : '0',
        transition: isTransitioning ? 'padding-top 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)' : 'none',
      }"
    >
      <!-- 一大两小布局 -->
      <div v-if="showData.templateStyle === 'oneMainTwoSub'" class="layout-one-main-two-sub">
        <template
          v-for="(group, groupIndex) in groupedOneMainTwoSubProducts"
          :key="group[0]?.id ?? `group-${groupIndex}`"
        >
          <div v-if="group[0]" class="main-product">
            <div class="product-card large" @click="handleProductClick(group[0])">
              <div class="product-image-container">
                <AuthImage
                  v-if="group[0]?.imageUrl"
                  :src="group[0].imageUrl"
                  :alt="group[0].name"
                  class="product-image"
                  :forceAuth="true"
                  :lazy="true"
                />
                <div v-else class="product-image placeholder">
                  <div class="placeholder-content">
                    <div class="placeholder-icon">📦</div>
                    <div class="placeholder-text">图片无法加载</div>
                  </div>
                </div>
                <!-- 商品标签 -->
                <div v-if="showData.showTags && group[0]?.tags" class="product-tags">
                  <span
                    v-for="tag in group[0].tags.slice(0, 2)"
                    :key="tag"
                    class="tag"
                    :class="getTagClass(tag)"
                  >
                    {{ tag }}
                  </span>
                </div>
                <!-- 秒杀倒计时 -->
                <div v-if="showData.enableSeckill && group[0]?.isSeckill" class="seckill-timer">
                  <span class="timer-label">秒杀</span>
                  <span class="timer-text">{{ formatTime(group[0].seckillEndTime) }}</span>
                </div>
              </div>
              <div class="product-info">
                <div class="product-title on-main-two-sub">
                  {{ group[0]?.name || '这里显示商品名称，最多显示1行' }}
                </div>
                <div class="product-desc on-main-two-sub">
                  {{ group[0]?.description || '这里显示商品描述，最多显示1行' }}
                </div>
                <!-- 评分和销量 -->
                <div
                  v-if="
                    (showData.showRating && group[0]?.rating) ||
                    (showData.showSales && group[0]?.sales)
                  "
                  class="product-meta on-main-two-sub"
                >
                  <div v-if="showData.showRating && group[0]?.rating" class="rating">
                    <span class="stars">{{ getStars(group[0].rating) }}</span>
                    <span class="rating-text">{{ group[0].rating }}</span>
                  </div>
                  <div v-if="showData.showSales && group[0]?.sales" class="sales">
                    已售{{ formatSales(group[0].sales) }}
                  </div>
                </div>
                <div class="product-footer">
                  <div v-if="showData.showPrice" class="price-container">
                    <span class="product-price">¥{{ group[0]?.price || 99 }}</span>
                    <span v-if="group[0]?.originalPrice" class="original-price"
                      >¥{{ group[0].originalPrice }}</span
                    >
                  </div>
                  <div v-if="showData.showCart" class="cart-icon" @click.stop="addToCart(group[0])">
                    🛒
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="group.length > 1" class="sub-products">
            <div
              v-for="(product, index) in group.slice(1, 3)"
              :key="product?.id || `sub-${groupIndex}-${index}`"
              class="product-card"
              @click="handleProductClick(product)"
            >
              <div class="product-image-container">
                <AuthImage
                  v-if="product?.imageUrl"
                  :src="product.imageUrl"
                  :alt="product.name"
                  class="product-image"
                  :forceAuth="true"
                  :lazy="true"
                />
                <div v-else class="product-image placeholder">
                  <div class="placeholder-content">
                    <div class="placeholder-icon">📦</div>
                    <div class="placeholder-text">图片无法加载</div>
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
        </template>
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
            <AuthImage
              v-if="product?.imageUrl"
              :src="product.imageUrl"
              :alt="product.name"
              class="product-image"
              :forceAuth="true"
              :lazy="true"
            />
            <div v-else class="product-image placeholder">
              <div class="placeholder-content">
                <div class="placeholder-icon">📦</div>
                <div class="placeholder-text">图片无法加载</div>
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
            <AuthImage
              v-if="product.imageUrl"
              :src="product.imageUrl"
              :alt="product.name"
              class="product-image"
              :forceAuth="true"
              :lazy="true"
            />
            <div v-else class="product-image placeholder">
              <div class="placeholder-content">
                <div class="placeholder-icon">📦</div>
                <div class="placeholder-text">图片无法加载</div>
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
            <AuthImage
              v-if="product?.imageUrl"
              :src="product.imageUrl"
              :alt="product.name"
              class="product-image"
              :forceAuth="true"
              :lazy="true"
            />
            <div v-else class="product-image placeholder">
              <div class="placeholder-content">
                <div class="placeholder-icon">📦</div>
                <div class="placeholder-text">图片无法加载</div>
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
import type { ComponentEnvironment } from '@/types/environment'
import AuthImage from '@/components/common/AuthImage.vue'

const props = defineProps<{
  objData: Goods
  environment?: ComponentEnvironment
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
  enableGroup: false,
})

// 环境相关的计算属性
const environment = computed(() => props.environment || 'editing')
const environmentClass = computed(() => `product-${environment.value}`)

const activeGroupId = ref(-1)

// DOM引用
const productContainerRef = ref<HTMLElement>()
const productTabsRef = ref<HTMLElement>()
const productDisplayRef = ref<HTMLElement>()

// 吸顶相关状态
const isTabsSticky = ref(false)
const stickyTabsHeight = ref(0)
const containerOffsetTop = ref(0)
// 添加过渡状态管理
const isTransitioning = ref(false)
const stickyProgress = ref(0) // 0-1之间的过渡进度

// 无限滚动相关状态
const currentPage = ref(1)
const pageSize = ref(8) // 每页加载8个商品，平衡首屏展示与加载频率
const isLoading = ref(false)

// 获取所有可用商品（不分页）
const allAvailableProducts = computed(() => {
  if (showData.value.groupData.length === 0) {
    return showData.value.goodsList
  }

  const activeGroup = showData.value.groupData.find((group) => group.id === activeGroupId.value)
  if (!activeGroup) {
    return showData.value.goodsList
  }

  // 根据分组筛选商品
  // return showData.value.goodsList.filter((product) => product.category === activeGroup.goodsCategoryName)
  return showData.value.goodsList.filter((product) =>
    product.categoryIds.includes(activeGroup.goodsCategoryId),
  )
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

// 将商品按3个一组分组（1大2小为一组）
const groupedOneMainTwoSubProducts = computed(() => {
  const groups: GoodsItem[][] = []
  for (let i = 0; i < currentProducts.value.length; i += 3) {
    groups.push(currentProducts.value.slice(i, i + 3))
  }
  return groups
})

const switchGroup = (groupId: number) => {
  activeGroupId.value = groupId
  // 切换分组时重置分页
  currentPage.value = 1

  // 延迟检查吸顶状态，确保DOM已更新
  nextTick(() => {
    updateStickyState()
  })
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

// 防抖计时器和过渡管理
let scrollTimer: number | null = null
let transitionTimer: number | null = null

// 清理过渡状态的辅助函数
const clearTransitionState = (isUnsticking = false) => {
  if (transitionTimer) {
    clearTimeout(transitionTimer)
    transitionTimer = null
  }

  if (isUnsticking) {
    // 取消吸顶时，先等待padding动画完成，再清理过渡状态
    transitionTimer = setTimeout(() => {
      stickyTabsHeight.value = 0 // 延迟清零高度，让padding动画完成
      setTimeout(() => {
        isTransitioning.value = false
      }, 50) // 短暂延迟确保状态更新
    }, 400) // 与CSS动画时间匹配
  } else {
    // 开始吸顶时，正常清理过渡状态
    transitionTimer = setTimeout(() => {
      isTransitioning.value = false
    }, 400)
  }
}

// 滚动监听器（防抖优化）
const handleScroll = () => {
  if (scrollTimer) {
    clearTimeout(scrollTimer)
  }

  // 使用requestAnimationFrame确保动画流畅
  scrollTimer = window.requestAnimationFrame(() => {
    updateStickyState()
    checkLoadMore()
  })
}

// 更新吸顶状态
const updateStickyState = () => {
  if (!productContainerRef.value || !productTabsRef.value) return

  const containerRect = productContainerRef.value.getBoundingClientRect()
  const containerTop = containerRect.top
  const containerBottom = containerRect.bottom
  const windowHeight = window.innerHeight

  // 计算过渡进度（基于容器顶部位置）
  const maxTransitionDistance = 100 // 过渡距离，可以调整
  let progress = 0

  if (containerTop <= 0) {
    // 当容器顶部到达或超过页面顶部时
    progress = Math.min(1, Math.abs(containerTop) / maxTransitionDistance)
  } else {
    // 当容器顶部在页面顶部下方时
    progress = Math.max(0, 1 - containerTop / maxTransitionDistance)
  }

  stickyProgress.value = progress

  // 开始吸顶的条件：商品组件的顶端到达或超过页面最顶端，且商品组件还在视窗内
  const shouldStartSticky = containerTop <= 0 && containerBottom > 0

  // 取消吸顶的条件：商品组件回到页面顶部上方，或者商品组件完全离开视窗底部
  const shouldCancelSticky = containerTop > 0 || containerBottom <= 0

  if (shouldStartSticky && !isTabsSticky.value) {
    // 如果正在取消吸顶的过程中又要开始吸顶，先清理之前的状态
    if (isTransitioning.value) {
      if (transitionTimer) {
        clearTimeout(transitionTimer)
        transitionTimer = null
      }
    }

    isTransitioning.value = true
    isTabsSticky.value = true
    stickyTabsHeight.value = productTabsRef.value.offsetHeight
    containerOffsetTop.value = productContainerRef.value.offsetTop

    // 使用统一的过渡状态清理函数
    clearTransitionState(false)

    /* // 开发环境下的调试信息
    if (import.meta.env.DEV) {
      console.log('🎯 商品标签开始吸顶', {
        containerTop,
        containerBottom,
        windowHeight,
        stickyTabsHeight: stickyTabsHeight.value,
        environment: environment.value,
        progress: stickyProgress.value,
      })
    } */
  } else if (shouldCancelSticky && isTabsSticky.value) {
    // 如果正在开始吸顶的过程中又要取消吸顶，先清理之前的状态
    if (isTransitioning.value) {
      if (transitionTimer) {
        clearTimeout(transitionTimer)
        transitionTimer = null
      }
    }

    isTransitioning.value = true
    isTabsSticky.value = false
    // 不立即清零高度，让动画先执行
    // stickyTabsHeight.value = 0

    // 使用统一的过渡状态清理函数，传入取消吸顶标识
    clearTransitionState(true)

    /* // 开发环境下的调试信息
    if (import.meta.env.DEV) {
      console.log('📍 商品标签取消吸顶', {
        containerTop,
        containerBottom,
        reason: containerTop > 0 ? '容器回到顶部上方' : '容器完全离开视窗',
        progress: stickyProgress.value,
        stickyTabsHeight: stickyTabsHeight.value,
        willStartPaddingAnimation: true,
      })
    } */
  }
}

// 检查是否需要加载更多商品
const checkLoadMore = () => {
  if (!productDisplayRef.value) return

  // 获取商品展示区域的位置信息
  const displayRect = productDisplayRef.value.getBoundingClientRect()
  const windowHeight = window.innerHeight

  // 当商品展示区域的底部进入视窗时加载更多
  const distanceFromBottom = displayRect.bottom - windowHeight

  if (distanceFromBottom <= 200 && hasMoreProducts.value && !isLoading.value) {
    /* // 开发环境下的调试信息
    if (import.meta.env.DEV) {
      console.log('📱 触发分页加载', {
        distanceFromBottom,
        currentPage: currentPage.value,
        totalProducts: allAvailableProducts.value.length,
        isTabsSticky: isTabsSticky.value,
      })
    } */
    loadMoreProducts()
  }
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

// 监听props变化并更新showData
watch(
  () => props.objData,
  async (newObjData: Goods) => {
    await nextTick()
    showData.value = { ...newObjData }
    if (showData.value.groupData.length > 0) {
      activeGroupId.value = showData.value.groupData[0].id
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
    activeGroupId.value = showData.value.groupData[0].id
  }

  // 使用nextTick确保DOM元素已经渲染
  nextTick(() => {
    // 初始化标签高度
    if (productTabsRef.value) {
      stickyTabsHeight.value = productTabsRef.value.offsetHeight
    }

    // 添加滚动监听器（主要监听窗口滚动）
    window.addEventListener('scroll', handleScroll, { passive: true })

    // 添加窗口大小变化监听器
    window.addEventListener('resize', handleScroll, { passive: true })

    // 如果在预览或全屏环境，也监听父容器滚动
    if (environment.value === 'preview' || environment.value === 'fullscreen') {
      const previewContainer = document.querySelector('.component-list')
      if (previewContainer) {
        previewContainer.addEventListener('scroll', handleScroll, { passive: true })
      }
    }

    // 初始检查一次吸顶状态
    updateStickyState()
  })
})

onUnmounted(() => {
  // 清理滚动监听器
  window.removeEventListener('scroll', handleScroll)

  // 清理窗口大小变化监听器
  window.removeEventListener('resize', handleScroll)

  // 清理预览容器的滚动监听器
  const previewContainer = document.querySelector('.component-list')
  if (previewContainer) {
    previewContainer.removeEventListener('scroll', handleScroll)
  }

  // 清理防抖计时器
  if (scrollTimer) {
    cancelAnimationFrame(scrollTimer)
    scrollTimer = null
  }

  // 清理过渡计时器
  if (transitionTimer) {
    clearTimeout(transitionTimer)
    transitionTimer = null
  }
})
</script>

<style scoped>
/* ===== 基础样式 - 所有环境共享 ===== */
.product-container {
  width: 100%;
  line-height: 24px;
  box-sizing: border-box;
  border: 1px solid transparent;
  overflow: hidden;
}

/* ===== 编辑环境样式 ===== */
.env-editing.product-container {
  min-width: 300px;
}

.env-editing.product-container:hover {
  border: 1px dashed #1890ff;
}

/* ===== 预览环境样式 ===== */
.env-preview.product-container {
  width: 100%;
  max-width: none; /* 移除最大宽度限制，让容器占满模拟器宽度 */
  margin: 0;
}

.env-preview.product-container:hover {
  border: none; /* 预览模式不显示编辑边框 */
}

/* ===== 全屏环境样式 ===== */
.env-fullscreen.product-container {
  width: 100vw;
  max-width: none;
  margin: 0;
  padding: 0;
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
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
  transform: translateZ(0); /* 启用硬件加速 */
  will-change: transform, box-shadow, background, border-radius; /* 优化性能 */
}

/* 吸顶状态样式 */
.product-tabs.is-sticky {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  margin-bottom: 0;
  border-radius: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(12px);
  background: rgba(250, 250, 250, 0.95);
  z-index: 1000;
  border-bottom: 2px solid #e0e0e0;
  transform: translateY(0) translateZ(0);
  animation: slideDownSticky 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* 取消吸顶动画样式 */
.product-tabs.unsticking {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  animation: slideUpUnsticky 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* 过渡状态优化 */
.product-tabs.is-transitioning {
  pointer-events: none; /* 过渡期间禁用交互 */
}

/* 预览环境下的吸顶样式 */
.env-preview .product-tabs.is-sticky {
  position: absolute;
  z-index: 100;
  left: 0;
  right: 0;
  background: rgba(250, 250, 250, 0.98);
}

.env-preview .product-tabs.unsticking {
  position: absolute;
  z-index: 100;
  animation: slideUpUnsticky 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* 全屏环境下的吸顶样式 */
.env-fullscreen .product-tabs.is-sticky {
  position: fixed;
  z-index: 1000;
  background: rgba(250, 250, 250, 0.95);
  backdrop-filter: blur(10px);
}

.env-fullscreen .product-tabs.unsticking {
  position: fixed;
  z-index: 1000;
  background: rgba(250, 250, 250, 0.95);
  backdrop-filter: blur(10px);
  animation: slideUpUnsticky 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.tab-item {
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
  transform: translateZ(0); /* 启用硬件加速 */
  will-change: transform, background, border-color, box-shadow; /* 性能优化 */
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
  transform: translateZ(0); /* 启用硬件加速 */
  will-change: padding-top; /* 性能优化 */
}

/* 有吸顶padding时的优化 */
.product-display.has-sticky-padding {
  backface-visibility: hidden; /* 减少重绘 */
  transform: translateZ(0); /* 确保硬件加速 */
}

/* 不同布局模式下的过渡优化 */
.layout-one-main-two-sub.has-sticky-padding,
.layout-two-columns.has-sticky-padding,
.layout-large-image.has-sticky-padding,
.layout-list.has-sticky-padding {
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* 商品卡片在过渡期间的优化 */
.has-sticky-padding .product-card {
  transform: translateZ(0);
  backface-visibility: hidden;
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

/* ===== 一大两小布局 - 基础样式 ===== */
.layout-one-main-two-sub {
  display: flex;
  flex-direction: column; /* 主产品和子产品区域上下排列 */
  gap: 8px;
  width: 100%;
  padding: 8px;
  background: #fafafa;
  border-radius: 12px;
  box-sizing: border-box;
  margin: 0 auto;
  min-height: auto; /* 让高度由内容的aspect-ratio决定 */
}

.main-product {
  width: 100%; /* 主产品占据全宽 */
  min-width: 0;
}

.sub-products {
  width: 100%; /* 子产品区域与主产品同宽 */
  display: flex;
  flex-direction: row; /* 两个子产品左右排列 */
  /* gap: 8px; */
  min-width: 0;
  box-sizing: border-box;
  justify-content: space-around;
}

/* 编辑环境 - 一大两小布局 */
.env-editing .layout-one-main-two-sub {
  max-width: 600px; /* 减小最大宽度，让比例更合理 */
  gap: 12px;
  padding: 12px;
  min-height: auto; /* 让高度由内容决定 */
}

.env-editing .sub-products {
  gap: 12px;
}

/* 预览环境 - 一大两小布局 */
.env-preview .layout-one-main-two-sub {
  max-width: none; /* 移除最大宽度限制，占满模拟器宽度 */
  gap: 6px;
  padding: 6px;
  min-height: auto; /* 让高度由内容决定 */
}

.env-preview .sub-products {
  justify-content: space-between;
}

.env-preview .sub-products .product-card,
.env-fullscreen .sub-products .product-card {
  width: 48%;
  min-height: 250px;
}

/* 全屏环境 - 一大两小布局 */
.env-fullscreen .layout-one-main-two-sub {
  max-width: 100%;
  gap: 16px;
  padding: 16px;
  min-height: auto; /* 让高度由内容决定 */
  width: 100vw;
}

/* ===== 两列布局 - 基础样式 ===== */
.layout-two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  width: 100%;
  padding: 8px;
  background: #fafafa;
  border-radius: 12px;
  box-sizing: border-box;
  margin: 0 auto;
}

/* 编辑环境 - 两列布局 */
.env-editing .layout-two-columns {
  max-width: 800px;
  width: 100%;
  gap: 12px;
  padding: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

/* 编辑环境下，两列卡片占满可用宽度，避免压缩成单行 */
.env-editing .layout-two-columns .product-card {
  max-width: none;
  width: 100%;
  justify-self: stretch;
}

/* 预览环境 - 两列布局 */
.env-preview .layout-two-columns {
  max-width: none; /* 移除最大宽度限制，占满模拟器宽度 */
  gap: 8px;
  padding: 8px;
}

/* 全屏环境 - 两列布局 */
.env-fullscreen .layout-two-columns {
  max-width: 100%;
  gap: 12px;
  padding: 12px;
  width: 100vw;
}

/* ===== 大图模式 - 基础样式 ===== */
.layout-large-image {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 8px;
  background: #fafafa;
  border-radius: 12px;
  box-sizing: border-box;
  margin: 0 auto;
}

/* 编辑环境 - 大图模式 */
.env-editing .layout-large-image {
  max-width: 100%;
  width: 100%;
  gap: 20px;
  padding: 12px;
}

/* 预览环境 - 大图模式 */
.env-preview .layout-large-image {
  max-width: none; /* 移除最大宽度限制，占满模拟器宽度 */
  width: 100%;
  gap: 16px;
  padding: 8px;
}

/* 全屏环境 - 大图模式 */
.env-fullscreen .layout-large-image {
  max-width: 100%;
  width: 100%;
  gap: 24px;
  padding: 16px;
}

/* ===== 列表模式 - 基础样式 ===== */
.layout-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 8px;
  background: #fafafa;
  border-radius: 12px;
  box-sizing: border-box;
  margin: 0 auto;
}

/* 编辑环境 - 列表模式 */
.env-editing .layout-list {
  max-width: 100%;
  width: 100%;
  gap: 16px;
  padding: 12px;
}

/* 预览环境 - 列表模式 */
.env-preview .layout-list {
  max-width: none; /* 移除最大宽度限制，占满模拟器宽度 */
  width: 100%;
  gap: 12px;
  padding: 8px;
}

/* 全屏环境 - 列表模式 */
.env-fullscreen .layout-list {
  max-width: 100%;
  width: 100%;
  gap: 20px;
  padding: 16px;
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
}

/* 确保标题在一大两小布局的主商品区域显示为一行
.main-product .product-title.on-main-two-sub {
  -webkit-line-clamp: 1;
  max-height: 1.5em;
  font-size: 16px;
  font-weight: 600;
} */

/* 主商品区域的价格样式 */
.main-product .product-price {
  font-size: 18px;
  font-weight: 700;
}

.product-card.medium {
  height: 260px;
}

.product-card.large-image {
  height: auto;
  min-height: 380px; /* 给大图卡片足够高度，避免文字区被压缩 */
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

/* 子产品样式 - 适应固定比例布局 */
.sub-products .product-card {
  flex: 1; /* 两个子产品平均分配宽度 */
  height: 100%; /* 填满子产品区域高度 */
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.sub-products .product-image-container {
  flex: 1; /* 图片容器占据剩余空间 */
  min-height: 0; /* 移除最小高度限制 */
  position: relative;
}

.sub-products .product-info {
  padding: 6px 8px; /* 减小内边距适应紧凑布局 */
  flex: 0 0 auto; /* 信息区域不缩放 */
}

.sub-products .product-title {
  font-size: 11px; /* 稍微减小字体 */
  line-height: 1.2;
  -webkit-line-clamp: 1; /* 只显示一行标题 */
  margin-bottom: 2px;
}

.sub-products .product-price {
  font-size: 12px; /* 减小价格字体 */
  font-weight: 600;
  margin-bottom: 1px;
}

.sub-products .product-sales,
.sub-products .product-rating {
  font-size: 9px; /* 进一步减小辅助信息字体 */
}

/* 子产品中的购物车按钮优化 */
.sub-products .cart-icon {
  font-size: 12px;
  padding: 3px;
  min-width: 20px;
  min-height: 20px;
  width: 20px;
  height: 20px;
}

/* 子产品中的标签优化 */
.sub-products .product-tags {
  top: 6px;
  left: 6px;
  gap: 2px;
}

.sub-products .tag {
  padding: 2px 4px;
  font-size: 8px;
  border-radius: 6px;
  max-width: 40px;
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
  /* 确保图片保持正确的宽高比 */
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

/* ===== 商品标签 - 基础样式 ===== */
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
}

/* 编辑环境 - 商品标签 */
.env-editing .product-tags {
  top: 12px;
  left: 12px;
  gap: 6px;
}

.env-editing .tag {
  padding: 4px 8px;
  font-size: 11px;
  border-radius: 12px;
  max-width: 100px;
}

.env-editing .tag:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
}

/* 预览环境 - 商品标签 */
.env-preview .product-tags {
  top: 8px;
  left: 8px;
  gap: 4px;
  max-width: 60px;
}

.env-preview .tag {
  padding: 2px 6px;
  font-size: 10px;
  border-radius: 8px;
  max-width: 100%;
  transform: scale(1);
}

.env-preview .tag:hover {
  transform: scale(1); /* 预览模式不放大 */
}

/* 全屏环境 - 商品标签 */
.env-fullscreen .product-tags {
  top: 12px;
  left: 12px;
  gap: 6px;
  max-width: 120px;
}

.env-fullscreen .tag {
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 12px;
  max-width: 100%;
}

.env-fullscreen .tag:hover {
  transform: scale(1); /* 全屏模式不放大 */
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
  min-height: 140px; /* 留出更多文本展示空间 */
}

/* 大图模式的图片区域单独控制高度，避免整体塌缩 */
.product-card.large-image .product-image-container {
  min-height: 220px;
  flex: 0 0 auto;
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
  -webkit-line-clamp: 2;
  max-height: 3em;
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

/* .product-title.on-main-two-sub {
  -webkit-line-clamp: 2;
  max-height: 2.4em;
  font-size: 12px;
  margin-bottom: 3px;
  line-height: 1.2;
} */

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
  font-size: 13px;
  color: #666;
  line-height: 1.4;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
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

  /* 小屏幕下的一大两小布局优化 */
  .layout-one-main-two-sub {
    gap: 4px;
    padding: 4px;
    min-height: auto; /* 让高度由内容决定 */
  }

  .main-product {
    min-width: 0;
  }

  .sub-products {
    gap: 4px; /* 减小间距适应小屏 */
    min-width: 0;
  }

  .sub-products .product-card {
    height: 100%; /* 填满容器高度 */
  }

  .sub-products .product-image-container {
    flex: 1;
    min-height: 0; /* 移除最小高度限制 */
  }

  .product-card.small,
  .product-card.on-main-two-sub {
    height: auto; /* 自适应高度 */
    min-height: 120px; /* 设置最小高度 */
  }

  /* 子产品卡片在小屏幕下的特殊处理 */
  .sub-products .product-card {
    flex: 1; /* 平均分配宽度 */
    height: auto;
    min-height: 120px;
  }

  .layout-two-columns {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 6px;
  }

  /* 编辑环境下仍保持两列，避免商品单行堆叠 */
  .env-editing .layout-two-columns {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    width: 100%;
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

/* 编辑页面大屏幕优化 */
@media (min-width: 1024px) {
  .layout-two-columns {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
    padding: 12px;
    max-width: 800px;
  }

  .layout-one-main-two-sub {
    gap: 12px;
    padding: 12px;
    min-height: auto; /* 让高度由内容决定 */
    max-width: 600px; /* 控制最大宽度保持合理比例 */
  }

  .sub-products {
    gap: 12px;
  }

  .layout-large-image,
  .layout-list {
    padding: 12px;
    gap: 16px;
  }

  .product-image-container {
    min-height: 180px;
  }

  .sub-products .product-image-container {
    min-height: 140px; /* 在大屏幕下增加图片高度 */
  }
}

/* 超大屏幕编辑页面优化 */
@media (min-width: 1440px) {
  .layout-two-columns {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    padding: 16px;
    max-width: 1000px;
  }

  .layout-one-main-two-sub {
    gap: 16px;
    padding: 16px;
    min-height: auto; /* 让高度由内容决定 */
    max-width: 800px; /* 控制最大宽度保持合理比例 */
  }

  .main-product {
  }

  .sub-products {
    gap: 16px;
  }

  .layout-large-image,
  .layout-list {
    padding: 16px;
    gap: 20px;
    max-width: 800px;
  }

  .product-image-container {
    min-height: 200px;
  }

  .sub-products .product-image-container {
    min-height: 160px; /* 在超大屏幕下进一步增加高度 */
  }

  .product-info {
    padding: 18px;
  }
}

/* 编辑页面特殊优化 - 确保商品卡片保持合理比例 */
.layout-two-columns .product-card {
  max-width: 300px; /* 限制单个商品卡片的最大宽度 */
  justify-self: center; /* 在Grid中居中显示 */
}

.layout-one-main-two-sub .product-card {
  max-width: none; /* 一大两小布局中不限制宽度 */
}

.layout-large-image .product-card {
  max-width: 400px; /* 大图模式限制最大宽度 */
  align-self: center; /* 在Flex中居中显示 */
}

.layout-list .product-card {
  max-width: 500px; /* 列表模式限制最大宽度 */
  align-self: center; /* 在Flex中居中显示 */
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

/* 吸顶动画 */
@keyframes slideDownSticky {
  0% {
    transform: translateY(-100%) translateZ(0);
    opacity: 0;
    box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  }
  50% {
    transform: translateY(-20%) translateZ(0);
    opacity: 0.7;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  100% {
    transform: translateY(0) translateZ(0);
    opacity: 1;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
}

/* 取消吸顶动画 */
@keyframes slideUpUnsticky {
  0% {
    transform: translateY(0) translateZ(0);
    opacity: 1;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
  30% {
    transform: translateY(-10%) translateZ(0);
    opacity: 0.8;
    box-shadow: 0 3px 15px rgba(0, 0, 0, 0.12);
  }
  70% {
    transform: translateY(-60%) translateZ(0);
    opacity: 0.3;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
  }
  100% {
    transform: translateY(-100%) translateZ(0);
    opacity: 0;
    box-shadow: 0 0 0 rgba(0, 0, 0, 0);
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
  name: 'ProductComponent',
}
</script>
