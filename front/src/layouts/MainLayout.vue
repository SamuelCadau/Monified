<template>
  <q-layout view="hhh lpR fFf">
    <q-header unelevated class="q-pt-md q-px-xl">
      <q-toolbar class="col-12 row justify-between">
        <q-toolbar-title class="col-3">
          <q-img
            src="/logo_monified.png"
            style="width: 150px;"
          />
        </q-toolbar-title>
        <div class="col-7 flex justify-center">
          <q-tabs indicator-color="transparent" active-color="white" no-caps v-model="global.tab">
            <q-tab class="q-px-lg" name="home" label="Home" @click="global.step = 1" />
            <q-tab class="q-px-lg" name="news" label="News" @click="global.step = 2" />
          </q-tabs>
        </div>
        <div v-if="account == true" class="col-2 flex justify-end items-center">
          <span class="WorkBold q-pr-sm text-subtitle1">JohnDoe</span>
          <q-btn flat dense>
            <q-avatar rounded>
              <img src="https://cdn.quasar.dev/img/avatar.png" /> </q-avatar
          ></q-btn>
        </div>
        <div v-if="account == false" class="col-2 flex justify-end items-center">
          <q-btn label="Register" no-caps unelevated class="WorkSans" style="background-color: #AB21EC; width: 100px; height: 50px; font-size: 17px;" @click="goToRegister" dense></q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container style="padding-top: 0px">
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { UseGlobal } from 'stores/global'

export default defineComponent({
  name: 'MainLayout',
  setup () {
    const global = UseGlobal()
    const account = ref(false)
    const router = useRouter()

    const goToRegister = () => {
      router.push('/register')
    }

    return {
      global,
      account,
      goToRegister
    }
  }
})
</script>

<style scoped>
.q-layout__section--marginal {
  background-color: rgba(0, 0, 0, 0);
}
</style>
