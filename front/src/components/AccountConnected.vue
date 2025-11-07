<template>
  <div
    style="
      padding: 25px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      height: 100vh;
    "
  >
    <div class="col-12 items-center row">
      <div class="col-6 row justify-start">
        <span class="WorkBold col-12" style="color: white; font-size: 36px"
          >Account</span
        >
        <span class="WorkSans col-12" style="color: #acb5ca; font-size: 14px"
          >Your account available at will</span
        >
      </div>
      <div class="col-6 row justify-end">
        <q-avatar size="42px">
          <img :src="userAvatar" />
        </q-avatar>
        <q-btn flat dense round color="white" icon="expand_more">
          <q-menu
            transition-show="jump-down"
            transition-hide="jump-up"
            style="background-color: #202740"
          >
            <q-list style="min-width: 100px">
              <q-item clickable style="color: red" @click="logout">
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </div>
    <div class="WorkSans" style="z-index: 999; height: 100%">
      <div
        style="
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          gap: 50px;
          height: 100%;
        "
      >
        <div style="display: flex; flex-direction: column; margin-bottom: 30px">
          <div class="avatarSection">
            <q-avatar size="150px">
              <img :src="userAvatar" />
            </q-avatar>
            <div class="btnAvatar">
              <q-file
                outlined
                v-model="file"
                style="
                  background-color: #59e4d7;
                  border: none;
                  box-shadow: none;
                  max-width: 185px;
                  color: #fff;
                  border-radius: 20px;
                "
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
              <q-btn
                label="Confirm"
                type="submit"
                unelevated
                @click="upload"
                style="
                  width: 185px;
                  height: 48px;
                  background-color: #202740;
                  color: #fff;
                  text-transform: capitalize;
                  border-radius: 20px;
                "
              />
            </div>
          </div>
          <p
            style="
              color: #fff;
              width: 80%;
              margin: 0;
              font-size: 12px;
              font-weight: 400;
              margin-left: 100px;
            "
          >
            Add an avatar. The recommended size is 256x256px
          </p>
        </div>

        <form @submit.prevent.stop="updateUser" class="q-gutter-md">
          <div
            style="display: flex; justify-content: space-between; width: 500px"
          >
            <div class="col-6">
              <q-input
                ref="firstnameRef"
                dark
                label-color="white"
                stack-label
                color="teal"
                outlined
                v-model="user.firstname"
                label="First name"
                style="width: 225px; height: 40px"
              >
                <template v-slot:append>
                  <q-icon name="account_circle" color="white" />
                </template>
              </q-input>
            </div>

            <div class="col-6">
              <q-input
                ref="lastnameRef"
                dark
                label-color="white"
                stack-label
                color="teal"
                outlined
                v-model="user.lastname"
                label="Last name"
                style="width: 225px; height: 40px"
              >
                <template v-slot:append>
                  <q-icon name="account_circle" color="white" />
                </template>
              </q-input>
            </div>
          </div>

          <div style="width: 500px">
            <q-input
              ref="usernameRef"
              dark
              label-color="white"
              stack-label
              color="teal"
              outlined
              v-model="user.username"
              label="Username"
              style="height: 40px; margin-top: 25px"
            >
              <template v-slot:append>
                <q-icon name="account_circle" color="white" />
              </template>
            </q-input>
          </div>

          <div class="col-6" style="width: 500px">
            <q-input
              ref="mailRef"
              dark
              label-color="white"
              stack-label
              color="teal"
              outlined
              v-model="user.email"
              type="email"
              label="Email"
              style="height: 40px; margin-top: 25px"
            >
              <template v-slot:append>
                <q-icon name="email" color="white" />
              </template>
            </q-input>
          </div>

          <div class="col-6" style="width: 500px">
            <q-input
              dark
              ref="passwordRef"
              label-color="white"
              stack-label
              color="teal"
              outlined
              label="Password"
              v-model="user.password"
              :type="isPwd ? 'password' : 'text'"
              style="height: 40px; margin-top: 25px"
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

          <div class="col-6" style="width: 500px">
            <q-input
              ref="cityRef"
              dark
              label-color="white"
              stack-label
              color="teal"
              outlined
              v-model="user.city"
              label="City"
              style="height: 40px; margin-top: 25px"
            >
              <template v-slot:append>
                <q-icon name="account_circle" color="white" />
              </template>
            </q-input>
          </div>

          <div class="col-6" style="width: 500px">
            <q-input
              ref="addressRef"
              dark
              label-color="white"
              stack-label
              color="teal"
              outlined
              v-model="user.address"
              label="Address"
              style="height: 40px; margin-top: 25px"
            >
              <template v-slot:append>
                <q-icon name="account_circle" color="white" />
              </template>
            </q-input>
          </div>

          <div class="col-6" style="width: 500px">
            <q-input
              ref="phoneRef"
              dark
              label-color="white"
              stack-label
              color="teal"
              outlined
              v-model="user.phone"
              label="Phone"
              style="height: 40px; margin-top: 25px"
            >
              <template v-slot:append>
                <q-icon name="account_circle" color="white" />
              </template>
            </q-input>
          </div>

          <div
            style="
              display: flex;
              justify-content: space-between;
              width: 500px;
              margin-top: 40px;
            "
          >
            <q-btn
              label="Update account"
              type="submit"
              unelevated
              style="
                width: 205px;
                height: 45px;
                margin-left: 140px;
                background-color: #59e4d7;
                color: #fff;
                text-transform: capitalize;
                border-radius: 20px;
              "
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { UseGlobal } from "stores/global";
import { ref } from "vue";
import { useQuasar } from "quasar";
import userService from "src/services/User";
import URL from "src/helpers/Contants";
import createLogger from "src/utils/logger";

const logger = createLogger("account-connected");
export default {
  name: "AccountConnected",
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
    };
  },
  components: {},
  data() {
    return {
      tab: "home",
      text: "",
      user: {
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
      },
      account: true,
      router: this.$router,
      file: null,
      defaultAvatar: "https://cdn.quasar.dev/img/avatar2.jpg",
    };
  },
  methods: {
    async updateUser(id, user) {
      id = this.global.accessToken[1];
      userService
        .updateUser(id, this.user, {
          data: {
            firstname: this.user.firstname,
            lastname: this.user.lastname,
            username: this.user.username,
            email: this.user.email,
            password: this.user.password,
          },
        })
        .then(() => {
          this.$q.notify({
            message: "Profil mis à jour",
            color: "positive",
          });
        })
        .catch((err) => {
          logger.error("Unable to update user profile", err);
          this.$q.notify({
            message: "Impossible de mettre à jour le profil",
            color: "negative",
          });
        });
    },
    async upload() {
      const user_id = this.global.accessToken[1];
      const formData = new FormData();
      formData.append("user_id", user_id);
      formData.append("file", this.file);
      userService
        .uploadFile(formData)
        .then((res) => {
          this.getUser();
          logger.info("Avatar uploaded", { user_id });
        })
        .catch((err) => {
          logger.error("Unable to upload avatar", err);
        });
    },
    logout() {
      sessionStorage.clear();
      this.global.accessToken = "";
      this.account = false;
      this.router.push({ path: `/login` });
    },
    getUser() {
      userService
        .getUser(this.global.accessToken[1])
        .then((response) => {
          this.user = response.data.data;
        })
        .catch((error) => {
          logger.error("Unable to fetch user", error);
        });
    },
  },
  computed: {
    userAvatar() {
      return this.user?.picture?.path
        ? URL.buildAssetUrl(this.user.picture.path)
        : this.defaultAvatar;
    },
  },
  mounted() {
    this.getUser();
  },
};
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
.avatarSection {
  display: flex;
  margin: 0 0 20px 60px;
}
.btnAvatar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 18px 40px;
}
.avatarDrop {
  position: fixed;
  top: 40px;
  right: 50px;
}
.backImg {
  position: fixed;
  top: 105px;
  right: 5px;
  opacity: 0.3;
}
</style>
