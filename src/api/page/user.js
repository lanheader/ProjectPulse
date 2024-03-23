import request from '@/utils/request'

export function login() {
  return request({
    url: '/console/user/login',
    method: 'get'
  })
}

// 接口
export function userinfo() {
  return request({
    url: '/console/user/info',
    method: 'get'
  })
}

