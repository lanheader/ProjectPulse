/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

// 验证手机号
const _checkMobile = (val, required = true) => {
  let flag = false
  const t = /^1(3|4|5|7|8|9)\d{9}$/
  if (val && t.test(val)) {
    flag = true
  }
  if (!required && val.trim() === '') {
    flag = true
  }
  return flag
}

const _lengthCheck = (val, min = 0, max) => {
  let status = null // 1: 通过；2：小于最小值；3大于最大值
  const valStrLength = (val + '').length
  if (valStrLength < min) {
    status = 2
  }
  if (valStrLength >= min && valStrLength <= max) {
    status = 1
  }
  if (valStrLength > max) {
    status = 3
  }
  return status
}

const _isInteger = (obj) => {
  return Math.floor(obj) === Number(obj)
}

const _isEmail = (value) => {
  const email = value
  const t = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g
  let flag = false
  if (t.test(email)) {
    flag = true
  }
  return flag
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
const _isExternal = (path) => {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/* 时间戳转换为时间,精确到时分秒 */

const _formatDate = (timeStamp) => {
  const date = new Date(timeStamp)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
  const minute = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
  const second = date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
}
function _formatToDesiredTime(localTimeString) {
  // Create a new Date object from the local time string
  const date = new Date(localTimeString)

  // Extract and format the date and time components
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  const second = String(date.getSeconds()).padStart(2, '0')

  // Combine the components into a single string
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

export {
  _checkMobile,
  _lengthCheck,
  _isInteger,
  _isEmail,
  _isExternal,
  _formatDate,
  _formatToDesiredTime
}

