<template>
  <div class="col-12 items-center row q-px-lg">
    <SuccessBar :isActive="this.isActiveSuccess" :message="this.message" />
    <ErrorBar :isActive="this.isActiveError" :message="this.message" />
    <div class="col-6 row justify-start">
      <span class="WorkBold col-12" style="color: white; font-size: 36px"
        >Dashboard</span
      >
      <span class="WorkSans col-12" style="color: #acb5ca; font-size: 14px"
        >With all of necessary tools in today’s market</span
      >
    </div>
    <div class="col-6 row justify-end">
      <q-avatar size="42px">
        <img :src="userAvatar" />
      </q-avatar>
      <q-btn flat dense round color="white" icon="expand_more">
        <q-menu
          class="menu-margin"
          transition-show="jump-down"
          transition-hide="jump-up"
          style="background-color: #202740"
        >
          <q-list style="min-width: 100px">
            <q-separator style="background-color: #acb5ca" />
            <q-item clickable style="color: red" @click="logout">
              <q-item-section>Logout</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>
  <div class="col-12 items-center row q-gutter-md q-px-lg q-pt-lg">
    <q-card v-for="(item, index) in this.topCryptos" :key="index" class="topCrypto">
      <q-card-section class="imgTopCrypto">
        <div class="img">
          <img :src="item.pathImage" class="cryptoImg" alt="image" />
        </div>
      </q-card-section>
      <q-card-section class="descTopCrypto">
        <span class="cryptoSymbol" style="color: #c9c9c9; font-size: 12px">{{
          item["symbol"]
        }}</span>
        <div class="priceAndVariation">
          <span class="cryptoPrice" style="color: white">${{ item["price"] }}</span>
          <span class="cryptoVariation" v-bind:class="{ 'negative': item['variation'] < 0 }"
            v-if="item['variation'] < 0">{{ item["variation"] }}</span>
          <span class="cryptoVariation" v-bind:class="{ 'positive': item['variation'] > 0 }" v-else>{{
            item["variation"]
          }}</span>
        </div>
      </q-card-section>
    </q-card>
  </div>
  <div class="row col-12 justify-start">
    <div class="q-pl-lg col-9">
      <Chart :crypto="this.crypto" />
    </div>
    <div class="row col-3 q-pt-lg q-mt-sm justify-center items-center">
      <q-card class="my-card">
        <q-card-section>
          <span class="WorkSans" style="font-size: 20px; color: #acb5ca">Stats</span>
        </q-card-section>
        <q-card-section v-ripple class="q-py-none">
          <div class="col-12 row items-center" style="
              background-color: rgba(171, 33, 236, 0.6);
              border-radius: 12px;
            ">
            <div class="col-4">
              <q-icon class="q-pt-sm" name="img:/icons/cryptoRight.svg" size="70px" />
            </div>
            <div class="col-8 row justify-center">
              <span class="WorkSans col-12" style="color: #acb5ca; font-size: 18px">Cryptos</span>
              <span class="WorkSans col-12" style="color: #acb5ca; font-size: 12px">{{ this.cryptos.length }}</span>
            </div>
          </div>
        </q-card-section>
        <q-card-section v-ripple class="q-pt-none">
          <div
            class="col-12 q-mt-md row items-center"
            style="
              background-color: rgba(89, 228, 215, 0.6);
              border-radius: 12px;
            "
          >
            <div class="col-4">
              <q-icon
                class="q-pt-sm"
                name="img:/icons/userRight.svg"
                size="70px"
              />
            </div>
            <div class="col-8 row justify-center">
              <span
                class="WorkSans col-12"
                style="color: #acb5ca; font-size: 18px"
                >Total Users</span
              >
              <span
                class="WorkSans col-12"
                style="color: #acb5ca; font-size: 12px"
                >{{ this.users.length }}</span
              >
            </div>
          </div>
        </q-card-section>
      </q-card>
      <div class="q-mt-lg q-px-md q-py-md my-card"
        style="border-radius: 3px; height: 50vh;">
        <div>
          <span class="WorkSans" style="font-size: 20px; color: #acb5ca"
            >Top News</span
          >
        </div>
        <div class="topNewsContent">
          <q-card
            v-for="(item, index) in this.news"
            :key="index"
            class="newCards"
            flat
            bordered
            @click.prevent="goNewsShow(item.id)"
          >
            <q-card-section horizontal class="newCards">
              <div class="img">
                <img :src="item.image" class="newsImg" alt="image" />
              </div>
              <div class="description">
                <span
                  class="titleNews"
                  style="color: #acb5ca; font-size: 11px"
                  >{{ item["title"] }}</span
                >
                <span class="dateNews" style="font-size: 10px">{{
                  item["date"]
                }}</span>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </div>
  <div class="col-12 q-pt-lg q-pl-lg justify-between row" style="margin-top: -216px">
    <div class="col-9">
      <span class="WorkSans col-12" style="color: white; font-size: 24px"
        >Market Listing</span
      >
      <div class="q-pt-md q-mb-md grid gridDash">
        <ag-grid-vue
          class="ag-theme-alpine-dark"
          :columnDefs="columnDefs.value"
          :rowData="rowData.value"
          :defaultColDef="defaultColDef"
          animateRows="true"
          @grid-ready="onGridReady"
          pagination="true"
          paginationPageSize="40"
          rowSelection="multiple"
          @click="rowSelected"
          :gridOptions="gridOptions"
        >
        </ag-grid-vue>

      </div>
    </div>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3"; // the AG Grid Vue Component
import { reactive, onMounted, ref } from "vue";
import cryptoService from "src/services/Crypto";
import bookmarkService from "src/services/Bookmark";
import newsService from "src/services/News";
import userService from "src/services/User";
import URL from "src/helpers/Contants";
import { renderCryptoIcon } from "src/utils/cryptoIconRenderer";
import createLogger from "src/utils/logger";

const logger = createLogger("dashboard");

import Chart from "src/components/Chart/CandleStick/CandleStickChart.vue";
import SuccessBar from "src/components/SnackBar/SuccessBar.vue";
import ErrorBar from "src/components/SnackBar/ErrorBar.vue";

import { UseGlobal } from "stores/global";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

export default {
  name: "App",
  components: {
    AgGridVue,
    Chart,
    SuccessBar,
    ErrorBar,
  },
  setup() {
    const global = UseGlobal();
    const rowData = reactive({});
    const columnDefs = reactive({
      value: [
        {
          field: "picture.path",
          headerName: "",
          width: 10,
          sortable: false,
          filter: false,
          cellRenderer: renderCryptoIcon,
        },
        {
          field: "symbol",
          headerName: "Name",
          headerAlign: "center",
          filter: "agTextColumnFilter",
          filterParams: {
            filterOptions: ["contains", "notContains", "startsWith", "blank"],
            defaultOption: "contains",
            buttons: ["reset"],
          },
          cellRenderer: function (params) {
            return `<span>${params.value.slice(0, -4)}</span>`;
          },
        },
        {
          field: "price",
          headerName: "Price",
          filter: "agNumberColumnFilter",
          filterParams: {
            filterOptions: ["equals", "lessThan", "greaterThan", "inRange"],
            defaultOption: "contains",
            buttons: ["reset"],
          },
          cellRenderer: function (params) {
            return `<span>$${params.value}</span>`;
          },
        },
        { field: "volume", headerName: "Volume in 24 H" },
        {
          field: "variation",
          headerName: "Variation",
          filter: "agNumberColumnFilter",
          filterParams: {
            filterOptions: ["equals", "lessThan", "greaterThan", "inRange"],
            defaultOption: "contains",
            buttons: ["reset"],
          },
          cellRenderer: function (params) {
            let color = params.value <= 0 ? "#a34040" : "#35bf35";
            return (
              '<span style="color:' + color + '">' + params.value + "</span>"
            );
          },
        },
      ],
    });

    const defaultColDef = {
      sortable: true,
      filter: true,
      flex: 1,
      pagination: true,
      paginationPageSize: "40",
      resizable: true,
    };

    onMounted(() => {
      cryptoService
        .getAllCryptos()
        .then((response) => {
          rowData.value = response.data.data;
        })
        .catch((err) => {
          logger.error("Unable to load cryptos for grid", err);
        });
    });

    return {
      global,
      rowSelection: null,
      columnDefs,
      rowData,
      defaultColDef,
    };
  },
  data() {
    return {
      crypto: [],
      cryptoc: [],
      selectedCrypto: [],
      arrayOfBookmarkId: [],
      cryptosGrid: [],
      matchWithBookmark: [],
      indexInDB: [],
      newsId: "",
      user: {},
      users: {},
      news: [],
      cryptos: [],
      topCryptos: [],
      router: this.$router,
      gridOptions: {
        undoRedoCellEditing: true,
        undoRedoCellEditingLimit: 10,
      },
      isActiveSuccess: false,
      isActiveError: false,
      message: "",
      defaultAvatar: "https://cdn.quasar.dev/img/avatar2.jpg",
    };
  },
  methods: {
    sizeToFit() {
      this.gridApi.sizeColumnsToFit();
    },

    getAllUsers() {
      userService
        .getAllUsers()
        .then((response) => {
          this.users = response.data.data;
        })
        .catch((err) => {
          logger.error("Unable to load users list", err);
        });
    },
    getCryptoLength() {
      cryptoService
        .getAllCryptos()
        .then((response) => {
          this.cryptos = response.data.data;
          return this.cryptos;
        })
        .catch((err) => {
          logger.error("Unable to load crypto collection", err);
        });
    },
    getUser() {
      userService
        .getUser(this.global.accessToken[1])
        .then((response) => {
          this.user = response.data.data;
          return this.user;
        })
        .catch((err) => {
          logger.error("Unable to fetch current user", err);
        });
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridOptions;
    },
    logout() {
      sessionStorage.clear();
      this.global.accessToken = "";
      this.account = false;
      this.router.push({ path: `/login` });
    },
    rowSelected() {
      let crypto = this.gridApi.getSelectedRows().flat();
      this.crypto = crypto[0];
      this.selectedCryptos = crypto.map((c) => c.id);
    },

    async postBookmark() {
      let cryptoIds = [];
      let userId = this.global.accessToken[1];
      cryptoIds = this.selectedCryptos;
      logger.debug("Selected cryptos for bookmarking", this.selectedCryptos);
      if (this.selectedCryptos === undefined) {
        this.isActiveError = true;
        this.message = "Please select a crypto to bookmark";
        setTimeout(() => {
          this.isActiveError = false;
        }, 2000);
      }
      if (typeof cryptoIds !== "undefined" && cryptoIds.length > 0) {
        cryptoIds.forEach((cryptoId) => {
          bookmarkService
            .addCryptoToUserBookmarks(userId, cryptoId)
            .then((response) => {
              this.isActiveSuccess = true;
              this.message = "Bookmark added successfully";
              setTimeout(() => {
                this.isActiveSuccess = false;
              }, 2000);
            })
            .catch((err) => {
              logger.warn("Unable to add bookmark", err);
            });
        });
      }
    },
    async getTopCrypto() {
      cryptoService
        .getAllCryptos()
        .then((response) => {
          this.crypto = response.data.data;
          let findSymbol = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "XMRUSDT"];
          let topBeforeImage = response.data.data.filter((obj) =>
            findSymbol.includes(obj.symbol)
          );
          this.topCryptos = topBeforeImage.map((item) => {
            item.pathImage = "/icons/crypto-" + item.symbol + ".svg";
            item.symbol = item.symbol.slice(0, -4);
            return item;
          });
        })
        .catch((err) => {
          logger.error("Unable to compute top cryptos", err);
        });
    },
    color() {
      return this.value > 0 ? "green" : "black";
    },
    async deleteBookmark() {
      let cryptoIds = [];
      let userId = this.global.accessToken[1];
      cryptoIds = this.selectedCryptos;
      if (typeof cryptoIds !== "undefined" && cryptoIds.length > 0) {
        cryptoIds.forEach((cryptoId) => {
          bookmarkService.removeCryptoFromUserBookmarks(userId, cryptoId);
          this.isActiveSuccess = true;
          this.message = "Bookmark deleted";
          setTimeout(() => {
            this.isActiveSuccess = false;
          }, 2000);
        });
      }
      this.isActiveError = true;
      this.message = "Please select a crypto to delete";
      setTimeout(() => {
        this.isActiveError = false;
      }, 2000);
    },
    async getAllBookmarksOfUser() {
      let userId = this.global.accessToken[1];
      bookmarkService
        .getAllBookmarksOfUser(userId)
        .then((response) => {
          this.arrayOfBookmarkId = response.data.data.map((i) => i.crypto_id);
          this.gridApi.forEachNode((rowNode, index) => {
            if (this.arrayOfBookmarkId.includes(rowNode.data.id)) {
              this.indexInDB.push(index);
            }
          });
        })
        .catch((err) => {
          logger.warn("Unable to load bookmark indices", err);
        });
    },
    async getTopNews() {
      newsService
        .getAllNews()
        .then((response) => {
          let topNews = response.data.data;
          this.news = topNews.slice(0, 3).map((item) => {
            item.image = "/icons/news-" + item.id + ".jpg";
            item.date = item.pubDate.slice(0, -9);

            return item;
          });
        })
        .catch((err) => {
          logger.error("Unable to load top news", err);
        });
    },
    async goNewsShow(newsId) {
      this.newsId;
      const response = await newsService.getOneNews(newsId);
      const data = response.data.data;
      this.router.push({ path: `/news/${newsId}` });
    },
    undo() {
      this.gridOptions.api.undoRedoCellEditing();
    }
  },
  computed: {
    userAvatar() {
      return this.user?.picture?.path
        ? URL.buildAssetUrl(this.user.picture.path)
        : this.defaultAvatar;
    },
  },
  mounted() {
    this.getAllBookmarksOfUser();
    this.getTopNews();
    this.getAllUsers();
    this.getCryptoLength();
    this.getTopCrypto();
    this.getUser();
  },
};
</script>

<style lang="scss">
.menu-margin {
  top: 70px !important;
  left: 1410px !important;
  width: 75px !important;
  overflow: hidden !important;
}
.ag-cell-value.ag-cell.ag-cell-not-inline-editing.ag-cell-normal-height.ag-cell-focus:focus-within {
  border: none;
}
.chart {
  width: 100% !important;
  height: 50vh;
  background-color: #222628;
}
.my-card {
  background-color: #202740;
}
.newsImg {
  height: 150px;
}
.newCards {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #11191f;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
  height: 12vh;
  padding: 1px;
  cursor: pointer;
}
.topNewsContent {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: space-around;
  height: 88%;
}
.img {
  width: 42%;
  height: 100%;
  background-size: cover;
  overflow: hidden;
  border-radius: 12px 0 0 12px;
}
.description {
  overflow: hidden;
  width: 55%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: space-around;
}
.titleNews {
  font-weight: bold;
  margin: 0 8px 8px 2px;
}
.dateNews {
  color: #59e4d7;
  margin: 0 0 0 2px;
}
.topCrypto {
  display: flex;
  justify-content: space-around;
  background-color: #202740;
  width: 285px;
  height: 90px;
  border-radius: 12px;
}
.imgTopCrypto {
  width: 40%;
  padding: 0;
}
.imgTopCrypto .img {
  margin: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.imgTopCrypto img {
  height: 64px;
}
.descTopCrypto {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
  padding: 0 !important;
}
.cryptoSymbol {
  font-size: 22px !important;
  padding: 0 0 0 5px;
}
.priceAndVariation {
  display: flex;
  justify-content: space-between;
  padding: 0 30px 0px 0;
}
.cryptoIcon {
  height: 28px;
  width: 28px;
  margin: 6px 0 0 60px;
}
.gridDash .ag-root-wrapper.ag-layout-normal.ag-ltr {
  height:auto;
}
.gridDash .ag-root-wrapper-body.ag-layout-normal.ag-focus-managed {
  height:auto;
}
.negative {
  color: #ff0000;
}
.positive {
  color: #00ff00;
}
</style>
