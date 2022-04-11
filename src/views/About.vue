<template>
  <TopNavBar></TopNavBar>


  <div style="width: 100%">
    <!-- banner -->
    <img style="object-fit:cover;width: 100%;position: absolute;top: 0;height: 40vh" src="../assets/images/home_back.jpg">
    <div class="m-about">
      <div style="width: 80%;margin: auto">
        <el-row>
          <el-col :span="24"><h1 style="text-align: center">{{$t('AboutPage.About_1')}}</h1></el-col>
        </el-row>
        <img style="display:block;object-fit: fill;margin:auto" src="../assets/images/line.png">
        <el-card  style="margin: 0 auto">
          <br>
          <div class="blockquote" style="text-align: center;font-size: 18px;font-weight: 800">
            <div>{{$t('AboutPage.About_2')}}</div>
            <div>{{$t('AboutPage.About_3')}}</div>
            <div>{{$t('AboutPage.About_4')}}</div>
            <div>{{$t('AboutPage.About_5')}}</div>
            <div>{{$t('AboutPage.About_6')}}</div>
            <div>{{$t('AboutPage.About_7')}}</div>
          </div>
        </el-card>
      </div>

      <Addabout ref="addabout"></Addabout>
    </div>
    <br>
    <br>
  </div>

  <Footer style="width: 101%"></Footer>
</template>

<script>
import TopNavBar from '../components/TopNavBar'
import Footer from '../components/Footer'

export default {
  components: {
    TopNavBar,
    Footer
  },
  data() {
    return {
      dataList: []
    }
  }
}
</script>

<style scoped>
.blockquote {
  line-height: 2;
  margin: 0;
  font-size: 15px;
  border-left: 0.2rem solid #1685a9;
  padding: 10px 1rem !important;
  background: rgb(79, 160, 177,0.1);
  border-radius: 4px;
}
.el-card{
  width: 50%;
  background: rgb(240,240,240,0.2);
  backdrop-filter: blur(10px);
  border-radius: 20px;
}
.el-card:hover {
  transition:all 0.5s;
  width: 54%;
}


.m-about {
  padding-top: 35vh !important;
  padding-bottom: 0px !important;
  width: 100%;
  margin: auto;
}




</style>
