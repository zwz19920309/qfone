
import {
  RECORD_USERINFO,
  SET_MENU
} from './mutation-types.js'

export default {
  async setUserInfo({ commit }, user) {
    commit(RECORD_USERINFO, user)
  },
  async setMenu({ commit }, menu) {
    commit(SET_MENU, menu)
  }
}
