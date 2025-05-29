<template>
  <a-layout>
    <a-layout-sider :style="siderStyle">
      <div class="logo_title">
        <img class="logo" src="@/assets/logo.svg" width="30px" />
        <span>电商管理后台</span>
      </div>
      <div class="menu_span"></div>
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

<style scoped>
.logo_title {
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 30px;
  height: 64px;
}

/* 修改菜单项的圆角 */
:deep(.ant-menu-dark .ant-menu-item),
:deep(.ant-menu-dark .ant-menu-submenu-title) {
  border-radius: 3px;
}

.menu_span {
  width: 100%;
  height: 30px;
  background-color: #232b40;
}

/* 修改侧边栏背景色 */
:deep(.ant-layout-sider) {
  background-color: #232b40 !important; /* 深灰色背景 */
  color: #d5d7dd;
}

:deep(.ant-menu-dark) {
  background-color: #232b40 !important;
  color: #d5d7dd;
}

:deep(.ant-menu-inline) {
  background-color: #232b40 !important;
  color: #d5d7dd;
}

/* 一级菜单项悬浮 */
:deep(.ant-menu-dark .ant-menu-item:not(.ant-menu-item-selected):hover),
:deep(.ant-menu-dark .ant-menu-submenu-title:not(.ant-menu-item-selected):hover) {
  background-color: #3f475b !important;
}

/* 子菜单项悬浮*/
:deep(.ant-menu-dark .ant-menu-submenu .ant-menu-item:not(.ant-menu-item-selected):hover) {
  background-color: #3f475b !important;
}
</style>

<script lang="ts">
export default {
  name: 'Main',
}
</script>

<script lang="ts" setup>
import { ref, watch, h } from 'vue'
import { MailOutlined, InboxOutlined } from '@ant-design/icons-vue'
import type { CSSProperties } from 'vue'
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
    label: '工作台',
    title: '工作台',
  },
  {
    key: 'sub1',
    icon: () => h(MailOutlined),
    label: '内容管理',
    title: '内容管理',
    children: [
      {
        key: '2',
        label: '自定义页面',
        title: '自定义页面',
      },
      {
        key: '3',
        label: '广告位管理',
        title: '广告位管理',
      },
      {
        key: '4',
        label: '热搜词管理',
        title: '热搜词管理',
      },
      {
        key: '5',
        label: '评价管理',
        title: '评价管理',
      },
      {
        key: '6',
        label: '文章管理',
        title: '文章管理',
      },
      {
        key: '7',
        label: '栏目管理',
        title: '栏目管理',
      },
    ],
  },
  {
    key: 'sub2',
    icon: () => h(MailOutlined),
    label: '商品管理',
    title: '商品管理',
    children: [
      {
        key: '8',
        label: '商品管理',
        title: '商品管理',
      },
      {
        key: '9',
        label: '商品分组',
        title: '商品分组',
      },
      {
        key: '10',
        label: '品牌管理',
        title: '品牌管理',
      },
      {
        key: '11',
        label: '商品标签',
        title: '商品标签',
      },
      {
        key: '12',
        label: '商品属性',
        title: '商品属性',
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
