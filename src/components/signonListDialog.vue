<template>
  <el-dialog title="签到活动列表" :visible.sync="dialogShow">
    <div>
      <signon-list
        :simplify="simplify"
        :dynamic="dynamic"
        :isEdit="isEdit"
        :signonList="cSignonList"
      ></signon-list>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageInfo.currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageInfo.pageSize"
      layout="sizes, prev, pager, next"
      :total="cTotal"
    ></el-pagination>
  </el-dialog>
</template>

<script>
import { getSignonList } from '@/api/getData'
export default {
  components: {
    'signon-list': () => import('@/components/signonList.vue')
  },
  data() {
    return {
      value: '',
      dialogShow: false,
      cSignonList: this.signonList || [],
      cData: [],
      cTotal: 0,
      dynamic: null,
      isEdit: true,
      simplify: true,
      pageInfo: {
        currentPage: 1,
        pageSize: 5
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      // if (!this.cSignonList.length) {
      //   let res = await getSignonList()
      //   if (res.status === 200 && res.data.list.length) {
      //     this.cSignonList = res.data.list
      //   }
      // }
    },
    handleSelectionChange(data) {
      this.cData = data
    },
    async handleSizeChange(data) {
      this.sizeChange && this.sizeChange(data)
    },
    async handleCurrentChange(data) {
      this.currentChange && this.currentChange(data)
    },
    inSure() {
      this.callBack && this.callBack(this.cData)
    },
    open(params) {
      this.dynamic = params.dynamic
      this.isEdit = params.isEdit || this.isEdit
      this.dialogShow = true
    },
    close() {
      this.dialogShow = false
    }
  },
  props: ['callBack', 'signonList', 'isDate', 'sizeChange', 'currentChange', 'total'],
  watch: {
    signonList: function (newVal, oldVal) {
      this.cSignonList = newVal
    },
    total: function (newVal, oldVal) {
      this.cTotal = newVal
    }
  }
}
</script>

<style lang="less">
.t-right {
  text-align: right;
}
</style>
