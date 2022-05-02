<template>
  <div class="myContainer">
    <div style="display:flex;opacity:0.8;position:relative;width: 95%;padding: 2%;margin: auto">
      <!--会议目录-->
      <el-table :data="conferenceList" class="MyTable" style="width: 30%;margin: auto" max-height="600px"
                v-loading="Loading.conferenceListLoading">
        <el-table-column prop="name" :label="$t('ConferenceInfo.Name')"/>
        <el-table-column prop="state" :label="$t('ConferenceInfo.State')">
          <template #default="scope">
            <el-switch :model-value="scope.row.state === 1"
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       inline-prompt
                       active-text="O"
                       inactive-text="X"
                       disabled
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" :label="$t('MyConferencePage.Operation')">
          <template #default="scope">
            <div style="display: flex;overflow: auto">
              <el-button type="text" @click="ConferenceParticipants(scope.row)"
              >{{ $t('ParticipantManagementPage.Participants') }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--参与者目录-->
      <el-table :data="participantList" style="width: 65%;margin: auto" class="MyTable" max-height="650px"
                v-loading="Loading.ParticipantsLoading">
        <el-table-column prop="name" :label="$t('UserInfo.UserName')"/>
        <el-table-column prop="mail" :label="$t('UserInfo.Email')"/>
        <el-table-column prop="phone" :label="$t('UserInfo.Phone')"/>
        <el-table-column prop="state" :label="$t('ConferenceInfo.State')">
          <template #default="scope">
            <el-switch
                :loading="Loading.changeStateLoading"
                :model-value="scope.row.state === 1"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="changeState(scope.row)"
                inline-prompt
                active-text="O"
                inactive-text="X"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="reviewing" :label="$t('ParticipantManagementPage.Reviewing')">
          <template #default="scope">
            <el-switch :model-value="scope.row.reviewing === 1"
                       active-color="#13ce66"
                       :loading="Loading.changeRefereeLoading"
                       inactive-color="#ff4949"
                       @change="changeReferee(scope.row)"
                       inline-prompt
                       active-text="O"
                       inactive-text="X"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" :label="$t('MyConferencePage.Operation')" width="100">
          <template #default="scope">
            <div style="display: flex;overflow: auto">
              <el-button type="text" style="color: red" @click="ParticipantRemove(scope.row)"
              >{{ $t('ParticipantManagementPage.Remove') }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "participantManagement",
  data() {
    return {
      Loading: {
        conferenceListLoading: false,
        ParticipantsLoading: false,
        changeStateLoading: false,
        changeRefereeLoading: false
      },
      conferenceList: [],
      participantList: [],
      conferenceId: '',
    }
  },
  created() {
    this.Loading.conferenceListLoading = true
    this.Loading.ParticipantsLoading = true
    setTimeout(() => {
      this.getConferenceList()
      this.Loading.conferenceListLoading = false
      this.Loading.ParticipantsLoading = false
    }, 500)
  },
  methods: {
    //获取会议成员表
    ConferenceParticipants(row) {
      this.Loading.ParticipantsLoading = true
      setTimeout(() => {
        this.conferenceId = row.id
        this.getParticipantList(row.id)
        this.Loading.ParticipantsLoading = false
      }, 500)

    },
    //移除成员
    ParticipantRemove(row) {
      ElMessageBox.confirm(
          this.$i18n.t('MyMessageBox.Box_1') + row.name + '?',
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
    //改变状态
    async changeState(row) {
      row.state = row.state === 1 ? 0 : 1
      await this.$http.get('/api/server/participant/changeSate' + this.conferenceId + '/' + row.id).then((res) => {
        if (res.data.flag) {
          this.Loading.changeStateLoading = true
          setTimeout(() => {
            this.$message.success(res.data.message)
            this.Loading.changeStateLoading = false
          }, 300)
        }
      })
    },
    async changeReferee(row) {
      row.reviewing = row.reviewing === 1 ? 0 : 1
      await this.$http.get('/api/server/participant/changeReferee' + this.conferenceId + '/' + row.id).then((res) => {
        if (res.data.flag) {
          this.Loading.changeRefereeLoading = true
          setTimeout(() => {
            this.$message.success(res.data.message)
            this.Loading.changeRefereeLoading = false
          }, 300)
        }
      })
    },
    async getConferenceList() {
      const {data: res} = await this.$http.get('/api/server/conference/getMyConference/')
      this.conferenceList = res.data
    },
    async getParticipantList(id) {
      const {data: res} = await this.$http.get('/api/server/participant/getParticipantsList' + id)
      this.participantList = res.data
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
  background-color: rgb(255, 255, 255, 0.1);
}

.MyTable {
  width: 50%;
  margin: 0 auto;
  border-radius: 20px;
}

.MyDrawer {
  overflow: auto;
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
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
  font-weight: 600;
}

.el-table th.el-table__cell {
  -webkit-user-select: none;
  user-select: none;
  background-color: transparent;
}

.el-table {
  margin: auto;
  position: relative;
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

