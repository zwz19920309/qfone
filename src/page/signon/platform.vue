<template>
  <div class="fillcontain">
    <div class="mar10">
      <div class="mar10">
        <h3>平台管理</h3>
      </div>
      <div class="mar10">
        <platform-list :callBack="initData" :isEdit="isEdit" :platFormList="platFormList"></platform-list>
      </div>
    </div>
  </div>
</template>

<script>
import { addPlatForm, getPlatFormList } from '@/api/getData'
export default {
  data() {
    return {
      isEdit: true,
      platform: { name: '' },
      platFormList: []
    }
  },
  components: {
    'platform-list': () => import('@/components/platFormList.vue')
  },
  created() {
    this.initData({})
  },
  methods: {
    async initData(params) {
      let res = await getPlatFormList({})
      if ((res.status === 200)) {
        this.platFormList = res.data.list
      }
    },
    async submit() {
      let res = await addPlatForm({ name: '' })
      if (res.status === 200) {
        this.$message({ message: '操作成功', type: 'success' })
      } else {
        this.$message.error('操作失败')
      }
      console.log('name: ', this.platform)
    }
  }
}
</script>
