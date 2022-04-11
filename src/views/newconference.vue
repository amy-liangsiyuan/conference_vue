<template>
  <TopNavBar></TopNavBar>
  <!-- banner -->
  <img style="object-fit:cover;width: 100%;position: absolute;top: 0;height: 40vh" src="../assets/images/home_back.jpg">
  <!--主内容-->
  <div class="m-home">
    <div  style="width: 80%;margin: auto">
      <el-row>
        <el-col :span="24"><h1 style="text-align: center">{{$t('NewConference')}}</h1></el-col>
      </el-row>
      <img style="display:block;object-fit: fill;margin:auto" src="../assets/images/line.png">
      <!--会议信息表单-->
      <div class="home_1" style="width: 40%;margin: 20px auto ; border:1px solid #bbe1f1;border-radius:15px;padding: 20px 20px">
        <el-form
            ref="conferenceInfo"
            style="font-size:20px;font-weight:800;margin-top: 20px"
            :rules="rules"
            :model="conferenceInfo"
            label-width="120px"
            label-position="right"
        >
          <el-form-item :label="$t('ConferenceInfo.Name')" prop="name">
            <el-input v-model="conferenceInfo.name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('ConferenceInfo.City')" prop="city">
            <el-input v-model="conferenceInfo.city"></el-input>
          </el-form-item>
          <el-form-item :label="$t('ConferenceInfo.Address')" prop="address">
            <el-input v-model="conferenceInfo.address"></el-input>
          </el-form-item>
          <el-form-item :label="$t('ConferenceInfo.Department')" prop="department">
            <el-input v-model="conferenceInfo.department"></el-input>
          </el-form-item>
          <el-form-item :label="$t('ConferenceInfo.Time')" prop="time_arr">
            <el-date-picker
                format="YYYY/MM/DD hh:mm"
                value-format="YYYY-MM-DD hh:mm"
                v-model="conferenceInfo.time_arr"
                type="datetimerange"
                style="width: 100%"
                :disabled-date="TimeFunc"
            ></el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('ConferenceInfo.Language')">
            <el-radio-group v-model="conferenceInfo.language">
              <el-radio label="1">中文</el-radio>
              <el-radio label="2">English</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('ConferenceInfo.ExpectedNumber')" prop="peopleNum">
            <el-input v-model="conferenceInfo.peopleNum"></el-input>
          </el-form-item>
          <el-form-item :label="$t('ConferenceInfo.Description')">
            <el-input type="textarea" v-model="conferenceInfo.description"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" @click="submit('conferenceInfo')">{{$t('ConferenceInfo.Create')}}</el-button>
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

// import type { UploadFile } from 'element-plus/es/components/upload/src/upload.type'
export default {
  components: {
    TopNavBar,
    Footer,
  },
  data() {
    return {

      conferenceInfo: {
        time_arr: [],
        name: "",
        firstPicture: "",
        city: "",
        address: "",
        department: "",
        createTime: "",
        dropTime: "",
        language: "1",
        peopleNum: "",
        description: ""
      },
      TimeFunc(time) {
        return time.getTime() < Date.now() - 8.64e7;//禁止选择今天以前的时间
      },
      rules: {
        name: [
          {
            required: true,
            message: 'Please Input',
            trigger: 'blur',
          },
        ],
        city: [
          {
            required: true,
            message: 'Please Input',
            trigger: 'blur',
          },
        ],
        address: [
          {
            required: true,
            message: 'Please Input',
            trigger: 'blur',
          },
        ],
        time_arr: [
          {
            required: true,
            type:'array',
            message: 'Please Input',
            trigger: 'blur',
          },
        ],
        peopleNum: [
          {
            required: true,
            message: 'Please Input',
            trigger: 'blur',
          },
        ],
      }
    }
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.conferenceInfo.createTime = this.conferenceInfo.time_arr[0]
          this.conferenceInfo.dropTime = this.conferenceInfo.time_arr[1]
          const param = JSON.stringify(this.conferenceInfo)
          this.$http.post('/api/server/conference/add_conference', param).then((res) => {
            if (res.data.flag) {
              this.$message.success(res.data.message)
              this.$router.push('/admin')
            } else {
              this.$message.error(res.data.message)
            }
          })
        } else {
          this.$message.error('Verification failed!')
          return false;
        }
      });
    }
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
.home_1{
  background: rgb(255,255,255,0.2);
  backdrop-filter: blur(30px);
}
</style>
