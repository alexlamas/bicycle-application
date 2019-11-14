<template>
  <div id="app">
    <b-container class="px-4 py-2">
      <div id="nav">
        <router-link class="mr-3 button" to="/"><h1>Users</h1></router-link>
        <router-link to="/bicycles"><h1>Bicycles</h1></router-link>
      </div>
      <router-view />
    </b-container>
  </div>
</template>

<style scoped>
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
