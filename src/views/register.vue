<template>
  <TopNavBar></TopNavBar>
  <!-- banner -->
  <img style="object-fit:cover;width: 100%;position: absolute;top: 0;height: 40vh" src="../assets/images/home_back.jpg">
  <!--主内容-->
  <div class="m-home">
    <div style="width: 60%;margin: auto">
      <el-row>
        <el-col :span="24"><h1 style="text-align: center">{{$t('Register')}}</h1></el-col>
      </el-row>
      <img style="display:block;object-fit: fill;margin:auto" src="../assets/images/line.png">
      <!--会议信息表单-->
      <div style="backdrop-filter:blur(30px);width: 40%;margin: 20px auto ; border:1px solid #bbe1f1;border-radius:15px;padding: 20px 20px">
        <el-form
            ref="userInfo"
            style="font-size:20px;font-weight:800;margin-top: 20px"
            :rules="rules"
            :model="userInfo"
            label-width="120px"
            label-position="right"
        >
          <el-form-item :label="$t('UserInfo.UserName')" prop="name">
            <el-input v-model.trim="userInfo.name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('UserInfo.Phone')" prop="phone">
            <el-input v-model.trim="userInfo.phone"></el-input>
          </el-form-item>
          <el-form-item :label="$t('UserInfo.Email')" prop="mail">
            <el-input v-model.trim="userInfo.mail"></el-input>
          </el-form-item>

          <el-form-item :label="$t('UserInfo.PassWord')" prop="password">
            <el-input v-model.trim="userInfo.password" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" @click="submit('userInfo')">{{$t('Register')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
  <Footer style="width: 101%"></Footer>
</template>

<script>
import TopNavBar from '../components/TopNavBar'
import Footer from '../components/Footer'
import { ElMessageBox} from "element-plus";

// import type { UploadFile } from 'element-plus/es/components/upload/src/upload.type'
export default {
  components: {
    TopNavBar,
    Footer,
  },
  data() {
    //手机号码校验
    const validateNum = (rule, value, callback) => {
      const phone = /^1\d{10}$/    //以1开头的数字
      if (!(phone.test(value)) && value) {
        callback(new Error('Incorrect mobile phone format!'))
      } else {
        callback()
      }
    }
    return {
      userInfo: {
        name: "",
        phone: "",
        password: "",
        mail: "",
        avatar: ""
      },
      rules: {
        name: [
          {
            min: 3,
            max: 10,
            message: 'The length is 3 ~ 10 characters',
            trigger: "blur"
          },
          {
            required: true,
            message: 'Please input username',
            trigger: 'blur',
          },
        ],
        phone: [
          {required: true, message: "Please input phone number", trigger: "blur"},
          {min: 7, max: 11, message: 'The length is 7 ~ 11', trigger: "blur"},
          {validator: validateNum, trigger: "blur"}
        ],
        mail: [
          {
            required: true,
            message: 'Please input Email',
            trigger: 'blur',
          },
        ],
        password: [
          {min: 7, max: 11, message: 'The length is 7 ~ 11', trigger: "blur"},
          {
            required: true,
            message: 'Please input password',
            trigger: 'blur',
          },
        ]
      }
    }
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const param = this.$encryption(JSON.stringify(this.userInfo))
          this.$http.post('/api/server/user/register', param).then((res) => {
            if (res.data.flag) {
              //弹窗完整示例
              ElMessageBox({
                title: '',
                message: res.data.message+"Click to redirect ",
                confirmButtonText: 'OK',
                showClose:false,
                closeOnClickModal:false,
                closeOnPressEscape:false,
                beforeClose: (action, instance, done) => {
                  if (action === 'confirm') {
                    instance.confirmButtonLoading = true
                    instance.confirmButtonText = 'Loading...'
                    setTimeout(() => {
                      done()
                      setTimeout(() => {
                        instance.confirmButtonLoading = false
                      }, 300)
                    }, 2000)
                  } else {
                    done()
                  }
                },
              }).then(() => {
                this.$router.push('/login')
              })

            } else {
              this.$message.error(res.data.message)
            }
          })
        } else {
          this.$message.error('Verification failed!')
          return false;
        }
      });
    },
  }
}
</script>

<style scoped>
.m-home {
  padding-top: 35vh !important;
  padding-bottom: 0 !important;
  width: 100%;
  margin: auto;
}
.el-form{}
</style>
