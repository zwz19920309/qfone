import {
  GET_USERINFO,
  RECORD_USERINFO
} from './mutation-types.js'

export default {
  // 获取用户信息存入vuex
  [GET_USERINFO](state, info) {
    if (state.userInfo && (state.userInfo.username !== info.username)) {
      return
    }
    state.userInfo = { ...info }
  },
  // 记录用户信息
  [RECORD_USERINFO](state, info) {
    state.userInfo = info
    state.login = true
  }
}
