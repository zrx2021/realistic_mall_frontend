<template>
  <a-layout>
    <a-layout-sider :style="siderStyle" v-model:collapsed="state.collapsed">
      <div class="logo_title">
        <img class="logo" src="@/assets/logo.svg" width="30px" />
        <span class="title">电商管理后台</span>
      </div>
      <div class="menu_span"></div>
      <a-menu
        v-model:openKeys="state.openKeys"
        v-model:selectedKeys="state.selectedKeys"
        mode="inline"
        theme="dark"
        :inline-collapsed="state.collapsed"
        :items="items"
        @click="handleMenuClick($event.item.path)"
      ></a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header :style="headerStyle">
        <div class="header-container">
          <div class="header-left">
            <MenuUnfoldOutlined
              v-if="state.collapsed"
              class="trigger-icon"
              @click="() => (state.collapsed = !state.collapsed)"
            />
            <MenuFoldOutlined
              v-else
              class="trigger-icon"
              @click="() => (state.collapsed = !state.collapsed)"
            />
          </div>
          <div class="header-right">
            <div class="search-container">
              <a-input-search
                v-model:value="searchValue"
                placeholder="搜索..."
                style="width: 300px"
                @search="onSearch"
              >
                <template #prefix>
                  <SearchOutlined style="color: rgba(0, 0, 0, 0.45)" />
                </template>
              </a-input-search>
            </div>
            <a-badge :count="unreadMessages" class="message-badge">
              <BellOutlined class="header-icon" @click="handleMessageClick" />
            </a-badge>
            <a-dropdown>
              <div class="user-dropdown">
                <a-avatar :size="32" :src="userAvatar" />
                <span class="username">{{ userName }}</span>
              </div>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="profile">
                    <UserOutlined />
                    <span>个人中心</span>
                  </a-menu-item>
                  <a-menu-item key="settings">
                    <SettingOutlined />
                    <span>设置</span>
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="logout" @click="handleLogout">
                    <LogoutOutlined />
                    <span>退出登录</span>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>
      </a-layout-header>
      <a-layout-content :style="contentStyle">
        <a-flex :style="contentStyle" justify="space-around" vertical gap="middle">
          <router-view />
        </a-flex>
      </a-layout-content>
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
  overflow: hidden;
  transition: all 0.3s;
}

.logo_title .logo {
  margin-right: 8px;
  transition: -right 0.3s;
}

.logo_title .title {
  white-space: nowrap;
  opacity: 1;
  transition: opacity 0.3s;
}

/* 折叠时的样式 */
:deep(.ant-layout-sider-collapsed) {
  .logo_title {
    padding: 0 16px;
  }

  .logo_title .logo {
    margin-right: 0;
  }

  .logo_title .title {
    opacity: 0;
    display: inline-block;
    width: 0;
  }
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

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 16px;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.trigger-icon {
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;
  padding: 0 12px;
}

.trigger-icon:hover {
  color: #1890ff;
}

.header-icon {
  font-size: 18px;
  cursor: pointer;
  padding: 0 12px;
}

.message-badge {
  cursor: pointer;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 0 12px;
}

.username {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
}

:deep(.ant-layout-header) {
  background: #fff;
  padding: 0;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 10;
}

.search-container {
  margin-right: 8px;
  width: 300px;
  display: flex;
  align-items: center;
  height: 100%;
}

:deep(.ant-input-affix-wrapper) {
  border-radius: 4px;
}

:deep(.ant-input-search) {
  max-height: 32px;
}

:deep(.ant-input-search .ant-input) {
  &:hover,
  &:focus {
    border-color: #1890ff;
  }
}
</style>

<script lang="ts">
export default {
  name: 'MainLayout',
}
</script>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { CSSProperties, Component } from 'vue'
import { h } from 'vue'
import { getUserMenu } from '@/api/user'
import type { MenuItem, MenuItemRaw } from '@/types/menu'
import * as AntIcons from '@ant-design/icons-vue'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue'

const state = ref({
  collapsed: false,
  selectedKeys: ['1'],
  openKeys: ['sub1'],
  preOpenKeys: ['sub1'],
})

// 菜单数据
const items = ref<MenuItem[]>([])

// 用户信息
const userName = ref('Admin User')
const userAvatar = ref('https://api.dicebear.com/7.x/avataaars/svg?seed=admin')
const unreadMessages = ref(5)

const searchValue = ref('')

// 获取路由实例
const router = useRouter()

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
        id: 3,
        parentId: null,
        key: '3',
        icon: 'contents.png', // 本地图标
        label: '内容管理',
        title: '内容管理',
        path: '/content',
        sort: 3,
        visible: true,
        children: [
          {
            id: 31,
            parentId: 3,
            key: '3-1',
            icon: '',
            label: '自定义页面',
            title: '自定义页面',
            path: '/content/pages',
            sort: 1,
            visible: true,
            children: [],
            createTime: null,
            updateTime: null,
            createBy: null,
            updateBy: null,
          },
        ],
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
        children: [
          {
            id: 21,
            parentId: 2,
            key: '2-1',
            icon: '',
            label: '商品管理',
            title: '商品管理',
            path: '/goods/management',
            sort: 1,
            visible: true,
            children: [],
            createTime: null,
            updateTime: null,
            createBy: null,
            updateBy: null,
          },
          {
            id: 22,
            parentId: 2,
            key: '2-2',
            icon: '',
            label: '商品分组',
            title: '商品分组',
            path: '/goods/category',
            sort: 2,
            visible: true,
            children: [],
            createTime: null,
            updateTime: null,
            createBy: null,
            updateBy: null,
          },
        ],
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

// 处理消息点击
const handleMessageClick = () => {
  console.log('Navigate to messages page')
}

// 处理搜索
const onSearch = (value: string) => {
  console.log('搜索:', value)
}

// 处理菜单点击
const handleMenuClick = (path: string) => {
  console.log('菜单点击:', path)
  router.push(path || '/')
}

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

// 组件样式
const headerStyle: CSSProperties = {
  height: '64px',
  lineHeight: '64px',
  position: 'relative',
}

const contentStyle: CSSProperties = {
  display: 'flex',
  width: '100%',
  justifyContent: 'flex-start',
  alignContent: 'center',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#F4F4F4',
}

const siderStyle: CSSProperties = {
  minHeight: '100vh',
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
