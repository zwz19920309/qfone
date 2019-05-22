
import {
  RECORD_USERINFO
} from './mutation-types.js'

export default {
  async setUserInfo({ commit }, user) {
    commit(RECORD_USERINFO, user)
  }
}
