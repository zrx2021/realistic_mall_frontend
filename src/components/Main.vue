<template>
  <a-layout>
    <a-layout-sider :style="siderStyle">Sider</a-layout-sider>
    <a-layout>
      <a-layout-header :style="headerStyle">Header</a-layout-header>
      <a-layout-content :style="contentStyle">Content</a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
export default {
  name: 'Main',
}
</script>

<script lang="ts" setup>
import type { CSSProperties } from 'vue'
const headerStyle: CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#7dbcea',
}

const contentStyle: CSSProperties = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#108ee9',
}

const siderStyle: CSSProperties = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#3ba0e9',
}
</script>
