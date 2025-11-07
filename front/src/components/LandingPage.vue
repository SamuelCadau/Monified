<template>
  <div id="header" class="WorkSans">
    <q-img
      src="/background.png"
      style="
      position: absolute; top: -100px;
      "
    />

    <div class="col-12 row" style="height: 100vh">
      <div class="col-6" style="display: flex; align-items: center; padding-left: 50px;">
        <div style="width: 100%; display: flex; flex-direction: column; gap: 20px;">
            <p style="color: #59E4D7; font-size: 15px; letter-spacing: 5px;">BUILT ON WEB3. POWERED BY YOU.</p>
            <h2 style="font-size:60px; color: #fff; margin: 0; line-height: 100px; width: 800px;">The Crypto Currency Dashboard Is Here</h2>
            <p style="color: #ACB5CA; width: 500px;">Leverage on any tokens with a protocol trusted with billions for its performance and reliability.</p>
            <q-btn unelevated rounded style="background-color: #59E4D7; color: #000; text-transform: capitalize; width: 170px; height: 50px; font-size: 16px; font-weight: bold;" label="Discover" @click="goToLogin" />
        </div>
      </div>

      <div class="col-6">
        <q-img src="/bitcoin_card_top.png" style="
        width: 22%;
        left: 120px;
        top: 140px;
        " />

        <q-img src="/etherum_card_top.png" style="
        width: 25%;
        top: 260px;
        left: 450px;"/>

        <q-img src="/binance_card_top.png" style="
        width: 25%;
        top: 600px;
        left: -100px;"/>
      </div>
    </div>
    <div style="display: flex; flex-direction: column; margin-top: 80px; gap: 80px;">
    <CountHome/>
    <LogoCrypto/>
    <TabsCrypto/>
    </div>
</div>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import { UseGlobal } from "stores/global";
import CountHome from "src/components/CountHome.vue"
import LogoCrypto from "src/components/LogoCrypto.vue"
import TabsCrypto from "src/components/TabsCrypto.vue"
import { RouterLink } from "vue-router";

export default defineComponent({
  name: "LandingPage",
  setup() {
    const global = UseGlobal();
    return {
      global,
    };
  },
  components: {
    CountHome,
    LogoCrypto,
    TabsCrypto,
  },
  data() {
    return {
      tab: "home",
      token: [],
    };
  },
  methods: {
    goToLogin() {
      this.$router.push("/login");
    },
  },
  mounted() {},
});
</script>

<style scoped>
.q-layout__section--marginal {
  background-color: rgba(0, 0, 0, 0);
}

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
</style>
