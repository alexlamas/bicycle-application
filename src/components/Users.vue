<template>
  <div>
    <b-row class="mt-2">
      <b-col>
        <input
          v-model="userSearch"
          class="form-control"
          type="search"
          placeholder="Search users..."
        />
      </b-col>
      <b-col class="pl-0">
        <b-button v-b-modal.add-user-modal variant="primary">Add</b-button>
      </b-col>
    </b-row>
    <add-user />
    <user-table :filterVariable="userSearch" />
  </div>
</template>

<script>
import UserTable from "./UserTable";
import AddUser from "./AddUser";
export default {
  data() {
    return {
      userSearch: ""
    };
  },
  components: {
    UserTable,
    AddUser
  }
};
</script>
