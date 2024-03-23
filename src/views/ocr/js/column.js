import { ocrType, statusType, vendorType } from '@/views/ocr/js/utils'

const column = [
  {
    label: 'REQUEST_ID',
    name: 'requestId',
    fixed: 'left',
    align: 'center',
    overflow: true
  },
  {
    label: '类型',
    name: 'type',
    fixed: 'left',
    align: 'center',
    overflow: true,
    type: 'select',
    selectOptions: ocrType
  },
  {
    label: '服务商',
    name: 'vendor',
    fixed: 'left',
    align: 'center',
    overflow: true,
    type: 'select',
    selectOptions: vendorType
  },
  {
    label: '接收请求时间',
    name: 'requestTime',
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
    statusOptions: statusType
  }]

export default column
