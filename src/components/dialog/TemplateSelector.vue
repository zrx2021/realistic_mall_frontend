<template>
  <a-modal
    :open="props.isVisable"
    :footer="null"
    :closable="false"
    width="1000px"
    :wrap-class-name="'template-selector-modal'"
    @cancel="handleCancel"
  >
    <div class="modal-header">
      <h3 class="modal-title">选择页面模板</h3>
      <close-outlined class="close-icon" @click="handleCancel" />
    </div>

    <div class="search-section">
      <a-input-search
        v-model:value="searchValue"
        placeholder="请输入模板名称"
        style="width: 300px"
      />
    </div>

    <div class="tags-section">
      <a-radio-group v-model:value="selectedTag" button-style="solid" size="small" class="tags">
        <a-radio-button v-for="tag in tags" :key="tag.value" :value="tag.value" class="tag-button">
          {{ tag.label }}
        </a-radio-button>
      </a-radio-group>
    </div>

    <div class="templates-grid">
      <!-- 空白模板 -->
      <div class="template-card empty-template" @click="selectTemplate('empty')">
        <div class="template-icon">
          <plus-outlined />
        </div>
        <div class="template-name">使用空白模板</div>
      </div>
      <!-- 其他模板 -->
      <div
        v-for="template in displayTemplates"
        :key="template.id"
        class="template-card"
        @click="selectTemplate(template.id)"
      >
        <img :src="template.image" :alt="template.name" class="template-image" />
        <div class="template-name">{{ template.name }}</div>
      </div>
    </div>

    <div class="pagination-section">
      <a-pagination
        v-model:current="currentPage"
        :total="totalTemplates"
        :pageSize="pageSize"
        show-size-changer
        show-quick-jumper
      />
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, computed, defineEmits } from 'vue'
import { CloseOutlined, PlusOutlined } from '@ant-design/icons-vue'

const emit = defineEmits(['getSelectedId', 'closeDialog'])
const props = defineProps({
  isVisable: Boolean,
})

// 搜索
const searchValue = ref('')

// 标签数据
const tags = [
  { label: '全部', value: 'all' },
  { label: '官方模板', value: 'official' },
  { label: '电商模板', value: 'ecommerce' },
  { label: '营销模板', value: 'marketing' },
  { label: '自定义模板', value: 'custom' },
]
const selectedTag = ref('all')

// 模板数据
const templates = [
  {
    id: '1',
    name: '电商首页模板',
    image: '/templates/ecommerce-home.jpg',
    type: 'ecommerce',
  },
  {
    id: '2',
    name: '产品详情模板',
    image: '/templates/product-detail.jpg',
    type: 'ecommerce',
  },
  // 添加更多模板...
]

// 分页
const currentPage = ref(1)
const pageSize = ref(12)
const totalTemplates = computed(() => templates.length)

// 展示的模板
const displayTemplates = computed(() => {
  let filtered = templates

  // 搜索过滤
  if (searchValue.value) {
    filtered = filtered.filter((t) =>
      t.name.toLowerCase().includes(searchValue.value.toLowerCase()),
    )
  }

  // 标签过滤
  if (selectedTag.value !== 'all') {
    filtered = filtered.filter((t) => t.type === selectedTag.value)
  }

  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  return filtered.slice(start, start + pageSize.value)
})

// 处理关闭
const handleCancel = () => {
  emit('closeDialog')
}

// 处理模板选择
const selectTemplate = (templateId: string) => {
  emit('getSelectedId', templateId)
  handleCancel()
}
</script>

<style scoped>
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.close-icon {
  font-size: 18px;
  cursor: pointer;
  color: #999;
  transition: color 0.3s;
}

.tags {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
}

.close-icon:hover {
  color: #666;
}

.search-section {
  margin-bottom: 16px;
}

.tags-section {
  margin-bottom: 24px;
}

:deep(.ant-radio-button-wrapper) {
  border: none !important;
}

:deep(.ant-radio-button-wrapper::before) {
  display: none !important;
}

:deep(.tag-button) {
  height: 22px;
  color: #333;
  font-size: 12px;
  border-radius: 4px;
  background: #f5f5f5;
}

:deep(.tag-button:hover) {
  color: #1890ff;
}

:deep(.ant-radio-button-wrapper-checked) {
  background: #1890ff !important;
  border-color: #1890ff !important;
  color: #fff !important;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 24px;
}

.template-card {
  aspect-ratio: 2/3;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
}

.template-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.empty-template {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fafafa;
}

.template-icon {
  font-size: 32px;
  color: #bfbfbf;
  margin-bottom: 8px;
}

.template-image {
  width: 100%;
  height: calc(100% - 40px);
  object-fit: cover;
}

.template-name {
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #666;
}

.pagination-section {
  display: flex;
  justify-content: flex-end;
}

:deep(.ant-modal-content) {
  padding: 24px;
}
</style>
