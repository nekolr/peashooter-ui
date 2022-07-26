import Layout from '@/layout/index.vue'
import Home from '@/views/dashboard/index.vue'

export const basicRoutes = [
  {
    name: '404',
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    isHidden: true,
  },

  {
    name: 'Login',
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    isHidden: true,
    meta: {
      title: '登录',
    },
  },

  {
    name: 'Dashboard',
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        name: 'Home',
        path: 'home',
        component: Home,
        meta: {
          title: '首页',
          icon: 'mdi:home',
        },
      },
    ],
  },

  {
    name: 'System',
    path: '/system',
    component: Layout,
    redirect: '/system/settings',
    children: [
      {
        name: 'Settings',
        path: 'settings',
        component: () => import('@/views/settings/index.vue'),
        meta: {
          title: '系统设置',
          icon: 'ep:setting',
        },
      },
    ],
  },

  {
    name: 'DataSource',
    path: '/datasource',
    component: Layout,
    redirect: '/datasource/manage',
    children: [
      {
        name: 'DataSourceManage',
        path: 'manage',
        component: () => import('@/views/datasource/index.vue'),
        meta: {
          title: '数据源管理',
          icon: 'ant-design:database-outlined',
        },
      },
    ],
  },

  {
    name: 'Group',
    path: '/group',
    component: Layout,
    redirect: '/group/manage',
    children: [
      {
        name: 'GroupManage',
        path: 'manage',
        component: () => import('@/views/group/index.vue'),
        meta: {
          title: '分组管理',
          icon: 'carbon:category',
        },
      },
    ],
  },
]

const modules = import.meta.globEager('./modules/*.js')
const asyncRoutes = []
Object.keys(modules).forEach((key) => {
  asyncRoutes.push(...modules[key].default)
})

export { asyncRoutes }
