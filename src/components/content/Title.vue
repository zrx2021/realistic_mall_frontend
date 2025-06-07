<template class="title-container">
  <h3 v-text="props.ObjData"></h3>
</template>

<script setup lang="ts">
const props = defineProps<{
  ObjData: string
}>()
</script>

<style scoped>
.title-container {
  box-sizing: border-box;
  width: 100%;
}

h3:hover {
  border: 1px dashed #1890ff;
}

h3 {
  margin: 0;
  height: 30px;
  width: 373px;
  padding-left: 15px;
  font-size: 16px;
  line-height: 30px;
  color: #333;
  text-align: left;
  border: 1px solid transparent;
}
</style>

<script lang="ts">
export default {
  name: 'EditorTitle',
}
</script>
