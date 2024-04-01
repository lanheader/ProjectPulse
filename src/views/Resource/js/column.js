
const column = [
  {
    label: '资源名称',
    name: 'resource_name',
    fixed: 'left',
    align: 'center',
    overflow: true
  },
  {
    label: '资源类型',
    name: 'resource_type',
    fixed: 'left',
    align: 'center',
    overflow: true
  },
  {
    label: 'IP地址',
    name: 'resource_ip',
    fixed: 'left',
    align: 'center',
    overflow: true
  },
  {
    label: 'CPU',
    name: 'resource_cpu',
    fixed: 'left',
    align: 'center',
    overflow: true,
    type: 'time'
  },
  {
    label: '内存',
    name: 'resource_memory',
    fixed: 'left',
    align: 'center',
    overflow: true,
    type: 'time'
  },
  {
    label: '磁盘',
    name: 'resource_disk',
    fixed: 'left',
    align: 'center',
    overflow: true,
    type: 'time'
  },
  {
    label: '操作系统',
    name: 'resource_os',
    fixed: 'left',
    align: 'center',
    overflow: true,
    type: 'time'
  },
  {
    label: '状态',
    name: 'is_active',
    fixed: 'left',
    align: 'center',
    overflow: true,
    type: 'time'
  },
  {
    label: '告警',
    name: 'is_alarm',
    fixed: 'left',
    align: 'center',
    overflow: true,
    type: 'time'
  }]

export default column
