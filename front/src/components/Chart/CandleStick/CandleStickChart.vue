<template>
  <div class="container">
    <div class="top">
      <p class="title">Overall Growth</p>
      <div class="crypto">
        <div class="circle" />
        <p class="text">{{ crypto.symbol || this.bitcoin.symbol }}</p>
      </div>
      <div class="date-box" v-if="this.checkCryptoProperties(this.crypto)">
        <div class="date" @click="setSeries4h">4H</div>
        <div class="date" @click="setSeries1d">1D</div>
        <div class="date" @click="setSeries1w">1W</div>
        <div class="date" @click="setSeries1m">1M</div>
      </div>
      <div class="date-box" v-if="!this.checkCryptoProperties(this.crypto)">
        <div class="date" @click="setBtcSeries4h">4h</div>
        <div class="date" @click="setBtcSeries1d">1d</div>
        <div class="date" @click="setBtcSeries1w">1w</div>
        <div class="date" @click="setBtcSeries1m">1m</div>
      </div>
    </div>
    <div class="middle">
      <div class="chart">
        <apexchart type="candlestick" height="350" :options="chartOptions" :series="series"></apexchart>
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import { defineComponent } from "vue";
import { UseGlobal } from "stores/global";
import cryptoService from "src/services/Crypto";
import createLogger from "src/utils/logger";

const logger = createLogger("candlestick-chart");

export default defineComponent({
  name: "CandleStickChart",
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    crypto: {
      type: Object,
      required: true,
      default: null,
    },
  },
  watch: {
    crypto: {
      handler: function (newVal, oldVal) {
        this.setSeries1d();
      },
    },
  },
  setup() {
    const global = UseGlobal();
    return {
      global,
    };
  },
  data() {
    return {
      tab: "home",
      chart: {},
      series: [],
      bitcoin: {},
      chartOptions: {
        chart: {
          type: "candlestick",
          height: 600,
          toolbar: {
            show: true,
          },
          background: "#202740",
        },
        tooltip: {
          enabled: false,
        },
        annotations: {
          xaxis: [
            {
              x: "Oct 06 14:00",
              borderColor: "#00E396",
              label: {
                borderColor: "#00E396",
                style: {
                  fontSize: "8px",
                  color: "#fff",
                  background: "#00E396",
                },
                orientation: "horizontal",
                offsetY: 7,
                text: "Annotation Test",
              },
            },
          ],
        },
        xaxis: {
          type: "category",
          tickPlacement: "none",
          labels: { show: false },
        },
        yaxis: {
          labels: { show: false },
        },
        grid: {
          show: false,
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100],
          },
        },
      },
    };
  },
  methods: {
    setSeries4h() {
      if (this.crypto === {}) {
        return;
      }
      this.series = [
        {
          data: this.crypto?.historic?.fourHour.map((item) => {
            return {
              x: item.Time,
              y: [item.Open, item.High, item.Low, item.Close],
            };
          }),
        },
      ];
    },
    setSeries1d() {
      if (this.crypto === {}) {
        return;
      }
      this.series = [
        {
          data: this.crypto?.historic?.day.map((item) => {
            return {
              x: item.Time,
              y: [item.Open, item.High, item.Low, item.Close],
            };
          }),
        },
      ];
    },
    setSeries1w() {
      if (this.crypto === {}) {
        return;
      }
      this.series = [
        {
          data: this.crypto?.historic?.week.map((item) => {
            return {
              x: item.Time,
              y: [item.Open, item.High, item.Low, item.Close],
            };
          }),
        },
      ];
    },
    setSeries1m() {
      if (this.crypto === {}) {
        return;
      }
      this.series = [
        {
          data: this.crypto?.historic?.oneMonth.map((item) => {
            return {
              x: item.Time,
              y: [item.Open, item.High, item.Low, item.Close],
            };
          }),
        },
      ];
    },
    getBtc() {
      cryptoService
        .getBitcoin()
        .then((res) => {
          this.bitcoin = res.data.data;
          this.series = [
            {
              data: res.data.data.historic.week.map((item) => {
                return {
                  x: item.Time,
                  y: [item.Open, item.High, item.Low, item.Close],
                };
              }),
            },
          ];
        })
        .catch((err) => {
          logger.error("Unable to fetch bitcoin history", err);
        });
    },
    setBtcSeries4h() {
      this.series = [
        {
          data: this.bitcoin?.historic?.fourHour.map((item) => {
            return {
              x: item.Time,
              y: [item.Open, item.High, item.Low, item.Close],
            };
          }),
        },
      ];
    },
    setBtcSeries1d() {
      this.series = [
        {
          data: this.bitcoin?.historic?.day.map((item) => {
            return {
              x: item.Time,
              y: [item.Open, item.High, item.Low, item.Close],
            };
          }),
        },
      ];
    },
    setBtcSeries1w() {
      this.series = [
        {
          data: this.bitcoin?.historic?.week.map((item) => {
            return {
              x: item.Time,
              y: [item.Open, item.High, item.Low, item.Close],
            };
          }),
        },
      ];
    },
    setBtcSeries1m() {
      this.series = [
        {
          data: this.bitcoin?.historic?.oneMonth.map((item) => {
            return {
              x: item.Time,
              y: [item.Open, item.High, item.Low, item.Close],
            };
          }),
        },
      ];
    },
    checkCryptoProperties(crypto) {
      if (crypto.hasOwnProperty("symbol")) {
        return true;
      } else {
        return false;
      }
    },
  },
  mounted() {
    this.getBtc();
  },
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Work+Sans&display=swap");

.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  font-family: "Work Sans", sans-serif;
}

.top {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100px;
}

.title {
  font-size: 24px;
  font-weight: 500;
  color: #fff;
  margin: 0;
}

.text {
  font-size: 15px;
  font-weight: 500;
  color: #ab21ec;
  margin: 0;
}

.crypto {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #ab21ec;
}

.date-box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.date {
  font-size: 13px;
  font-weight: 300;
  color: #acb5ca;
  width: 52px;
  height: 37px;
  background-color: #202740;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  cursor: pointer;
}

.date:hover {
  background-color: #2b344e;
  transition: 0.5s;
}

.chart {
  color: #fff;
}
.apexcharts-tooltip {
  background: #f3f3f3;
  color: orange;
}
</style>
