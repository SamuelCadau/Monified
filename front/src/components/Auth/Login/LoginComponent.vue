<template>
  <!-- <div class="container">
    <button class="button" @click="googleLogin">Google</button>
    <button class="button" @click="microsoftLogin">Microsoft</button>
  </div> -->d
</template>

<script>
import { defineComponent } from "vue";

import userService from "src/services/User";

export default defineComponent({
  name: "LoginComponent",
  data() {
    return {};
  },
  methods: {
    async googleLogin() {
      const response = await userService.googleLogin();
    },
    async microsoftLogin() {
      const response = await userService.microsoftLogin();
    },
  },
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.button {
  width: 500px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
  border-radius: 20px;
  background-color: transparent;
  color: #fff;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.5s ease;
  margin-bottom: 20px;
}

.button:hover {
  background-color: #fff;
  color: #000;
  cursor: pointer;
}
</style>
