<template>
  <div class="fillcontain">
    <div class="mar10">
      <div class="pad10">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="可补签日期: ">
            <textarea
              rows="10"
              cols="40"
              v-model="calendarObj.display"
              @click="openMultiByDrop($event)"
            ></textarea>
          </el-form-item>
        </el-form>
      </div>
      <div class="pad10">
        <el-button type="primary" @click="bulkAddResignDate">确认提交</el-button>
      </div>
      <transition name="fade">
        <div class="calendar-dropdown" v-if="calendarObj.show">
          <calendar
            :zero="calendarObj.zero"
            :lunar="calendarObj.lunar"
            :value="calendarObj.value"
            :multi="calendarObj.multi"
            @select="calendarObj.select"
          ></calendar>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { addResignDate, getResignDateList } from '@/api/getData'
export default {
  data() {
    return {
      resignDateList: [],
      calendarObj: {
        arr: [],
        display: '',
        multi: true,
        show: false,
        zero: true,
        value: [], // 默认日期
        lunar: true, // 显示农历
        select: value => {
          console.log('@dateValue: ', value)
          let displayValue = []
          let newResignData = []
          value.forEach(v => {
            let date =
              v[0] +
              '-' +
              (v[1] >= 10 ? v[1] : '0' + v[1]) +
              '-' +
              (v[2] >= 10 ? v[2] : '0' + v[2])
            displayValue.push(date)
            newResignData.push(date)
          })
          this.calendarObj.value = value
          this.resignDateList = newResignData
          this.calendarObj.display = displayValue.join(',')
        }
      }
    }
  },
  components: {
    calendar: () => import('@/components/common/calendar/calendar.vue'),
    'break-sticks': () => import('@/components/common/small/breakSticks.vue')
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      let res = await getResignDateList()
      if (res.status === 200 && res.data.list.length) {
        let datas = res.data.list
        let arr = []
        datas.forEach(ele => {
          let dates = ele.split('-')
          arr.push([
            parseInt(dates[0]),
            parseInt(dates[1]),
            parseInt(dates[2])
          ])
        })
        this.arr = arr
        this.calendarObj.select(arr)
      }
    },
    async submit() { },
    openMultiByDrop(e) {
      this.calendarObj.show = true
      e.stopPropagation()
      window.setTimeout(() => {
        document.addEventListener(
          'click',
          e => {
            this.calendarObj.show = false
            document.removeEventListener('click', () => { }, false)
          },
          false
        )
      }, 1000)
    },
    async bulkAddResignDate() {
      let res = await addResignDate({ resignDates: this.resignDateList })
      if (res.status === 200) {
        this.$message({ message: '修改成功', type: 'success' })
        this.initData()
      }
    }
  }
}
</script>

<style lang="less">
.calendar_box {
  position: relative;
  width: 120px;
  height: 40px;
  margin-left: 100px;
}
.calendar_input {
  position: absolute;
  top: 0;
  left: 0;
  width: 120px;
  height: 40px;
  color: transparent;
  cursor: pointer;
  background: #409eff;
  border-radius: 5px;
  border-color: #409eff;
}
.resign_text {
  position: absolute;
  z-index: 1;
  color: #fff;
  top: 10px;
  left: 13px;
  font-size: 14px;
}

/*下拉框*/
.calendar-dropdown {
  background: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 2px;
  margin-left: -250px;
  margin-top: -300px;
}
.calendar-dropdown:before {
  position: absolute;
  left: 30px;
  top: -10px;
  content: "";
  border: 5px solid rgba(0, 0, 0, 0);
  border-bottom-color: #dedede;
}
.calendar-dropdown:after {
  position: absolute;
  left: 30px;
  top: -9px;
  content: "";
  border: 5px solid rgba(0, 0, 0, 0);
  border-bottom-color: #fff;
}
</style>
