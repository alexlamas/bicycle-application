<template lang="html">
  <b-navbar toggleable="md" type="light">
    <b-container class="px-sm-2">
      <b-navbar-brand class="ml-md-1" to="/">
        <img src="@/assets/logo.png" alt="logo" style="width:200px" />
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <!-- Right aligned nav items -->
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto ">
          <b-nav-item class="my-auto mr-2" to="/"
            ><h6 class="m-0">Home</h6></b-nav-item
          >
          <b-nav-item class="my-auto mr-2" to="visitors"
            ><h6 class="m-0">Visitors</h6></b-nav-item
          >
          <b-nav-item class="my-auto mr-2" to="helpers"
            ><h6 class="m-0">Helpers</h6></b-nav-item
          >
          <b-nav-item class="my-auto mr-2" to="volunteers"
            ><h6 class="m-0">Volunteers</h6></b-nav-item
          >
          <b-nav-item class="my-auto mr-3" to="bicycles"
            ><h6 class="m-0">Bicycles</h6></b-nav-item
          >
          <b-nav-item>
            <b-button size="sm" variant="outline-dark" @click="signOut">
              Sign Out</b-button
            >
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
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
.btn {
  width: 5rem;
}
.nav-link {
  border-bottom: 2px solid transparent;
}

.router-link-exact-active {
  color: black !important;
  font-weight: 500 !important;
  border-bottom: 2px solid black;
}
.navbar-brand {
  border-bottom: 2px solid transparent;
}
@media (max-width: 766px) {
  .router-link-exact-active {
    border-bottom: none;
  }
}
.router-link {
  font-weight: 200 !important;
}
</style>
