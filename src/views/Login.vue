<template>
  <div id="login-wrapper">
    <el-menu
        style="position:relative;z-index: 99;border: transparent"
        class="el-menu-demo"
        mode="horizontal"
        background-color="rgba(255, 255, 255,0)"
        text-color="#fff"
        active-text-color="#000000"
        router="true"
    >
      <el-menu-item index="/">
        <div style="font-size: 20px;font-weight: 800">{{$t('PlatformName')}}</div>
      </el-menu-item>
      <el-menu-item style="margin-left:auto" index="/">
        <el-icon>
          <home-filled/>
        </el-icon>
        {{$t('TopNavBar.Home')}}
      </el-menu-item>
      <el-menu-item index="/searchconference">
        <el-icon>
          <search/>
        </el-icon>
        {{$t('TopNavBar.SearchConference')}}
      </el-menu-item>
      <el-menu-item index="/about">
        <el-icon>
          <phone-filled/>
        </el-icon>
        {{$t('TopNavBar.About')}}
      </el-menu-item>
      <el-menu-item index="/register">
        <el-icon>
          <circle-plus/>
        </el-icon>
        {{$t('TopNavBar.Register')}}
      </el-menu-item>
    </el-menu>

    <div class="login-box">
      <h2>{{$t('PlatformName')}}</h2>
      <form>
        <div class="user-box">
            <input
                type="text"
                name=""
                v-model.trim="loginForm.name"
                required=""
                key="username-v3"
            />
            <label>{{$t('UserInfo.UserName')}}:</label>
        </div>

        <div class="user-box">
            <input
                autocomplete="new-password"
                type="password"
                name=""
                v-model.trim="loginForm.password"
                required=""
                key="password-v3"
            />
            <label>{{$t('UserInfo.PassWord')}}:</label>
        </div>
        <el-row :gutter="25">
          <el-col span="8">
            <div class="user-box" style="width: 150px">
              <input
                  type="text"
                  name=""
                  v-model.trim="loginForm.code"
                  required=""
              />
              <label>{{$t('UserInfo.PIN')}}:</label>
            </div>
          </el-col>
          <el-col span="8">
            <el-image v-bind:src="verifyCode" @click="getCode()" width="100px" height="35px"
                      style="float: right;cursor:pointer;"/>
          </el-col>
        </el-row>
        <a href="#" style="left:65%;font-weight: 800" @click="login">
          <span></span>
          <span></span>
          <span></span>
          {{$t('Login')}}
        </a>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //验证码图片
      verifyCode: "",
      loginForm: {
        name: "",
        password: "",
        verKey: "",
        code: ""//输入的验证码
      },
    }
  },
  created() {
    if (sessionStorage.getItem('token')){
      this.$router.push('/')
    }
    this.getCode()
  },
  methods: {
    async getCode() {
      const {data: res} = await this.$http.get('/api/server/user/code')
      this.verifyCode = res.data
      this.loginForm.verKey = res.code
    },
    async login() {
      var param = this.$encryption(JSON.stringify(this.loginForm))
      // console.log('param2' + param2)
      const {data: res} = await this.$http.post('/api/server/user/login', param)
      if (res.flag !== true) {
        this.$message.error(res.message)
        await this.getCode()
      } else {
        this.$message.success('success')
        // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
        //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
        //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
        window.sessionStorage.setItem('token', res.code)
        window.sessionStorage.setItem('user', JSON.stringify(res.data))
        // 2. 通过编程式导航跳转到后台主页
        await this.$router.push('/admin')
        // //刷新页面，删除vuex数据
        // setTimeout(() => {
        //   window.location.reload()
        // }, 100)
      }
    }
  }
}
</script>
<style scoped>
#login-wrapper {
  background: url("../assets/images/home_back.jpg") center center /
    cover no-repeat;
  width: 101%;
  height: 100vh;
}

.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  padding: 40px;
  transform: translate(-50%, -50%);
  background: rgba(50, 50, 50, 0.4);
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.9);
  box-sizing: border-box;

  backdrop-filter: blur(20px);
  border-radius: 20px;
  transition: 0.4s;
}
.login-box:hover{
  transition: 0.4s;
  margin-top: .5%;
  background: rgba(50, 50, 50, 0.5);
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.9);
}
.login-box h2 {
  margin: 0 0 30px;
  padding: 0;
  color: #fff;
  text-align: center;
}

.login-box .user-box {
  position: relative;
}

.login-box .user-box input {
  width: 100%;
  padding: 10px 0;
  font-size: 26px;
  color: #fff;
  margin-bottom: 35px;
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  background: transparent;
}

.login-box .user-box label {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px 0;
  font-size: 16px;
  color: #fff;
  pointer-events: none;
  transition: 0.5s;
}

.login-box .user-box input:focus ~ label,
.login-box .user-box input:valid ~ label {
  top: -20px;
  left: 0;
  color: #03e9f4;
  font-size: 12px;
}

.login-box form a {
  position: relative;
  display: inline-block;
  padding: 10px 20px;
  color: #03e9f4;
  font-size: 16px;
  text-decoration: none;
  text-transform: uppercase;
  overflow: hidden;
  transition: 0.5s;
  margin-top: 40px;
  letter-spacing: 4px;
}

.login-box a:hover {
  background: #03e9f4;
  color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4, 0 0 100px #03e9f4;
}

.login-box a span {
  position: absolute;
  display: block;
}

.login-box a span:nth-child(1) {
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #03e9f4);
  animation: btn-anim1 1s linear infinite;
}

@keyframes btn-anim1 {
  0% {
    left: -100%;
  }
  50%,
  100% {
    left: 100%;
  }
}

.login-box a span:nth-child(2) {
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, #03e9f4);
  animation: btn-anim2 1s linear infinite;
  animation-delay: 0.25s;
}

@keyframes btn-anim2 {
  0% {
    top: -100%;
  }
  50%,
  100% {
    top: 100%;
  }
}

.login-box a span:nth-child(3) {
  bottom: 0;
  right: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, #03e9f4);
  animation: btn-anim3 1s linear infinite;
  animation-delay: 0.5s;
}

@keyframes btn-anim3 {
  0% {
    right: -100%;
  }
  50%,
  100% {
    right: 100%;
  }
}

.login-box a span:nth-child(4) {
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, #03e9f4);
  animation: btn-anim4 1s linear infinite;
  animation-delay: 0.75s;
}

@keyframes btn-anim4 {
  0% {
    bottom: -100%;
  }
  50%,
  100% {
    bottom: 100%;
  }
}
</style>
