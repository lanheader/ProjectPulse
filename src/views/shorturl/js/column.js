import { statusOptions } from '@/views/shorturl/js/utils'

const column = [
  {
    label: '源地址',
    name: 'originUrl',
    fixed: 'left',
    align: 'center',
    overflow: true
  },
  {
    label: '短地址',
    name: 'shortUrl',
    fixed: 'left',
    align: 'center',
    overflow: true
  },
  {
    label: '创建时间',
    name: 'createTime',
    fixed: 'left',
    align: 'center',
    overflow: true,
    type: 'time'
  },
  {
    label: '失效时间',
    name: 'expire',
    fixed: 'left',
    align: 'center',
    overflow: true,
    type: 'time'
  },
  {
    label: '状态',
    name: 'status',
    fixed: 'left',
    align: 'center',
    overflow: true,
    type: 'status',
    statusOptions: statusOptions
  }]

export default column
