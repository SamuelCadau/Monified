<template>
  <div
    class="fullscreen WorkSans"
    style="background-color: #11191f; z-index: 999"
  >
    <div class="col-12 row">
      <div
        class="col-6 relative"
        style="
          padding: 4% 13% 8% 5%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100vh;
        "
      >
        <p class="icon-top-right" @click="goBack">Back home</p>
        <div style="display: flex; flex-direction: column; margin-bottom: 60px">
          <p
            class="WorkBold"
            style="color: #59e4d7; font-size: 15px; margin: 0px"
          >
            DON’T WORRY YOUR SAVE
          </p>
          <p style="font-size: 56px; color: #fff; margin-top: -20px">
            Provide your email<span
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
            You haven’t forgotten ?<a
              href="#/login"
              style="text-decoration: none"
              ><span style="color: #59e4d7"> Log In</span></a
            >
          </p>
        </div>
        <form
          @submit.prevent="onSubmit"
          @reset.prevent.stop="onReset"
          style="display: flex; flex-direction: column; gap: 60px"
        >
          <div class="col-6" style="width: 500px">
            <q-input
              ref="userMailRef"
              dark
              label-color="white"
              stack-label
              :dense="dense"
              color="teal"
              outlined
              v-model="userMail"
              type="email"
              label="Email"
            >
              <template v-slot:append>
                <q-icon name="email" color="white" />
              </template>
            </q-input>
          </div>

          <div
            style="display: flex; justify-content: space-between; width: 500px"
          >
            <q-btn
              label="Cancel"
              type="reset"
              unelevated
              rounded
              style="
                width: 225px;
                height: 50px;
                background-color: #202740;
                color: #fff;
                text-transform: capitalize;
                border-radius: 20px;
              "
            />

            <q-btn
              label="Send mail"
              type="submit"
              unelevated
              rounded
              style="
                width: 225px;
                height: 50px;
                background-color: #59e4d7;
                color: #fff;
                text-transform: capitalize;
                border-radius: 20px;
              "
            />
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
import { ref } from "vue";
import userService from "src/services/User";
import createLogger from "src/utils/logger";

const logger = createLogger("reset-mail");

export default defineComponent({
  name: "SendMail",

  setup() {
    const global = UseGlobal();
    const userMail = ref(null);
    const userMailRef = ref(null);
    const accept = ref(false);

    return {
      global,
      userMailRef,

      accept,
      onReset() {
        userMail.value = null;
        userMailRef.value.resetValidation();
      },
    };
  },

  data() {
    return {
      tab: "home",
      text: "",
      userMail: this.email,
      router: this.$router,
    };
  },

  methods: {
    async onSubmit() {
      if (!this.userMail) {
        this.$q.notify({
          message: "Merci de renseigner votre email",
          color: "negative",
        });
        return;
      }
      try {
        await userService.requestPasswordReset(this.userMail);
        this.$q.notify({
          message: "Email envoyé, consultez votre boîte de réception",
          color: "positive",
        });
        this.$router.push("/");
      } catch (error) {
        logger.warn("Password reset email failed", error);
        this.$q.notify({
          message: "Email invalide ou inconnu",
          color: "negative",
        });
      }
    },
    goBack() {
      this.$router.push("/");
    },
  },
  mounted() {
    this.userMail = this.email;
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
  cursor: pointer;
  transition: 0.5s;
}

.icon-top-right:hover {
  color: #59e4d7;
  font-weight: bold;
  transition: 0.5s;
}

.q-item__label:hover {
  color: #59e4d7;
  font-weight: bold;
}
</style>
