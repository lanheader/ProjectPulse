// 查询使用的时间选项
export const createPickerOptions = {
  disabledDate: () => false,
  // 只能选择7天的数据
  onPick: ({ maxDate, minDate }) => {
    this.createPickerOptions.disabledDate = time => {
      if (minDate) {
        const min = new Date(minDate).getTime()
        const sevenDaysAfter = new Date(min + 7 * 24 * 60 * 60 * 1000).getTime()
        const sevenDaysBefore = new Date(min - 7 * 24 * 60 * 60 * 1000).getTime()
        return time.getTime() < sevenDaysBefore || time.getTime() > sevenDaysAfter
      }
    }
  },
  shortcuts: [{
    text: '最近一天',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近三天',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近七天',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  }]
}
// 更新使用的时间选项
export const expirePickerOptions = {
  disabledDate: (time) => {
    function add0(m) { return m < 10 ? '0' + m : m }
    function setDate() {
      const time = new Date()
      const y = time.getFullYear()
      const m = time.getMonth() + 1
      const d = time.getDate()
      const h = time.getHours()
      const min = time.getMinutes()
      const s = time.getSeconds()
      return y + '.' + add0(m) + '.' + add0(d) + ' ' + add0(h) + ':' + add0(min) + ':' + add0(s)
    }
    const date = new Date(setDate())
    const year = date.getFullYear()
    const nextYearDate = new Date(date.setFullYear(year + 1))
    return time.getTime() < Date.now() || time.getTime() > nextYearDate.getTime()
  },
  shortcuts: [{
    text: '一年',
    onClick(picker) {
      const date = new Date()
      date.setTime(date.getTime() + 3600 * 1000 * 24 * 365)
      picker.$emit('pick', date)
    }
  }]
}

export const statusOptions = [
  {
    label: '失效',
    value: 0,
    name: 'info'
  },
  {
    label: '生效',
    value: 1,
    name: 'success'
  }
]

