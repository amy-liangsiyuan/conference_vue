<template>
  <TopNavBar></TopNavBar>
  <!--主图片-->
  <img style="object-fit: cover;width: 100%;position: absolute;top: 0;height: 40vh"
       src="../assets/images/home_back.jpg">
  <!--主内容-->
  <div class="m-home">
    <div style="width: 80%;margin: auto">
      <el-row>
        <el-col :span="24"><h1 style="text-align: center">{{ $t('SearchConferencePage.Search_1') }}</h1></el-col>
      </el-row>
      <img style="display:block;object-fit: fill;margin:auto" src="../assets/images/line.png">
      <!--查询表单-->
      <div style="width: 80%;margin: 35px auto">
        <el-form :inline="true" :model="Query">
          <el-form-item :label="$t('SearchConferencePage.Search_2')">
            <el-input v-model="Query.queryString" :placeholder="$t('SearchConferencePage.Search_3')"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchSubmit">{{ $t('SearchConferencePage.Search_9') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--查询结果展示-->
      <div style="width: 80%;margin: 0 auto" v-loading="loading">
        <el-row>
          <el-col
              style="align-items: stretch;margin-bottom: 20px"
              v-for="item in searchList"
              :key="item.id"
              :span="24"
          >
            <el-card shadow="hover" style="padding: 20px 20px">
              <div v-text="item.createTime" style="font-size: 18px;font-weight: 800;color: #2150b1;"></div>
              <div v-text="item.name"
                   style="overflow: auto;margin-top: 25px;line-height: 30px;font-size: 22px;height: 70px;font-weight: 800"></div>
              <div>
                <div style="width: 50%;float: left">
                  <el-icon size="15px">
                    <location/>
                  </el-icon>
                  <a v-text="item.city" style="font-size: 16px;font-weight: 700"></a>

                </div>
                <div style="float: right">
                  <el-button type="primary" style="padding: 10px;margin-bottom: 10px"
                             @click="toConference(item.id)">{{ $t('SearchConferencePage.Search_10') }}
                  </el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-pagination
            @current-change="handleCurrentPage"
            :page-size="Query.pageSize"
            layout="prev, pager, next"
            :total="Query.total"
            :current-page="Query.currentPage"
            :hide-on-single-page="true"
            :background="true"
        ></el-pagination>
      </div>
    </div>
  </div>
  <Footer style="width: 101%;margin-top: 20px"></Footer>
</template>

<script>
import TopNavBar from '../components/TopNavBar'
import Footer from '../components/Footer'

export default {
  name: "searchconference",
  data() {
    return {
      loading: false,
      Query: {
        currentPage: 1,
        pageSize: 5,
        total: null,
        queryString: "",
      },

      searchList: []
    }
  },
  components: {
    TopNavBar,
    Footer
  },
  created() {
    this.searchSubmit()

  },
  methods: {
    async searchSubmit() {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 500)
      const {data: res} = await this.$http.post('/api/server/conference/searchPage', JSON.stringify(this.Query))
      this.searchList = res.data.list
      this.Query.total = res.data.total
      this.Query.currentPage = res.data.pageNum
      this.Query.pageSize = res.data.pageSize
    },
    toConference(conferenceId) {
      //跳转到对应到会议主页面
      alert(conferenceId)
    },
    async handleCurrentPage(currentPage) {
      this.Query.currentPage = currentPage
      const {data: res} = await this.$http.post('/api/server/conference/searchPage', JSON.stringify(this.Query))
      this.loading=true
      setTimeout(()=>{
        this.searchList = res.data.list
        this.Query.total = res.data.total
        this.Query.currentPage = res.data.pageNum
        this.Query.pageSize = res.data.pageSize
        this.loading=false
      },500)

    }
  }
}
</script>

<style scoped>
.m-home {
  padding-top: 35vh !important;
  padding-bottom: 0 !important;
  width: 100%;
  min-height: 40vh;
  margin: auto;
}

.el-card {
  background: rgb(240, 240, 240, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 20px;
}

.el-card:hover {
  transition: all 0.2s;
  margin: 1% -3% 1% -3%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3) !important;


}
</style>
