<template>
  <div id="app">
    <b-container class="px-4 py-2">
      <div id="nav">
        <router-link to="/">Users</router-link> |
        <router-link to="/bicycles">Bicycles</router-link>
      </div>
      <router-view />
    </b-container>
  </div>
</template>
