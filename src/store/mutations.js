import {
  RECORD_USERINFO,
  SET_MENU
} from './mutation-types.js'

export default {
  // 记录用户信息
  [RECORD_USERINFO](state, info) {
    state.userInfo = info
    state.login = true
  },
  [SET_MENU](state, menu) {
    state.menu = menu
  }
}
