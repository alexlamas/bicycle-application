<template>
  <div>
    <navbar />
    <b-container>
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
      <user-table :userSearch="userSearch" />
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
