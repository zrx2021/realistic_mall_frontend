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

/* 统一设置菜单图标大小 */
:deep(.ant-menu-item .anticon) {
  font-size: 16px !important;
  vertical-align: middle;
  margin-right: 10px;
}

:deep(.ant-menu-submenu-title .anticon) {
  font-size: 16px !important;
  vertical-align: middle;
  margin-right: 10px;
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
  name: 'MainLayout',
}
</script>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import type { CSSProperties, Component } from 'vue'
import { h } from 'vue'
import { getUserMenu } from '@/api/user'
import type { MenuItem, MenuItemRaw } from '@/types/menu'
import * as AntIcons from '@ant-design/icons-vue'

const state = ref({
  collapsed: false,
  selectedKeys: ['1'],
  openKeys: ['sub1'],
  preOpenKeys: ['sub1'],
})

// 菜单数据
const items = ref<MenuItem[]>([])

// 处理菜单数据
const processMenuItems = (menuItems: MenuItemRaw[]): MenuItem[] => {
  // 按 sort 字段排序
  const sortedItems = [...menuItems].sort((a, b) => a.sort - b.sort)

  return sortedItems.map((item) => {
    const menuItem: MenuItem = {
      key: item.key || String(item.id),
      label: item.label || item.title,
      title: item.title,
      path: item.path,
    }

    // 处理图标
    if (item.icon) {
      // 判断是否为本地图标（以.png、.jpg、.svg等结尾）
      if (/\.(png|jpe?g|svg|gif)$/i.test(item.icon)) {
        // 从路径中提取文件名
        const iconFileName = item.icon.split('/').pop() || ''
        menuItem.icon = () =>
          h('img', {
            src: new URL(`../assets/menu/${iconFileName}`, import.meta.url).href,
            style: {
              width: '16px',
              height: '16px',
              marginRight: '10px',
              verticalAlign: 'middle',
            },
          })
      } else {
        // 使用 Ant Design 图标
        const AntIcon = (AntIcons as Record<string, Component>)[item.icon]
        if (AntIcon) {
          menuItem.icon = () => h(AntIcon)
        }
      }
    }

    // 处理子菜单
    if (item.children && item.children.length > 0) {
      menuItem.children = processMenuItems(item.children)
    }

    return menuItem
  })
}

// 获取菜单数据
const fetchMenuItems = async () => {
  try {
    const data = await getUserMenu()
    items.value = processMenuItems(data)
  } catch (error) {
    console.error('获取菜单失败：', error)
    // 使用示例数据作为后备
    const fallbackData: MenuItemRaw[] = [
      {
        id: 1,
        parentId: null,
        key: '1',
        icon: 'DashboardOutlined', // Ant Design 图标
        label: '工作台',
        title: '工作台',
        path: '/workbench',
        sort: 1,
        visible: true,
        children: [],
        createTime: null,
        updateTime: null,
        createBy: null,
        updateBy: null,
      },
      {
        id: 2,
        parentId: null,
        key: '2',
        icon: 'goods.png', // 本地图标
        label: '商品管理',
        title: '商品管理',
        path: '/goods',
        sort: 2,
        visible: true,
        children: [],
        createTime: null,
        updateTime: null,
        createBy: null,
        updateBy: null,
      },
    ]
    items.value = processMenuItems(fallbackData)
  }
}

// 监听菜单展开/收起
watch(
  () => state.value.openKeys,
  (_val, oldVal) => {
    state.value.preOpenKeys = oldVal
  },
)

// 组件样式
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

// 组件挂载时获取菜单数据
onMounted(() => {
  fetchMenuItems()
})
</script>
