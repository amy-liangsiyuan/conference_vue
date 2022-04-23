<template>
  <footer>
    <div class="footer-wrap">
      <p class="m-text-thin m-text-spaced ">主管单位：XXXXXX｜运维单位：XXXXXX</p>
      <div>Copyright @2021 - {{ new Date().getFullYear() }}</div>
    </div>
  </footer>
</template>

<script>
</script>

<style scoped>
.footer-wrap {
  line-height: 2;
  position: center;
  padding: 15px 40px;
  color: #eee;
  font-size: 14px;
  text-align: center;
  background: linear-gradient(-45deg, #55aaff,#ee7752, #ce3e75, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  backdrop-filter: blur(20px);
  opacity: 0.7;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  animation: Gradient 10s ease infinite;
  margin-top: 3%;
  transition: all .5s;
}
.footer-wrap a {
  color: #eee !important;
}
.footer-wrap:hover{
  transition:all .5s;
  box-shadow: 0 0 6px rgba(0,0,0,0.5);
}
@keyframes Gradient {
  0% {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
</style>
