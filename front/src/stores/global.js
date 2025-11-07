import { defineStore } from 'pinia';

export const UseGlobal = defineStore('global', {
  state: () => ({
    tab: "home",
    step: 1,
    stepConnected: 1,
    accessToken: "",
  }),
  getters: {
    getAccessToken(state) {
      return state.accessToken
    },
  },
  actions: {
    setAccessToken(accessToken) {
      this.accessToken = accessToken;
    },
    logout() {
      // CLEAN SESSION
      this.global.accessToken = [];
      this.$router.push("/login");
    }
  },
  persist: {
    storage: sessionStorage,
    paths: ['accessToken'],
  }
});
