import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false })

router.beforeEach(async(to, from, next) => {
  document.title = getPageTitle(to.meta.title)
  NProgress.start()
  const hasToken = getToken()
  if (hasToken) {
    const hasRoles = store.getters.roles && store.getters.roles.length > 0
    if (hasRoles) {
      next()
    } else {
      try {
        // 获取用户信息
        await store.dispatch('user/getInfo')
        // 组装路由信息
        await store.dispatch('permission/generateRoutes')
        // 获取工作空间
        await store.dispatch('user/workSpace')
        // 设置replace: true，这样导航就不会留下历史记录
        next({ ...to, replace: true })
      } catch (error) {
        console.log(error)
        Message.error(error || '未获取到账号信息，请联系管理员！')
        NProgress.done()
      }
    }
  } else {
    // 如果没有token信息,执行获取token
    window.location.href = `http://${window.location.host}/console/user/login`
    next()
    NProgress.done()
  }
})

router.afterEach(() => {
  NProgress.done()
})
