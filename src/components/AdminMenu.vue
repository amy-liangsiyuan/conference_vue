<template>
  <div class="adminbg">
    <el-row class="tac">
      <el-col :span="3">

        <el-menu
            style="  backdrop-filter: blur(30px);"
            :background-color="this.isCollapse?'rgb(255,255,255,0.3)':'rgb(255,255,255,0.1)'"
            :default-active="$route.path"
            class="el-menu-vertical-demo myMenu"
            :router="true"
            :collapse="isCollapse"
        >
          <el-button v-show="this.screenWidth>=1600"
                     style="backdrop-filter: blur(30px);background:transparent;width: 100%;opacity: 0.5"
                     @click="toggleCollapse"
                     v-text="isCollapse?'< >':'> <'"></el-button>
          <el-button style="backdrop-filter: blur(30px);background:transparent;margin-left:0;width: 100%;opacity: 0.5"
                     @click="changeLang">{{ $t('Language') }}
          </el-button>

          <el-sub-menu index="1">
            <template #title>
              <el-icon v-show="isCollapse">
                <avatar/>
              </el-icon>
              <el-avatar style="margin-left: 18%" :size="40" :src="avatar"/>
              <span style="font-size:18px;margin-left:10px">{{ name }}</span>

            </template>

            <el-menu-item-group>

              <el-menu-item index="/admin/userinfo">{{ $t('AdminPage.SelfInfo') }}</el-menu-item>
              <el-menu-item index="/admin/myconference">{{ $t('AdminPage.ConferenceInfo') }}</el-menu-item>
              <el-button color="rgb(200,0,0)"
                         style="text-align:left;color:whitesmoke;font-weight:800;width: 100%;height:50px;opacity: 0.5"
                         @click="LoginOut">{{ $t('AdminPage.LogOut') }}
              </el-button>
            </el-menu-item-group>
            <el-sub-menu index="1-4">
              <template #title>item four</template>
              <el-menu-item index="1-4-1">item one</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-menu-item index="2">
            <el-icon>
              <icon-menu/>
            </el-icon>
            <span>Navigator Two</span>
          </el-menu-item>
          <el-menu-item index="/">
            <el-icon>
              <home-filled/>
            </el-icon>
            <span>{{$t('TopNavBar.Home')}}</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="20" style="margin-top: 5vh;" :class="isCollapse?'myWidth_2':'myWidth_1'">
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      screenWidth: '',
      isCollapse: false,
      MenuWidth: "12",
      avatar: 'http://localhost:9002/images/test.jpg',
      name: "user"
    }
  },
  mounted() {
    window.onresize = () => {
      this.screenWidth = document.body.clientWidth
      if (this.screenWidth < 1600) this.isCollapse = true
      else this.isCollapse = false
    }
  },
  created() {
    this.screenWidth = document.body.clientWidth
    this.getUser()
  },
  methods: {
    getUser() {
      if (sessionStorage.getItem('token') && sessionStorage.getItem('user')) {
        const user = JSON.parse(sessionStorage.getItem('user'))
        this.name = user.name
        this.avatar = user.avatar
      }
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    changeLang() {
      const locale = localStorage.getItem('lang') === 'en' ? 'ch' : 'en'
      localStorage.setItem('lang', locale)
      this.$i18n.locale = locale
    },
    LoginOut() {
      window.sessionStorage.removeItem('token')
      window.sessionStorage.removeItem('user')
      this.$router.push('/')
    }
  }
}
</script>
<style scoped>
.el-menu-item {
  justify-content: center
}

.adminbg {
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

.myMenu {
  box-shadow: 3px 3px 10px black;
  margin-top: 15vh;
  height: 70vh;
  overflow: hidden;
  font-weight: 800;
  border-radius: 25px
}

.myWidth_1 {
  animation-name: changeWidth_1;
  animation-duration: 1000ms; /*定义动画完成一个周期所需要的时间，以秒或毫秒计*/
  -webkit-animation-fill-mode: forwards; /*动画完成后保持最后状态*/
}

.myWidth_2 {
  animation-name: changeWidth_2;
  animation-duration: 1000ms; /*定义动画完成一个周期所需要的时间，以秒或毫秒计*/
  -webkit-animation-fill-mode: forwards;
}

@-webkit-keyframes changeWidth_1 {
  0% {
    margin-left: -2%;
  }
  100% {
    margin-left: 2%;
  }
}

@-webkit-keyframes changeWidth_2 {
  0% {
    margin-left: 2%;
  }
  100% {
    margin-left: -2%;
  }
}
</style>
