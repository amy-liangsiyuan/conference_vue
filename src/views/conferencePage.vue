<template>
  <div class="mainContainer" v-loading="loading">
    <div class="imgContainer">
      <img class="topImg"
           src="../assets/images/home_back.jpg">
    </div>
    <!--分割线-->
    <div style="width:100%;margin-top:10px;text-align: center">
      <img src="../assets/images/line.png">
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
          information
        </div>
      </div>

    </div>
    <Footer style="width: 80%;margin: auto"></Footer>
  </div>

</template>

<script>
import Footer from '../components/Footer'

export default {
  components: {Footer},
  name: "conferencePage",
  data() {
    return {
      loading:false,
      content: '',
      conferenceId: '',
      Tree: [],
    }
  },
  created() {
    this.loading=true
    setTimeout(()=>{
      this.conferenceId = localStorage.getItem('conferenceId')
      this.getMenu(this.conferenceId).then(()=>{this.setContent(this.Tree)})
      this.loading=false
    },500)


  },
  methods: {
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
.mainContainer {
  min-height: 100vh;
  width: 101%;
}

.imgContainer {
  margin: 0 auto;
  height: 20vh;
  width: 80%;
}

.contentContainer {
  margin: 0 auto;
  width: 80%;

}

.menuContainer {
  width: 14%;
  height: 70vh;
}

/*中间的md预览*/
.markDownContainer {
  background-color: white;
  padding: 20px;
  border: 1px solid #dcdcdc;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  width: 70%;
  min-height: 70vh;
  transition: all .5s;
}

.markDownContainer:hover {
  transition: all .5s;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
}

/*右侧信息栏*/
.infoContainer {
  width: 15%;
  margin-left: 1%;
  height: 70vh;
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
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  transition: all .5s;
}

.topImg:hover {
  transition: all .5s;
  box-shadow: 10px 10px 10px black;
}

/*左侧菜单*/
.MyTree {
  width: 75%;
  overflow: hidden;
  border: 1px solid #dcdcdc;
  border-radius: 10px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  background: rgb(247, 247, 247, 0.9);
  transition: all .5s;
}

.MyTree:hover {
  transition: all .5s;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);

}
</style>
