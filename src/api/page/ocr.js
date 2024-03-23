import request from '@/utils/request'

export function OcrLogs(params) {
  return request({
    url: `/console/ocr/log`,
    method: 'get',
    params: params
  })
}
