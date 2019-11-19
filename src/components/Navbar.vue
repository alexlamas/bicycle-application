<template lang="html">
  <b-navbar type="light" variant="light">
    <b-navbar-nav>
      <b-nav-item to="/users"><h6 class="m-0">Users</h6></b-nav-item>
      <b-nav-item to="/bicycles"><h6 class="m-0">Bicycles</h6></b-nav-item>
    </b-navbar-nav>

    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto">
      <b-nav-item @click="signOut" href="#">Sign Out</b-nav-item>
    </b-navbar-nav>
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
