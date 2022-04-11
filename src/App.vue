<template>
  <div style="width: 99%;">
    <transition
        mode="out-in"
        enter-active-class="animate__animated animate__fadeIn"
        leave-active-class="animate__animated animate__fadeOut">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </transition>
  </div>

</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      transitionName: '',
      // path: ''
    }
  },
  mounted() {
    this.path = this.$route.path
  },
  watch: {
    $route(to) {
      this.path = to.path
    }
  },

}

</script>

<style scoped>
</style>
