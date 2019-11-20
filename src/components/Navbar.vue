<template lang="html">
  <b-navbar fixed="top" type="light" variant="light">
    <b-container class="px-md-2">
      <b-navbar-nav>
        <b-nav-item to="/users"><h6 class="m-0">Users</h6></b-nav-item>
        <b-nav-item to="/bicycles"><h6 class="m-0">Bicycles</h6></b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-button
          class="mr-1"
          size="sm"
          variant="outline-secondary"
          @click="signOut"
          >Sign Out</b-button
        >
      </b-navbar-nav>
    </b-container>
  </b-navbar>
</template>

<script>
import { auth } from "@/firebase";

export default {
  methods: {
    signOut() {
      auth.signOut().then(() => {
        this.$router.replace("login");
      });
    }
  }
};
</script>

<style lang="css" scoped>
.navbar-nav {
  flex-direction: row !important;
}
</style>
