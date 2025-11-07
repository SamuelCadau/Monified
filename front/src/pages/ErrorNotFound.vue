<template>
  <div class="fullscreen text-white text-center q-pa-md flex flex-center" style="background-color: #11191F;">
    <div>
    <img src="/error_404.png" width="300" height="300"/>
      <div class="WorkBold" style="color: #59E4D7; font-size: 64px;">
        No results found
      </div>
      <p class="WorkSans" style="font-size: 24px;">We couldn’t find what you searched for.</p>
      
      <q-btn 
      unelevated 
      rounded 
      style="
      background-color: #59E4D7; 
      color: #FFF; 
      text-transform: capitalize; 
      padding: 10px 85px;"
      to="/" 
      label="Home" />

    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorNotFound'
})
</script>

<style>
  .error-404 {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }

  h1 {
    font-size: 2em;
    margin-top: 20px;
  }
</style>
