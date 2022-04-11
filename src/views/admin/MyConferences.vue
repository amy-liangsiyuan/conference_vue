<template>
  <div class="myContainer">
    <div style="opacity:0.8;position:relative;width: 90%;padding: 5% 5% 5% 5%;">

      <el-table :data="conferenceList" class="MyTable" max-height="630">
        <el-table-column fixed prop="name" :label="$t('ConferenceInfo.Name')" width="200"/>
        <el-table-column prop="createTime" :label="$t('ConferenceInfo.CreateTime')" width="190"/>
        <el-table-column prop="dropTime" :label="$t('ConferenceInfo.DropTime')" width="190"/>
        <el-table-column prop="city" :label="$t('ConferenceInfo.City')" width="120"/>
        <el-table-column prop="address" :label="$t('ConferenceInfo.Address')" width="300"/>
        <el-table-column prop="department" :label="$t('ConferenceInfo.Department')" width="150"/>
        <el-table-column prop="state" :label="$t('ConferenceInfo.State')" width="150"/>
        <el-table-column fixed="right" :label="$t('MyConferencePage.Operation')">
          <template #default="scope">
            <el-button type="text" @click="ConferenceEdit(scope.row)"
            >{{ $t('MyConferencePage.Edit') }}
            </el-button
            >
            <el-button type="text" style="color: red" @click="ConferenceDelete(scope.row)">
              {{ $t('MyConferencePage.Delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--弹出框-->
      <el-drawer
          size="37%"
          style="border-radius: 20px"
          v-model="formFlag"
          :before-close="handleClose"
          direction="rtl"
          :title="$t('MyConferencePage.EditConference')"
      >
        <div class="MyDrawer">
              <el-form
                  ref="conferenceInfo"
                  style="font-size:20px;font-weight:800;margin-top: 20px"
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
      myHeader: {
        Authorization: "Bearer " + window.sessionStorage.getItem('token'),
        token: window.sessionStorage.getItem('token'),
        conferenceId: ''
      },
      fileList: [
        {
          name: 'foo.jpeg',
          url: '',
        },
      ],
      dialogVisible: false,
      formFlag: false,
      conferenceInfo: {
        id: '',
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
    this.getConferenceList()
  },
  methods: {
    async getConferenceList() {
      const {data: res} = await this.$http.get('/api/server/conference/getMyConference/')
      this.conferenceList = res.data
    },

    ConferenceEdit(row) {
      this.conferenceInfo = row;
      this.myHeader.conferenceId = this.conferenceInfo.id
      this.fileList[0].url = this.conferenceInfo.firstPicture
      this.formFlag = true;
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
          this.$http.post('/api/server/conference/update_conference', param).then((res) => {
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
      this.$http.delete('/api/server/file/delete_firstPicture', {
        headers:
            {
              'conferenceId': this.myHeader.conferenceId
            }
      }).then((res) => {
        if (res.data.flag) {
          this.$message.success("Remove success!")
          this.getConferenceList()
        } else {
          this.$message.error("uplad error!")
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
  height: 100%;
  opacity: 1;
  background-color: rgb(255, 255, 255, 0.25);
  border-radius: 20px;
  backdrop-filter: blur(30px);
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

.el-drawer__header {
  margin-bottom: 0;
  color: black;
}
</style>
