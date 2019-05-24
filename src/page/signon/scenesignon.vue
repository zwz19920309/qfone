<template>
  <div class="fillcontain">
    <div class="mar10">
      <div class="pad10">
        <break-sticks></break-sticks>
      </div>
      <div class="pad10">
        <signon-list
          :isDate="isDate"
          :dynamic="signonDynamic"
          :isEdit="isEdit"
          :signonList="signonList"
          :simplify="simplify"
        ></signon-list>
      </div>
      <div class="pad10">
        <signon-list-dialog
          :signonList="dialogSignonList"
          :sizeChange="dialogSizeChange"
          :currentChange="dialogCurrentChange"
          :total="dialogPageInfo.total"
          ref="signonListRef"
        ></signon-list-dialog>
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
      <div>
        <date-dialog :callBack="addOneSignon" ref="dateRef"></date-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { DATETYPE, DATETYPEVALUE } from '@/common/common'
import {
  getSignonListBySceneId,
  bulkAddScenesign,
  bulkDeleteScenesign
} from '@/api/getData'
export default {
  data() {
    let that = this
    return {
      DATETYPE: DATETYPE,
      DATETYPEVALUE: DATETYPEVALUE,
      isDate: true,
      isEdit: true,
      sceneId: 0,
      platformId: '',
      scene: {},
      simplify: true,
      signon: {},
      signonList: [],
      dialogSignonList: [],
      pageInfo: {
        page: 1,
        pageSize: 10,
        total: 0
      },
      dialogPageInfo: {
        page: 1,
        pageSize: 5,
        total: 0
      },
      signonDynamic: {
        actionbutton: [
          {
            label: '删除',
            type: 'danger',
            size: 'mini',
            action: async function (row) {
              that.bulkDeleteSceneSignon(row)
            }
          }
        ],
        bluckActionbutton: [
          {
            label: '添加活动',
            hide: false,
            type: 'primary',
            size: 'mini',
            action: async function () {
              that.openSignOn()
            }
          },
          {
            label: '批量删除',
            type: 'danger',
            size: 'mini',
            action: async function (data) {
              that.bulkDeleteSceneSignon(data)
            }
          }
        ]
      }
    }
  },
  components: {
    'signon-list': () => import('@/components/signonList.vue'),
    'signon-list-dialog': () => import('@/components/signonListDialog.vue'),
    'break-sticks': () => import('@/components/common/small/breakSticks.vue'),
    'date-dialog': () => import('@/components/dateDialog.vue')
  },
  created() {

    this.platformId = this.$route.query.platformId
    this.sceneId = this.$route.query.id
    this.initData({ page: this.pageInfo.page, size: this.pageInfo.pageSize, sceneid: this.sceneId, pid: this.platformId, type: 2 })
  },
  methods: {
    async initData(params) {
      params = params || { page: this.pageInfo.page, size: this.pageInfo.pageSize, sceneid: this.sceneId, pid: this.platformId, type: 2 }
      let res = await getSignonListBySceneId(params)
      if (res.status === 200) {
        this.signonList = res.data.list
        this.scene = res.data.scene
        this.pageInfo.total = res.data.total
      }
    },
    async getSignonListNotInSceneId() {
      let res = await getSignonListBySceneId({
        pid: this.platformId,
        sceneid: this.sceneId,
        type: 1,
        size: this.dialogPageInfo.pageSize,
        page: this.dialogPageInfo.page
      })
      if (res.status === 200) {
        if (!res.data.list || res.data.list.length < 1) {
          return false
        }
        this.dialogSignonList = res.data.list
        this.dialogPageInfo.total = res.data.total
      }
      return res
    },
    async openSignOn() {
      let that = this
      let params = {
        actionbutton: [
          {
            label: '添加',
            type: 'primary',
            size: 'mini',
            action: async function (row) {
              that.openDate(row)
            }
          }
        ]
      }
      let res = await this.getSignonListNotInSceneId()
      if (!res) {
        this.$message.error('暂无新增模板')
        return
      }
      this.$refs.signonListRef.open({ dynamic: params })
    },
    async bulkDeleteSceneSignon(signonList) {
      if (!signonList || signonList.length < 1) {
        this.$message.error('请选择想要删除得选项')
        return
      }
      let scenesignons = []
      if (signonList instanceof Array) {
        signonList.forEach(signon => {
          scenesignons.push({ sceneid: this.scene.id, signonid: signon.id })
        })
      } else {
        scenesignons = [{ sceneid: this.sceneId, signonid: signonList.id }]
      }
      let res = await bulkDeleteScenesign({ scenesignons: scenesignons })
      if (res && res.status === 200) {
        this.$message({ message: '操作成功', type: 'success' })
        this.initData()
      } else {
        this.$message.error('操作失败')
      }
    },
    async openDate(signon) {
      this.signon = signon

      this.$refs.dateRef.open()
    },
    async addOneSignon(date) {
      if (!date.start_at || !date.end_at) {
        this.$message.error('请选择签到开始时间与结束时间')
        return
      }
      if ((moment().subtract(1, "days").valueOf() > moment(date.start_at).valueOf()) || (moment().valueOf() > moment(date.end_at).valueOf())) {
        this.$message.error('签到日期生效时间必须大于等于今天')
        return
      }
      if ((moment(date.start_at).valueOf()) > moment(date.end_at).valueOf()) {
        this.$message.error('签到开始时间必须小于签到结束日期')
        return
      }
      let cycleNum = (this.signon.cycle_text.type === DATETYPE.USERDEFINED) ? this.signon.cycle_text.number : DATETYPEVALUE[this.signon.cycle_text.type] // 周期天数
      let days = moment(date.end_at).diff(date.start_at, 'days')

      if (cycleNum > (moment(date.end_at).diff(date.start_at, 'days'))) {
        this.$message.error('签到有效时间段必须大于最小签到周期')
        return
      }
      let res = await bulkAddScenesign({ scenesignons: [{ sceneid: this.scene.id, signonid: this.signon.id, start: date.start_at, end: date.end_at }] })
      if (res && res.status === 200) {
        this.$message({ message: '操作成功', type: 'success' })
        this.$refs.signonListRef.close()
        this.$refs.dateRef.close()
        this.initData()
      } else {
        this.$message.error('操作失败')
      }
    },
    async handleSizeChange(data) {
      this.pageInfo.pageSize = data
      this.initData(this.pageInfo)
    },
    async handleCurrentChange(data) {
      this.pageInfo.page = data
      this.initData(this.pageInfo)
    },
    async dialogSizeChange(data) {
      this.dialogPageInfo.pageSize = data
      await this.getSignonListNotInSceneId()
    },
    async dialogCurrentChange(data) {
      this.dialogPageInfo.page = data
      await this.getSignonListNotInSceneId()
    }
  }
}
</script>

<style lang="less">
</style>
