<template>
  <div>
    <div id="nav">
      <router-link class="mr-3 button" to="/users"><h1>Users</h1></router-link>
      <router-link to="/bicycles"><h1>Bicycles</h1></router-link>
      <b-col class="text-right align-middle">
        <b-button variant="link" @click="signOut">Sign Out</b-button>
      </b-col>
    </div>
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
import UserTable from "./users/UserTable";
import AddUser from "./users/AddUser";
import { auth } from "@/firebase";
export default {
  methods: {
    signOut() {
      auth.signOut().then(() => {
        this.$router.replace("login");
      });
    }
  },
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
