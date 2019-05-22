import {
  RECORD_USERINFO
} from './mutation-types.js'

export default {
  // 记录用户信息
  [RECORD_USERINFO](state, info) {
    state.userInfo = info
    state.login = true
  }
}
