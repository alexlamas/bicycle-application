<template lang="html">
  <b-modal
    @ok="returnBicycle"
    ok-title="Return"
    ok-variant="success"
    ref="return-bicycle"
    no-fade
    id="return-bicycle"
    title="Return Bicycle"
  >
    <bicycle :withButton="false" :bicycle="bicycle" />
  </b-modal>
</template>

<script>
import { db } from "../firebase";
import Bicycle from "./Bicycle";
export default {
  components: {
    Bicycle
  },
  props: {
    bicycle: Object
  },
  methods: {
    returnBicycle() {
      var bicycleKey = this.bicycle.key;
      var key = this.bicycle.currentUser;
      db.ref("bicycles/" + bicycleKey + "/currentUser").set("none");
      db.ref("people/" + key + "/bicycleKey").set("");
    }
  }
};
</script>

<style>
.card-body {
  padding: 0.5rem !important;
  height: 50px;
}
</style>
