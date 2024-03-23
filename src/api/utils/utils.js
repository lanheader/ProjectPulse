import { differenceInMonths } from 'date-fns'
/* 工具函数 */

// 对象快速排序
// example: [{ key: value}, { key: value}]
export const utilQuickSortElement = (arr, key) => {
  if (arr.length <= 1) { return arr }
  const pivotIndex = Math.floor(arr.length / 2)
  const pivot = arr.splice(pivotIndex, 1)[0]
  const left = []
  const right = []
  for (const i = 0; i < arr.length; i++) {
    if (arr[i][key] < pivot[key]) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  const ret = utilQuickSortElement(left, key).concat([pivot], utilQuickSortElement(right, key))
  return ret
}

// 对象全等或数组的每一项值相等
export const utilValueEquals = (a, b) => {
  if (a === b) return true
  if (!(a instanceof Array)) return false
  if (!(b instanceof Array)) return false
  if (a.length !== b.length) return false
  for (let i = 0; i !== a.length; ++i) {
    if (a[i] !== b[i]) return false
  }
  return true
}

// 数组深拷贝，嵌套1层对象
export const utilDeepCopy1 = (tar) => {
  if (Array.isArray(tar)) {
    const arr = []
    tar.forEach(item => arr.push(Object.assign({}, item)))
    return arr
  } else {
    const obj = {}
    Object.keys(tar).forEach(key => {
      if (typeof tar[key] === 'object') {
        obj[key] = Object.assign({}, tar[key])
      } else {
        obj[key] = tar[key]
      }
    })
    return obj
  }
}

// 获取yyyy-mm-dd hh:mm:ss 格式时间
export const getDate = (str, isFullTime) => {
  const d = new Date(str)
  const year = d.getFullYear()
  const month = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
  const day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
  const hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
  const min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
  const sec = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()

  if (isFullTime) {
    return `${year}-${month}-${day} ${hour}:${min}:${sec}`
  } else {
    return `${year}-${month}-${day}`
  }
}

/* 解析swagger json格式 */

function swaggerFindDefinition(ref, definitions) {
  let ret = null
  for (let i = 0; i < definitions.length; i += 1) {
    if (definitions[i].name === ref.replace('#', '')) {
      ret = definitions[i]
      break
    }
  }
  return ret
}
// 递归组织组件需要的数据
function findAllChildrenDefinition(param, ref, list) {
  const makeOne = (obj, theRef) => {
    const found = swaggerFindDefinition(theRef, list)
    if (found) {
      const temp = []
      found.properties.forEach((pitem) => {
        const sub = {
          name: pitem.name,
          type: pitem.type || 'string',
          isRequired: pitem.required,
          example: pitem.example || '',
          note: pitem.desc || ''
        }
        if (pitem.ref) {
          makeOne(sub, pitem.ref)
        }
        temp.push(sub)
      })
      obj.children = temp
    } else {
      console.log('swagger definitions not found')
    }
  }
  makeOne(param, ref)
}

export const utilParseSwaggerDetail = (obj) => {
  const ret = {
    request: [],
    response: []
  }

  // 解析入参规则
  obj.parameters.forEach((item) => {
    const param = {
      name: item.name || '',
      isRequired: item.required,
      example: item.example || '',
      note: item.desc || ''
    }
    if (item.ref) {
      // hack，兼容旧格式
      if (item.ref && item.ref.startsWith('array#')) {
        item.ref = item.ref.replace('array#', '#')
        param.type = 'array'
        const arrayItemObj = {
          name: 'array items',
          isRequired: false,
          example: '',
          note: item.desc || '',
          type: 'object'
        }
        param.children = [arrayItemObj]
        findAllChildrenDefinition(arrayItemObj, item.ref, obj.definitions)
      } else {
        // param.type = 'object';
        param.type = item.type
        findAllChildrenDefinition(param, item.ref, obj.definitions)
      }
    } else {
      param.type = (item.type === 'query' || item.type === 'body') ? 'string' : item.type // swagger里type=body或query都视为不规范的类型，都设置为string
    }
    ret.request.push(param)
  })
  // 解析响应规则
  const responseDef = swaggerFindDefinition(obj.response[0].properties.data, obj.definitions)
  responseDef.properties.forEach((item) => {
    const temp = {
      name: item.name || '',
      isRequired: item.required,
      example: item.example || '',
      note: item.desc || '',
      type: item.type
    }
    if (item.ref) {
      findAllChildrenDefinition(temp, item.ref, obj.definitions)
    }
    ret.response.push(temp)
  })
  return ret
}

// 判断对象类型
export const utilTypeOf = (tar) => {
  const nativeTypeString = Object.prototype.toString.call(tar)
  const simpleTypeString = nativeTypeString.replace(/^\[object (.+)\]$/, '$1').toLowerCase()
  return simpleTypeString === 'number' && Number.isInteger(tar) ? 'integer' : simpleTypeString
}

// 用于恢复页面原来滚动条位置
/*
* @params: _this 页面vue实例
*
*/
export const recoverScroll = (_this) => {
  const scrollTop = _this.$route.meta.scrollTop
  const $content = document.querySelector('.app-main-content')
  if (scrollTop && $content) {
    $content.scrollTop = scrollTop
  }
}

// 判断一个时间距离现在是否小于一个固定值
/*
* @params: 相差月份limit 月份
*
*/
export const isExpiration = (time, limit = 3) => {
  if (!time) return false
  const date = new Date()
  return differenceInMonths(time, date) < limit
}
