<template>
  <div class="q-pa-md visitorGrid">
    <ag-grid-vue
      class="ag-theme-alpine-dark"
      style="height: 120vh"
      :columnDefs="columnDefs.value"
      :rowData="rowData.value"
      :defaultColDef="defaultColDef"
      animateRows="true"
      @grid-ready="onGridReady"
      pagination="true"
      paginationPageSize="40"
    ></ag-grid-vue>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { AgGridVue } from "ag-grid-vue3"; // the AG Grid Vue Component
import { reactive, onMounted, ref } from "vue";
import cryptoService from "src/services/Crypto";
import { UseGlobal } from "stores/global";
import { renderCryptoIcon } from "src/utils/cryptoIconRenderer";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css";
import createLogger from "src/utils/logger";

const logger = createLogger("tabs-crypto");

export default defineComponent({
  name: "TabsCrypto",
  components: {
    AgGridVue,
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
          cellRenderer: renderCryptoIcon,
        },
        {
          field: "symbol",
          headerName: "Name",
          cellRenderer: function (params) {
            return `<span>${params.value.slice(0, -4)}</span>`;
          },
        },
        {
          field: "price",
          headerName: "Price",
          cellRenderer: function (params) {
            return `<span>$${params.value}</span>`;
          },
        },
        { field: "volume", headerName: "Volume in 24 H" },
        {
          field: "variation",
          headerName: "Variation",
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
      sortable: false,
      filter: false,
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
      router: this.$router,
    };
  },
  methods: {
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridOptions;
    },
    onFirstDataRendered(params) {
      params.api.sizeColumnsToFit();
    },
  },
  mounted() {},
});
</script>

<style>
.visitorGrid {
  margin: 0 8vw;
}
.cryptoIcon {
  height: 28px;
  width: 28px;
  margin: 6px 0 0 60px;
}
</style>
