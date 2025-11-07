<template>
  <div class="row justify-center col-12 items-center">
    <div class="q-px-lg q-mb-lg col-12">
      <div class="col-12 items-center row cryptoNav">
        <div class="col-6 row justify-start">
          <span class="WorkBold col-12" style="color: white; font-size: 36px"
            >Crypto</span
          >
          <span class="WorkSans col-12" style="color: #acb5ca; font-size: 14px"
            >All our crypto repertoried in one place</span
          >
        </div>
        <div class="col-6 row justify-end">
          <q-avatar size="42px">
            <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
          </q-avatar>
          <q-btn flat dense round color="white" icon="expand_more">
            <q-menu
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

      <div class="grid">
        <q-btn
          color="dark"
          class="q-mb-md q-mt-xl q-mr-md"
          outlined
          dark
          label="Add crypto"
          v-show="addButton"
          @click="postBookmark()"
        />
        <q-btn
          color="dark"
          class="q-mb-md q-mt-xl"
          outlined
          dark
          label="Remove crypto"
          v-show="removeButton"
          @click="deleteBookmark()"
        />
        <q-btn
          color="dark"
          class="q-mb-md q-mt-xl"
          outlined
          dark
          label="Show my crypto"
          v-show="showButton"
          @click="onClick(), getAllBookmarksOfUser()"
        />
        <ag-grid-vue
          ref="agGrid"
          class="ag-theme-alpine-dark"
          style="height: 80vh"
          :columnDefs="columnDefs.value"
          :rowData="rowData.value"
          :defaultColDef="defaultColDef"
          animateRows="true"
          @grid-ready="onGridReady"
          pagination="true"
          paginationPageSize="40"
          rowSelection="multiple"
          :rowMultiSelectWithClick="true"
          @click="rowSelected"
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
import userService from "src/services/User";
import bookmarkService from "src/services/Bookmark";
import createLogger from "src/utils/logger";

import { UseGlobal } from "stores/global";
import { renderCryptoIcon } from "src/utils/cryptoIconRenderer";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { SessionStorage } from "quasar";
import { RowNodeSorter } from "ag-grid-community";

const logger = createLogger("crypto-connected");

export default {
  name: "App",
  components: {
    AgGridVue,
  },
  setup() {
    const global = UseGlobal();
    const gridApi = ref(null);
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
        {
          field: "volume",
          headerName: "Volume in 24 H",
          filter: "agNumberColumnFilter",
          filterParams: {
            filterOptions: ["equals", "lessThan", "greaterThan", "inRange"],
            defaultOption: "contains",
            buttons: ["reset"],
          },
        },
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
              '<span style="color:' + color + '">' + params.value + "%</span>"
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
      paginationPageSize: "10",
    };

    onMounted(() => {
      cryptoService
        .getAllCryptos()
        .then((response) => {
          rowData.value = response.data.data;
        })
        .catch((err) => {
          logger.error("Unable to load cryptos", err);
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
      selectedCrypto: [],
      notSelectedCryptos: [],
      arrayOfBookmarkId: [],
      cryptosGrid: [],
      matchWithBookmark: [],
      indexInDB: [],
      selectedRows: [],
      router: this.$router,
      removeButton: false,
      addButton: false,
      showButton: true,
    };
  },
  computed: {
    deselectedRows() {
      return this.getDeselectedRows();
    },
  },
  watch: {
    selectedRows() {
      this.deselectedRows;
    },
    selectedCryptos: function (newValue, oldValue) {
      this.postBookmark();
    },
    notSelectedCryptos: function (newValue, oldValue) {
      this.deleteBookmark();
    },
  },
  methods: {
    logout() {
      sessionStorage.clear();
      this.global.accessToken = "";
      this.account = false;
      this.router.push({ path: `/login` });
    },
    rowSelected() {
      let selectedRows = this.gridApi.getSelectedRows();
      this.selectedCryptos = selectedRows.map((c) => c.id);
      let lengthTotal = this.rowData.value.map((i) => i.id);
      this.notSelectedCryptos = lengthTotal.filter(
        (val) => !this.selectedCryptos.includes(val)
      );
    },
    getUser() {
      userService
        .getUser(this.global.accessToken[1])
        .then((response) => {
          this.user = response.data.data;
          return this.user;
        })
        .catch((err) => {
          logger.error("Unable to fetch user", err);
        });
    },

    async postBookmark() {
      let cryptoIds = [];
      let userId = this.global.accessToken[1];
      cryptoIds = this.selectedCryptos;
      if (typeof cryptoIds !== "undefined" && cryptoIds.length > 0) {
        cryptoIds.forEach((cryptoId) => {
          bookmarkService
            .addCryptoToUserBookmarks(userId, cryptoId)
            .then((response) => {})
            .catch((err) => {
              logger.warn("Unable to add bookmark", err);
            });
        });
      }
    },
    async deleteBookmark() {
      let cryptoID = [];
      let userId = this.global.accessToken[1];
      cryptoID = this.notSelectedCryptos;
      if (typeof cryptoID !== "undefined" && cryptoID.length > 0) {
        cryptoID.forEach((idCrypto) => {
          bookmarkService
            .removeCryptoFromUserBookmarks(userId, idCrypto)
            .then((response) => {})
            .catch((err) => {
              logger.warn("Unable to remove bookmark", err);
            });
        });
      }
    },
    async getAllBookmarksOfUser() {
      let userId = this.global.accessToken[1];
      bookmarkService
        .getAllBookmarksOfUser(userId)
        .then((response) => {
          this.arrayOfBookmarkId = response.data.data.map((i) => i.crypto_id);
          this.gridApi.forEachNode((rowNode) => {
            if (this.arrayOfBookmarkId.includes(rowNode.data.id)) {
              if (!this.indexInDB.includes(rowNode.rowIndex)) {
                this.indexInDB.push(rowNode.rowIndex);
              }
              rowNode.setSelected(true);
            }
          });
        })
        .catch((err) => {
          logger.warn("Unable to load user bookmarks", err);
        });
    },
    onClick() {
      this.removeButton = true;
      this.addButton = true;
      this.showButton = false;
    },
    async onGridReady(params) {
      this.gridApi = params.api;
      this.gridOptions;
      await this.getAllBookmarksOfUser();
    },
  },
  mounted() {
    this.postBookmark();
    this.deleteBookmark();
  },
};
</script>

<style lang="scss">
.ag-cell-value.ag-cell.ag-cell-not-inline-editing.ag-cell-normal-height.ag-cell-focus:focus-within {
  border: none;
}

::-webkit-scrollbar {
  background: white;
  width: 8px !important;
  height: 10px;
  margin: 5px;
  cursor: pointer;
  border-radius: 5px;
  border: solid 1px #59e4d7;
}

::-webkit-scrollbar-thumb {
  background: #222628;
  width: 20px !important;
  margin: 5px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);

  border-radius: 5px;
  border: 2px solid #202740;
}

::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}
.cryptoIcon {
  height: 28px;
  width: 28px;
  margin: 6px 0 0 60px;
}
.addButton,
.removeButton {
  width: 50%;
  height: 38px;
  margin-top: 35px;
  opacity: 0.4;
  transition: all 0.8s ease;
  border-radius: 8px 8px 0 0;
}
.showButton {
  width: 100%;
  background-color: #2f4593;
  height: 38px;
  margin-top: 35px;
  opacity: 0.4;
  transition: all 0.8s ease;
  border-radius: 8px 8px 0 0;
}
.addButton {
  background-color: rgb(120, 224, 120);
}
.removeButton {
  background-color: rgb(198, 104, 104);
}
.removeButton:hover,
.addButton:hover,
.showButton:hover {
  opacity: 1;
}
.cryptoNav {
  margin-top: 30px;
}
</style>
