<template>
  <div class="environment-demo">
    <div class="demo-header">
      <h1>组件环境样式隔离演示</h1>
      <p>展示同一个Product组件在不同环境下的样式表现</p>
    </div>

    <div class="demo-controls">
      <div class="control-group">
        <label>当前测试环境：</label>
        <select v-model="currentEnvironment" class="environment-select">
          <option value="editing">编辑环境 (Editing)</option>
          <option value="preview">预览环境 (Preview)</option>
          <option value="fullscreen">全屏环境 (Fullscreen)</option>
        </select>
      </div>

      <div class="control-group">
        <label>布局样式：</label>
        <select v-model="templateStyle" class="template-select">
          <option value="twoColumns">两列布局</option>
          <option value="oneMainTwoSub">一大两小 (上下排列)</option>
          <option value="largeImage">大图模式</option>
          <option value="list">列表模式</option>
        </select>
      </div>
    </div>

    <div class="demo-content">
      <div class="layout-info" v-if="templateStyle === 'oneMainTwoSub'">
        <div class="info-card">
          <h3>📱 一大两小布局说明</h3>
          <p><strong>精确比例设计：</strong></p>
          <ul>
            <li>📏 <strong>主产品</strong>：2:1 宽高比，占据上方区域</li>
            <li>🔄 <strong>子产品区域</strong>：4:1 宽高比，与主产品等宽</li>
            <li>📐 <strong>每个子产品</strong>：2:1 宽高比，左右平分空间</li>
            <li>⚖️ <strong>空间关系</strong>：子产品高度是主产品高度的一半</li>
          </ul>
          <p class="highlight">✨ 精确的比例设计确保布局在任何尺寸下都保持协调美观</p>
        </div>
      </div>

      <div class="demo-section">
        <h2>当前环境: {{ environmentLabels[currentEnvironment] }}</h2>
        <div class="demo-container" :class="`container-${currentEnvironment}`">
          <Product :objData="demoProductData" :environment="currentEnvironment" />
        </div>
      </div>

      <div class="demo-comparison">
        <h2>三环境对比</h2>
        <div class="comparison-grid">
          <div class="comparison-item">
            <h3>编辑环境</h3>
            <div class="demo-container container-editing">
              <Product :objData="demoProductData" environment="editing" />
            </div>
          </div>

          <div class="comparison-item">
            <h3>预览环境</h3>
            <div class="demo-container container-preview">
              <Product :objData="demoProductData" environment="preview" />
            </div>
          </div>

          <div class="comparison-item">
            <h3>全屏环境</h3>
            <div class="demo-container container-fullscreen">
              <Product :objData="demoProductData" environment="fullscreen" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="demo-info">
      <h2>环境配置信息</h2>
      <div class="config-grid">
        <div class="config-item" v-for="(config, env) in environmentTokens" :key="env">
          <h3>{{ environmentLabels[env as ComponentEnvironment] }}</h3>
          <ul>
            <li><strong>最大宽度:</strong> {{ config.maxWidth }}</li>
            <li><strong>内边距:</strong> {{ config.padding }}</li>
            <li><strong>间距:</strong> {{ config.gap }}</li>
            <li><strong>交互效果:</strong> {{ config.showInteraction ? '是' : '否' }}</li>
            <li><strong>编辑边框:</strong> {{ config.showEditingBorder ? '是' : '否' }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Product from '@/components/content/Product.vue'
import type { Goods } from '@/types/content/content'
import type { ComponentEnvironment } from '@/types/environment'
import { environmentTokens } from '@/types/environment'
import { getGoodsImageUrl } from '@/utils/image'

const currentEnvironment = ref<ComponentEnvironment>('editing')
const templateStyle = ref('twoColumns')

const environmentLabels: Record<ComponentEnvironment, string> = {
  editing: '编辑环境',
  preview: '预览环境',
  fullscreen: '全屏环境',
}

// 演示用的商品数据
const demoProductData = computed<Goods>(() => ({
  goodsId: 1,
  componentId: 1,
  templateStyle: templateStyle.value,
  goodsList: [
    {
      id: 1,
      name: 'iPhone 15 Pro Max 256GB 深空黑色',
      description: '钛金属设计，A17 Pro芯片，专业级摄像头系统',
      price: 9999,
      originalPrice: 10999,
      imageUrl: getGoodsImageUrl('iPhone 15 Pro Max 256GB 深空黑色.webp'),
      stock: 50,
      sales: 1234,
      rating: 4.8,
      tags: ['热销', '新品', '5G'],
      discount: 9,
      isHot: true,
      isNew: true,
      category: '数码影音',
    },
    {
      id: 2,
      name: '小米13 Ultra 徕卡影像旗舰手机',
      description: '徕卡专业影像，骁龙8 Gen2处理器',
      price: 5999,
      originalPrice: 6499,
      imageUrl: getGoodsImageUrl('小米13 Ultra 徕卡影像旗舰手机.webp'),
      stock: 30,
      sales: 856,
      rating: 4.7,
      tags: ['徕卡', '影像'],
      discount: 8,
      category: '数码影音',
    },
    {
      id: 3,
      name: 'AirPods Pro 第二代',
      description: '主动降噪，空间音频，无线充电',
      price: 1899,
      originalPrice: 2199,
      imageUrl: getGoodsImageUrl('AirPods Pro 第二代.webp'),
      stock: 100,
      sales: 2341,
      rating: 4.6,
      tags: ['降噪', '无线'],
      category: '数码影音',
    },
    {
      id: 4,
      name: 'MacBook Pro 14英寸 M3芯片',
      description: 'M3芯片，Liquid Retina XDR显示屏，专业级性能',
      price: 14999,
      originalPrice: 15999,
      imageUrl: getGoodsImageUrl('MacBook Pro 14英寸 M3芯片.webp'),
      stock: 25,
      sales: 567,
      rating: 4.9,
      tags: ['新品', '专业'],
      discount: 6,
      isNew: true,
      category: '数码影音',
    },
  ],
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
}))
</script>

<style scoped>
.environment-demo {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.demo-header {
  text-align: center;
  margin-bottom: 40px;
}

.demo-header h1 {
  color: #1890ff;
  margin-bottom: 10px;
}

.demo-header p {
  color: #666;
  font-size: 16px;
}

.demo-controls {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-group label {
  font-weight: 600;
  color: #333;
}

.environment-select,
.template-select {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  min-width: 150px;
}

.demo-content {
  margin-bottom: 40px;
}

.layout-info {
  margin-bottom: 30px;
}

.info-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.info-card h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
  font-weight: 600;
}

.info-card p {
  margin: 10px 0;
  line-height: 1.6;
}

.info-card ul {
  margin: 15px 0;
  padding-left: 20px;
}

.info-card li {
  margin: 8px 0;
  line-height: 1.5;
}

.info-card .highlight {
  background: rgba(255, 255, 255, 0.15);
  padding: 12px;
  border-radius: 8px;
  margin-top: 15px;
  border-left: 4px solid rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

.demo-section {
  margin-bottom: 50px;
}

.demo-section h2 {
  color: #333;
  border-bottom: 2px solid #1890ff;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.demo-container {
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  position: relative;
}

.demo-container::before {
  content: attr(class);
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(24, 144, 255, 0.1);
  color: #1890ff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  z-index: 100;
  pointer-events: none;
}

.container-editing {
  background: #fff7e6;
  border-color: #ffa940;
}

.container-editing::before {
  content: '编辑环境';
  background: rgba(255, 169, 64, 0.2);
  color: #fa8c16;
}

.container-preview {
  background: #f6ffed;
  border-color: #73d13d;
}

.container-preview::before {
  content: '预览环境';
  background: rgba(115, 209, 61, 0.2);
  color: #52c41a;
}

.container-fullscreen {
  background: #f0f5ff;
  border-color: #40a9ff;
}

.container-fullscreen::before {
  content: '全屏环境';
  background: rgba(64, 169, 255, 0.2);
  color: #1890ff;
}

.demo-comparison h2 {
  color: #333;
  border-bottom: 2px solid #52c41a;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.comparison-item h3 {
  text-align: center;
  margin-bottom: 15px;
  color: #595959;
}

.demo-info {
  background: #fafafa;
  padding: 30px;
  border-radius: 8px;
}

.demo-info h2 {
  color: #333;
  border-bottom: 2px solid #722ed1;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.config-item {
  background: white;
  padding: 20px;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
}

.config-item h3 {
  color: #1890ff;
  margin-bottom: 15px;
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 8px;
}

.config-item ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.config-item li {
  padding: 5px 0;
  border-bottom: 1px dashed #f0f0f0;
  color: #666;
}

.config-item li:last-child {
  border-bottom: none;
}

/* 响应式适配 */
@media (max-width: 1200px) {
  .comparison-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .demo-controls {
    flex-direction: column;
    gap: 15px;
  }

  .control-group {
    flex-direction: column;
    text-align: center;
  }

  .environment-select,
  .template-select {
    min-width: 200px;
  }
}
</style>
