<template>
  <div>
    <SendMail/>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import SendMail from "../../components/Auth/ResetPassword/SendMail.vue";

export default defineComponent({
  name: "SendMailPage",
  components: {
    SendMail,
  },

});
</script>
