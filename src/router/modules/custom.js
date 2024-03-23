import Layout from '@/layout'

const customRouter = [
  {
    path: '/users',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Users',
    meta: {
      title: '用户管理',
      icon: 'el-icon-s-tools',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'userinfo',
        name: 'UsersInfo',
        component: () => import('@/views/Users/index.vue'),
        meta: {
          title: '用户管理',
          roles: ['admin', 'editor']
        }
      }
    ]
  }
]

export default customRouter
