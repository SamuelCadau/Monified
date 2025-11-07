<template>
  <div class="container">
    <LoginBasic />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import LoginBasic from "../components/Auth/Login/Login.vue";
export default defineComponent({
  name: "LoginPage",
  components: {
    LoginBasic,
  },
});
</script>

<style scoped>
.container {
  height: 100vh;
  width: 100%;
  background-color: #11191F;
}
</style>
