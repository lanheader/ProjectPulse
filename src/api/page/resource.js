import request from '@/utils/request'

export function ResourceList() {
  return request({
    url: '/api/resources',
    method: 'get'
  })
}
