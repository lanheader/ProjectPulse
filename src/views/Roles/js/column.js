
const column = [
  {
    label: '角色名称',
    name: 'role_name',
    fixed: 'left',
    align: 'center',
    overflow: true
  },
  {
    label: '角色代码',
    name: 'role_code',
    fixed: 'left',
    align: 'center',
    overflow: true
  },
  {
    label: '角色描述',
    name: 'description',
    fixed: 'left',
    align: 'center',
    overflow: true
  },
  {
    label: '创建时间',
    name: 'create_time',
    fixed: 'left',
    align: 'center',
    overflow: true,
    type: 'time'
  },
  {
    label: '更新时间',
    name: 'update_time',
    fixed: 'left',
    align: 'center',
    overflow: true,
    type: 'time'
  }]

export default column
