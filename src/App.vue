<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import { auth } from "@/firebase";

export default {
  created: function() {
    auth.onAuthStateChanged(function(user) {
      if (user.uid != "dmfqlj7qiZcSuznZiiPRt2Ja2yi2") {
        alert(
          "You are logged in with a viewing account, which means that you will not be able to add, edit, or delete any of the users and bicycles. You can click any button you want without affecting the data."
        );
      }
    });
  }
};
</script>
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
