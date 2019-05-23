<template>
  <el-dialog title="奖品管理" :visible.sync="dialogShow" @close="close">
    <div>
      <el-form :inline="true">
        <el-form-item label="名称">
          <el-input placeholder="请填写奖品名称" v-model="cPrize.name"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-form>
        <el-form-item label="奖品描述">
          <el-input
            type="textarea"
            :rows="5"
            style="width: 400px;"
            placeholder="请填写描述"
            v-model="cPrize.note"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-form>
        <el-form-item label="上传图片">
          <div class="upload-img-warp">
            <span class="upload-btn">请上传</span>
            <upload-img :callBack="handleIcon"></upload-img>
          </div>
          <div class="icon" v-show="showIcon">
            <img :src="prize.icon">
          </div>
          <div class="icon" v-show="showNewIcon">
            <img ref="icon">
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="pad10 t-right">
      <el-button type="primary" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  components: {
    'upload-img': () => import('@/components/common/file/uploadImg.vue')
  },
  data() {
    return {
      showNewIcon: false,
      showIcon: false,
      pImgId: 'pImgId',
      cPrize: this.prize || { name: '', note: '', icon: '' },
      dialogShow: false
    }
  },
  created() {
  },
  methods: {
    submit() {
      this.callBack && this.callBack(this.cPrize)
    },
    open(params) {
      this.dialogShow = true
    },
    close() {
      this.showNewIcon = false
      this.dialogShow = false
    },
    handleIcon(file, e) {
      this.showIcon = false
      this.showNewIcon = true
      this.prize.icon = file
      this.$refs.icon.src = e.target.result
    }
  },
  props: ['prize', 'callBack', 'editIcon'],
  watch: {
    'prize': function (newVal, oldVal) {
      if (newVal) {
        this.cPrize = newVal
        if ((newVal.icon)) {
          this.showIcon = true
        }
      }
    }
  }
}
</script>

<style lang="less">
.t-right {
  text-align: right;
}
.icon {
  width: 100px;
  height: 100px;
  float: left;
  img {
    width: 80px;
    height: 80px;
    border: 1px solid #eee;
  }
}
.upload-img-warp {
  width: 80px;
  height: 30px;
  background: #eee;
  border: 1px solid #aaa;
  border-radius: 3px;
  float: left;
  margin-left: 30px;
  margin-right: 40px;
  position: relative;
}
.upload-btn {
  position: absolute;
  width: 60px;
  line-height: 30px;
  left: 15px;
}
</style>
