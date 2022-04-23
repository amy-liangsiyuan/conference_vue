<template>
  <TopNavBar></TopNavBar>
  <div>
    <!--banner-->
    <div class="home-banner">
      <div class="banner-container">
        <h1 class="blog-title animated zoomIn">
          {{ $t('PlatformName') }}
        </h1>
        <!-- 向下滚动 -->
        <div class="scroll-down" @click="scrollDown">
          <el-icon>
            <arrow-down-bold/>
          </el-icon>
          <h4>{{ $t('ScrollDown') }}<i class="el-icon-arrow-down"></i></h4>
        </div>
      </div>
    </div>
  </div>
  <!--主内容 -->
  <div class="m-home">
    <div style="width: 80%;margin: auto">
      <el-row>
        <el-col :span="24"><h1 style="text-align: center">{{ $t('HomePage.Home_1') }}</h1></el-col>
      </el-row>
      <img style="display:block;object-fit: fill;margin:auto" src="../assets/images/line.png">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card>
            <el-image
                :src="require('../assets/images/describe_1.jpg')"
            />
            <div style="padding: 14px;text-align: center">
              <h3>{{ $t('HomePage.Home_2') }}</h3>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="always">
            <el-image
                :src="require('../assets/images/describe_2.jpg')"
            />
            <div style="padding: 14px;text-align: center">
              <h3>{{ $t('HomePage.Home_3') }}</h3>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="always">
            <el-image
                :src="require('../assets/images/describe_3.jpg')"
            />
            <div style="padding: 14px;text-align: center">
              <h3>{{ $t('HomePage.Home_4') }}</h3>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="always">
            <el-image
                :src="require('../assets/images/describe_4.jpg')"
            />
            <div style="padding: 14px;text-align: center">
              <h3>{{ $t('HomePage.Home_5') }}</h3>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <!-- 推荐会议-->
      <el-row>
        <el-col :span="24"><h1 style="text-align: center">{{ $t('HomePage.Home_6') }}</h1></el-col>
      </el-row>
      <img style="display:block;object-fit: fill;margin:auto" src="../assets/images/line.png">
      <el-row :gutter="25">
        <el-col
            v-for="item in latestList"
            :key="item.id"
            :span="8"
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
                <el-button type="primary" style="padding: 10px;margin-bottom: 10px" @click="toConference(item.id)">
                  {{ $t('HomePage.Home_7') }}
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <Footer style="width: 101%"></Footer>
  </div>

</template>

<script>
import TopNavBar from '../components/TopNavBar'
import Footer from '../components/Footer'

export default {
  components: {
    TopNavBar,
    Footer
  },
  name: "home",
  data() {
    return {
      latestList: [
        {
          id: 1,
          createTime: "2022-2-1",
          name: "一个比较长的会议名字用来做测试",
          city: "上海"
        },
        {
          id: 2,
          createTime: "2022-2-2",
          name: "会议2",
          city: "成都"
        },
        {
          id: 1,
          createTime: "2022-2-3",
          name: "会议3",
          city: "北京"
        },
        {
          id: 1,
          createTime: "2022-2-4",
          name: "会议4",
          city: "乌鲁木齐"
        }
      ]
    }
  },
  created() {
    this.getRecommendList()
  },
  methods: {
    toConference(conferenceId) {
      localStorage.setItem('conferenceId',conferenceId)
      this.$router.push('/conferencePage')
    },
    scrollDown() {
      window.scrollTo({
        behavior: 'smooth',
        top: document.documentElement.clientHeight
      })
    },
    async getRecommendList() {
      const {data: res} = await this.$http.get('/api/server/conference/getRecommendList')
      this.latestList = res.data
    }
  }
}

</script>

<style scoped>
.el-col {
  align-items: stretch;
  margin-bottom: 25px;
}

.m-home {
  padding-top: 100vh !important;
  padding-bottom: 0px !important;
  width: 100%;
  margin: auto;
}

.home-banner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  background: url("../assets/images/home_back.jpg") center center /
    cover no-repeat;
  text-align: center;
  color: #fff !important;
  animation: header-effect 1s !important;
}

.banner-container {
  margin-top: 43vh;
  line-height: 1.5;
  color: #eee;
}

.blog-contact a {
  color: #fff !important;
}

.el-card {
  background: rgb(240, 240, 240, 0.2);
  backdrop-filter: blur(5px);
  border-radius: 20px;

}

.el-card:hover {
  transition: all 0.2s;
  /*margin: 0 1% 0 1%;*/
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3) !important;
}

.card-info-social {
  line-height: 40px;
  text-align: center;
  font-size: 1.5rem;
  margin: 6px 0 -6px;
}

.left-radius {
  border-radius: 8px 0 0 8px !important;
  order: 0;
}

.right-radius {
  border-radius: 0 8px 8px 0 !important;
  order: 1;
}

.article-wrapper {
  font-size: 14px;
}

@media (min-width: 760px) {
  .blog-title {
    font-size: 2.5rem;
  }

  .blog-intro {
    font-size: 1.5rem;
  }

  .blog-contact {
    line-height: 40px;
    text-align: center;
    font-size: 1.5rem;
    margin: 6px 0 -6px;
  }

  .home-container {
    max-width: 1200px;
    margin: calc(100vh - 50px) auto 0 auto;
    padding: 0 3px;
  }

  .article-card {
    display: flex;
    align-items: center;
    height: 280px;
    width: 100%;
    margin-top: 20px;
  }

  .article-cover {
    overflow: hidden;
    height: 100%;
    width: 45%;
  }

  .on-hover {
    transition: all 0.6s;
  }

  .article-card:hover .on-hover {
    transform: scale(1.1);
  }

  .article-wrapper {
    padding: 0 2.5rem;
    width: 55%;
  }

  .article-wrapper a {
    font-size: 1.5rem;
    transition: all 0.3s;
  }
}

@media (max-width: 759px) {
  .blog-title {
    font-size: 24px;
  }

  .blog-contact {
    font-size: 1.25rem;
    line-height: 2;
  }

  .home-container {
    width: 100%;
    margin: calc(100vh - 66px) auto 0 auto;
  }

  .article-card {
    margin-top: 1rem;
  }

  .article-cover {
    border-radius: 8px 8px 0 0 !important;
    height: 230px !important;
    width: 100%;
  }

  .article-cover div {
    border-radius: 8px 8px 0 0 !important;
  }

  .article-wrapper {
    padding: 1.25rem 1.25rem 1.875rem;
  }

  .article-wrapper a {
    font-size: 1.25rem;
    transition: all 0.4s;
  }
}

.scroll-down {
  cursor: pointer;
  position: absolute;
  bottom: 0;
  width: 100%;
}

.scroll-down i {
  font-size: 2rem;
}


@keyframes scroll-down-effect {
  0% {
    top: 0;
    opacity: 0.4;
    filter: alpha(opacity=40);
  }
  50% {
    top: -16px;
    opacity: 1;
    filter: none;
  }
  100% {
    top: 0;
    opacity: 0.4;
    filter: alpha(opacity=40);
  }
}

.big i {
  color: #f00;
  animation: big 0.8s linear infinite;
}

@keyframes big {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}
</style>
