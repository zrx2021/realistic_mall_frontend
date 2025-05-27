<template>
  <a-layout>
    <a-layout-sider :style="siderStyle">
      <div class="logo_title">
        <img class="logo" src="@/assets/logo.svg" width="30px" />
        <span>电商管理后台</span>
      </div>
      <a-menu
        v-model:openKeys="state.openKeys"
        v-model:selectedKeys="state.selectedKeys"
        mode="inline"
        theme="dark"
        :inline-collapsed="state.collapsed"
        :items="items"
      ></a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header :style="headerStyle">Header</a-layout-header>
      <a-layout-content :style="contentStyle">Content</a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style>
.logo_title {
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 30px;
  height: 64px;
}
</style>

<script lang="ts">
export default {
  name: 'Main',
}
</script>

<script lang="ts" setup>
import { ref, watch, h } from 'vue'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  MailOutlined,
  DesktopOutlined,
  InboxOutlined,
  AppstoreOutlined,
} from '@ant-design/icons-vue'
const state = ref({
  collapsed: false,
  selectedKeys: ['1'],
  openKeys: ['sub1'],
  preOpenKeys: ['sub1'],
})
const items = ref([
  {
    key: '1',
    icon: () => h(InboxOutlined),
    label: 'Option 3',
    title: 'Option 3',
  },
  {
    key: 'sub1',
    icon: () => h(MailOutlined),
    label: 'Navigation One',
    title: 'Navigation One',
    children: [
      {
        key: '2',
        label: 'Option 5',
        title: 'Option 5',
      },
      {
        key: '3',
        label: 'Option 6',
        title: 'Option 6',
      },
      {
        key: '4',
        label: 'Option 7',
        title: 'Option 7',
      },
      {
        key: '5',
        label: 'Option 8',
        title: 'Option 8',
      },
    ],
  },
])
watch(
  () => state.value.openKeys,
  (_val, oldVal) => {
    state.value.preOpenKeys = oldVal
  },
)
const toggleCollapsed = () => {
  state.value.collapsed = !state.value.collapsed
  state.value.openKeys = state.value.collapsed ? [] : state.value.preOpenKeys
}

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
