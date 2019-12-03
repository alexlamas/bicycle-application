<template>
  <div id="app">
    <router-view />
  </div>
</template>
<style media="screen">
@media (min-width: 576px) {
  .container {
    max-width: 98vw !important;
  }
}
@media (min-width: 900px) {
  .container {
    max-width: 860px;
  }
}
</style>
