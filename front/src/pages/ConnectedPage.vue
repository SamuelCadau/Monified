<template>
  <div v-if="global.accessToken">
    <q-stepper ref="stepper" v-model="global.stepConnected" flat animated>
      <q-step
        title="step"
        class="fit bg-primary"
        :name="1"
        :done="global.stepConnected > 1"
      >
        <DashboardConnected />
      </q-step>
      <q-step
        title="step"
        class="fit bg-primary"
        :name="2"
        :done="global.stepConnected > 2"
        flat animated
      >
        <NewsConnected />
      </q-step>
      <q-step
        title="step"
        class="fit bg-primary"
        :name="3"
        :done="global.stepConnected > 3"
        flat animated
      >
        <CryptoConnected />
      </q-step>
      <q-step
        title="step"
        class="fit bg-primary"
        :name="4"
        :done="global.stepConnected > 4"
        flat animated
      >
        <AccountConnected />
      </q-step>
      <q-step
        title="step"
        class="fit bg-primary"
        :name="5"
        :done="global.stepConnected > 5"
        flat animated
      >
        <AdminConnected />
      </q-step>
    </q-stepper>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { UseGlobal } from "stores/global";
import DashboardConnected from "src/components/DashboardConnected.vue";
import NewsConnected from "src/components/NewsConnected.vue";
import CryptoConnected from "src/components/CryptoConnected.vue";
import AdminConnected from "src/pages/AdminPage.vue";
import AccountConnected from "src/components/AccountConnected.vue";


export default defineComponent({
  name: "IndexPage",

  setup() {
    const global = UseGlobal();

    return {
      global,
    };
  },
  components: {
    DashboardConnected,
    NewsConnected,
    CryptoConnected,
    AdminConnected,
    AccountConnected
  },
  data() {
    return {
      id: "",
      user: {},
    };
  },
  methods: {


  },
  mounted() {
  },

});
</script>

<style>

.q-stepper__header {
  display: none !important;
}
.q-stepper--horizontal .q-stepper__step-inner {
  padding: 0px;
}


</style>
