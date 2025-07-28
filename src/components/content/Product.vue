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
          <div class="product-placeholder large">
            <div class="product-image"></div>
            <div class="product-info">
              <div class="product-title">商品标题</div>
              <div class="product-price">¥99.00</div>
            </div>
          </div>
        </div>
        <div class="sub-products">
          <div class="product-placeholder small">
            <div class="product-image"></div>
            <div class="product-info">
              <div class="product-title">商品标题</div>
              <div class="product-price">¥99.00</div>
            </div>
          </div>
          <div class="product-placeholder small">
            <div class="product-image"></div>
            <div class="product-info">
              <div class="product-title">商品标题</div>
              <div class="product-price">¥99.00</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 两列布局 -->
      <div v-else-if="showData.templateStyle === 'twoColumns'" class="layout-two-columns">
        <div v-for="i in 4" :key="i" class="product-placeholder medium">
          <div class="product-image"></div>
          <div class="product-info">
            <div class="product-title">商品标题</div>
            <div class="product-price">¥99.00</div>
          </div>
        </div>
      </div>

      <!-- 大图模式 -->
      <div v-else-if="showData.templateStyle === 'largeImage'" class="layout-large-image">
        <div v-for="i in 2" :key="i" class="product-placeholder large-image">
          <div class="product-image"></div>
          <div class="product-info">
            <div class="product-title">商品标题</div>
            <div class="product-price">¥99.00</div>
          </div>
        </div>
      </div>

      <!-- 列表模式 -->
      <div v-else-if="showData.templateStyle === 'list'" class="layout-list">
        <div v-for="i in 3" :key="i" class="product-placeholder list-item">
          <div class="product-image"></div>
          <div class="product-info">
            <div class="product-title">商品标题</div>
            <div class="product-price">¥99.00</div>
            <div class="product-desc">商品描述信息</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Goods } from '@/types/content/content'

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
})

const activeGroupId = ref(-1)

const switchGroup = (groupId: number) => {
  activeGroupId.value = groupId
  // 这里可以添加切换分组的逻辑
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
  padding: 16px;
  border-radius: 6px;
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
  gap: 12px;
}

.main-product {
  flex: 2;
}

.sub-products {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 两列布局 */
.layout-two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* 大图模式 */
.layout-large-image {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 列表模式 */
.layout-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 商品占位符 */
.product-placeholder {
  border-radius: 6px;
  overflow: hidden;
  transition: all 0.3s;
}

.product-placeholder:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-placeholder.large {
  height: 200px;
}

.product-placeholder.medium {
  height: 160px;
}

.product-placeholder.small {
  height: 80px;
  display: flex;
  gap: 8px;
}

.product-placeholder.large-image {
  height: 120px;
  display: flex;
  gap: 12px;
}

.product-placeholder.list-item {
  height: 80px;
  display: flex;
  gap: 12px;
  padding: 12px;
  border: 1px solid #f0f0f0;
}

/* 商品图片 */
.product-image {
  background: #f0f0f0;
  border-radius: 4px;
  flex-shrink: 0;
}

.large .product-image {
  height: 140px;
  margin-bottom: 8px;
}

.medium .product-image {
  height: 100px;
  margin-bottom: 8px;
}

.small .product-image {
  width: 60px;
  height: 60px;
}

.large-image .product-image {
  width: 100px;
  height: 100px;
}

.list-item .product-image {
  width: 60px;
  height: 60px;
}

/* 商品信息 */
.product-info {
  padding: 8px;
  flex: 1;
}

.small .product-info,
.large-image .product-info,
.list-item .product-info {
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.product-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  font-size: 16px;
  color: #ff4d4f;
  font-weight: 600;
}

.product-desc {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

<script lang="ts">
export default {
  name: 'Product',
}
</script>
