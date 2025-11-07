<template>
  <q-layout
    view="lHh lpr lFf"
    style="background-color: #11191f"
    v-if="global.getAccessToken"
  >
    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      style="background-color: #0e151b"
    >
      <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
        <div class="col-12 row q-ml-lg q-mt-lg">
          <q-img
            class=""
            width="177px"
            height="40px"
            src="/logo-monified2.png"
          />
        </div>
        <q-list class="row q-mt-lg" padding>
          <q-item
            class="col-12 q-pl-lg"
            clickable
            v-ripple
            :active="global.stepConnected === 1"
            @click="global.stepConnected = 1"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon
                size="18px"
                color="white"
                :name="
                  global.stepConnected === 1
                    ? 'img:/icons/dashActive.svg'
                    : 'img:/icons/dash.svg'
                "
              />
            </q-item-section>

            <q-item-section>
              <span
                :style="
                  global.stepConnected === 1 ? 'color: #AB21EC' : 'color: white'
                "
                >Dashboard</span
              >
            </q-item-section>
          </q-item>

          <q-item
            class="col-12 q-pl-lg"
            clickable
            v-ripple
            :active="global.stepConnected === 2"
            @click="global.stepConnected = 2"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon
                size="18px"
                color="white"
                :name="
                  global.stepConnected === 2
                    ? 'img:/icons/newsActive.svg'
                    : 'img:/icons/news.svg'
                "
              />
            </q-item-section>

            <q-item-section>
              <span
                :style="
                  global.stepConnected === 2 ? 'color: #AB21EC' : 'color: white'
                "
                >News</span
              >
            </q-item-section>
          </q-item>

          <q-item
            class="col-12 q-pl-lg"
            clickable
            v-ripple
            :active="global.stepConnected === 3"
            @click="global.stepConnected = 3"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon
                size="18px"
                color="white"
                :name="
                  global.stepConnected === 3
                    ? 'img:/icons/cryptoActive.svg'
                    : 'img:/icons/crypto.svg'
                "
              />
            </q-item-section>

            <q-item-section>
              <span
                :style="
                  global.stepConnected === 3 ? 'color: #AB21EC' : 'color: white'
                "
                >Cryptos</span
              >
            </q-item-section>
          </q-item>

          <q-item
            class="col-12 q-pl-lg"
            clickable
            v-ripple
            :active="global.stepConnected === 4"
            @click="global.stepConnected = 4"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon
                size="18px"
                color="white"
                :name="
                  global.stepConnected === 4
                    ? 'img:/icons/accountActive.svg'
                    : 'img:/icons/account.svg'
                "
              />
            </q-item-section>

            <q-item-section>
              <span
                :style="
                  global.stepConnected === 4 ? 'color: #AB21EC' : 'color: white'
                "
                >Account</span
              >
            </q-item-section>
          </q-item>

          <q-item
            v-if="this.admin === 'admin'"
            class="col-12 q-pl-lg"
            clickable
            v-ripple
            :active="global.stepConnected === 5"
            @click="global.stepConnected = 5"
            active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon
                size="18px"
                color="white"
                :name="
                  global.stepConnected === 5
                    ? 'img:/icons/accountActive.svg'
                    : 'img:/icons/admin.svg'
                "
              />
            </q-item-section>

            <q-item-section>
              <span
                :style="
                  global.stepConnected === 5 ? 'color: #AB21EC' : 'color: white'
                "
                >Admin</span
              >
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import { UseGlobal } from "stores/global";
import userService from "src/services/User";
import createLogger from "src/utils/logger";

const logger = createLogger("connected-layout");

export default defineComponent({
  name: "ConnectedLayout",

  setup() {
    const global = UseGlobal();
    const leftDrawerOpen = ref(false);

    return {
      global,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
  data() {
    return {
      user: {},
      admin: 0,
      role: {},
    };
  },
  methods: {
    getUserGoogle() {
      userService
        .getUserGoogle()
        .then(() => {
          logger.debug("Google user retrieved via session cookie");
        })
        .catch((err) => {
          logger.warn("Unable to fetch Google session", err);
        });
    },
    getUser() {
      // retrieve id from global
      const id = this.global.accessToken[1];
      userService
        .getUser(id)
        .then((res) => {
          this.user = res.data.data;
          if (this.user.role_id === 2) {
            this.admin = "admin";
            return true;
          } else {
            return false;
          }
        })
        .catch((err) => {
          logger.error("Unable to fetch user profile", err);
        });
    },
  },

  mounted() {
    this.getUser();
    this.getUserGoogle();
  },
});
</script>

<style scoped>
.my-menu-link {
  background: #ab21ec26;
}
</style>
