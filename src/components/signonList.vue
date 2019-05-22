<template>
  <div>
    <el-table
      border
      :data="signonList"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" v-if="isEdit"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="date" label="签到类型">
        <template slot-scope="scope">
          <span>{{scope.row.checktypename}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="签到周期">
        <template slot-scope="scope">
          <span>{{scope.row.cycle_text.name}}</span>
          <span v-if="scope.row.cycle_text.type == 5">{{scope.row.cycle_text.number}}(天)</span>
          <span v-else>{{DATETYPEVALUE[scope.row.cycle_text.type]}}(天)</span>
        </template>
      </el-table-column>
      <el-table-column v-if="!simplify" prop="rule_desc" label="规则描述" width="250"></el-table-column>
      <el-table-column label="奖品管理" width="150" v-if="!simplify">
        <template slot-scope="scope">
          <div>
            <span class="detail" @click="toPrizeList(scope.$index, scope.row)">奖品详情</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="!simplify" label="补签详情" width="100">
        <template slot-scope="scope">
          <span
            class="detail"
            v-if="(scope.row.extra_text && scope.row.extra_text.resign && (scope.row.extra_text.resign.cost === 2))"
            @click="toResignPlan(scope.$index, scope.row)"
          >补签方案</span>
          <span
            v-if="!(scope.row.extra_text && scope.row.extra_text.resign && (scope.row.extra_text.resign.cost === 2))"
          >无</span>
        </template>
      </el-table-column>
      <el-table-column label="生效时间" v-if="isDate">
        <template slot-scope="scope">
          <span v-if="scope.row.start_at">{{scope.row.start_at}}--{{scope.row.end_at}}</span>
          <span
            class="detail"
            v-if="!scope.row.start_at"
            @click="openEditDate(scope.$index, scope.row)"
          >添加时间</span>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="操作" width="180" v-if="isEdit">
        <template slot-scope="scope">
          <el-button
            v-for="(item, key) in cDynamic.actionbutton"
            :key="key"
            :type="item.type"
            :size="item.size"
            @click="func(item.action, scope.row)"
          >{{ item.label }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pad10 t-right" v-if="isEdit">
      <el-button
        v-for="(item, key) in cDynamic.bluckActionbutton"
        v-if="(!item.hide) || signonList.length"
        :key="key"
        :type="item.type"
        :size="item.size"
        @click="func(item.action, signons)"
      >{{ item.label }}</el-button>
    </div>
    <div>
      <edit-signon-dialog :callBack="handleSignOn" :signon="signon" ref="editSignon"></edit-signon-dialog>
    </div>
    <div>
      <edit-signon-dialog :callBack="handleNewSignOn" ref="newSignon"></edit-signon-dialog>
    </div>
    <div>
      <date-dialog :callBack="handleDate" ref="dateRef"></date-dialog>
    </div>
  </div>
</template>

<script>
import { DATETYPEVALUE } from '@/common/common'
import {
  deleteSignon,
  bulkDeleteSignOn,
  addSignon,
  updateSignonById
} from '@/api/getData'
export default {
  components: {
    'edit-signon-dialog': () => import('@/components/editSignonDialog.vue'),
    'date-dialog': () => import('@/components/dateDialog.vue')
  },
  data() {
    let that = this
    return {
      cPid: '' || this.pid,
      signon: {},
      signons: [],
      DATETYPEVALUE: DATETYPEVALUE,
      cDynamic: this.dynamic || {
        actionbutton: [
          {
            label: '编辑',
            type: 'primary',
            size: 'mini',
            action: async function (row) {
              await that.handleEdit(row)
            }
          },
          {
            label: '删除',
            type: 'danger',
            size: 'mini',
            action: async function (row) {
              await that.handleDelete(row)
            }
          }
        ],
        bluckActionbutton: [
          {
            label: '新建模板',
            type: 'primary',
            size: 'mini',
            action: async function () {
              await that.openNewSignOn()
            }
          },
          {
            label: '批量删除',
            type: 'danger',
            size: 'mini',
            action: async function () {
              await that.handleBluckEdit()
            }
          }
        ]
      }
    }
  },
  created() {
    console.log('signonComponent: ', this.cPid)
  },
  methods: {
    async func(func, data) {
      func && func(data)
    },
    async handleEdit(row) {
      this.signon = {
        name: row.name,
        rule_desc: row.rule_desc,
        checkinype: row.checktypetype,
        datetype: row.cycle_text.type,
        cycleNum: row.cycle_text.number,
        id: row.id,
        isResign: (row.extra_text && row.extra_text.resign && row.extra_text.resign.resign) ? row.extra_text.resign.resign : 0,
        cost: (row.extra_text && row.extra_text.resign && row.extra_text.resign.cost) ? row.extra_text.resign.cost : 1,
        formId: (row.extra_text && row.extra_text.resign && row.extra_text.resign.form_id) ? row.extra_text.resign.form_id : 1,
        resignDates: (row.extra_text && row.extra_text.resign && row.extra_text.resign.resign_dates) ? row.extra_text.resign.resign_dates : []
      }
      console.log('@:this.signon: ', this.signon)
      this.$refs.editSignon.open()
    },
    async handleDelete(row) {
      this.$confirm('确认删除该选项?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = await deleteSignon({ id: row.id })
        if (res.status === 200) {
          this.$message({ message: '删除成功', type: 'success' })
          this.callBack && this.callBack()
        }
      })
    },
    async handleSelectionChange(data) {
      this.signons = data
    },
    async handleBluckEdit() {
      let ids = []
      this.signons.forEach(ele => {
        ids.push(ele.id)
      })
      let res = await bulkDeleteSignOn({ ids: ids })
      if (res.status === 200) {
        this.$message({ message: '删除成功', type: 'success' })
        this.callBack && this.callBack()
      }
    },
    async handleSignOn(data) {
      if (!data.name || !data.checkinype || !data.datetype || !data.rule_desc) {
        this.$message({ message: '请完善信息', type: 'warning' })
        return
      }
      let params = { id: this.signon.id, name: data.name, checkinType: data.checkinype, dateType: data.datetype, number: data.cycleNum, desc: data.rule_desc, formId: data.formId, isResign: data.isResign, cost: data.cost, pid: this.cPid }
      // if (params.cost === 2) {
      params.resignDates = data.resignDates
      // }
      let res = await updateSignonById(params)
      if (res.status === 200) {
        this.$message({ message: '修改成功', type: 'success' })
        this.$refs.editSignon.close()
        this.callBack && this.callBack()
      }
    },
    async openNewSignOn(data) {
      this.$refs.newSignon.open()
    },
    async handleNewSignOn(data) {
      //  { name: '', rule_desc: '', period: '', checkinype: 1, datetype: 1, cycleNum: '0', isResign: 0, formId: 1, cost: 1, resignDates: [] },
      console.log('@data: ', data)
      if (!data.name || !data.rule_desc || !data.checkinype || !data.datetype) {
        this.$message({ message: '请完善信息', type: 'warning' })
        return
      }
      let params = { name: data.name, checkinType: data.checkinype, dateType: data.datetype, number: data.cycleNum, desc: data.rule_desc, formId: data.formId, isResign: data.isResign, cost: data.cost, pid: this.cPid }
      // if (params.cost === 2) {
      params.resignDates = data.resignDates
      // }
      let res = await addSignon(params)
      if (res.status === 200) {
        this.$message({ message: '操作成功', type: 'success' })
        this.$refs.newSignon.close()
        this.callBack && this.callBack()
      }
    },
    async openEditDate(index, row) {
      this.signon = row
      this.$refs.dateRef.open()
    },
    async handleDate(data) {
      this.signon.start_at = data.start_at
      this.signon.end_at = data.end_at
      this.$refs.dateRef.close()
    },
    toPrizeList(index, row) {
      this.$router.push({ path: '/prizeList', query: { id: row.id, platformId: this.cPid } })
    },
    toResignPlan(index, row) {
      this.$router.push({ path: '/resignPlan', query: { id: row.id, platformId: this.cPid } })
    }
  },
  props: ['signonList', 'isEdit', 'isDate', 'simplify', 'callBack', 'dynamic', 'pid'],
  watch: {
    'pid': function (newVal, oldVal) {
      this.cPid = newVal
    }
  }
}
</script>

<style lang="less">
.detail {
  padding: 0 5px;
  text-decoration: underline;
  color: #409eff;
  cursor: pointer;
}
</style>
