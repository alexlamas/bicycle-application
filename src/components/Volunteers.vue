<template>
  <div>
    <navbar />
    <b-container>
      <b-navbar sticky class="px-0" style="background-color:white">
        <b-form-input
          v-model="userSearch"
          type="search"
          placeholder="Search..."
          size="sm"
        />

        <b-button
          v-b-modal.add-user-modal
          variant="primary"
          size="sm"
          class="ml-2"
          ><font-awesome-icon icon="plus"
        /></b-button>
      </b-navbar>
      <b-row style="padding-left:1.3rem">
        <div class=" text-muted">
          Filter:
        </div>
        <b-form-checkbox-group
          v-model="filters"
          :options="options"
          class=" ml-3"
          switches
        >
        </b-form-checkbox-group>
      </b-row>

      <add-user :type="type" :userSearch="userSearch" />
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
      type: "volunteers",
      userSearch: "",
      filters: ["volunteers"],
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
