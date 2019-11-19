<template>
  <div>
    <navbar />
    <b-input-group class="mt-3">
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
    <add-user :userSearch="userSearch" />
    <user-table :userSearch="userSearch" />
  </div>
</template>

<script>
import UserTable from "./users/UserTable";
import AddUser from "./users/AddUser";
import Navbar from "./Navbar";
export default {
  data() {
    return {
      userSearch: ""
    };
  },
  components: {
    UserTable,
    AddUser,
    Navbar
  }
};
</script>
