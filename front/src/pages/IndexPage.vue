<template>
  <div>
    <q-stepper ref="stepper" v-model="global.step" flat animated>
      <q-step title="step" class="fit bg-primary" style="min-height: 100vh" :name="1" :done="global.step > 1">
        <LandingPage />
      </q-step>
      <q-step title="step" class="fit bg-primary" style="min-height: 100vh" :name="2" :done="global.step > 2">
      <NewsConnected/>
      </q-step>
    </q-stepper>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import LandingPage from 'src/components/LandingPage.vue';
import { UseGlobal } from "stores/global"
import NewsConnected from 'src/components/NewsConnected.vue';

export default defineComponent({
  name: 'IndexPage',

  setup() {
    const global = UseGlobal()

    return {
      global,
    }
  },
  components: {
    LandingPage,
    NewsConnected,
  }
})
</script>

<style>
.q-stepper__header {
  display: none !important;
}
</style>
