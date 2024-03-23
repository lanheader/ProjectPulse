import store from '../../store'

export default {
  install(Vue) {
    Vue.mixin({
      methods: {
        // 按钮级别权限控制
        mixinPermission(key, currentId = '') {
          // 接口没有定义，这里直接定义静态的权限（角色）列表， 不同的角色对应有不同的操作权限
          const rules = {
            adminActions: [
              'audit',
              'edit',
              'review',
              'search',
              'add',
              'delete'
            ],
            defaultActions: []
          }
          const userPermissions = () => {
            let ret = []
            const currentClusterId =
							currentId !== '' ? currentId : store.state.currentClusterId
            // 区分admin与普通用户
            if (store.state.userType && store.state.userType === 1) {
              ret = rules.adminActions
            } else if (store.state.userType === 0) {
              // 普通用户可以授权单个的集群的管理员权限
              if (store.state.clusterIds.includes(currentClusterId)) {
                ret = rules.adminActions
              } else {
                ret = rules.defaultActions
              }
            }
            return ret
          }
          const isShow = userPermissions().indexOf(key) > -1
          return isShow
        }
      }
    })
  }
}
