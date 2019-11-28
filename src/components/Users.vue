<template>
  <div>
    <navbar />
    <b-container>
      <div class="d-flex mt-2">
        <div class=" text-muted">
          Filter by:
        </div>
        <b-form-checkbox-group
          v-model="filters"
          :options="options"
          class=" ml-3"
          switches
        >
        </b-form-checkbox-group>
      </div>

      <b-navbar sticky class="px-0" style="background-color:white">
        <b-input-group size="sm">
          <input
            v-model="userSearch"
            class="form-control "
            type="search"
            placeholder="Search users..."
          />
          <b-input-group-append>
            <b-button v-b-modal.add-user-modal variant="primary"
              ><font-awesome-icon icon="plus" class="mr-1" /> User</b-button
            >
          </b-input-group-append>
        </b-input-group>
      </b-navbar>

      <add-user :userSearch="userSearch" />
      <user-table :userSearch="userSearch" :filters="filters" />
    </b-container>
  </div>
</template>

<script>
import UserTable from "./users/UserTable";
import AddUser from "./users/AddUser";
import Navbar from "./Navbar";

export default {
  data() {
    return {
      userSearch: "",
      filters: ["visitors"],
      options: [{ text: "Renting", value: "renting" }]
    };
  },
  components: {
    UserTable,
    AddUser,
    Navbar
  }
};
</script>

<style scoped>
.custom-control-input:checked ~ .custom-control-label::before {
  border-color: #ffc107 !important;
  background-color: #ffc107 !important;
  outline: none !important;
  box-shadow: none !important;
}
.custom-control-label::before,
.custom-file-label,
.custom-select {
  outline: none !important;
  box-shadow: none !important;
  border: #adb5bd solid 1px !important;
}
</style>
