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
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  animation: Gradient 10s ease infinite;
  margin-top: 5%;
}
.footer-wrap a {
  color: #eee !important;
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
