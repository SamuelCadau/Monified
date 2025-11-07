<template>
  <h2>Manage crypto on Monified</h2>

  <div class="grid">
    <ag-grid-vue
      class="ag-theme-alpine-dark"
      style="height: 80vh"
      :columnDefs="columnDefs.value"
      :rowData="rowData.value"
      :defaultColDef="defaultColDef"
      animateRows="true"
      @grid-ready="onGridReady"
      pagination="true"
      paginationPageSize="40"
      @click="rowSelected"
      rowSelection="multiple"
      :rowMultiSelectWithClick="true"
      @first-data-rendered="onFirstDataRendered"
    >
    </ag-grid-vue>
    <button class="btnGrid" @click="deleteCrypto()">remove crypto</button>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3"; // the AG Grid Vue Component
import { reactive, onMounted, ref } from "vue";
import cryptoService from "src/services/Crypto";
import { UseGlobal } from "stores/global";
import { renderCryptoIcon } from "src/utils/cryptoIconRenderer";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import createLogger from "src/utils/logger";

const logger = createLogger("admin-crypto");

export default {
  name: "AdminConnectedForCrypto",
  components: {
    AgGridVue,
  },
  setup() {
    const global = UseGlobal();
    const rowData = reactive({});
    const columnDefs = reactive({
      value: [
        {
          field: "id",
          headerName: "",
          width: 30,
          headerCheckboxSelection: true,
          checkboxSelection: (params) => {
            return params.data;
          },
          showDisabledCheckboxes: true,
        },
        {
          field: "picture.path",
          headerName: "",
          sortable: false,
          filter: false,
          width: 150,
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
      resizable: true,
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
      crypto,
      idCrypto: [],
      cryptosGrid: [],
      indexInDB: [],
      cryptos: [],
      router: this.$router,
    };
  },
  methods: {
    getCryptoLength() {
      cryptoService
        .getAllCryptos()
        .then((response) => {
          this.cryptos = response.data.data;
          return this.cryptos;
        })
        .catch((err) => {
          logger.error("Unable to load crypto list", err);
        });
    },

    onGridReady(params) {
      this.gridApi = params.api;
      this.gridOptions;
    },
    logout() {
      this.global.accessToken = [];
      this.$router.push("/login");
    },
    onFirstDataRendered(params) {
      params.api.sizeColumnsToFit();
    },
    rowSelected() {
      let crypto = this.gridApi.getSelectedRows().flat();
      this.crypto = crypto[0];
      this.idCrypto = crypto.map((c) => c.id);
    },
    async deleteCrypto() {
      this.idCrypto.forEach((id) => {
        cryptoService
          .deleteCrypto(id)
          .then((response) => {
          })
          .catch((err) => {
            logger.warn("Unable to delete crypto", err);
          });
      });
    },
  },
  mounted() {
    this.deleteCrypto();
  },
};
</script>

<style lang="scss">
.ag-cell-value.ag-cell.ag-cell-not-inline-editing.ag-cell-normal-height.ag-cell-focus:focus-within {
  border: none;
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
.cardsTop {
  background: none;
}
</style>
