import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/login/',
    method: 'post',
    data
  })
}

// 接口
export function getInfo() {
  return request({
    url: '/api/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

export function UserList(params) {
  return request({
    url: '/api/users/',
    method: 'get',
    params: params
  })
}
export function RoleList(params) {
  return request({
    url: '/api/role/',
    method: 'get',
    params: params
  })
}

