<template>
  <div style="margin: 0 auto;text-align: center">

    <img style="object-fit: fill;top: 0;width:80%;height: 30vh;margin: 0 auto"
         src="../assets/images/defaultback.png">
    <el-row>
      <el-col :span="24"><h1 style="text-align: center" v-text="conference.name"></h1></el-col>
    </el-row>
    <img style="display:block;object-fit: fill;margin:auto" src="../assets/images/line.png">
  </div>
  <Footer></Footer>
</template>

<script>
import Footer from '../components/Footer'

export default {
  components: {
    Footer
  },
  name: "conferenceinfo",
  data(){
    return{
      conference:{
        name:"xxxx第x次xxxxx国际学术会议",

      }
    }
  }
}
</script>

<style scoped>

</style>
