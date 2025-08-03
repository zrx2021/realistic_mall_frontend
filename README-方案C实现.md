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

## 📝 后续计划

- [ ] 扩展到其他组件（Title, Elevator等）
- [ ] 添加环境间样式转换动画
- [ ] 实现样式热重载和实时预览
- [ ] 添加可视化环境配置工具
- [ ] 性能优化和样式代码分割
