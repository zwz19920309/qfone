<template>
  <div class="fillcontain">
    <div class="mar10">
      <div>
        <el-table border :data="resignDates" stripe style="width: 100%">
          <el-table-column label="补签日期">
            <template slot-scope="scope">
              <span>{{scope.row}}</span>
            </template>
          </el-table-column>
          <el-table-column label="补签消耗">
            <template slot-scope="scope">
              <span
                v-if="extraText.consumes && extraText.consumes.length"
              >{{extraText.consumes[0][scope.row]}}</span>
            </template>
          </el-table-column>
          <el-table-column label="详情">
            <template slot-scope="scope">
              <span
                class="detail"
                v-if="extraText.consumes && extraText.consumes.length"
                @click="toSignonPrizeList(scope.$index, scope.row)"
              >消耗明细</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="openPrizeList(scope.$index, scope.row, 1)"
              >添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <prize-list-dialog
      :sizeChange="handleSizeChange"
      :currentChange="handleCurrentChange"
      :isEdit="isEdit"
      :total="total"
      :prizeList="prizeList"
      ref="prizeListRef"
    ></prize-list-dialog>
    <div>
      <div class="pad10">
        <el-dialog title="奖品数量" :visible.sync="numDialogShow" append-to-body>
          <el-form :inline="true" class="demo-form-inline">
            <el-input v-model="prizeNum" placeholder="请输入奖品数量"></el-input>
          </el-form>
          <div class="pad10 t-right">
            <el-button type="primary" @click="AddConsumes">确认</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { getSignonById, getPrizeList, bulkAddConsumes } from '@/api/getData'
export default {
  data() {
    return {
      numDialogShow: false,
      prizeNum: 1,
      prize: '',
      platformId: '',
      isEdit: true,
      total: 0,
      signOnId: 0,
      reDate: '',
      resignDates: [],
      prizeList: [],
      extraText: {},
      pageInfo: { page: 1, pageSize: 5 }
    }
  },
  components: {
    'prize-list-dialog': () => import('@/components/prizeListDialog.vue')
  },
  created() {
    this.platformId = this.$route.query.platformId
    this.signOnId = this.$route.query.id
    this.initData({})
  },
  methods: {
    async initData() {
      let res = await getSignonById({ id: this.signOnId })
      if (res.status === 200) {
        this.resignDates = res.data.extra_text.resign.resign_dates
        this.extraText = res.data.extra_text
      }
    },
    async getPrizeList(params) {
      let res = await getPrizeList(params)
      if (res.status === 200) {
        if (!res.data.list || res.data.list.length < 1) {
          return false
        }
        this.prizeList = res.data.list
        this.total = res.data.total
      }
      return res
    },
    async openPrizeList(index, row, type) {
      this.type = type
      this.reDate = row
      this.pageInfo = { page: 1, pageSize: 5 }
      let res = await this.getPrizeList({ page: this.pageInfo.page, size: this.pageInfo.pageSize, pid: this.platformId })
      if (!res.data || !res.data.list.length) {
        this.$message.error('暂无新奖品')
        return
      }
      let that = this
      let params = {
        actionbutton: [
          { label: '添加', type: 'primary', size: 'mini', action: async function (row) { that.handlePrize(row) } }
        ]
      }
      this.$refs.prizeListRef.open(params)
    },
    handlePrize(row) {
      this.numDialogShow = true
      this.prize = row
    },
    async AddConsumes() {
      let res
      if (this.type === 1) {
        res = await bulkAddConsumes({ id: this.signOnId, prid: this.prize.id, pnum: this.prizeNum, date: this.reDate })
      }
      if (res.status === 200) {
        this.$message({ message: '操作成功', type: 'success' })
        this.numDialogShow = false
        this.$refs.prizeListRef.close()
        this.initData()
      } else {
        this.$message.error('操作失败')
      }
    },
    async handleSizeChange(data) {
      this.pageInfo.pageSize = data
      await this.getPrizeList({ page: this.pageInfo.page, size: this.pageInfo.pageSize, pid: this.platformId })
    },
    async handleCurrentChange(data) {
      this.pageInfo.page = data
      await this.getPrizeList({ page: this.pageInfo.page, size: this.pageInfo.pageSize, pid: this.platformId })
    },
    toSignonPrizeList(index, row) {
      this.$router.push({ path: '/signonConsumesList', query: { signonId: this.signOnId, date: row } })
    }
  }
}
</script>

<style lang="less">
</style>
