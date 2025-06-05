<template>
  <a-flex :style="containerStyle" vertical gap="middle">
    <a-flex :style="boxStyle" justify="space-around" vertical gap="middle">
      <a-button type="primary">Primary</a-button>
      <a-button type="primary">Primary</a-button>
      <a-button type="primary">Primary</a-button>
      <a-button type="primary">Primary</a-button>
    </a-flex>
    <a-flex :style="boxStyle" justify="space-around" vertical gap="middle">
      <a-button type="primary">Primary</a-button>
      <a-button type="primary">Primary</a-button>
      <a-button type="primary">Primary</a-button>
      <a-button type="primary">Primary</a-button>
    </a-flex>
  </a-flex>
</template>

<script lang="ts">
export default {
  name: 'ContentsManagement',
}
</script>

<script lang="ts" setup>
import type { CSSProperties } from 'vue'

const containerStyle: CSSProperties = {
  width: '100%',
  margin: '20px 0',
  justifyContent: 'space-around',
  backgroundColor: '#F4F4F4',
}

const boxStyle: CSSProperties = {
  width: '80%',
  margin: '0 auto',
  padding: '24px',
  borderRadius: '6px',
  backgroundColor: '#fff',
}
</script>

<style scoped></style>
