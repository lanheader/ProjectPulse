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
    url: '/console/user/info',
    method: 'get'
  })
}

