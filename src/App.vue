<template>
  <div id="app">
    <navbar />
    <b-container>
      <router-view />
    </b-container>
  </div>
</template>
<script>
import Navbar from "./components/Navbar";
export default {
  components: {
    Navbar
  }
};
</script>
<style>
.router-link-exact-active {
  color: black !important;
}
</style>
