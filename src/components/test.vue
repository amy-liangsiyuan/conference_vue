<template>
  <el-button @click="test">123</el-button>
  <el-dialog v-model="d" width="30%">
    <div style="width: 70%;margin: 0 auto">
      <el-form
          ref="userInfo"
          style="font-size:20px;font-weight:800;margin-top: 20px"
          :model="participantInfo"
          label-width="120px"
          label-position="right"
      >
        <el-form-item :label="$t('UserInfo.UserName')" prop="name">
          <el-input v-model.trim="participantInfo.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('UserInfo.Phone')" prop="phone">
          <el-input v-model.trim="participantInfo.phone"></el-input>
        </el-form-item>
        <el-form-item :label="$t('UserInfo.Email')" prop="mail">
          <el-input v-model.trim="participantInfo.mail"></el-input>
        </el-form-item>

        <el-form-item :label="$t('UserInfo.PassWord')" prop="password">
          <el-input v-model.trim="participantInfo.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" @click="submit('userInfo')">{{ $t('Register') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>

export default {
  data() {
    return {
      participantInfo: {
        name: '',
        phone: '',
        mail: '',
        password: '',
      },
      d: false
    }
  },
  methods: {

    test() {
      this.d = true
    }
  }
}
</script>
