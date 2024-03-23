import { login, userinfo } from '@/api/page/user.js'
import { ProjectList } from '@/api/page/workSpace.js'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    userInfo: {},
    avatar: '',
    isLogin: getToken(),
    roles: null,
    workSpaces: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_WORKSPACES: (state, workSpaces) => {
    state.workSpaces = workSpaces
  }
}

const actions = {
  // 用户空间获取
  workSpace({ commit }) {
    return new Promise((resolve, reject) => {
      ProjectList().then(response => {
        commit('SET_WORKSPACES', response.data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 登录接口
  login({ commit }) {
    return new Promise((resolve, reject) => {
      login().then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      userinfo().then(response => {
        const { data } = response
        if (!data) {
          reject('未获取到用户信息，请重新登录后再试！')
        }
        commit('SET_USERINFO', data)
        commit('SET_ROLES', [data['type']])
        commit('SET_NAME', data['username'])
        resolve(data['user_type'])
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },
  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // 根据角色生成可访问路由映射
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // 动态添加可访问路由
    router.addRoutes(accessRoutes)

    // 重置访问过的视图和缓存的视图
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

