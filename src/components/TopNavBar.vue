<template>
  <el-menu

      :default-active="$route.path"
      class="myNav"
      mode="horizontal"
      text-color="#fff"
      active-text-color="rgb(255,255,255)"
      @select="handleSelect"
  >
    <el-menu-item>
      <div style="font-size: 20px;font-weight: 800">{{ $t('PlatformName') }}</div>
    </el-menu-item>
    <el-menu-item style="margin-left:auto" index="/">
      <el-icon>
        <home-filled/>
      </el-icon>
      {{ $t('TopNavBar.Home') }}
    </el-menu-item>
    <el-menu-item index="/searchconference">
      <el-icon>
        <search/>
      </el-icon>
      {{ $t('TopNavBar.SearchConference') }}
    </el-menu-item>
    <el-menu-item index="/newconference">
      <el-icon>
        <circle-plus/>
      </el-icon>
      {{ $t('TopNavBar.NewConference') }}
    </el-menu-item>
    <el-menu-item index="/about">
      <el-icon>
        <phone-filled/>
      </el-icon>
      {{ $t('TopNavBar.About') }}
    </el-menu-item>


    <el-menu-item v-if="isLogin()" index="/login">
      <el-icon>
        <check/>
      </el-icon>
      {{ $t('Login') }}
    </el-menu-item>
    <el-sub-menu  :popper-offset="0" v-else >
      <template #title>
        <el-avatar  :size="30" :src="avatar"/>
        <span style="margin-left:10px">{{ name }}</span>
      </template>
      <el-menu-item index="/admin" style="background:rgb(60, 134, 149,0.7);color: black">{{
          $t('TopNavBar.ManagementCenter')
        }}
      </el-menu-item>
      <el-menu-item @click="Logout" style="color: red;font-weight: 800 ">{{ $t('TopNavBar.LogOut') }}</el-menu-item>
    </el-sub-menu>
    <div style="height: inherit;display: flex">
      <el-button size="small" style="background:transparent;color: whitesmoke;margin: auto 10px" @click="changeLang" plain>
        {{ $t('Language') }}
      </el-button>
    </div>

  </el-menu>
</template>

<script>
import router from "../router";

export default {
  components: {},
  data() {
    return {
      avatar: '',
      name: "user"
    }
  },
  methods: {
    isLogin() {
      if (sessionStorage.getItem('token') && sessionStorage.getItem('user')) {
        const user = JSON.parse(sessionStorage.getItem('user'))
        this.avatar = user.avatar
        this.name = user.name
        return false
      } else return true
    },
    changeLang() {
      const locale = localStorage.getItem('lang') === 'en' ? 'ch' : 'en'
      localStorage.setItem('lang', locale)
      this.$i18n.locale = locale
    },
    Logout() {
      window.sessionStorage.removeItem('token')
      window.sessionStorage.removeItem('user')
      window.location.reload()
    },
    handleSelect(key) {
      if (key)
        router.push(key)
    }
  }
}
</script>

<style scoped>
.myNav {
  position: relative;
  top: 0;
  z-index: 99;
  width: 101%;
  border: transparent;
  background: transparent;
  --el-menu-hover-bg-color:rgb(255,255,255,0.2);
}

</style>
