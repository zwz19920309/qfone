<template>
  <div class="fillcontain">
    <div class="table_container">
      <div class="mar10 pad10">
        <break-sticks></break-sticks>
      </div>
      <div class="mar10">
        <prize-list
          :pid="platformId"
          :isEdit="isEdit"
          :callBack="initData"
          :prizeList="prizeList"
          ref="prizeListRef"
        ></prize-list>
      </div>
      <div class="Pagination" style="text-align: left;margin-top: 10px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="pageInfo.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageInfo.pageSize"
          layout="sizes, prev, pager, next, total"
          :total="pageInfo.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getPrizeList } from '@/api/getData'
export default {
  data() {
    return {
      isEdit: true,
      prizeList: [],
      platformId: '',
      pageInfo: {
        page: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  components: {
    'prize-list': () => import('@/components/prizeList.vue'),
    'break-sticks': () => import('@/components/common/small/breakSticks.vue')
  },
  created() {
    this.platformId = this.$route.query.platformId
    this.initData(this.pageInfo)
  },
  methods: {
    async initData(params) {
      let res = await getPrizeList({ page: this.pageInfo.page, size: this.pageInfo.pageSize, pid: this.platformId })
      if (res.status === 200) {
        this.prizeList = res.data.list
        this.pageInfo.total = res.data.total
      }
    },
    async handleSizeChange(data) {
      this.pageInfo.pageSize = data
      await this.initData(this.pageInfo)
    },
    async handleCurrentChange(data) {
      this.pageInfo.page = data
      await this.initData(this.pageInfo)
    }
  }
}
</script>

<style lang="less">
</style>
