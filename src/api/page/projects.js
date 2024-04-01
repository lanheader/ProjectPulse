import request from '@/utils/request.js'

// 用户列表
export function RoleUserList(params) {
  return request({
    url: '/api/projectUsers',
    method: 'get',
    params: params
  })
}

// 创建用户
export function RoleUserSubmit(data) {
  return request({
    url: '/api/projectUsers',
    method: 'post',
    data: data
  })
}

// 添加项目成员
export function MemberDelete(params) {
  return request({
    url: `/api/projectrolesusers/${params.id}`,
    method: 'delete'
  })
}

// 获取项目列表
export function ProjectList() {
  return request({
    url: '/api/project',
    method: 'get'
  })
}

