<template>
  <div class="mainContainer" v-loading="loading">
    <div class="imgContainer">
      <img class="topImg"
           :src=this.conferenceInfo.firstPicture alt="">
    </div>
    <div class="contentContainer">
      <div style="display: flex">
        <div class="menuContainer">
          <el-tree
              @node-click="handleNodeClick"
              class="MyTree"
              :data="Tree"
              node-key="id"
              default-expand-all
              :expand-on-click-node="false">
          </el-tree>
        </div>
        <div class="markDownContainer">
          <v-md-editor v-model="content" mode="preview"></v-md-editor>
        </div>
        <div class="infoContainer">
          <div style="margin:0 auto;text-align: center">
            <el-button size="small" v-if="isLogin" @click="LoginOut" type="danger" round>
              {{ $t('TopNavBar.LogOut') }}
            </el-button>
            <el-button size="small" v-else @click="Login_Register" type="primary" round>{{
                $t('ConferencePage.Login_Register')
              }}
            </el-button>
            <el-button size="small" v-if="isLogin" type="success" @click="uploadDrawerOpen" round>
              {{ $t('ConferencePage.Submit') }}
            </el-button>
          </div>
          <el-timeline style="margin-left: -40px;margin-top: 30px;margin-right: 5px">
            <el-timeline-item
                type="primary"
                size="large"
                hollow
                placement="top"
                v-for="Info in InfoLine"
                :key="Info.id"
                :timestamp="Info.title">
              <el-card style="white-space: pre-wrap; word-break: break-all;">{{ Info.content }}</el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
      <!--登录注册弹出抽屉-->
      <el-drawer
          size="30%"
          v-model="dialogFlag"
          direction="rtl"
      >
        <div style="text-align: center;margin-bottom: 50px">
          <el-switch
              :model-value="activeName === 'Register'"
              @change="activeName=activeName==='Login'?'Register':'Login'"
              active-color="#5c9df3"
              inactive-color="#5c9df3"
              :active-text="$t('Register')"
              :inactive-text="$t('Login')"
          ></el-switch>
        </div>
        <div v-if="activeName==='Register'">
          <!--注册-->
          <el-form
              ref="participantInfo"
              style="font-size:20px;font-weight:800;margin-top: 20px"
              :model="participantRegisterInfo"
              label-width="120px"
              label-position="right"
          >
            <el-form-item :label="$t('UserInfo.UserName')" prop="name" required>
              <el-input maxlength="10" v-model.trim="participantRegisterInfo.name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('UserInfo.Phone')" prop="phone" required>
              <el-input maxlength="11" v-model.trim="participantRegisterInfo.phone"></el-input>
            </el-form-item>
            <el-form-item :label="$t('UserInfo.Email')" prop="mail" required>
              <el-input maxlength="30" v-model.trim="participantRegisterInfo.mail"></el-input>
            </el-form-item>
            <el-form-item :label="$t('UserInfo.PassWord')" prop="password" required>
              <el-input maxlength="15" v-model.trim="participantRegisterInfo.password" type="password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="large" @click="Register">{{ $t('Register') }}</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-else>
          <!--登录-->
          <el-form
              ref="participantInfo"
              style="font-size:20px;font-weight:800;margin-top: 20px"
              :model="participantLoginInfo"
              label-width="120px"
              label-position="right"
          >
            <el-form-item :label="$t('UserInfo.Email')" prop="mail" required>
              <el-input maxlength="30" v-model.trim="participantLoginInfo.mail"></el-input>
            </el-form-item>
            <el-form-item :label="$t('UserInfo.PassWord')" prop="password" required>
              <el-input maxlength="15" v-model.trim="participantLoginInfo.password" type="password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="large" @click="Login">{{ $t('Login') }}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-drawer>

      <!--文件提交弹出抽屉-->
      <el-drawer
          size="60%"
          v-model="submitDrawerFlag"
          direction="rtl"
      >
        <div style="text-align: center;padding: 2%">
          <el-upload
              ref="paperUpload"
              :action=paperPath
              :on-success="submitPaperSuccess"
              :show-file-list="false"
              :limit="1"
          >
            <el-button type="text">{{$t('ConferencePage.ClickToUpload')}}</el-button>
          </el-upload>
          <el-table style="margin-top: 2%" :data="paperList" v-loading="paperListLoading">
            <el-table-column prop="name" :label="$t('PaperInfo.Name')"/>
            <el-table-column prop="createTime" :label="$t('PaperInfo.CreateTime')"/>
            <el-table-column prop="refereeName" :label="$t('PaperInfo.Referee')"/>
            <el-table-column prop="state" :label="$t('PaperInfo.State')">
              <template #default="scope">
                <span v-if="scope.row.state===0">{{$t('PaperState.State0')}}</span>
                <span v-else-if="scope.row.state===1" style="color:#d88918;">{{$t('PaperState.State1')}}</span>
                <span v-else-if="scope.row.state===2" style="color: #0abdfe">{{$t('PaperState.State2')}}</span>
                <span v-else-if="scope.row.state===3" style="color: red">{{$t('PaperState.State3')}}</span>
                <span v-else-if="scope.row.state===4" style="color: green">{{$t('PaperState.State4')}}</span>
                <span v-else-if="scope.row.state===5" style="color: #f98d45">{{$t('PaperState.State5')}}</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" :label="$t('MyConferencePage.Operation')" width="150">
              <template #default="scope">
                <div style="display: flex;overflow: auto;text-align: center">
                  <el-upload
                      v-if="scope.row.state===0||scope.row.state===5"
                      ref="paperReUpload"
                      :action=paperReuploadPath
                      :on-success="ReuploadPaperSuccess"
                      :show-file-list="false"
                      :limit="1"
                  >
                    <el-button @click="reuploadPaper(scope.row.id)" type="text">{{$t('ConferencePage.Reupload')}}</el-button>
                  </el-upload>
                  <el-button v-if="scope.row.state===0" type="text" style="color: red;margin-left: 10px" @click="deletePaper(scope.row)"
                  >{{ $t('ParticipantManagementPage.Remove') }}
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-drawer>
    </div>
    <Footer style="width: 85%;margin: auto"></Footer>
  </div>

</template>

<script>
import Footer from '../components/Footer'

export default {
  components: {Footer},
  name: "conferencePage",
  data() {
    return {
      paperListLoading:false,
      submitDrawerFlag: false,
      loading: false,
      dialogFlag: false,

      activeName: 'Login',
      isLogin: false,
      paperList:[],
      content: '',
      conferenceId: '',
      Tree: [],
      InfoLine: [],
      conferenceInfo: {},
      participant: {
        id:'1',
        name: '',
        phone: '',
        mail: '',
      },
      participantRegisterInfo: {
        name: '',
        phone: '',
        mail: '',
        password: '',
      },
      participantLoginInfo: {
        mail: '',
        password: '',
      },
      paperPath:'',
      paperReuploadPath:''
    }
  },
  created() {
    this.loading = true
    setTimeout(() => {
      this.conferenceId = localStorage.getItem('conferenceId')
      this.getParticipant()
      this.getMenu(this.conferenceId).then(() => {
        this.setContent(this.Tree)
        this.getConference(this.conferenceId).then(() => {
          const local = this.conferenceInfo.language === '1' ? 'ch' : 'en'
          localStorage.setItem('lang', local)
          this.$i18n.locale = local
        })
        this.getInfoList(this.conferenceId)
      })
      this.loading = false
    }, 500)


  },
  methods: {
    //注册提交方法
    async Register() {
      await this.$http.post('/api/server/participant/register' + this.conferenceId, this.participantRegisterInfo).then((res) => {
        if (res.data.flag) {
          this.$message.success(res.data.message)
          this.dialogFlag = false
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    //登录提交方法
    async Login() {
      await this.$http.post('/api/server/participant/login' + this.conferenceId, this.participantLoginInfo).then((res) => {
        if (res.data.flag) {
          this.$message.success(res.data.message)
          sessionStorage.setItem('participant', JSON.stringify(res.data.data))
          this.getParticipant()
          this.isLogin = true
          this.dialogFlag = false
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    //参与者登出方法
    LoginOut() {
      sessionStorage.removeItem('participant')
      this.isLogin = false
    },
    //登录注册触发方法
    Login_Register() {
      this.dialogFlag = true
    },
    //论文重传路径设定方法
    reuploadPaper(id){
      this.$refs.paperUpload.clearFiles(); //上传成功之后清除历史记录
      this.$refs.paperReUpload.clearFiles();
      this.paperReuploadPath='http://localhost:9001/server/file/reuploadPaper'+id
    },
    //删除论文方法
    async deletePaper(row){
      if (row.state===0){
        await this.$http.delete('/api/server/file/deletePaper'+row.id).then((res)=>{
          if (res.data.flag){
            this.paperListLoading=true
            setTimeout(()=>{
              this.$message.success(res.data.message)
              this.getParticipantPaperList()
              this.paperListLoading=false
            },500)
          }else{
            this.$message.success(res.data.message)
          }
        })
      }else {
        this.$message.warning()
      }
    },
    //提交文件触发方法
    uploadDrawerOpen(){
      this.submitDrawerFlag=true
      this.paperListLoading=true
      setTimeout(()=>{
        this.getParticipantPaperList()
        this.paperListLoading=false
      },500)
    },
    //获取参与者
    getParticipant() {
      if (sessionStorage.getItem('participant')) {
        this.isLogin = true
        const participant = JSON.parse(sessionStorage.getItem('participant'))
        this.participant.id=participant.id
        this.participant.name = participant.name
        this.participant.mail = participant.mail
        this.participant.phone = participant.phone
        this.paperPath='http://localhost:9001/server/file/submitPaper'+this.conferenceId+'/'+this.participant.id
      }
    },
    //获取paper列表
    async getParticipantPaperList(){
      await this.$http.get('/api/server/file/getParticipantPaperList'+this.conferenceId+'/'+this.participant.id).then((res)=>{
        if (res.data.flag){
          this.paperList=res.data.data
        }
      })
    },
    //获取通知列表
    async getInfoList(id) {
      await this.$http.get('/api/server/conference/getInfoList' + id).then((res) => {
        this.InfoLine = res.data.data
      })
    },
    //获取会议信息
    async getConference(id) {
      await this.$http.get('/api/server/conference/getConference' + id).then((res) => {
        if (res.data.flag) {
          this.conferenceInfo = res.data.data
        } else {
          this.$message.error('get conference error!')
        }
      })
    },
    //获取会议菜单信息
    async getMenu(id) {
      await this.$http.get('/api/server/conference/findPage' + id).then((res) => {
        if (res.data.flag) {
          this.Tree = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    handleNodeClick(data) {
      if (data.childrenNum === 0)
        this.content = data.content
    },
    //递归掉用函数，寻找第一个有内容的菜单项
    setContent(Tree) {
      for (let i = 0; i < Tree.length; i++) {
        if (Tree[i].childrenNum === 0) {
          this.content = Tree[i].content
          return true
        } else {
          if (this.setContent(Tree[i].children))
            return true
        }
      }
    },
    //文件上传功能函数
    //上传成功
    submitPaperSuccess(res){
      this.paperListLoading=true
      this.$refs.paperUpload.clearFiles(); //上传成功之后清除历史记录
      setTimeout(()=>{
        if (res.flag){
          this.$message.success(res.message)
          this.getParticipantPaperList()
          this.paperListLoading=false
        }else {
          this.$message.error(res.message)
          this.paperListLoading=false
        }
      },500)
    },
    ReuploadPaperSuccess(res){
      this.paperListLoading=true
      setTimeout(()=>{
        if (res.flag){
          this.$message.success(res.message)
          this.getParticipantPaperList()
          this.paperListLoading=false
        }else {
          this.$message.error(res.message)
          this.paperListLoading=false
        }
      },500)

    },
  },

}
</script>

<style scoped>
/*主容器*/
.mainContainer {
  min-height: 100vh;
  width: 101%;
}

/*分割图片容器*/
.imgContainer {
  margin: 0 auto;
  height: 20vh;
  width: 85%;
}

.contentContainer {
  margin: 20px auto;
  width: 85%;

}

/*左侧菜单容器*/
.menuContainer {
  background-color: rgb(247, 247, 247, 0.9);
  border: 1px solid #dcdcdc;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  margin-right: 1%;
  width: 14%;
  height: 75vh;
  transition: all .5s;
}

.menuContainer:hover {
  transition: all .5s;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
}

/*中间的md预览*/
.markDownContainer {
  background-color: white;
  padding: 20px;
  border: 1px solid #dcdcdc;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  width: 65%;
  min-height: 70vh;
  transition: all .5s;
}

.markDownContainer:hover {
  transition: all .5s;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
}

/*右侧信息栏*/
.infoContainer {
  width: 20%;
  margin-left: 1%;
  min-height: 90vh;
  padding: 20px;
  background-color: rgb(247, 247, 247, 0.9);
  border: 1px solid #dcdcdc;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  transition: all .5s;
}

.infoContainer:hover {
  transition: all .5s;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
}

/*顶部图片*/
.topImg {
  object-fit: cover;
  width: 100%;
  height: 100%;
  box-shadow: 5px 5px 5px black;
  border-radius: 10px;
  transition: all .5s;
}

.topImg:hover {
  transition: all .5s;
  box-shadow: 10px 10px 10px black;
}

/*左侧菜单*/
.MyTree {
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
  font-weight: 900;
  width: 78%;
  padding: 20px;
  background: transparent;

}

/*弹出对话框*/
.MyDialog {
  position: absolute;
  width: 200px;
  height: 200px;
  z-index: 200;
}

/*描述内文字样式*/
.cell-item {
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
  color: black;
  font-size: 16px !important;
  line-height: 24px;
  font-weight: 900;
}

.el-card {
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  transition: all .5s;
}

.el-card:hover {
  transition: all .5s;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
}
</style>
