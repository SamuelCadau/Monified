<template>
  <div class="fullscreen WorkSans" style="background-color: #11191F; z-index: 999;">
    <div class="col-12 row">
      <div class="col-6 relative" style=" padding: 4% 13% 8% 5%;;
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100vh;">
        <div class="icon-top-right" @click="goBack">
          <q-item-label>
            Back home
          </q-item-label>
        </div>
        <p class="WorkBold" style="color: #59E4D7; font-size: 15px; margin: 0px;">DON’T WORRY YOUR SAVE</p>
        <h2 style="font-size:50px; color: #fff; margin: 0px;">Reset Password<span
            style="color: #59E4D7; font-size: 100px;">.</span></h2>
        <p style="color: #fff; width: 80%; margin-top: 20px;">You haven’t forgotten ? <a href="#/login"><span
              style="color: #59E4D7;">Log in</span></a></p>

        <form @submit.prevent="resetPassword" @reset.prevent.stop="onReset">

          <div style="margin: 40px 0px;">
            <q-input dark style="margin-bottom: 20px;" ref="passwordRef" label-color="white" stack-label :dense="dense"
              color="teal" outlined label="Password" v-model="password" :type="isPwd ? 'password' : 'text'">
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd"
                  color="white" />
              </template>
            </q-input>

            <q-input dark style="margin-bottom: 20px;" ref="passwordRef" label-color="white" stack-label :dense="dense"
              color="teal" outlined label="Confirm password" v-model="passwordConfirm"
              :type="isPwd ? 'password' : 'text'">
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd"
                  color="white" />
              </template>
            </q-input>
          </div>

          <div class="col-6" style="display: flex;">
            <q-btn label="Reset password" type="submit" unelevated rounded style="
                    float: right;
                    background-color: #59E4D7;
                    color: #FFF;
                    text-transform: capitalize;
                    padding: 10px 65px;" />
          </div>
        </form>


      </div>
      <div class="col-6">
        <q-img src="/back_register.png" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { UseGlobal } from "stores/global";
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import userService from "src/services/User";
import createLogger from "src/utils/logger";

const logger = createLogger("reset-password");


export default defineComponent({
  name: "ResetPassword",

  setup() {
    const global = UseGlobal();
    const $q = useQuasar()

    const password = ref(null)
    const passwordRef = ref(null)

    const accept = ref(false)

    return {
      isPwd: ref(true),
      global,
      passwordRef,

      accept,

      onSubmit() {

        passwordRef.value.validate()
        if (password.value === null) {
        } else {
          this.resetPassword()
        }
      },

      onReset() {

        password.value = null
        passwordRef.value.resetValidation()
      }
    };
  },
  components: {
  },
  data() {
    return {
      tab: "home",
      users: [],
      text: "",
      token: this.$route.params.token,
      id: parseInt(this.$route.params.id),
      passwordConfirm: '',
      password: '',
      user: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      }
    };
  },
  methods: {
    async resetPassword() {
      if (!this.password || !this.passwordConfirm) {
        this.$q.notify({
          message: "Le mot de passe ne peut pas être vide",
          color: "negative",
        });
        return;
      }

      if (this.password !== this.passwordConfirm) {
        this.$q.notify({
          message: "Les mots de passe ne correspondent pas",
          color: "negative",
        });
        return;
      }

      try {
        await userService.updatePassword(this.id, { password: this.password });
        this.$q.notify({
          message: "Mot de passe mis à jour avec succès",
          color: "positive",
        });
        this.$router.push("/login");
      } catch (error) {
        logger.error("Password reset failed", error);
        this.$q.notify({
          message: "Impossible de mettre à jour le mot de passe",
          color: "negative",
        });
      }
    },
    goBack() {
      this.$router.push('/')
    }
  },

  mounted() {

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

.relative {
  position: relative;

}

.icon-top-right {
  position: absolute;
  top: 7%;
  right: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 110px;
  color: #fff;
  font-size: 1.1em;
}

.q-item__label:hover {
  color: #59e4d7;
  font-weight: bold;
}
</style>
