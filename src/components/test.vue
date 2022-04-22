<template>
  <el-button @click="test"></el-button>
</template>

<script>
export default {
  methods:{
    async test() {
      await this.$http.get('/api/server/conference/get_page'+'1507795422150705153').then((res) => {
        if (res.data.flag) {
          this.$message.success(res.data.message)
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  }
}


</script>
