<template>
  <div class="myContainer">
    <div style="opacity:0.8;position:relative;width: 90%;padding: 5% 5% 5% 5%;">

      <el-table :data="conferenceList" class="MyTable" max-height="630" v-loading="loading">
        <el-table-column fixed prop="name" :label="$t('ConferenceInfo.Name')" width="200"/>
        <el-table-column prop="createTime" :label="$t('ConferenceInfo.CreateTime')" width="190"/>
        <el-table-column prop="dropTime" :label="$t('ConferenceInfo.DropTime')" width="190"/>
        <el-table-column prop="city" :label="$t('ConferenceInfo.City')" width="120"/>
        <el-table-column prop="address" :label="$t('ConferenceInfo.Address')" width="250"/>
        <el-table-column prop="department" :label="$t('ConferenceInfo.Department')" width="150"/>
        <el-table-column prop="state" :label="$t('ConferenceInfo.State')" width="150">
          <template #default="scope">
            <el-switch :model-value="scope.row.state === 1"
                       :loading="switchLoading"
                       @change="changeState(scope.row)"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       inline-prompt
                       active-text="O"
                       inactive-text="X"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" :label="$t('MyConferencePage.Operation')">
          <template #default="scope">
            <el-button type="text" @click="ConferenceEdit(scope.row)"
            >{{ $t('MyConferencePage.Edit') }}
            </el-button
            >
            <el-button type="text" @click="ConferenceDetails(scope.row)">
              {{ $t('MyConferencePage.Details') }}
            </el-button>
            <el-button type="text" style="color: red" @click="ConferenceDelete(scope.row)">
              {{ $t('MyConferencePage.Delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--更多设置弹出框-->
      <el-drawer
          size="98%"
          style="border-radius: 20px"
          v-model="DetailsFlag"
          direction="ltr"
          :title="$t('MyConferencePage.ConferenceMenu')"
      >
        <div style="margin:-10px auto 10px;border-radius:20px;width: 14%;background: rgb(255, 255, 255, 0.5)">
          <el-switch
              :model-value="activeName === 'Menu'"
              @change="activeName=activeName==='Menu'?'Info':'Menu'"
              active-color="#5c9df3"
              inactive-color="#5c9df3"
              :active-text="$t('MyConferencePage.MenuSetting')"
              :inactive-text="$t('MyConferencePage.CalendarSetting')"
          ></el-switch>
        </div>
        <div v-if="activeName==='Menu'" class="MyDrawer" style="padding: 2%" v-loading="loading">
          <div style="width: 40%;">
            <div>
              <el-button icon="plus" style="margin-bottom: 10px" type="info" @click="addRoot" round>
                {{ $t('MyConferencePage.AddRoot') }}
              </el-button>
              <el-button icon="Check" style="margin-bottom: 10px" type="primary" @click="MenuSubmit" round>
                {{ $t('MyConferencePage.Modify') }}
              </el-button>
            </div>

            <el-tree
                class="MyTree"
                :data="Tree"
                node-key="id"
                default-expand-all
                :expand-on-click-node="false">
              <template #default="{ node, data }">
                <span class="custom-tree-node">

          <el-input class="MyInput" size="small" v-model="data.label"></el-input>
                  <span>
                      <el-button type="text" @click="append(node,data)">
                        {{ $t('MyConferencePage.Append') }}
                      </el-button>
                      <el-button v-if="data.childrenNum===0" type="text" @click="TreeEdit(node, data)">
                      {{ $t('MyConferencePage.Edit') }}
                      </el-button>
                      <el-button type="text" style="color: red" @click="remove(node, data)">
                        {{ $t('MyConferencePage.Delete') }}
                      </el-button>
                  </span>
                </span>
              </template>
            </el-tree>
          </div>
          <el-divider direction="vertical"></el-divider>
          <div style="height:100%;width: 65%;margin-left:1%;text-align: left;overflow:hidden">
            <v-md-editor v-model="this.Node.content" height="95%"></v-md-editor>
          </div>
        </div>
        <!--通知设置-->
        <div v-else class="MyDrawer" style="padding: 2%;" v-loading="loading">
          <div style="width: 50%;margin-right: 4%">
            <div>
              <el-button icon="plus" style="margin-bottom: 10px" type="info" @click="addInfoLine" round>
                {{ $t('MyConferencePage.AddInfoLine') }}
              </el-button>
              <el-button icon="check" style="margin-bottom: 10px" type="primary" @click="submitInfo" round>
                {{ $t('MyConferencePage.Modify') }}
              </el-button>
            </div>
            <div style="height:auto;border-radius: 20px;padding: 20px;background: rgb(255, 255, 255, 0.5)">
              <div v-for="item in InfoLine" :key="item.id" style="display: flex;margin-bottom: 10px;width: 100%">
                <el-row style="width: 100%;margin-top: 10px">
                  <el-col style="text-align: left">
                    <div>
                      <el-input maxlength="30" class="MyInput_2" v-model="item.title" style="width: 85%">
                        <template #prepend>{{ $t('MyConferencePage.Title') }}</template>
                      </el-input>
                      <el-button style="margin-left: 1%" type="danger" @click="removeInfoLine(item.id)" round>
                        {{ $t('MyConferencePage.Delete') }}
                      </el-button>
                    </div>
                  </el-col>
                  <el-col>
                    <el-input maxlength="200" :placeholder="$t('MyConferencePage.Content')" type="textarea"
                              class="MyInput_2"
                              v-model="item.content">
                    </el-input>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <el-divider direction="vertical"></el-divider>
          <div style="width: 50%;margin-left:1%">
            <el-timeline style="text-align: left;margin: 0 auto">
              <el-timeline-item
                  placement="top"
                  v-for="Info in InfoLine"
                  :key="Info.id"
                  :timestamp="Info.title">
                <el-card style="white-space: pre-wrap; word-break: break-all;">{{ Info.content }}</el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </el-drawer>


      <!--基础设置弹出框-->
      <el-drawer
          size="36%"
          style="border-radius: 20px"
          v-model="formFlag"
          :before-close="handleClose"
          direction="rtl"
          :title="$t('MyConferencePage.EditConference')"
      >
        <div class="MyDrawer" v-loading="editLoading">
          <el-form
              ref="conferenceInfo"
              style="font-size:20px;font-weight:800;margin-top: 20px;margin-left: -20px"
              :rules="rules"
              :model="conferenceInfo"
              label-width="140px"
              label-position="right"
          >
            <el-form-item :label="$t('ConferenceInfo.Name')" prop="name">
              <el-input v-model="conferenceInfo.name" disabled></el-input>
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
                  format="YYYY-MM-DD hh:mm"
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
            <el-form-item :label="$t('ConferenceInfo.FirstPicture')">
              <el-upload
                  style="margin-left: 0"
                  action="http://localhost:9001/server/file/add_firstPicture"
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
              <el-dialog width="100%" v-model="dialogVisible">
                <el-image width="100%" :src="this.conferenceInfo.firstPicture" alt="Preview Image"/>
              </el-dialog>
            </el-form-item>
            <el-form-item label="">
              <el-tag style="overflow: hidden" type="danger" size="small">{{ $t('MyConferencePage.Tips') }}</el-tag>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="large" @click="submit('conferenceInfo')">
                {{ $t('MyConferencePage.Modify') }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-drawer>
    </div>
  </div>

</template>

<script>

import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "UserInfo",
  data() {
    return {
      loading: false,
      switchLoading: false,
      editLoading: true,
      activeName: 'Menu',
      InfoLine: [],
      Node: {
        //唯一标识
        id: '',
        //几级菜单
        level: '',
        //位于当前级的位置
        sort: '',
        pid: null,
        label: '',
        content: '',
        childrenNum: 0,
        children: [],
        conferenceId: ''
      },
      myHeader: {
        Authorization: "Bearer " + window.sessionStorage.getItem('token'),
        token: window.sessionStorage.getItem('token'),
        conferenceId: ''
      },
      Tree: [],
      fileList: [
        {
          name: 'foo.jpeg',
          url: '',
        },
      ],
      dialogVisible: false,
      DetailsFlag: false,
      formFlag: false,
      conferenceInfo: {
        id: "",
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
      conferenceList: [],
      TimeFunc(time) {
        return time.getTime() < Date.now() - 8.64e7;//禁止选择今天以前的时间
      },
      rules: {
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
            type: 'array',
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
  created() {
    this.loading = true
    setTimeout(() => {
      this.getConferenceList()
      this.loading = false
    }, 500)
  },
  methods: {
    async getInfoList(id) {
      await this.$http.get('/api/server/conference/getInfoList' + id).then((res)=>{
        this.InfoLine=res.data.data
      })
    },
    async changeState(row) {
      row.state = row.state === 1 ? 0 : 1
      await this.$http.get('/api/server/conference/changeState' + row.id).then((res) => {
        if (res.data.flag) {
          this.switchLoading = true
          setTimeout(() => {
            this.$message.success(res.data.message)
            this.switchLoading = false
          }, 500)
        }
      })
    },
    async getConferenceList() {
      const {data: res} = await this.$http.get('/api/server/conference/getMyConference/')
      this.conferenceList = res.data
    },

    ConferenceEdit(row) {
      this.formFlag = true;
      this.editLoading = true
      this.fileList[0].url = ''
      setTimeout(() => {
        this.conferenceInfo = row;
        this.myHeader.conferenceId = this.conferenceInfo.id
        this.fileList[0].url = this.conferenceInfo.firstPicture
        this.editLoading = false
      }, 700)

    },
    ConferenceDetails(row) {
      this.conferenceInfo = row
      this.DetailsFlag = true
      this.loading = true
      setTimeout(() => {
        this.getMenu(this.conferenceInfo.id)
        this.getInfoList(this.conferenceInfo.id)
        this.loading = false
      }, 500)
    },
    ConferenceDelete(row) {
      ElMessageBox.confirm(
          this.$i18n.t('MyMessageBox.Box_1') + row.name,
          'Warning',
          {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
          }
      )
          .then(() => {
            ElMessage({
              type: 'success',
              message: this.$i18n.t('MyMessageBox.Box_3'),
            })
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: this.$i18n.t('MyMessageBox.Box_2'),
            })
          })
    },
    handleClose() {
      ElMessageBox.confirm(this.$i18n.t('MyConferencePage.IsSubmit'))
          .then(() => {
            if (this.submit("conferenceInfo")) {
              this.formFlag = false
              this.dialogVisible = false
            }
          })
          .catch(() => {
            this.formFlag = false
            this.dialogVisible = false
          })
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.conferenceInfo.createTime = this.conferenceInfo.time_arr[0]
          this.conferenceInfo.dropTime = this.conferenceInfo.time_arr[1]
          const param = JSON.stringify(this.conferenceInfo)
          this.$http.post('/api/server/conference/updateConference', param).then((res) => {
            if (res.data.flag) {
              this.$message.success(res.data.message)
              this.getConferenceList()
              this.formFlag = false
              return true
            } else {
              this.$message.error(res.data.message)
              return false
            }
          })
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
      const isLtSize = param.size < (1024 * 1024 * 5)
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
      this.$http.delete('/api/server/file/deleteFirstPicture', {
        headers:
            {
              'conferenceId': this.myHeader.conferenceId
            }
      }).then((res) => {
        if (res.data.flag) {
          this.$message.success("Remove success!")
          this.getConferenceList()
        } else {
          this.$message.error("upload error!")
          this.conferenceInfo.firstPicture = ''
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
      this.conferenceInfo.firstPicture = res.data
      this.getConferenceList()
    },
    //上传失败
    onError() {
      this.$message.error("Upload error!")
    },
    //超出文件个数提示
    handleExceed() {
      this.$message.error(`Only 1 file can be selected!`);
    },
    addRoot() {
      const newChild = {
        id: this.guid(),
        level: 1,
        sort: this.Tree.length + 1,
        pid: null,
        label: this.$i18n.t('MyConferencePage.Input'),
        content: '### Edit With MarkDown',
        childrenNum: 0,
        children: [],
        conferenceId: this.conferenceInfo.id
      }
      this.Tree.push(newChild)
    },
    append(node, data) {
      //node用于获取level，data可以获取点击的data的id以及其他内容
      const newChild = {
        id: this.guid(),
        level: data.level + 1,
        sort: ++data.childrenNum,
        pid: data.id,
        label: this.$i18n.t('MyConferencePage.Input'),
        content: '### Edit With MarkDown',
        childrenNum: 0,
        children: [],
        conferenceId: this.conferenceInfo.id
      };

      if (!data.children) {
        data.children = []
      }
      data.children.push(newChild);
      this.data = [...this.data]
    },
    TreeEdit(node, data) {
      this.Node = data
    },
    remove(node, data) {
      const parent = node.parent;
      parent.data.childrenNum--
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
      for (let i = 0; i < parent.data.childrenNum; i++) {
        parent.data.children[i].sort = i + 1;
      }
      this.data = [...this.data]
    },

    async MenuSubmit() {
      await this.$http.post('/api/server/conference/updatePage', this.Tree).then((res) => {
        if (res.data.flag) {
          this.loading = true
          setTimeout(() => {
            this.$message.success(res.data.message)
            this.loading = false
          }, 500)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    //获取对应会议的菜单
    async getMenu(id) {
      await this.$http.get('/api/server/conference/findPage' + id).then((res) => {
        if (res.data.flag) {
          this.Tree = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    //添加通知
    addInfoLine() {
      this.InfoLine.push({
        id: this.guid(),
        title: '',
        content: '',
        conferenceId: this.conferenceInfo.id,
        createTime: this.getCurrentTime()
      })
    },
    async submitInfo() {
      await this.$http.post('/api/server/conference/updateInfo', this.InfoLine).then((res) => {
        if (res.data.flag) {
          this.loading=true
          setTimeout(()=>{
            this.$message.success(res.data.message)
            this.loading=false
          },500)

        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    //uuid生成函数
    guid() {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }

      return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    },
    //当前时间生成
    getCurrentTime() {
      let yy = new Date().getFullYear();
      let mm = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
      let dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
      let hh = new Date().getHours();
      let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
      let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
      return yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss;
    },
    //移除通知
    removeInfoLine(id) {
      const Info = this.InfoLine.findIndex(I => I.id === id)
      this.InfoLine.splice(Info, 1)
    }
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

.myContainer:hover {
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

.MyTable {
  width: 100%;
  margin: 0 auto;
  border-radius: 20px;

}

.MyDrawer {
  overflow: auto;
  position: relative;
  display: flex;
  width: 100%;
  height: 95%;
  opacity: 1;
  background-color: rgb(255, 255, 255, 0.25);
  border-radius: 20px;
  backdrop-filter: blur(30px);
}

.MyTree {
  overflow: hidden;
  border-radius: 20px;
  padding: 20px;
  background: rgb(255, 255, 255, 0.5);
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.MyInput {
  --el-input-text-color: var(--el-text-color-regular);
  --el-input-border: transparent;
  --el-input-hover-border: transparent;
  --el-input-focus-border: transparent;
  --el-input-transparent-border: 0 0 0 1px transparent inset;
  --el-input-border-color: transparent;
  --el-input-border-radius: transparent;
  --el-input-bg-color: transparent;
  --el-input-icon-color: var(--el-text-color-placeholder);
  --el-input-placeholder-color: var(--el-text-color-placeholder);
  --el-input-hover-border-color: transparent;
  --el-input-clear-hover-color: transparent;
  --el-input-focus-border-color: transparent;
  position: relative;
  font-size: var(--el-font-size-base);
  display: inline-flex;
  width: 100%;
  line-height: 32px;
}

.MyInput_2 {
  --el-input-text-color: var(--el-text-color-regular);
  --el-input-border: 1px solid #dcdcdc;
  --el-input-hover-border: 1px solid #dcdcdc;
  --el-input-focus-border: 1px solid #dcdcdc;
  --el-input-transparent-border: 0 0 0 1px #dcdcdc inset;
  --el-input-border-color: #dcdcdc;
  --el-input-border-radius: 10px;
  --el-input-bg-color: rgb(255, 255, 255, 0.5);
  --el-input-icon-color: var(--el-text-color-placeholder);
  --el-input-placeholder-color: var(--el-text-color-placeholder);
  --el-input-hover-border-color: #dcdcdc;
  --el-input-clear-hover-color: #dcdcdc;
  --el-input-focus-border-color: #dcdcdc;
  position: relative;
  font-size: var(--el-font-size-base);
  width: 100%;
  line-height: 32px;
}

/*.el-input {*/
/*  --el-input-text-color: var(--el-text-color-regular);*/
/*  --el-input-border: transparent;*/
/*  --el-input-hover-border: transparent;*/
/*  --el-input-focus-border: transparent;*/
/*  --el-input-transparent-border: 0 0 0 1px transparent inset;*/
/*  --el-input-border-color: transparent;*/
/*  --el-input-border-radius: transparent;*/
/*  --el-input-bg-color: transparent;*/
/*  --el-input-icon-color: var(--el-text-color-placeholder);*/
/*  --el-input-placeholder-color: var(--el-text-color-placeholder);*/
/*  --el-input-hover-border-color: transparent;*/
/*  --el-input-clear-hover-color: transparent;*/
/*  --el-input-focus-border-color: transparent;*/
/*  position: relative;*/
/*  font-size: var(--el-font-size-base);*/
/*  display: inline-flex;*/
/*  width: 100%;*/
/*  line-height: 32px;*/
/*}*/

.el-divider--vertical {
  display: inline-block;
  height: 100%;
  margin-left: 1%;
  background: 0 0;
  border-left: 2px solid #cccccc;
  position: relative;
}
</style>
<style>
.cell {
  font-size: 17px;
  font-weight: 600;
}

.el-table {
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

.el-drawer.rtl.open {
  border-radius: 20px;
  background: rgb(112, 190, 199, 0.8);
  --el-drawer-padding-primary: var(--el-dialog-padding-primary, 20px);
}

.el-overlay {
  border-radius: 20px !important;
}

.el-drawer.ltr.open {
  border-radius: 20px;
  background: rgb(112, 190, 199, 0.8);
  --el-drawer-padding-primary: var(--el-dialog-padding-primary, 20px);
}

.el-drawer__header {
  margin: 0 auto;
  color: black;
}

.v-md-editor {
  border-radius: 10px;
  background-color: rgb(255, 255, 255, 0.5);
}

.v-md-textarea-editor textarea {
  background-color: transparent;
}

.v-md-editor-preview {
  background-color: transparent;
}

.vuepress-markdown-body {
  background-color: transparent;
}

.v-md-editor__editor-wrapper {
  border-right: 1px solid #ffffff !important;
}

.v-md-editor__toolbar {
  border-bottom: 1px solid #ffffff !important;
}

.v-md-editor--fullscreen {
  margin: 1% auto;
  width: 95%;
  background: rgb(230, 230, 230, 0.9);
}
</style>
