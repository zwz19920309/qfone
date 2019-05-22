<template>
  <div class="header_container">
    <span>
      <span v-if="userInfo">{{userInfo.nick}}</span>, 欢迎您!
    </span>
    <span @click="logout" class="out">退出</span>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState(['userInfo']) // 动态计算属性，相当于this.$store.getters.resturantName
  },
  created() {
  },
  methods: {
    async logout() {
      window.location.href = 'http://admin-upper.jin10.com'
    }
  }
}
</script>

<style lang="less">
@import "../style/mixin";
.header_container {
  background-color: #eff2f7;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
.avator {
  .wh(36px, 36px);
  border-radius: 50%;
  margin-right: 37px;
}
.el-dropdown-menu__item {
  text-align: center;
}
.out {
  color: #409eff;
  cursor: pointer;
  text-decoration: underline;
}
</style>
