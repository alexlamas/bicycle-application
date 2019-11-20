<template>
  <div>
    <b-navbar sticky class="px-0" style="background-color:white">
      <b-input-group>
        <input
          v-model="userSearch"
          class="form-control "
          type="search"
          placeholder="Search users..."
        />
        <b-input-group-append>
          <b-button v-b-modal.add-user-modal variant="primary">Add</b-button>
        </b-input-group-append>
      </b-input-group>
    </b-navbar>

    <add-user :userSearch="userSearch" />
    <user-table :userSearch="userSearch" />
  </div>
</template>

<script>
import UserTable from "./users/UserTable";
import AddUser from "./users/AddUser";
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
