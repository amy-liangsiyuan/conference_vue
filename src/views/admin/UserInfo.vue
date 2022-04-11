<template>
  <div class="myContainer">
    <div style="opacity:0.8;position:relative;display:flex;width: 90%;padding: 5% 5% 5% 5%;">
      <el-card class="myCard" >
        <div style="height: 5%" class="title-item">{{ $t('UserInfoPage.PersonalInformation') }}</div>
        <el-form
            ref="userInfo"
            size="large"
            class="cell-item"
            style="background: transparent;overflow: hidden;margin-top: 8%"
            :model="newUser"
            label-position="left"
            label-width="140px"
        >
          <el-form-item prop="phone">
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <user/>
                </el-icon>
                {{ $t('UserInfo.UserName') }}:
              </div>
            </template>
            <div class="cell-item" v-text="userInfo.name"></div>
          </el-form-item>
          <el-form-item prop="phone">
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <iphone/>
                </el-icon>
                {{ $t('UserInfo.Phone') }}:
              </div>
            </template>
            <div class="cell-item" v-text="userInfo.phone"></div>
          </el-form-item>
          <el-form-item prop="mail">
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <tickets/>
                </el-icon>
                {{ $t('UserInfo.Email') }}:
              </div>
            </template>
            <div class="cell-item" v-text="userInfo.mail"></div>
          </el-form-item>
          <el-form-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <picture-rounded/>
                </el-icon>
                {{ $t('UserInfo.Avatar') }}:
              </div>
            </template>
            <el-avatar shape="square" :size="150" :src="this.userInfo.avatar"/>
          </el-form-item>
        </el-form>
      </el-card>


      <el-descriptions
          v-show="false"
          style="overflow:auto;width: 40%;line-height: 40px; margin-top: 5% "
          :title="$t('UserInfoPage.PersonalInformation')"
          :column="1"
          border
      >
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <user/>
              </el-icon>
              {{ $t('UserInfo.UserName') }}
            </div>
          </template>
          <div class="cell-item" v-text="userInfo.name"></div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <iphone/>
              </el-icon>
              {{ $t('UserInfo.Phone') }}
            </div>
          </template>
          <div class="cell-item" v-text="userInfo.phone"></div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <tickets/>
              </el-icon>
              {{ $t('UserInfo.Email') }}
            </div>
          </template>
          <div class="cell-item" v-text="userInfo.mail"></div>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <picture-rounded/>
              </el-icon>
              {{ $t('UserInfo.Avatar') }}
            </div>
          </template>
          <el-avatar shape="square" :size="150" :src="this.userInfo.avatar"/>
        </el-descriptions-item>
      </el-descriptions>
      <div class="divider div-transparent"></div>
      <el-divider direction="vertical"></el-divider>
      <div style="width: 50%;margin-top:0.9%;margin-left: 5%;color: black;">
        <el-form
            ref="newUser"
            :rules="rules"
            size="large"
            class="cell-item"
            :model="newUser"
            label-position="left"
            label-width="130px"
        >
          <el-form-item>
            <div class="cell-item" style="color: black;margin-left: -23%">{{ $t('UserInfoPage.ChangeInfo') }}</div>
          </el-form-item>
          <el-form-item>
            <el-tag style="overflow: hidden" type="warning" size="small">{{ $t('UserInfoPage.Tips_1') }}</el-tag>
          </el-form-item>
          <el-form-item prop="phone">
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <iphone/>
                </el-icon>
                {{ $t('UserInfo.Phone') }}:
              </div>
            </template>
            <el-input maxlength="20" v-model.trim="newUser.phone"></el-input>
          </el-form-item>
          <el-form-item prop="mail">
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <tickets/>
                </el-icon>
                {{ $t('UserInfo.Email') }}:
              </div>
            </template>
            <el-input maxlength="30" v-model.trim="newUser.mail"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <lock/>
                </el-icon>
                {{ $t('UserInfo.PassWord') }}:
              </div>
            </template>
            <el-input maxlength="20" v-model.trim="newUser.password" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <picture-rounded/>
                </el-icon>
                {{ $t('UserInfo.Avatar') }}:
              </div>
            </template>
            <el-upload
                style="margin-left: 0"
                action="http://localhost:9001/server/file/add_avatar"
                :headers="myHeader"
                :limit="1"
                list-type="picture-card"
                :before-upload="beforeUpload"
                :on-preview="handlePictureCardPreview"
                :on-success="onSuccess"
                :on-error="onError"
                :on-remove="handleRemove"
                :on-exceed="handleExceed"
                :file-list="this.fileList[0].url==='' ? []:fileList"
            >
              <el-icon>
                <Plus/>
              </el-icon>
            </el-upload>
            <el-dialog width="20%" v-model="dialogVisible">
              <el-image width="100%" :src="this.userInfo.avatar" alt="Preview Image"/>
            </el-dialog>
          </el-form-item>
          <el-form-item>
            <el-tag style="overflow: hidden" type="danger" size="small">{{ $t('UserInfoPage.Tips_2') }}</el-tag>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit('newUser')">{{ $t('Submit') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>

</template>

<script>

export default {
  name: "UserInfo",
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
      myHeader: {
        token: window.sessionStorage.getItem('token'),
      },
      fileList: [
        {
          name: 'foo.jpeg',
          url: '',
        },
      ],
      dialogVisible: false,
      userInfo: {
        phone: "",
        password: "",
        mail: "",
        avatar: ""
      },
      newUser: {
        id: "",
        name: "",
        phone: "",
        password: "",
        mail: "",
      },
      rules: {
        phone: [
          {message: "Please input phone number", trigger: "blur"},
          {min: 7, max: 11, message: 'The length is 7 ~ 11', trigger: "blur"},
          {validator: validateNum, trigger: "blur"}
        ],
        mail: [
          {
            message: 'Please input Email',
            trigger: 'blur',
          },
        ],
        password: [
          {min: 6, max: 15, message: 'The length is 6 ~ 15', trigger: "blur"},
          {
            message: 'Please input password',
            trigger: 'blur',
          },
        ]
      }
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      if (window.sessionStorage.getItem('token') && window.sessionStorage.getItem('user')) {
        const user = JSON.parse(sessionStorage.getItem('user'))
        this.userInfo = user
        this.newUser.id = user.id
        this.newUser.phone = user.phone
        this.newUser.mail = user.mail
        this.fileList[0].url = user.avatar
      }
    },
    //表单提交
    submit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const param = this.$encryption(JSON.stringify(this.newUser))
          const {data: res} = await this.$http.post('/api/server/user/update_user', param)
          if (res.flag) {
            window.sessionStorage.setItem('user', JSON.stringify(res.data))
            this.$message.success(res.message)
            this.getUser()
          } else {
            this.$message.error(res.data.message)
          }
        } else {
          this.$message.error('Verification failed!')
          return false;
        }
      });
    },
    //上传前检查文件格式
    beforeUpload(param) {
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png', 'image/jpg'];
      const isImage = types.includes(param.type)
      const isLtSize = param.size < 1024 * 1024 * 5
      if (!isImage) {
        this.$message.error("The uploaded pictures can only be in JPG, GIF, BMP, PNG format!")
        return false
      }
      if (!isLtSize) {
        this.$message.error("The uploaded picture cannot exceed 5M!")
        return false
      }
    },
    //移除图片函数
    handleRemove() {
      this.$http.delete('/api/server/file/delete_avatar').then((res) => {
        if (res.data.flag) {
          this.$message.success("Remove success!")
          const user = JSON.parse(window.sessionStorage.getItem('user'))
          user.avatar = ''
          window.sessionStorage.setItem('user', JSON.stringify(user))
          this.getUser()
        } else {
          this.$message.error("error!")
        }
      })

    },
    //放大查看图片
    handlePictureCardPreview() {
      this.dialogVisible = true;
    },
    //上传成功
    onSuccess(res) {
      this.$message.success(res.message)
      this.dialogImageUrl = res.data
      const user = JSON.parse(window.sessionStorage.getItem('user'))
      user.avatar = res.data
      window.sessionStorage.setItem('user', JSON.stringify(user))
      this.getUser()
    },
    //上传失败
    onError() {
      this.$message.error("Upload error!")
    },
    //超出文件个数提示
    handleExceed() {
      this.$message.error(`Only 1 file can be selected!`);
    },
  }

}
</script>

<style scoped>
.cell-item {
  color: black;
  font-size: 16px !important;
  line-height: 24px;
  font-weight: 900;
}

.title-item {
  color: black;
  font-size: 20px !important;
  line-height: 28px;
  font-weight: 950;
}

.myCard {
  margin-top: 4%;
  overflow: auto;
  width: 40%;
  height: 66%;
  background: rgb(255,255,255,0.5);
  border: red !important;
}

.myContainer {
  box-shadow: 5px 5px 5px black;
  position: relative;
  display: flex;
  width: 100%;
  height: 90vh;
  opacity: 1;
  border: black 2px;
  background-color: rgb(255, 255, 255, 0.25);
  border-radius: 20px;
  backdrop-filter: blur(30px);
  transition: .5s;
}
.myContainer:hover{
  box-shadow: 5px 5px 20px black;
  position: relative;
  display: flex;
  width: 100%;
  height: 90vh;
  opacity: 1;
  border: black 2px;
  background-color: rgb(255, 255, 255, 0.1);
  border-radius: 20px;
}

.el-divider--vertical {
  display: inline-block;
  height: 100%;
  margin-left: 5%;
  background: 0 0;
  border-left: 2px solid #cccccc;
  position: relative;
}

.el-descriptions__header {
  color: black;
  font-size: 16px;
  line-height: 24px;
  font-weight: 900;
}
.el-card {
  --el-card-border-radius: 20px;
  transition: all 1s;
}
.el-card:hover{
  margin-top: 7%;
  background-color: rgb(255,255,255,0.7);
  backdrop-filter: blur(7px);
}
</style>
