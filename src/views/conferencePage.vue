<template>
  <div class="mainContainer" v-loading="Loading">
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
            <el-button size="small" v-else @click="LoginRegisterDialogFlag = true" type="primary" round>{{
                $t('ConferencePage.Login_Register')
              }}
            </el-button>
            <el-button size="small" v-if="isLogin" type="success" @click="uploadDrawerOpen" round>
              {{ $t('ConferencePage.Submit') }}
            </el-button>
            <el-button @click="getRefereePaperList" size="small" type="primary" v-if="isReferee" round>
              {{ $t('ConferencePage.Review') }}
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
          v-model="LoginRegisterDialogFlag"
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
        <div v-if="activeName==='Register'" style="border-radius: 10px">
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
              <el-button type="primary" @click="Register" :loading="loginRegisterDialogLoading" round>{{
                  $t('Register')
                }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-else style="border-radius:10px">
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
              <el-button type="primary" @click="Login" :loading="loginRegisterDialogLoading" round>{{
                  $t('Login')
                }}
              </el-button>
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
              :before-upload="beforePDFupload"
              :action=paperPath
              :on-success="submitPaperSuccess"
              :show-file-list="false"
              :limit="1"
          >
            <el-button icon="plus" type="primary" round>{{ $t('ConferencePage.ClickToUpload') }}</el-button>
          </el-upload>
          <el-table style="margin-top: 2%" :data="paperList" v-loading="paperListLoading">
            <el-table-column prop="name" :label="$t('PaperInfo.Name')"/>
            <el-table-column prop="createTime" :label="$t('PaperInfo.CreateTime')"/>
            <el-table-column prop="refereeName1" :label="$t('PaperInfo.Referee')"/>
            <el-table-column prop="state1" :label="$t('PaperInfo.State')">
              <template #default="scope">
                <span v-if="scope.row.state1===0" style="color: purple">{{ $t('PaperState.State0') }}</span>
                <span v-else-if="scope.row.state1===1" style="color:#0abdfe;">{{ $t('PaperState.State1') }}</span>
                <span v-else-if="scope.row.state1===2" style="color: red">{{ $t('PaperState.State2') }}</span>
                <span v-else-if="scope.row.state1===3" style="color: green">{{ $t('PaperState.State3') }}</span>
                <span v-else-if="scope.row.state1===4" style="color: #d88918">{{ $t('PaperState.State4') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="refereeName2" :label="$t('PaperInfo.Referee')"/>
            <el-table-column prop="state2" :label="$t('PaperInfo.State')">
              <template #default="scope">
                <span v-if="scope.row.state2===0" style="color: purple">{{ $t('PaperState.State0') }}</span>
                <span v-else-if="scope.row.state2===1" style="color:#0abdfe;">{{ $t('PaperState.State1') }}</span>
                <span v-else-if="scope.row.state2===2" style="color: red">{{ $t('PaperState.State2') }}</span>
                <span v-else-if="scope.row.state2===3" style="color: green">{{ $t('PaperState.State3') }}</span>
                <span v-else-if="scope.row.state2===4" style="color: #d88918">{{ $t('PaperState.State4') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="state" :label="$t('PaperInfo.FinalState')">
              <template #default="scope">
                <span v-if="scope.row.state===0" style="color: purple">{{ $t('PaperState.State0') }}</span>
                <span v-else-if="scope.row.state===1" style="color:#0abdfe;">{{ $t('PaperState.State1') }}</span>
                <span v-else-if="scope.row.state===2" style="color: red">{{ $t('PaperState.State2') }}</span>
                <span v-else-if="scope.row.state===3" style="color: green">{{ $t('PaperState.State3') }}</span>
                <span v-else-if="scope.row.state===4" style="color: #d88918">{{ $t('PaperState.State4') }}</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" :label="$t('MyConferencePage.Operation')" width="200">
              <template #default="scope">
                <div style="display: flex;overflow: auto;text-align: center">
                  <el-upload
                      v-if="scope.row.state===0||scope.row.state===4"
                      ref="paperReUpload"
                      :action=paperReuploadPath
                      :on-success="ReuploadPaperSuccess"
                      :show-file-list="false"
                      :limit="1"
                  >
                    <el-button @click="reuploadPaper(scope.row.id)" size="small" type="primary" round>
                      {{ $t('ConferencePage.Reupload') }}
                    </el-button>
                  </el-upload>
                  <el-button v-if="scope.row.state===0" size="small" type="danger" style="margin-left: 10px"
                             @click="deletePaper(scope.row)" round>
                    {{ $t('ParticipantManagementPage.Remove') }}
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-drawer>

      <!--审阅弹出抽屉-->
      <el-drawer
          size="70%"
          v-model="reviewDialogFlag"
          direction="rtl"
      >
        <div style="text-align: center;padding: 2%">
          <el-table style="margin-top: 2%" :data="refereePaperList" v-loading="refereePaperListLoading">
            <el-table-column prop="name" :label="$t('PaperInfo.Name')"/>
            <el-table-column prop="createTime" :label="$t('PaperInfo.CreateTime')"/>
            <el-table-column prop="submitterName" :label="$t('PaperInfo.Participant')"/>
            <el-table-column prop="refereeName1" :label="$t('PaperInfo.Referee')"/>
            <el-table-column prop="state1" :label="$t('PaperInfo.State')">
              <template #default="scope">
                <span v-if="scope.row.state1===0" style="color: purple">{{ $t('PaperState.State0') }}</span>
                <span v-else-if="scope.row.state1===1" style="color:#0abdfe;">{{ $t('PaperState.State1') }}</span>
                <span v-else-if="scope.row.state1===2" style="color: red">{{ $t('PaperState.State2') }}</span>
                <span v-else-if="scope.row.state1===3" style="color: green">{{ $t('PaperState.State3') }}</span>
                <span v-else-if="scope.row.state1===4" style="color: #f98d45">{{ $t('PaperState.State4') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="refereeName2" :label="$t('PaperInfo.Referee')"/>
            <el-table-column prop="state2" :label="$t('PaperInfo.State')">
              <template #default="scope">
                <span v-if="scope.row.state2===0" style="color: purple">{{ $t('PaperState.State0') }}</span>
                <span v-else-if="scope.row.state2===1" style="color:#0abdfe;">{{ $t('PaperState.State1') }}</span>
                <span v-else-if="scope.row.state2===2" style="color: red">{{ $t('PaperState.State2') }}</span>
                <span v-else-if="scope.row.state2===3" style="color: green">{{ $t('PaperState.State3') }}</span>
                <span v-else-if="scope.row.state2===4" style="color: #f98d45">{{ $t('PaperState.State4') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="state" :label="$t('PaperInfo.FinalState')">
              <template #default="scope">
                <span v-if="scope.row.state===0" style="color: purple">{{ $t('PaperState.State0') }}</span>
                <span v-else-if="scope.row.state===1" style="color:#0abdfe;">{{ $t('PaperState.State1') }}</span>
                <span v-else-if="scope.row.state===2" style="color: red">{{ $t('PaperState.State2') }}</span>
                <span v-else-if="scope.row.state===3" style="color: green">{{ $t('PaperState.State3') }}</span>
                <span v-else-if="scope.row.state===4" style="color: #f98d45">{{ $t('PaperState.State4') }}</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" :label="$t('MyConferencePage.Operation')" width="300">
              <template #default="scope">
                <div style="display: flex;overflow: auto;text-align: center">
                  <el-button @click="Review(scope.row)" size="small"
                             type="primary"
                             round>
                    {{ $t('ConferencePage.Review') }}
                  </el-button>
                  <el-button
                      v-if="(scope.row.refereeId1===participant.id&&scope.row.state1!==0)||(scope.row.refereeId2===participant.id&&scope.row.state2!==0)"
                      @click="UnReview(scope.row)" size="small" type="warning" round>
                    {{ $t('ConferencePage.UnReview') }}
                  </el-button>
                  <el-popover placement="left" trigger="hover" show-after="500">
                    <template #reference>
                      <el-button size="small" type="info" @click="DownLoadPaper(scope.row.url)" round>
                        {{ $t('ConferencePage.Download') }}
                      </el-button>
                    </template>
                    <iframe style="border:transparent;border-radius: 10px;width: 100%;height: 100%"
                            :src="scope.row.url"></iframe>
                  </el-popover>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <!--Reviewing-->
          <el-drawer

              size="45%"
              :append-to-body="true"
              v-model="paperDrawerFlag"
              direction="rtl"
          >

            <div style="display:block;text-align:center;height: 100%;padding: 20px" v-loading="stateGroupLoading">
              <el-descriptions
                  size="small"
                  style="overflow:auto"
                  border>
                <el-descriptions-item :label="$t('PaperInfo.Participant')">{{ reviewingPaper.submitterName }}
                </el-descriptions-item>
                <el-descriptions-item :label="$t('PaperInfo.CreateTime')">{{ reviewingPaper.createTime }}
                </el-descriptions-item>
                <el-descriptions-item :label="$t('PaperInfo.Name')">{{ reviewingPaper.name }}</el-descriptions-item>
              </el-descriptions>
              <iframe style="margin:10px auto;border-radius: 10px;width: 80%;border:transparent;height: 80%"
                      :src="reviewingPaper.url"></iframe>
              <el-radio-group v-model="reviewingPaper.state" @change="setPaperState">
                <el-radio-button :label="3">{{ $t('PaperState.State3') }}</el-radio-button>
                <el-radio-button :label="4">{{ $t('PaperState.State4') }}</el-radio-button>
                <el-radio-button :label="2">{{ $t('PaperState.State2') }}</el-radio-button>
              </el-radio-group>
            </div>
          </el-drawer>
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
      paperListLoading: false,
      refereePaperListLoading: false,
      loginRegisterDialogLoading: false,
      stateGroupLoading: false,
      submitDrawerFlag: false,
      paperDrawerFlag: false,
      Loading: false,
      LoginRegisterDialogFlag: false,
      reviewDialogFlag: false,
      activeName: 'Login',
      isLogin: false,
      isReferee: false,
      paperEvaluation: 3,
      reviewingPaper: [],
      paperList: [],
      refereePaperList: [],
      content: '',
      conferenceId: '',
      Tree: [],
      InfoLine: [],
      conferenceInfo: {},
      participant: {
        id: '',
        name: '',
        phone: '',
        mail: '',
        referee: ''
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
      paperPath: '',
      paperReuploadPath: ''
    }
  },
  created() {
    this.Loading = true
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
      this.Loading = false
    }, 500)


  },
  methods: {
    //注册提交方法
    async Register() {
      await this.$http.post('/api/server/participant/register' + this.conferenceId, this.participantRegisterInfo).then((res) => {
        this.loginRegisterDialogLoading = true
        setTimeout(() => {
          if (res.data.flag) {
            this.$message.success(res.data.message)
            this.LoginRegisterDialogFlag = false
          } else {
            this.$message.error(res.data.message)
          }
          this.loginRegisterDialogLoading = false
        }, 500)

      })
    },
    //登录提交方法
    async Login() {
      this.loginRegisterDialogLoading = true
      await this.$http.post('/api/server/participant/login' + this.conferenceId, this.participantLoginInfo).then((res) => {
        setTimeout(() => {
          if (res.data.flag) {
            this.$message.success(res.data.message)
            const participant = {
              id: '',
              name: '',
              phone: '',
              mail: '',
              referee: ''
            }
            participant.id = res.data.data.id
            participant.name = res.data.data.name
            participant.phone = res.data.data.phone
            participant.mail = res.data.data.mail
            this.$http.get('api/server/participant/checkReferee' + this.conferenceId + "/" + participant.id).then((res) => {
              if (res.data.flag) {
                participant.referee = '1'
              } else {
                participant.referee = '0'
              }
              sessionStorage.setItem('participant', JSON.stringify(participant))
              this.getParticipant()
              this.isLogin = true
              this.LoginRegisterDialogFlag = false
            })
          } else {
            this.$message.error(res.data.message)
          }
          this.loginRegisterDialogLoading = false
        }, 500)
      })
    },
    //参与者登出方法
    LoginOut() {
      this.Loading = true
      setTimeout(() => {
        sessionStorage.removeItem('participant')
        this.isLogin = false
        this.isReferee = false
        this.Loading = false
      }, 500)

    },
    //论文重传路径设定方法
    reuploadPaper(id) {
      this.$refs.paperUpload.clearFiles(); //上传成功之后清除历史记录
      this.$refs.paperReUpload.clearFiles();
      this.paperReuploadPath = 'http://localhost:9001/server/file/reuploadPaper' + id
    },
    //删除论文方法
    async deletePaper(row) {
      if (row.state === 0) {
        await this.$http.delete('/api/server/file/deletePaper' + row.id).then((res) => {
          if (res.data.flag) {
            this.paperListLoading = true
            setTimeout(() => {
              this.$message.success(res.data.message)
              this.getParticipantPaperList()
              this.paperListLoading = false
            }, 500)
          } else {
            this.$message.success(res.data.message)
          }
        })
      } else {
        this.$message.warning()
      }
    },
    //提交文件触发方法
    uploadDrawerOpen() {
      this.submitDrawerFlag = true
      this.paperListLoading = true
      setTimeout(() => {
        this.getParticipantPaperList()
        this.paperListLoading = false
      }, 500)
    },
    //获取参与者
    getParticipant() {
      if (sessionStorage.getItem('participant')) {
        this.isLogin = true
        const participant = JSON.parse(sessionStorage.getItem('participant'))
        this.participant.id = participant.id
        this.participant.name = participant.name
        this.participant.mail = participant.mail
        this.participant.phone = participant.phone
        this.participant.referee = participant.referee
        this.isReferee = this.participant.referee === '1'
        this.paperPath = 'http://localhost:9001/server/file/submitPaper' + this.conferenceId + '/' + this.participant.id
      }
    },
    //获取paper列表
    async getParticipantPaperList() {
      await this.$http.get('/api/server/file/getParticipantPaperList' + this.conferenceId + '/' + this.participant.id).then((res) => {
        if (res.data.flag) {
          this.paperList = res.data.data
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
    //获取该审稿员的论文列表
    async getRefereePaperList() {
      this.reviewDialogFlag = true
      this.refereePaperListLoading = true
      await this.$http.get('/api/server/file/getRefereePapers' + this.conferenceId + '/' + this.participant.id).then((res) => {
        setTimeout(() => {
          if (res.data.flag) {
            this.refereePaperList = res.data.data
          } else {
            this.$message.error(res.data.message)
          }
          this.refereePaperListLoading = false
        }, 500)
      })
    },
    async UnReview(row) {
      await this.$http.get('/api/server/file/setUnReviewing' + row.id + '/' + this.participant.id).then((res) => {
        if (res.data.flag) {
          this.refereePaperListLoading = true
          this.getRefereePaperList()
          setTimeout(() => {
            this.$message.success('You have waived the right to review this paper.');
            this.refereePaperListLoading = false
          }, 500)
        }
      })
    },
    async Review(row) {
      let f = 0
      if (row.refereeId1 === this.participant.id) f = 1
      if (row.refereeId2 === this.participant.id) f = 2
      if (f === 0) {
        await this.$http.get('/api/server/file/setReviewing' + row.id + '/' + this.participant.id).then((res) => {
          if (res.data.flag) {
            this.refereePaperListLoading = true
            this.getRefereePaperList()
            setTimeout(() => {
              this.$message.success('You have obtained the right to review this paper.');
              this.refereePaperListLoading = false
            }, 500)

          }
        })
      } else {
        this.refereePaperListLoading = true
        setTimeout(() => {
          this.reviewingPaper = {
            id: row.id,
            name: row.name,
            submitterName: row.submitterName,
            createTime: row.createTime,
            state: f === 1 ? row.state1 : row.state2,
            url: row.url
          }
          this.refereePaperListLoading = false
          this.paperDrawerFlag = true
        }, 500)
      }
    },
    DownLoadPaper(url) {
      window.open(url, '_blank')
    },
    async setPaperState(val) {
      await this.$http.get('/api/server/file/refereeChangeState' + this.reviewingPaper.id + "/" + this.participant.id + "/" + val).then((res) => {
        if (res.data.flag) {
          this.stateGroupLoading = true
          setTimeout(() => {
            this.$message.success(res.data.message)
            this.getRefereePaperList()
            this.stateGroupLoading = false
          }, 500)
        }
      })
    },
    //文件上传功能函数
    //上传前检测
    beforePDFupload(file) {
      const isPDF = file.type === 'application/pdf'
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isPDF) {
        this.$message.error("The file is not PDF !")
      }
      if (!isLt10M) {
        this.$message.error("The file is out of 10M !")
      }
      return isPDF && isLt10M
    },
    //上传成功
    submitPaperSuccess(res) {
      this.paperListLoading = true
      this.$refs.paperUpload.clearFiles(); //上传成功之后清除历史记录
      setTimeout(() => {
        if (res.flag) {
          this.$message.success(res.message)
          this.getParticipantPaperList()
          this.paperListLoading = false
        } else {
          this.$message.error(res.message)
          this.paperListLoading = false
        }
      }, 500)
    },
    ReuploadPaperSuccess(res) {
      this.paperListLoading = true
      setTimeout(() => {
        if (res.flag) {
          this.$message.success(res.message)
          this.getParticipantPaperList()
          this.paperListLoading = false
        } else {
          this.$message.error(res.message)
          this.paperListLoading = false
        }
      }, 500)

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
  width: 63%;
  min-height: 70vh;
  transition: all .5s;
}

.markDownContainer:hover {
  transition: all .5s;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
}

/*右侧信息栏*/
.infoContainer {
  width: 22%;
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
<style>
.el-popover.el-popper {
  background-color: rgb(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 15px;
  width: 35% !important;
  height: 85% !important;
}

.el-drawer.rtl.open {
  border-radius: 10px;
  background: rgb(255, 255, 255, 0.9);
  --el-drawer-padding-primary: var(--el-dialog-padding-primary, 20px);
}

.el-table {
  margin: auto;
  position: relative;
  border-radius: 10px;
  background-color: rgb(255, 255, 255, 0.2);
  --el-table-border-color: rgb(255, 255, 255, 0.7);
  --el-table-border: 1px solid var(--el-table-border-color);
  --el-table-text-color: black;
  --el-table-header-text-color: black;
  --el-table-row-hover-bg-color: rgb(255, 255, 255, 0.4);
  --el-table-current-row-bg-color: rgb(255, 255, 255, 0.3);
  --el-table-header-bg-color: rgb(255, 255, 255, 0.5);
  --el-table-fixed-box-shadow: 0 0 10px rgba(0, 0, 0, 0.12);
  --el-table-bg-color: rgb(255, 255, 255, 0.3);
  --el-table-tr-bg-color: rgb(255, 255, 255, 0.3);
  --el-table-expanded-cell-bg-color: rgb(255, 255, 255, 0.3);
}

.el-table__body-wrapper tr td.el-table-fixed-column--left, .el-table__body-wrapper tr td.el-table-fixed-column--right, .el-table__body-wrapper tr th.el-table-fixed-column--left, .el-table__body-wrapper tr th.el-table-fixed-column--right, .el-table__footer-wrapper tr td.el-table-fixed-column--left, .el-table__footer-wrapper tr td.el-table-fixed-column--right, .el-table__footer-wrapper tr th.el-table-fixed-column--left, .el-table__footer-wrapper tr th.el-table-fixed-column--right, .el-table__header-wrapper tr td.el-table-fixed-column--left, .el-table__header-wrapper tr td.el-table-fixed-column--right, .el-table__header-wrapper tr th.el-table-fixed-column--left, .el-table__header-wrapper tr th.el-table-fixed-column--right {
  position: sticky !important;
  z-index: 2;
  background: rgb(255, 255, 255, 0.2);
}

</style>
