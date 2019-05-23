<template>
  <div>
    <el-breadcrumb separator="/" v-if="menu">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{menu.name}}</el-breadcrumb-item>
      <el-breadcrumb-item v-if="menu.submenu">{{menu.submenu.name}}列表</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState(['menu']) // 动态计算属性
  },
  created() {
  }
}
</script>

<style lang="less">
</style>
