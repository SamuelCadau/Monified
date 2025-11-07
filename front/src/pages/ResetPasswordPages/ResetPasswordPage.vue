
<template>

  <div>
    <ResetPassword/>
  </div>
</template>

<script>

import ResetPassword from '../../components/Auth/ResetPassword/ResetPassword.vue'
import { defineComponent } from 'vue';

export default defineComponent({

  name: "ResetPasswordPage",
  components: {
    ResetPassword,
  },

  data() {
    return {
      account: false,
    }
  },
})

</script>
