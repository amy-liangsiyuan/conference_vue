<template>
  <div class="my404">
    <el-card class="myCard">
      <el-row>
        <el-col>
          <div style="margin-top:15%;font-size: 40px;font-weight:900;text-align: center">
            404 Not Found
          </div>
        </el-col>
        <el-col>
          <div style="margin-top:10%;text-align: center">
            <el-button type="primary" @click="toHome">BACK TO HOME</el-button>
          </div>

        </el-col>
      </el-row>

    </el-card>
  </div>


</template>

<script>
export default {
  name: "404page",
  methods: {
    toHome() {
      this.$router.push("/")
    }
  }
}
</script>

<style scoped>
.my404{
  display: flex;
  justify-content: center;
  align-items: center;
  /* 让页面始终占浏览器总高 */
  height: 100vh;
  width: 101%;
  /* 背景渐变色 */
  background-image: linear-gradient(200deg, #1abc9c, #0abdfe);
}
.myCard {
  margin: 5% auto;
  overflow: auto;
  width: 30%;
  height: 40%;
  background: rgb(240, 240, 240, 0.5);
  backdrop-filter: blur(20px);
  box-shadow: 5px 5px 5px black;
  border: red !important;
}

.el-card {
  --el-card-border-radius: 20px;
  transition: all 1s;
}

.el-card:hover {
  margin-top:7%;
}
</style>
