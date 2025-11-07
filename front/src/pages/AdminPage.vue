<template>
  <div class="adminContainer">
    <div class="adminContent">
      <div class="col-12 items-center headerAdmin row">
        <div class="col-6 row justify-start">
          <span class="WorkBold col-12" style="color: white; font-size: 36px"
            >Control center</span
          >
        </div>
        <div class="col-6 row justify-end">
          <q-avatar size="42px">
            <img :src="avatarUrl" />
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
      <div class="gridAdmin">
        <AdminConnectedForUser />
      </div>
      <div class="gridAdmin">
        <AdminConnectedForNews />
      </div>
      <div class="gridAdmin">
        <AdminConnectedForCrypto />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { UseGlobal } from "stores/global";
import AdminConnectedForCrypto from "src/components/Admin/AdminConnectedForCrypto.vue";
import AdminConnectedForUser from "src/components/Admin/AdminConnectedForUser.vue";
import AdminConnectedForNews from "src/components/Admin/AdminConnectedForNews.vue";
import userService from "src/services/User";
import URL from "src/helpers/Contants";
import createLogger from "src/utils/logger";

const logger = createLogger("admin-page");

export default defineComponent({
  name: "IndexPage",

  setup() {
    const global = UseGlobal();

    return {
      global,
    };
  },
  components: {
    AdminConnectedForUser,
    AdminConnectedForCrypto,
    AdminConnectedForNews,
  },
  data() {
    return {
      user: {},
      defaultAvatar: "https://cdn.quasar.dev/img/avatar2.jpg",
    };
  },
  methods: {
    getUser() {
      userService
        .getUser(this.global.accessToken[1])
        .then((response) => {
          this.user = response.data.data;
          return this.user;
        })
        .catch((error) => {
          logger.warn("Unable to fetch user profile", error);
        });
    },
    logout() {
      sessionStorage.clear();
      this.global.accessToken = "";
      this.account = false;
      this.$router.push({ path: `/login` });
    },
  },
  computed: {
    avatarUrl() {
      return this.user?.picture?.path
        ? URL.buildAssetUrl(this.user.picture.path)
        : this.defaultAvatar;
    },
  },
  mounted() {
    this.getUser();
  },
});
</script>

<style>
.adminContainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%
}
.adminContent {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: space-around;
  width: 90%;
}
.adminContent .gridAdmin {
  width:100%
}
.btnGrid {
  width: 305px;
  height: 60px;
  background-color: rgb(227, 124, 124);
  color: rgb(255, 255, 255);
  text-transform: capitalize;
  border-radius: 20px;
  transition: all 0.3s ease;
  margin: 30px 0 60px 34%;
  font-size: 26px;
}
.btnGrid:hover{
  background-color:rgb(156, 25, 25);
}
.headerAdmin{
  margin: 50px;
}
.gridAdmin h2{
  font-size: 25px;
  color: #dadada;
  font-weight: 500;
}
</style>
