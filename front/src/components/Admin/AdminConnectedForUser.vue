<template>
  <h2>Manage Monified's users</h2>
  <div class="grid">
    <button @click="undo">bb</button>
    <ag-grid-vue
      class="ag-theme-alpine-dark"
      style="height: 80vh"
      :columnDefs="columnDefs.value"
      :rowData="rowData.value"
      :rowIndex="rowIndex"
      :defaultColDef="defaultColDef"
      animateRows="true"
      @grid-ready="onGridReady"
      pagination="true"
      paginationPageSize="40"
      @click="rowSelected"
      rowSelection="multiple"
      :enableCellEditing="true"
      :singleClickEdit="true"
      :stopEditingWhenCellsLoseFocus="true"
      :suppressRowClickSelection="true"
      :rowMultiSelectWithClick="true"
      @first-data-rendered="onFirstDataRendered"
      :gridOptions="gridOptions"
    >
    </ag-grid-vue>

    <button class="btnGrid" @click="deleteUser()">remove user</button>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3"; // the AG Grid Vue Component
import { reactive, onMounted, ref } from "vue";
import userService from "src/services/User";
import { UseGlobal } from "stores/global";
import { useQuasar } from "quasar";
import createLogger from "src/utils/logger";

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

const logger = createLogger("admin-users");

export default {
  name: "AdminConnectedForUser",
  components: {
    AgGridVue,
  },
  setup() {
    const global = UseGlobal();
    const rowData = reactive({});
    const $q = useQuasar();

    const lastname = ref(null);
    const lastnameRef = ref(null);

    const firstname = ref(null);
    const firstnameRef = ref(null);

    const username = ref(null);
    const usernameRef = ref(null);

    const mail = ref(null);
    const mailRef = ref(null);

    const password = ref(null);
    const passwordRef = ref(null);

    const accept = ref(false);

    const columnDefs = reactive({
      value: [
        {
          field: "id",
          headerName: "",
          width: 140,
          headerCheckboxSelection: true,
          checkboxSelection: (params) => {
            return params.data;
          },
          showDisabledCheckboxes: true,
        },
        {
          field: "firstname",
          headerName: "FirstName",
          headerAlign: "center",
          editable: true,
          filter: "agTextColumnFilter",
          filterParams: {
            filterOptions: ["contains", "notContains", "startsWith", "blank"],
            defaultOption: "contains",
            buttons: ["reset"],
          },
          cellRenderer: function (params) {
            return `<input class="updateGrid" ref="firstnameRef" v-model="user.firstname"
              label="Firstname" value="${params.value}" />`;
          },
        },
        {
          field: "lastname",
          headerName: "Lastname",
          editable: true,
          filter: "agTextColumnFilter",
          filterParams: {
            filterOptions: ["contains", "notContains", "startsWith", "blank"],
            defaultOption: "contains",
            buttons: ["reset"],
          },
          cellRenderer: function (params) {
            return `<input class="updateGrid" ref="lastnameRef" v-model="user.lastname"
              label="Lastname" value="${params.value}" />`;
          },
        },
        {
          field: "username",
          headerName: "Username",
          editable: true,
          filter: "agTextColumnFilter",
          filterParams: {
            filterOptions: ["contains", "notContains", "startsWith", "blank"],
            defaultOption: "contains",
            buttons: ["reset"],
          },
          cellRenderer: function (params) {
            return `<input class="updateGrid" ref="usernameRef" v-model="user.username"
              label="Username" value="${params.value}" />`;
          },
        },
        {
          field: "email",
          headerName: "eMail",
          editable: true,
          width: 390,
          filter: "agTextColumnFilter",
          filterParams: {
            filterOptions: ["contains", "notContains", "startsWith", "blank"],
            defaultOption: "contains",
            buttons: ["reset"],
          },
          cellRenderer: function (params) {
            return `<input class="updateGrid" ref="emailRef" v-model="user.email"
              label="eMail" value="${params.value}" />`;
          },
        },
        {
          field: "phone",
          headerName: "Phone",
          editable: true,
          filter: "agNumberColumnFilter",
          filterParams: {
            filterOptions: ["equals", "lessThan", "greaterThan", "inRange"],
            defaultOption: "contains",
            buttons: ["reset"],
          },
          cellRenderer: function (params) {
            return `<input class="updateGrid" ref="phoneRef" v-model="user.phone"
              label="Phone" value="${params.value}" />`;
          },
        },
        {
          headerName: "Update",
          cellRenderer: function (params) {
            return `<button class="updateBtnGrid" label="Update account"
              type="submit" @click="updateUser()"><img class="editBtn" src="/icons/edit.svg" alt="edit"></button>`;
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
      userService
        .getAllUsers()
        .then((response) => {
          rowData.value = response.data.data;
        })
        .catch((err) => {
          logger.error("Unable to load users grid", err);
        });
    });

    return {
      global,
      rowSelection: null,
      columnDefs,
      rowData,
      defaultColDef,
      isPwd: ref(true),
      firstname,
      firstnameRef,
      lastname,
      lastnameRef,
      username,
      usernameRef,
      mail,
      mailRef,
      password: ref(""),
      passwordRef,

      accept,

      onSubmit() {
        firstnameRef.value.validate();
        lastnameRef.value.validate();
        usernameRef.value.validate();
        mailRef.value.validate();
        passwordRef.value.validate();
      },
    };
  },
  data() {
    return {
      indexInDB: [],
      users: {
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
      },
      router: this.$router,
      idUser: [],
    };
  },
  methods: {
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
      // params.api.setSuppressRowDrag(false);

      const updateData = (data) => params.api.setRowData(data);
      this.gridOptions;
    },
    logout() {
      this.global.accessToken = [];
      this.$router.push("/login");
    },
    onFirstDataRendered(params) {
      params.api.sizeColumnsToFit();
    },
    rowSelected(params) {
      const rows = this.gridApi.getSelectedRows().flat();
      this.idUser = rows.map((c) => c.id);
      logger.debug("Selected users", this.idUser);
    },
    async deleteUser() {
      this.idUser.forEach((id) => {
        userService
          .deleteUser(id)
          .then((response) => {
            logger.info("User deleted", { id });
          })
          .catch((err) => {
            logger.error("Unable to delete user", err);
          });
      });
    },
    undo() {
      this.gridApi.undoCellEditing();
    },
    // onBtStopEditing() {
    //   gridOptions.api.stopEditing();
    // },

    // onBtStartEditing() {
    //   gridOptions.api.setFocusedCell(1, "firstname");
    //   gridOptions.api.startEditingCell({
    //     rowIndex: 1,
    //     colKey: "firstname",
    //   });
    // },
    // async updateUser() {
    //   let id = this.global.accessToken[1];
    //   userService
    //     .updateUser(id, this.users, {
    //       data: {
    //         firstname: this.user.firstname,
    //         lastname: this.user.lastname,
    //         username: this.user.username,
    //         email: this.user.email,
    //         password: this.user.password,
    //       },
    //     })
    //     .then(
    //       (res) => {
    //         this.$router.push("/login");
    //       },
    //       (err) => {
    //         console.log(err);
    //       }
    //     );
    // },
  },

  mounted() {
    this.deleteUser();
    // this.updateUser();
    userService
      .getUser(this.global.accessToken[1])
      .then((response) => {
        this.user = response.data.data;
      })
      .catch((error) => {
        logger.error("Unable to fetch admin user", error);
      });
  },
};
</script>

<style lang="scss">
.updateGrid {
  background: none;
  border: none;
}
.updateBtnGrid {
  background-color: transparent;
  font-weight: bold;
  height: 100%;
  width: 90%;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4px;
  border: none;
}
.ag-cell-value.ag-cell.ag-cell-not-inline-editing.ag-cell-normal-height.ag-cell-focus:focus-within {
  border: none;
}

.my-card {
  width: 100%;
  max-width: 250px;
  background-color: #202740;
}
.updateBtnGrid:hover .editBtn {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  height: 36px;
  margin-bottom: 8px;
}
.editBtn {
  margin-bottom: 5px;
}
</style>
