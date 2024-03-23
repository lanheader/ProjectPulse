import axios from 'axios'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'

/* 创建一个axios实例 */
const service = axios.create({
  baseURL: '', // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

/* 请求拦截*/
service.interceptors.request.use((config) => {
  config.headers.Authentication = getToken()
  return config
}, error => Promise.reject(error))

/* 响应拦截 */
service.interceptors.response.use((response) => {
  // 返回错误数据，非0则为接口返回异常，弹出错误信息
  if (response.data.code !== 0) {
    Message({
      type: 'error',
      message: response.data.message ? response.data.message : '接口错误',
      duration: 5000
    })
    return Promise.reject(response.data)
  }
  return response.data
}, error => {
  // 判断如果response存在status，且为401，则为登录超时
  if (error?.response?.status === 401) {
    Message({
      type: 'error',
      message: '登录超时，请刷新后再试',
      duration: 5000
    })
    location.reload()
    return
  }
  Message({
    type: 'error',
    message: '网络错误',
    duration: 5000
  })
  return Promise.reject(error)
})

export default service
