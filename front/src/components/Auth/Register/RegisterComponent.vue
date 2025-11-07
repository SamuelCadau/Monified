<template>
  <div class="fullscreen WorkSans" style="background-color: #11191f; z-index: 999">

    <div class="col-12 row ">
      <div class="col-6 relative" style="
          padding: 10% 1% 7% 5%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100vh;
        ">
        <div class="icon-top-right" @click="goBack">
          <q-item-label>
            Back home
          </q-item-label>
        </div>


        <div style="display: flex; flex-direction: column; margin-bottom: 60px">
          <p class="WorkBold" style="color: #59e4d7; font-size: 15px; margin: 0px">
            START FOR FREE
          </p>
          <p style="font-size: 56px; color: #fff; margin-top: -20px">
            Create new Account<span style="color: #59e4d7; margin: 0px; font-size: 96px">.</span>
          </p>
          <p style="
              color: #fff;
              width: 80%;
              margin: 0;
              font-size: 15px;
              font-weight: 400;
            ">
            Already A Member ?<a href="#/login" style="text-decoration: none"><span style="color: #59e4d7"> Log
                In</span></a>
          </p>
        </div>

        <form @submit.prevent.stop="register" @reset.prevent.stop="onReset" class="q-gutter-md">
          <div style="
              display: flex;
              justify-content: space-between;
              width: 500px;
            ">
            <div class="col-6">
              <q-input ref="firstnameRef" dark label-color="white" stack-label color="teal" outlined
                v-model="this.user.firstname" label="First name" style="width: 225px;">
                <template v-slot:append>
                  <q-icon name="account_circle" color="white" />
                </template>
              </q-input>
            </div>

            <div class="col-6">
              <q-input ref="lastnameRef" dark label-color="white" stack-label color="teal" outlined
                v-model="this.user.lastname" label="Last name" style="width: 225px;">
                <template v-slot:append>
                  <q-icon name="account_circle" color="white" />
                </template>
              </q-input>
            </div>
          </div>

          <div style="width: 500px;">
            <q-input ref="usernameRef" dark label-color="white" stack-label color="teal" outlined
              v-model="this.user.username" label="Username">
              <template v-slot:append>
                <q-icon name="account_circle" color="white" />
              </template>
            </q-input>
          </div>

          <div class="col-6" style="width: 500px;">
            <q-input ref="mailRef" dark label-color="white" stack-label color="teal" outlined v-model="this.user.email"
              type="email" label="Email">
              <template v-slot:append>
                <q-icon name="email" color="white" />
              </template>
            </q-input>
          </div>

          <div class="col-6" style="width: 500px;">
            <q-input dark ref="passwordRef" label-color="white" stack-label color="teal" outlined label="Password"
              v-model="this.user.password" :type="isPwd ? 'password' : 'text'">
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd"
                  color="white" />
              </template>
            </q-input>
          </div>

          <div style="
              display: flex;
              justify-content: space-between;
              width: 500px;
              margin-top: 60px;
            ">
            <q-btn label="Cancel" type="reset" unelevated style="
                width: 225px;
                height: 50px;
                background-color: #202740;
                color: #fff;
                text-transform: capitalize;
                border-radius: 20px;
              " />

            <q-btn label="Create account" type="submit" unelevated style="
                width: 225px;
                height: 50px;
                background-color: #59e4d7;
                color: #fff;
                text-transform: capitalize;
                border-radius: 20px;
              " />
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
import { useQuasar } from "quasar";
import userService from "src/services/User"

export default defineComponent({
  name: "RegisterComponent",

  setup() {
    const global = UseGlobal();
    const $q = useQuasar();

    const lastname = ref(null);
    const lastnameRef = ref(null);

    const firstname = ref(null);
    const firstnameRef = ref(null);

    const username = ref(null);
    const usernameRef = ref(null);

    const mail = ref(null);
    const mailRef = ref(null);

    const password = ref(null);
    const passwordRef = ref(null);

    const accept = ref(false);

    return {
      // password: ref(''),
      isPwd: ref(true),
      global,

      firstname,
      firstnameRef,
      lastname,
      lastnameRef,
      username,
      usernameRef,
      mail,
      mailRef,
      password: ref(""),
      passwordRef,

      accept,

      onSubmit() {
        firstnameRef.value.validate();
        lastnameRef.value.validate();
        usernameRef.value.validate();
        mailRef.value.validate();
        passwordRef.value.validate();
      },

      onReset() {
        lastname.value = null;
        lastnameRef.value.resetValidation();
        firstname.value = null;
        firstnameRef.value.resetValidation();
        username.value = null;
        usernameRef.value.resetValidation();
        mail.value = null;
        mailRef.value.resetValidation();
        password.value = null;
        passwordRef.value.resetValidation();
      },
      showNotify() {
        $q.notify({
          message: "Please fill all the fields",
          color: "#fff",
          textColor: "red",
          position: "top",
          timeout: 2000,
        });
      }
    };
  },
  components: {},
  data() {
    return {
      tab: "home",
      text: "",
      hover: false,
      user: {
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
      },
    };
  },
  computed: {
    changeColor() {
      return this.hover ? "purple" : "white"
    }
  },
  methods: {
    register() {
      userService.register(this.user).then(
        (res) => {
          alert("You are registered");
          this.$router.push("/login");
        },
        (err) => {
          this.showNotify();
        }
      );
    },
    goBack() {
      this.$router.push("/");
    },
  },
  mounted() { },
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
