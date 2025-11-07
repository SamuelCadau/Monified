<template>
  Back home

  <div
    class="fullscreen WorkSans"
    style="background-color: #11191f; z-index: 999"
  >
    <div class="col-12 row">
      <div
        class="col-6 relative"
        style="
          padding: 10% 1% 7% 5%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100vh;
          width: 50%;
        "
      >
        <div class="icon-top-right" @click="goBack">
          <q-item-label style="cursor: pointer"> Back home </q-item-label>
        </div>

        <div style="display: flex; flex-direction: column; margin-bottom: 30px">
          <p
            class="WorkBold"
            style="color: #59e4d7; font-size: 15px; margin: 0px"
          >
            START FOR FREE
          </p>
          <p style="font-size: 56px; color: #fff; margin-top: -20px">
            Login Account<span
              style="color: #59e4d7; margin: 0px; font-size: 96px"
              >.</span
            >
          </p>
          <p
            style="
              color: #fff;
              width: 80%;
              margin: 0;
              font-size: 15px;
              font-weight: 400;
            "
          >
            Never registered ?<a href="#/register" style="text-decoration: none"
              ><span style="color: #59e4d7"> Sign Up</span></a
            >
          </p>
        </div>
        <div
          style="
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-bottom: 30px;
          "
        >
          <q-btn
            style="
              width: 500px;
              height: 64px;
              border: 1px solid #fff;
              border-radius: 10px;
            "
            @click="googleLogin"
            unelevated
            rounded
          >
            <template v-slot:default>
              <div style="display: flex; gap: 30px; align-items: center">
                <div class="col-2">
                  <q-icon color="primary" name="img:/google.svg" />
                </div>
                <div class="col-10">
                  <span class="WorkSans" style="font-size: 15px; color: #fff"
                    >Login with Google</span
                  >
                </div>
              </div>
            </template>
          </q-btn>
        </div>

        <div
          style="
            display: flex;
            gap: 5px;
            margin: 0;
            align-items: center;
            margin-bottom: 30px;
          "
        >
          <div style="width: 238px">
            <hr />
          </div>
          <div style="color: #fff; font-size: 14px; font-weight: 400">or</div>
          <div style="width: 238px">
            <hr />
          </div>
        </div>

        <q-form
          @submit.prevent="login"
          @reset.prevent.stop="onReset"
          class="q-gutter-md"
        >
          <div>
            <q-input
              ref="mailRef"
              dark
              label-color="white"
              stack-label
              color="teal"
              outlined
              v-model="this.user.email"
              type="email"
              label="Email"
              style="width: 500px"
              :rules="[(val) => !!val || 'Email cannot be blank']"
            >
              <template v-slot:append>
                <q-icon name="email" color="white" />
              </template>
            </q-input>
          </div>
          <div>
            <q-input
              dark
              ref="passwordRef"
              label-color="white"
              stack-label
              color="teal"
              outlined
              label="Password"
              v-model="this.user.password"
              :type="isPwd ? 'password' : 'text'"
              style="width: 500px"
              :rules="[(val) => !!val || 'Password cannot be blank']"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                  color="white"
                />
              </template>
            </q-input>
          </div>
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              width: 500px;
              margin-top: 5px;
            "
          >
            <q-btn
              label="Login"
              type="submit"
              unelevated
              style="
                width: 42%;
                height: 48px;
                background-color: #59e4d7;
                color: #fff;
                text-transform: capitalize;
                border-radius: 20px;
                font-size: 15px;
              "
            />

            <p
              style="
                color: #fff;
                margin-top: 15px;
                font-size: 15px;
                font-weight: 400;
              "
            >
              Forgot password ?
              <a @click="goSendMail" style="text-decoration: none"
                ><span style="color: #59e4d7; cursor: pointer">Reset </span></a
              >
            </p>
          </div>
        </q-form>
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
import { ref } from "vue";
import { useQuasar } from "quasar";
import userService from "src/services/User";
import URL from "src/helpers/Contants";
import createLogger from "src/utils/logger";

const logger = createLogger("login");

export default defineComponent({
  name: "LoginBasic",
  setup() {
    const global = UseGlobal();
    const $q = useQuasar();

    const mail = ref(null);
    const mailRef = ref(null);
    const password = ref(null);
    const passwordRef = ref(null);
    const accept = ref(false);

    return {
      global,
      mail,
      mailRef,
      password: ref(""),
      passwordRef,
      isPwd: ref(true),
      accept,
      onReset() {
        mail.value = null;
        mailRef.value.resetValidation();
        password.value = null;
        passwordRef.value.resetValidation();
      },

      showNotify() {
        $q.notify({
          message: "Invalid Email or Password",
          textColor: "red",
          position: "top",
          timeout: 2000,
        });
      },
    };
  },
  data() {
    return {
      tab: "home",
      text: "",
      user: {
        email: "",
        password: "",
      },
      isLoggedIn: false,
    };
  },

  methods: {
    login() {
      userService
        .login(this.user)
        .then((response) => {
          this.global.setAccessToken(response.data.accessToken);
          this.$router.push("/user");
        })
        .catch((error) => {
          logger.warn("Login failed", error);
          this.showNotify();
        });
    },
    googleLogin() {
      window.open(URL.AUTH_GOOGLE, "_self");
    },

    goSendMail() {
      this.$router.push("/reset-password/send-mail");
    },
    goBack() {
      this.$router.push("/");
    },
  },
  mounted() {},
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
  cursor: pointer;
}

.q-item__label:hover {
  color: #59e4d7;
  font-weight: bold;
}
</style>
