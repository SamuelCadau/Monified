<template>
  <div>
    <RegisterComponent />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import RegisterComponent from "../components/Auth/Register/RegisterComponent.vue";

export default defineComponent({
  name: "RegisterPage",

  components: {
    RegisterComponent,
  },
});
</script>

<style scoped>
#block_left {
  width: 50%;
  float: left;
  align-items: center;
  padding-top: 100px;
}

#block_right {
  width: 50%;
  float: right;
  display: block;
}
</style>
