<template>
  <div class="title-setting">
    <h4>标题</h4>
    <div class="title-input">
      <a-input v-model:value="title" :style="titleClass" placeholder="请输入标题" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type CSSProperties } from 'vue'

const title = ref('')
const titleClass = ref<CSSProperties>({
  width: '200px',
})
</script>

<style scoped>
.title-setting {
  width: 100%;
  height: 100%;
  padding: 16px;
  overflow-y: auto;
}

h4 {
  margin-bottom: 12px;
}
</style>

<script lang="ts">
export default {
  name: 'TitleSetting',
}
</script>
