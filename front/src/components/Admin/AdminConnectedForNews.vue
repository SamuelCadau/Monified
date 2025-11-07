<template>
  <h2>Manage news on Monified</h2>

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
    <button class="btnGrid" @click="deleteNews()">remove News</button>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3"; // the AG Grid Vue Component
import { reactive, onMounted, ref } from "vue";
import newsService from "src/services/News";
import { UseGlobal } from "stores/global";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import createLogger from "src/utils/logger";

const logger = createLogger("admin-news");

export default {
  name: "AdminConnectedForNews",
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
          width: 50,
          headerCheckboxSelection: true,
          checkboxSelection: (params) => {
            return params.data;
          },
          showDisabledCheckboxes: true,
        },
        {
          field: "title",
          headerName: "Title",
          width: 450,
          filter: "agTextColumnFilter",
          filterParams: {
            filterOptions: ["contains", "notContains", "startsWith", "blank"],
            defaultOption: "contains",
            buttons: ["reset"],
          },
        },
        {
          field: "link",
          headerName: "Link",
          filter: "agTextColumnFilter",
          filterParams: {
            filterOptions: ["contains", "notContains", "startsWith", "blank"],
            defaultOption: "contains",
            buttons: ["reset"],
          },

        },
        {
          field: "pubDate",
          headerName: "pubDate",
          filter: "agDateColumnFilter",
          filterParams: {
            filterOptions: ["contains", "notContains", "startsWith", "blank"],
            defaultOption: "contains",
            buttons: ["reset"],
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
      newsService
        .getAllNews()
        .then((response) => {
          rowData.value = response.data.data.map((i) => {
            return {
              id: i.id,
              title: i.title,
              link: i.link,
              pubDate: i.pubDate.slice(0, -9),
            };
          });
        })
        .catch((err) => {
          logger.error("Unable to load news", err);
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
      news: [],
      idNews: [],
      newsGrid: [],
      indexInDB: [],
      newsS: [],
      router: this.$router,
    };
  },
  methods: {
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
      let news = this.gridApi.getSelectedRows().flat();

      this.idNews = news.map((c) => c.id).flat();
    },
    async deleteNews() {
      this.idNews.forEach((id) => {
        newsService
          .deleteNews(id)
          .then((response) => {
          })
          .catch((err) => {
            logger.warn("Unable to delete news", err);
          });
      });
    },
  },
  mounted() {
    this.deleteNews();
  },
};
</script>

<style lang="scss"></style>
