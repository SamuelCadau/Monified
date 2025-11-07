<template>
    <q-layout view="hhh lpR fFf">
      <q-header unelevated class="q-pt-md q-px-xl">
        <q-toolbar class="col-12 row justify-between">
          <q-toolbar-title class="col-3">
            <!-- <span class="WorkBold text-h4">MONI</span>
            <span class="WorkBold text-h4 text-positive">FIED</span> -->
            <q-img
              src="/logo_monified_2.png"
              style="position: absolute; width: 15%;"
              to="/"
            />
          </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-page-container style="padding-top: 0px">
        <router-view />
      </q-page-container>

    </q-layout>
  </template>

  <script>
  import { defineComponent, ref } from 'vue'
  import { UseGlobal } from "stores/global"

  export default defineComponent({
    name: 'RegisterLayout',

    setup() {
      const global = UseGlobal()

      return {
        global,
      }
    },
    data(){
      return {
        account: false,
      }
    }
  })
  </script>

  <style scoped>
  .q-layout__section--marginal {
    background-color: rgba(0, 0, 0, 0);
  }
  </style>
