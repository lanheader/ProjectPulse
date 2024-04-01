import { statusOptions } from '@/views/Users/js/utils'

const column = [
  {
    label: '姓名',
    name: 'display',
    fixed: 'left',
    align: 'center',
    overflow: true
  },
  {
    label: '用户名',
    name: 'username',
    fixed: 'left',
    align: 'center',
    overflow: true
  },
  {
    label: '创建时间',
    name: 'date_joined',
    fixed: 'left',
    align: 'center',
    overflow: true,
    type: 'time'
  },
  {
    label: '邮箱',
    name: 'email',
    fixed: 'left',
    align: 'center',
    overflow: true
  }, {
    label: '手机号',
    name: 'phone',
    fixed: 'left',
    align: 'center',
    overflow: true
  },
  {
    label: '状态',
    name: 'is_active',
    fixed: 'left',
    align: 'center',
    overflow: true,
    type: 'status',
    statusOptions: statusOptions
  }]

export default column
