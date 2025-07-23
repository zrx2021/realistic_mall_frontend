<template>
  <div class="title-setting">
    <h4>标题</h4>
    <div class="title-input">
      <a-input
        v-model:value="title"
        :style="titleClass"
        placeholder="请输入标题"
        @blur="changing"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type CSSProperties, onMounted, watch } from 'vue'
import type { TextComponent } from '@/types/content/content'

const props = defineProps<{
  objData: string | TextComponent
}>()

const emits = defineEmits(['update:objData'])

const title = ref('')
const titleClass = ref<CSSProperties>({
  width: '200px',
})

const changing = () => {
  console.log('TitleSetting changing', title.value)
  if (typeof props.objData === 'string') {
    // 如果原来是字符串格式，保持字符串格式
    emits('update:objData', title.value)
  } else {
    // 如果原来是对象格式，保持对象格式
    emits('update:objData', {
      ...props.objData,
      titleContent: title.value,
    })
  }
}

onMounted(() => {
  if (typeof props.objData === 'string') {
    title.value = props.objData
  } else {
    title.value = props.objData.titleContent
  }
})

watch(
  () => props.objData,
  (newVal) => {
    if (typeof newVal === 'string') {
      title.value = newVal
    } else {
      title.value = newVal.titleContent
    }
  },
)
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
