# 方案C：组件级样式隔离实现

## 🎯 概述

方案C实现了组件级样式隔离，让每个组件自己管理在不同环境下的样式表现。这种方案提供了更好的维护性、可扩展性和类型安全。

## 🏗️ 架构设计

### 核心概念

```typescript
// 环境类型定义
type ComponentEnvironment = 'editing' | 'preview' | 'fullscreen'

// 组件接收environment prop
interface ComponentProps {
  objData: ComponentData
  environment?: ComponentEnvironment
}
```

### 环境说明

| 环境         | 使用场景   | 特点                               |
| ------------ | ---------- | ---------------------------------- |
| `editing`    | 页面编辑器 | PC端优化，显示交互效果，有编辑边框 |
| `preview`    | 移动端预览 | 模拟器预览，固定360px宽度          |
| `fullscreen` | 全屏预览   | 真实设备测试，完全沉浸式体验       |

## 📁 文件结构

```
src/
├── types/
│   └── environment.ts          # 环境类型定义和设计令牌
├── components/content/
│   └── Product.vue             # 商品组件（已适配）
├── views/content/pages/
│   └── layout.vue              # 编辑页面（传递editing环境）
├── components/dialog/
│   └── MobilePreview.vue       # 预览页面（传递preview/fullscreen环境）
└── views/
    └── environment-demo.vue    # 演示页面
```

## 🔧 核心实现

### 1. 环境类型系统 (`types/environment.ts`)

```typescript
export type ComponentEnvironment = 'editing' | 'preview' | 'fullscreen'

export const environmentTokens: Record<ComponentEnvironment, EnvironmentConfig> = {
  editing: {
    maxWidth: '800px',
    padding: '12px',
    gap: '12px',
    showInteraction: true,
    showEditingBorder: true,
  },
  preview: {
    maxWidth: '360px',
    padding: '8px',
    gap: '8px',
    showInteraction: false,
    showEditingBorder: false,
  },
  fullscreen: {
    maxWidth: '100%',
    padding: '16px',
    gap: '16px',
    showInteraction: false,
    showEditingBorder: false,
  },
}
```

### 2. 组件环境适配 (`Product.vue`)

```vue
<template>
  <div
    class="product-container"
    :class="[`template-${showData.templateStyle}`, `env-${environment}`, environmentClass]"
  >
    <!-- 组件内容 -->
  </div>
</template>

<script setup lang="ts">
import type { ComponentEnvironment } from '@/types/environment'

const props = defineProps<{
  objData: Goods
  environment?: ComponentEnvironment
}>()

const environment = computed(() => props.environment || 'editing')
const environmentClass = computed(() => `product-${environment.value}`)
</script>

<style scoped>
/* 基础样式 - 所有环境共享 */
.product-container {
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* 编辑环境样式 */
.env-editing.product-container {
  min-width: 300px;
}

.env-editing.product-container:hover {
  border: 1px dashed #1890ff;
}

/* 预览环境样式 */
.env-preview.product-container {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
}

/* 全屏环境样式 */
.env-fullscreen.product-container {
  width: 100vw;
  max-width: none;
}
</style>
```

### 3. 环境参数传递

#### 编辑页面 (`layout.vue`)

```vue
<component :is="getComponent(element.type)" :objData="indexData[index]" :environment="'editing'" />
```

#### 预览页面 (`MobilePreview.vue`)

```vue
<component
  :is="getComponent(element.type)"
  :objData="element.objData"
  :environment="isFullscreen ? 'fullscreen' : 'preview'"
/>
```

## 🎨 样式组织结构

### CSS组织原则

```css
/* ===== 基础样式 - 所有环境共享 ===== */
.component-base {
  /* 通用样式 */
}

/* ===== 编辑环境样式 ===== */
.env-editing .component-base {
  /* 编辑环境特定样式 */
}

/* ===== 预览环境样式 ===== */
.env-preview .component-base {
  /* 预览环境特定样式 */
}

/* ===== 全屏环境样式 ===== */
.env-fullscreen .component-base {
  /* 全屏环境特定样式 */
}
```

### 布局样式示例

```css
/* 两列布局 - 基础样式 */
.layout-two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  width: 100%;
}

/* 编辑环境 - 两列布局 */
.env-editing .layout-two-columns {
  max-width: 800px;
  gap: 12px;
  padding: 12px;
}

/* 预览环境 - 两列布局 */
.env-preview .layout-two-columns {
  max-width: 360px;
  gap: 8px;
  padding: 8px;
}

/* 全屏环境 - 两列布局 */
.env-fullscreen .layout-two-columns {
  max-width: 100%;
  gap: 12px;
  padding: 12px;
}
```

## 🚀 使用方法

### 1. 在新组件中实现环境隔离

```vue
<template>
  <div class="my-component" :class="`env-${environment}`">
    <!-- 组件内容 -->
  </div>
</template>

<script setup lang="ts">
import type { ComponentEnvironment } from '@/types/environment'

const props = defineProps<{
  environment?: ComponentEnvironment
}>()

const environment = computed(() => props.environment || 'editing')
</script>

<style scoped>
/* 基础样式 */
.my-component {
  /* ... */
}

/* 环境特定样式 */
.env-editing.my-component {
  /* 编辑环境样式 */
}

.env-preview.my-component {
  /* 预览环境样式 */
}

.env-fullscreen.my-component {
  /* 全屏环境样式 */
}
</style>
```

### 2. 在父组件中传递环境参数

```vue
<MyComponent :environment="currentEnvironment" :other-props="..." />
```

## 📊 演示页面

访问 `/environment-demo` 路由查看完整的演示效果，包括：

- 实时环境切换
- 三环境对比显示
- 环境配置信息展示
- 布局样式切换

## ✅ 优势

1. **样式隔离** - 每个组件管理自己的多环境样式
2. **类型安全** - TypeScript完整类型支持
3. **易于维护** - 样式逻辑集中在组件内部
4. **可扩展性** - 轻松添加新环境或修改现有环境
5. **性能优化** - 避免全局样式冲突
6. **开发体验** - 清晰的环境概念和API

## 🔄 迁移指南

### 从旧方案迁移到方案C

1. **添加environment prop**

   ```typescript
   const props = defineProps<{
     // 现有props...
     environment?: ComponentEnvironment
   }>()
   ```

2. **重构CSS样式**

   ```css
   /* 旧的 */
   .component {
     /* 样式 */
   }

   /* 新的 */
   .env-editing .component {
     /* 编辑环境样式 */
   }
   .env-preview .component {
     /* 预览环境样式 */
   }
   .env-fullscreen .component {
     /* 全屏环境样式 */
   }
   ```

3. **更新组件使用**

   ```vue
   <!-- 旧的 -->
   <Component :objData="data" />

   <!-- 新的 -->
   <Component :objData="data" :environment="'editing'" />
   ```

## 🎯 最佳实践

1. **环境默认值** - 始终提供默认环境（通常是'editing'）
2. **样式继承** - 基础样式在环境样式中继承和覆盖
3. **类型安全** - 使用TypeScript确保环境参数正确
4. **测试覆盖** - 为每个环境编写测试用例
5. **文档更新** - 及时更新组件文档说明环境差异

## 🆕 最新更新

### 一大两小布局优化 (2024-12-19)

**新的排列方式：**

- 📱 **主产品**：占据上方区域，更突出地展示主推商品
- 🔄 **子产品**：在下方左右排列，平均分配空间

**布局结构：**

```
┌─────────────────────────┐
│                         │
│      主产品区域          │
│                         │
├──────────┬──────────────┤
│          │              │
│ 子产品1  │   子产品2    │
│          │              │
└──────────┴──────────────┘
```

**优化亮点：**

- ✅ 主产品获得更大展示空间，提升转化率
- ✅ 子产品左右排列，视觉平衡更好
- ✅ 响应式适配，在不同屏幕下都有最佳效果
- ✅ 三环境统一，保持一致的用户体验

### 预览环境宽度修复 (2024-12-19)

**问题描述：**

- 🐛 预览环境下所有布局被限制在 `max-width: 360px`
- 🐛 导致右侧出现空隙，无法占满模拟器宽度

**修复内容：**

```css
/* 修复前 */
.env-preview .layout-* {
  max-width: 360px; /* ❌ 限制宽度 */
}

/* 修复后 */
.env-preview .layout-* {
  max-width: none; /* ✅ 占满模拟器宽度 */
}
```

**涉及布局：**

- ✅ 产品容器 `.env-preview.product-container`
- ✅ 一大两小布局 `.env-preview .layout-one-main-two-sub`
- ✅ 两列布局 `.env-preview .layout-two-columns`
- ✅ 大图模式 `.env-preview .layout-large-image`
- ✅ 列表模式 `.env-preview .layout-list`

### 一大两小布局比例优化 (2024-12-19)

**问题描述：**

- 🐛 元素宽度过大，布局比例不够精确
- 🐛 子产品尺寸与主产品缺乏明确的比例关系

**优化方案：**

```css
/* 精确比例控制 */
.main-product {
  aspect-ratio: 2/1; /* 主产品2:1比例 */
}

.sub-products {
  aspect-ratio: 4/1; /* 子产品区域4:1比例 */
}

.sub-products .product-card {
  aspect-ratio: 2/1; /* 每个子产品2:1比例 */
}
```

**布局结构：**

```
┌─────────────────────────┐  ← 主产品 (2:1)
│                         │
│      主产品区域          │
│                         │
├───────────┬─────────────┤  ← 子产品区域 (4:1)
│   子产品1  │   子产品2   │    每个子产品 (2:1)
│   (2:1)   │   (2:1)    │
└───────────┴─────────────┘
```

**优化亮点：**

- ✅ **精确比例**：使用 aspect-ratio 确保固定宽高比
- ✅ **协调关系**：子产品高度正好是主产品高度的一半
- ✅ **响应式**：比例在任何屏幕尺寸下都保持一致
- ✅ **视觉平衡**：数学精确的比例关系确保美观

### 商品分组标签吸顶功能 (2024-12-19)

**功能描述：**

- 🎯 当向上滚动时，商品分组标签区域固定在屏幕顶部
- 📍 只有商品组件顶端到达页面最顶端时才开始吸顶
- 🔄 商品展示区域继续滚动，分组标签始终可见
- 📱 智能检测商品展示区域位置，控制分页功能

**技术实现：**

```typescript
// 核心状态管理
const isTabsSticky = ref(false)
const stickyTabsHeight = ref(0)

// 滚动监听与吸顶检测
const updateStickyState = () => {
  const containerRect = productContainerRef.value.getBoundingClientRect()
  const containerTop = containerRect.top

  if (containerTop <= 0) {
    isTabsSticky.value = true
    stickyTabsHeight.value = productTabsRef.value.offsetHeight
  } else {
    isTabsSticky.value = false
  }
}

// 智能分页检测
const checkLoadMore = () => {
  const displayRect = productDisplayRef.value.getBoundingClientRect()
  const distanceFromBottom = displayRect.bottom - window.innerHeight

  if (distanceFromBottom <= 200 && hasMoreProducts.value) {
    loadMoreProducts()
  }
}
```

**样式适配：**

```css
/* 吸顶状态样式 */
.product-tabs.is-sticky {
  position: fixed;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(8px);
  background: rgba(250, 250, 250, 0.95);
}

/* 三环境适配 */
.env-preview .product-tabs.is-sticky {
  position: absolute;
}
.env-fullscreen .product-tabs.is-sticky {
  position: fixed;
}
```

**功能亮点：**

- ✅ **智能触发**：精确检测商品组件位置
- ✅ **平滑过渡**：300ms动画过渡效果
- ✅ **环境适配**：三环境下不同的定位策略
- ✅ **性能优化**：防抖处理，避免频繁计算
- ✅ **分页智能**：基于展示区域位置的精确分页

### 商品展示数量优化 (2024-12-19)

**优化目标：**

- 🎯 平衡首屏展示内容与加载性能
- 🎯 减少用户感知的频繁加载次数
- 🎯 提供合适的商品浏览体验

**调整内容：**

```typescript
// 从10个商品调整为8个商品
const pageSize = ref(8) // 每页加载8个商品，平衡首屏展示与加载频率
```

**8个商品的优势：**

- ✅ **性能平衡**：既不会初始加载过多，也不会内容过少
- ✅ **布局友好**：两列布局4行，一大两小布局1+2+5分布合理
- ✅ **用户体验**：减少频繁分页，提供足够的浏览内容
- ✅ **加载优化**：合理的首屏内容量，后续分页体验更佳

## 📝 后续计划

- [ ] 扩展到其他组件（Title, Elevator等）
- [ ] 添加环境间样式转换动画
- [ ] 实现样式热重载和实时预览
- [ ] 添加可视化环境配置工具
- [ ] 性能优化和样式代码分割
