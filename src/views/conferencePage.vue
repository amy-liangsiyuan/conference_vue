<template>
  <div class="mainContainer" v-loading="loading">
    <div class="imgContainer">
      <img class="topImg"
           :src=this.conferenceInfo.firstPicture alt="">
    </div>
    <!--分割线-->
<!--    <div style="width:100%;margin-top:10px;text-align: center;margin-bottom: 5px">-->
<!--&lt;!&ndash;      <h1 style="text-align: center">{{ this.conferenceInfo.name }}</h1>&ndash;&gt;-->
<!--      <img src="../assets/images/line.png">-->
<!--    </div>-->
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
            <el-button type="primary" round>{{$t('ConferencePage.Login_Register')}}</el-button>
            <el-button type="success" round>{{$t('ConferencePage.Submit')}}</el-button>
          </div>
          <el-timeline style="margin-left: -40px;margin-top: 30px;margin-right: 5px">
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
      loading: false,
      content: '',
      conferenceId: '',
      Tree: [],
      InfoLine:[],
      conferenceInfo: {}
    }
  },
  created() {
    this.loading = true
    setTimeout(() => {
      this.conferenceId = localStorage.getItem('conferenceId')
      this.getMenu(this.conferenceId).then(() => {
        this.setContent(this.Tree)
        this.getConference(this.conferenceId)
        this.getInfoList(this.conferenceId)
      })
      this.loading = false
    }, 500)


  },
  methods: {
    //获取通知列表
    async getInfoList(id) {
      await this.$http.get('/api/server/conference/getInfoList' + id).then((res)=>{
        this.InfoLine=res.data.data
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
    }
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
.el-card{
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  transition: all .5s;
}
.el-card:hover{
  transition: all .5s;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
}
</style>
