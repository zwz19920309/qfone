
import {
  GET_USERINFO,
  RECORD_USERINFO
} from './mutation-types.js'

export default {
  async getUserInfo({ commit }, user) {
    commit(GET_USERINFO, user)
  },
  async setUserInfo({ commit }, user) {
    commit(RECORD_USERINFO, user)
  }
}
