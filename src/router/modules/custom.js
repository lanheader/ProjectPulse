import Layout from '@/layout'

const customRouter = [
  {
    path: '/project',
    name: 'Project',
    component: Layout,
    meta: {
      title: '项目信息',
      icon: 'el-icon-date',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'info',
        name: 'ProjectInfo',
        component: () => import('@/views/ProjectUsers/index.vue'),
        meta: {
          title: '项目信息',
          roles: ['admin', 'editor']
        }
      }]
  },
  {
    path: '/alarm',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Alarm',
    meta: {
      title: '告警管理',
      icon: 'el-icon-info',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'alarminfo',
        name: 'AlarmInfo',
        component: () => import('@/views/ProjectUsers/index.vue'),
        meta: {
          title: '告警信息',
          roles: ['admin', 'editor']
        }
      }, {
        path: 'inspection',
        name: 'Inspection',
        component: () => import('@/views/Roles/index.vue'),
        meta: {
          title: '巡检列表',
          roles: ['admin', 'editor']
        }
      }, {
        path: 'alarmsettings',
        name: 'AlarmSettings',
        component: () => import('@/views/Users/index.vue'),
        meta: {
          title: '告警设置',
          roles: ['admin', 'editor']
        }
      }
    ]
  },
  {
    path: '/resources',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Resources',
    meta: {
      title: '资源管理',
      icon: 'el-icon-s-order',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'resourceinfo',
        name: 'ResourceInfo',
        component: () => import('@/views/ProjectUsers/index.vue'),
        meta: {
          title: '资源列表',
          roles: ['admin', 'editor']
        }
      }, {
        path: 'appinfo',
        name: 'AppInfo',
        component: () => import('@/views/Roles/index.vue'),
        meta: {
          title: '应用列表',
          roles: ['admin', 'editor']
        }
      }, {
        path: 'accountinfo',
        name: 'AccountInfo',
        component: () => import('@/views/Users/index.vue'),
        meta: {
          title: '账号列表',
          roles: ['admin', 'editor']
        }
      }, {
        path: 'notifyconfig',
        name: 'NotifyConfig',
        component: () => import('@/views/Users/index.vue'),
        meta: {
          title: '通知配置',
          roles: ['admin', 'editor']
        }
      }
    ]
  },
  {
    path: '/users',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Users',
    meta: {
      title: '用户管理',
      icon: 'el-icon-user-solid',
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'projectuser',
        name: 'ProjectUser',
        component: () => import('@/views/ProjectUsers/index.vue'),
        meta: {
          title: '项目用户',
          roles: ['admin', 'editor']
        }
      }, {
        path: 'roleinfo',
        name: 'RoleInfo',
        component: () => import('@/views/Roles/index.vue'),
        meta: {
          title: '角色管理',
          roles: ['admin', 'editor']
        }
      }, {
        path: 'userinfo',
        name: 'UserInfo',
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
