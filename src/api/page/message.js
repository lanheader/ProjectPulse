import request from '@/utils/request.js'

// 签名列表
export function SignatureList(params) {
  return request({
    url: `/console/sms/signature/`,
    method: 'get',
    params: params
  })
}

// 签名状态变更
export function SignatureEnable(id) {
  return request({
    url: `/console/sms/signature/${id}`,
    method: 'post'
  })
}

// 模版列表
export function TemplateList(params) {
  return request({
    url: `/console/sms/template/`,
    method: 'get',
    params: params
  })
}

// 模版状态变更
export function TemplateEnable(id) {
  return request({
    url: `/console/sms/template/${id}`,
    method: 'post'
  })
}

// 短信查询
export function SmsQuery(params) {
  return request({
    url: `/console/sms/`,
    method: 'get',
    params: params
  })
}

// 计费明细
export function SmsDetail(params) {
  return request({
    url: `/console/sms/`,
    method: 'get',
    params: params
  })
}

