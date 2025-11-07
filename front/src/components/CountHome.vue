<template>
  <div class="s1-container">
    <div class="s1-block-container">
      <div class="s1-block">
        <div class="s1-content-container">
          <h3 class="h3-purple">All-time trade volume</h3>
          <div class="s1-numbers">$<span class="counter">4,200,368,117</span></div>
        </div>
        <div class="s1-gradient-glow-purple"></div>
      </div>
    </div>
    <div class="s1-block-container is-total-trades-block-container">
      <div class="s1-block">
        <div class="s1-content-container">
          <h3 class="h3-green">Total Trades</h3>
          <div class="s1-numbers"><span class="counter">10,434</span></div>
        </div>
        <div class="s1-gradient-glow-green"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "CountHome",
})
</script>

<style scoped>
.s1-container {
  display: flex;
  justify-content: center;
  padding: 120px 0px 60px 0px;
}

.s1-block {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.s1-content-container {
  position: relative;
  z-index: 940;
  width: 100%;
  padding: 30px 30px 40px;
  text-align: center;
}

.h3-purple {
  margin-top: 0px;
  margin-bottom: 20px;
  color: #AB21EC;
  font-size: 19px;
  line-height: 1;
  font-weight: 500;
}

.h3-green {
  margin-top: 0px;
  margin-bottom: 20px;
  color: #59E4D7;
  font-size: 19px;
  line-height: 1;
  font-weight: 500;
}

.s1-numbers {
  font-size: 40px;
  line-height: 1;
  font-weight: 200;
  color: #ACB5CA;
}

.s1-gradient-glow-purple {
  position: absolute;
  z-index: 930;
  width: 90%;
  height: 1px;
  opacity: 0.95;
  background-image: linear-gradient(to right, #AB21EC, #AB21EC 35%, #AB21EC 65%, #AB21EC)
    /* background-image: linear-gradient(to right, #9756ff, #9756ff 35%, #00b3ec 65%, #00b3ec) */
}

.s1-gradient-glow-green {
  position: absolute;
  z-index: 930;
  width: 90%;
  height: 1px;
  opacity: 0.95;
  background-image: linear-gradient(to right, #59E4D7, #59E4D7 35%, #59E4D7 65%, #59E4D7)
}

.s1-block-container {
  width: 33.333333333333336%;
  padding: 16px;
}
</style>
