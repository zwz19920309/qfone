<template>
  <div class="fillcontain">
    <div class="table_container">
      <div class="mar10 pad10">
        <h3>奖励记录</h3>
      </div>
      <div class="mar10">
        <el-table border :data="recordList" style="width: 100%">
          <el-table-column prop="uid" label="用户uid"></el-table-column>
          <el-table-column prop="prize_name" label="奖励名称"></el-table-column>
          <el-table-column prop="number" label="奖励数量"></el-table-column>
          <el-table-column prop="prize_note" label="奖励描述" width="250"></el-table-column>
          <el-table-column prop="created_at" label="奖励时间"></el-table-column>
        </el-table>
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
      <div class="mar10 pad10">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="test.qAppId" placeholder="用户appid"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="test.qAppSecret" placeholder="用户appsecret"></el-input>
          </el-form-item>
        </el-form>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="test.uid" placeholder="用户uid"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">签到</el-button>
          </el-form-item>
        </el-form>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="test.qUid" placeholder="用户uid"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onQuery">查询</el-button>
          </el-form-item>
        </el-form>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="test.reuid" placeholder="用户uid"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="test.reSignDate" placeholder="补签日期"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onResign">补签</el-button>
          </el-form-item>
        </el-form>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="test.qUid" placeholder="用户uid"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onReward
            ">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { getAwardRecordList, userSignon, getSelfSignon, reSignon, getUserAwardListBySceneId } from '@/api/getData'
export default {
  data() {
    return {
      test: {
        platformId: '',
        uid: '',
        sceneId: '',
        qUid: '',
        qSecenId: '',
        qAppId: 'XenWteXacicouGeoUOxx',
        qAppSecret: 'c79c292102143b3a8bd39ca9eb7f71c8',
        reuid: '',
        reSceneId: '',
        reSignDate: ''
      },
      isEdit: true,
      recordList: [],
      pageInfo: {
        page: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  components: {
    'prize-list': () => import('@/components/prizeList.vue')
  },
  created() {
    this.platformId = this.$route.query.platformId
    console.log('@platformId:', this.platformId)
    this.initData({ page: this.pageInfo.page, size: this.pageInfo.pageSize, pid: this.platformId })
  },
  methods: {
    async initData(params) {
      let res = await getAwardRecordList(params)
      if (res.status === 200) {
        this.recordList = res.data.list
        this.pageInfo.total = res.data.total
      }
    },
    async handleSizeChange(data) {
      this.pageInfo.pageSize = data
      await this.initData({ page: this.pageInfo.page, size: this.pageInfo.pageSize, pid: this.platformId })
    },
    async handleCurrentChange(data) {
      this.pageInfo.page = data
      await this.initData({ page: this.pageInfo.page, size: this.pageInfo.pageSize, pid: this.platformId })
    },
    async onSubmit() {
      console.log('@onSubmit')
      await userSignon({ uid: this.test.uid, sceneid: this.test.sceneId, appid: this.test.qAppId, appsecret: this.test.qAppSecret })
    },
    async onQuery() {
      console.log('@onQuery: -----')
      await getSelfSignon({ uid: this.test.qUid, sceneid: this.test.qSecenId, scenesignonId: this.test.qSecenId, appid: this.test.qAppId, appsecret: this.test.qAppSecret })
    },
    async onResign() {
      console.log('@onResign: -----')
      await reSignon({ uid: this.test.reuid, sceneid: this.test.reSceneId, date: this.test.reSignDate, appid: this.test.qAppId, appsecret: this.test.qAppSecret })
    },
    async onReward() {
      await getUserAwardListBySceneId({ uid: this.test.qUid, sceneid: this.test.qSecenId, scenesignonId: this.test.qSecenId, appid: this.test.qAppId, appsecret: this.test.qAppSecret })
    }
  }
}
</script>

<style lang="less">
</style>
