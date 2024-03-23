import request from '@/utils/request'

export function ShortUrlList(params) {
  return request({
    url: `/console/shorturl/`,
    method: 'get',
    params: params
  })
}

export function ShortUrlDisable(id) {
  return request({
    url: `/console/shorturl/${id}`,
    method: 'delete'
  })
}
export function ShortUrlUpdate(params) {
  return request({
    url: `/console/shorturl/`,
    method: 'post',
    data: params
  })
}
export function ShortUrlCreate(params) {
  return request({
    url: `/console/shorturl/generate`,
    method: 'post',
    data: params
  })
}
