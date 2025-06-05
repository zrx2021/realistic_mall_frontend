import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { getToken } from '@/utils/auth'
import { message } from 'ant-design-vue'

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      requiresAuth: false,
    },
  },
  {
    path: '/',
    name: 'Main',
    component: () => import('@/views/Main.vue'),
    meta: {
      title: '首页',
      requiresAuth: true,
    },
    children: [
      {
        path: 'contents/pages',
        name: 'ContentsManagement',
        component: () => import('@/views/menu/contents/contentsManagement.vue'),
        meta: {
          title: '内容管理',
          requiresAuth: true,
        },
      },
    ],
  },
  // 将所有未匹配的路由重定向到首页
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title || ''} - 电商管理后台`

  // 检查是否需要登录权限
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 检查是否已登录
    if (!getToken()) {
      message.warning('请先登录')
      next({
        path: '/login',
        query: { redirect: to.fullPath }, // 保存要跳转的路由
      })
    } else {
      next()
    }
  } else {
    // 如果是访问登录页面且已经登录，则重定向到首页
    if (to.path === '/login' && getToken()) {
      next('/')
    } else {
      next()
    }
  }
})

export default router
