<template>
  <div id="app">
    <b-container class="px-4 py-2">
      <router-view />
    </b-container>
  </div>
</template>

<style>
#nav {
  display: flex;
}
#nav a {
  color: #007aff6b;
}
.router-link-exact-active {
  color: #0056b3 !important;
}
</style>
