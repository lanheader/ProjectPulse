import request from '@/utils/request.js'

// 用户列表
export function UserList() {
  return request({
    url: '/api/projectUsers/',
    method: 'get'
  })
}

// 用户详情
export function UserDetail(data) {
  return request({
    url: '/console/user/',
    method: 'get',
    params: data
  })
}

// 项目成员列表
export function MemberList(data) {
  return request({
    url: '/console/project/member/',
    method: 'get',
    params: data
  })
}

// 添加项目成员
export function MemberCreate(params) {
  return request({
    url: `/console/project/member/${params['projectId']}/${params['userId']}`,
    method: 'post'
  })
}
// 添加项目成员
export function MemberDelete(params) {
  return request({
    url: `/console/project/member/${params['projectId']}/${params['userId']}`,
    method: 'delete'
  })
}

// 获取项目列表
export function ProjectList() {
  return request({
    url: '/api/project/',
    method: 'get'
  })
}

// 获取AK列表
export function AKList(params) {
  return request({
    url: '/console/project_credential/',
    method: 'get',
    params: params
  })
}

// 修改AK
export function AKUpdate(data) {
  return request({
    url: '/console/project_credential/update/',
    method: 'post',
    data: data
  })
}
// 修改AK
export function AKCreate(data) {
  return request({
    url: '/console/project_credential/',
    method: 'post',
    data: data
  })
}

// 启用/禁用AK
export function AKDisable(params) {
  return request({
    url: `/console/project_credential/change_status/${params['id']}`,
    method: 'post'
  })
}
// 服务列表
export function ServiceList() {
  return request({
    url: `/console/service/`,
    method: 'get'
  })
}

// API列表
export function AKAPIManager(params) {
  return request({
    url: `/console/service/api/`,
    method: 'get',
    params: params
  })
}

// 凭证关闭
export function AKAPIClose(params) {
  return request({
    url: `/console/service/api/${params['credentialId']}/${params['serviceApiId']}`,
    method: 'delete'
  })
}

// 申请开通
export function AKAPIOpening(data) {
  return request({
    url: `/console/service/api/apply`,
    method: 'post',
    data: data
  })
}
// 申请调整
export function AKAPIAdjustment(data) {
  return request({
    url: `/console/service/api/adjust`,
    method: 'post',
    data: data
  })
}

export function TenantList(data) {
  return request({
    url: '/console/tenant/',
    method: 'get',
    params: data
  })
}

export function TenantCreate(data) {
  return request({
    url: '/console/tenant/',
    method: 'post',
    data: data
  })
}

// 租户费控列表
export function ControlList(data) {
  return request({
    url: '/console/tenant/credit/',
    method: 'get',
    params: data
  })
}

// 充值
export function Recharge(params) {
  return request({
    url: `/console/tenant/credit/${params['id']}/${params['credit']}`,
    method: 'post'
  })
}

// 关闭租户费控
export function CloseTenant(params) {
  return request({
    url: `/console/tenant/credit/${params['id']}`,
    method: 'delete'
  })
}

