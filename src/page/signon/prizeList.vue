<template>
  <div class="fillcontain">
    <div class="table_container">
      <div class="mar10">
        <break-sticks></break-sticks>
      </div>
      <div class="mar10 pad10">名称: {{signon.name}}</div>
      <div class="mar10 pad10" v-if="signon.checkin_type">类型: {{signon.checkin_type.name}}</div>
      <div class="mar10 pad10" v-if="signon.cycle_text">签到周期: {{cycleNum}} 天</div>
      <div class="mar10">
        <div>
          <el-table border :data="prizes" stripe style="width: 100%">
            <el-table-column prop="index" label="日期" width="180"></el-table-column>
            <el-table-column label="奖品id">
              <template slot-scope="scope">
                <span>{{scope.row.prizeIds}}</span>
              </template>
            </el-table-column>
            <el-table-column label="详情">
              <template slot-scope="scope">
                <span
                  class="detail"
                  v-if="scope.row.prizeIds.length"
                  @click="toSignonPrizeList(scope.$index, scope.row)"
                >奖品明细</span>
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
      <div>
        <prize-list-dialog
          :sizeChange="handleSizeChange"
          :currentChange="handleCurrentChange"
          :isEdit="isEdit"
          :total="total"
          :prizeList="prizeList"
          ref="prizeListRef"
        ></prize-list-dialog>
      </div>
      <div class="pad10">
        <el-dialog title="奖品数量" :visible.sync="numDialogShow" append-to-body>
          <el-form :inline="true" class="demo-form-inline">
            <el-input v-model="prizeNum" placeholder="请输入奖品数量"></el-input>
          </el-form>
          <div class="pad10 t-right">
            <el-button type="primary" @click="insureNumber">确认</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { DATETYPEVALUE } from '@/common/common'
import { getSignonById, getPrizeList, signonBulkAddPrizes } from '@/api/getData'
export default {
  data() {
    return {
      platformId: '',
      numDialogShow: false,
      prizeNum: 1,
      prizes: [],
      signon: {},
      isEdit: true,
      prize: {},
      prizeList: [],
      sizeOnPrize: {},
      total: 0,
      sceneId: 0,
      type: 1,
      cycleNum: 0,
      pageInfo: {
        page: 1,
        pageSize: 5
      }
    }
  },
  components: {
    'prize-list-dialog': () => import('@/components/prizeListDialog.vue'),
    'break-sticks': () => import('@/components/common/small/breakSticks.vue')
  },
  created() {
    this.sceneId = this.$route.query.id
    this.platformId = this.$route.query.platformId
    this.initData(this.sceneId)
  },
  methods: {
    async initData(id) {
      let res = await getSignonById({ id: id })
      let prizes = []
      if (res.status === 200) {
        this.signon = res.data
        if (this.signon.cycle_text.type === 5) {
          this.cycleNum = this.signon.cycle_text.number
        } else {
          this.cycleNum = DATETYPEVALUE[this.signon.cycle_text.type]
        }
        for (let m = 1; m <= this.cycleNum; m++) {
          if (this.signon.prizes_text && this.signon.prizes_text.prizes && this.signon.prizes_text.prizes[0] && this.signon.prizes_text.prizes[0][m]) {
            prizes.push({ index: m, prizeIds: this.signon.prizes_text.prizes[0][m] })
          } else {
            prizes.push({ index: m, prizeIds: [] })
          }
        }
        this.prizes = prizes
      }
    },
    async handleSizeChange(data) {
      this.pageInfo.pageSize = data
      await this.getPrizesBySignon()
    },
    async handleCurrentChange(data) {
      this.pageInfo.page = data
      await this.getPrizesBySignon()
    },
    async insureNumber() {
      let res = await signonBulkAddPrizes({ id: this.signon.id, pnum: this.prizeNum, pid: this.sizeOnPrize.id, number: this.prize.index })
      if (res.status === 200) {
        this.$message({ message: '操作成功', type: 'success' })
        this.numDialogShow = false
        this.$refs.prizeListRef.close()
        this.initData(this.sceneId)
      } else {
        this.$message.error('操作失败')
      }
    },
    async handleSignOnPrize(row) {
      this.numDialogShow = true
      this.sizeOnPrize = row
    },
    async getPrizesBySignon() {
      let res = await getPrizeList({ id: this.signon.id, number: this.prize.index, type: this.type, page: this.pageInfo.page, size: this.pageInfo.pageSize, pid: this.platformId })
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
      this.prize = row
      this.pageInfo = { page: 1, pageSize: 5 }
      let res = await this.getPrizesBySignon()
      if (!res) {
        this.$message.error('暂无新奖品')
        return
      }
      let that = this
      let params = {
        actionbutton: [
          { label: '添加', type: 'primary', size: 'mini', action: async function (row) { that.handleSignOnPrize(row) } }
        ],
        bluckActionbutton: [
          // { label: changePrams.m_btn_text, type: changePrams.type, size: 'mini', action: async function (data) { that.handleSignOnPrize(data) } }
        ]
      }
      this.$refs.prizeListRef.open(params)
    },
    toSignonPrizeList(index, row) {
      this.$router.push({ path: '/signonPrizeList', query: { signonId: this.signon.id, number: row.index } })
    }
  }
}
</script>

<style lang="less">
</style>
