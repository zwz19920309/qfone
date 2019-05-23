<template>
  <div class="fillcontain">
    <div class="table_container">
      <div class="mar10">
        <div class="pad10">
          <break-sticks></break-sticks>
        </div>
        <div class="pad10">
          <signon-list
            :pid="platformId"
            :callBack="callBcakHander"
            :isEdit="isEdit"
            :signonList="signonList"
          ></signon-list>
        </div>
        <div class="Pagination" style="text-align: left;margin-top: 10px;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pageInfo.currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageInfo.pageSize"
            layout="sizes, prev, pager, next"
            :total="pageInfo.total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSignonList } from '@/api/getData'
export default {
  data() {
    return {
      platformId: '',
      isEdit: true,
      signonList: [],
      pageInfo: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  components: {
    'signon-list': () => import('@/components/signonList.vue'),
    'edit-signon-dialog': () => import('@/components/editSignonDialog.vue'),
    'break-sticks': () => import('@/components/common/small/breakSticks.vue')
  },
  created() {
    this.platformId = this.$route.query.platformId
    this.initData(this.pageInfo)
  },
  methods: {
    async initData(params) {
      let res = await getSignonList({
        page: params.currentPage,
        size: params.pageSize,
        pid: this.platformId
      })
      if (res.status === 200) {
        this.signonList = res.data.list
        this.pageInfo.total = res.data.total
      }
    },
    test() {
      this.signonList = []
    },
    async handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.initData(this.params)
    },
    async handleCurrentChange(val) {
      this.pageInfo.currentPage = val
      this.initData(this.pageInfo)
    },
    callBcakHander() {
      this.initData(this.pageInfo)
    }
  }
}
</script>

<style lang="less">
</style>
