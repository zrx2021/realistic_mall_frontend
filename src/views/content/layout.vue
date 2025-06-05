<template>
  <a-layout>
    <a-layout-header :class="headerStyle">{{ 'Header' }}</a-layout-header>
    <a-layout-content>{{ 'Content' }}</a-layout-content>
  </a-layout>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'

const headerStyle: CSSProperties = {
  background: '#fff',
  padding: '0 20px',
  height: '64px',
}
</script>

<style scoped></style>

<script lang="ts">
export default {
  name: 'ContentPageEdit',
}
</script>
