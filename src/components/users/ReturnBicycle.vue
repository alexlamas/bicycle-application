<template lang="html">
  <b-modal
    @ok="returnBicycle"
    ok-title="Return"
    ok-variant="warning"
    ref="return-bicycle"
    no-fade
    id="return-bicycle"
    title="Return Bicycle"
  >
    <bicycle :withButton="false" :bicycle="bicycle" />
  </b-modal>
</template>

<script>
import { db } from "@/firebase";
import Bicycle from "../bicycles/Bicycle";
export default {
  components: {
    Bicycle
  },
  props: {
    bicycle: Object,
    user: Object
  },
  methods: {
    returnBicycle() {
      var bicycleKey = this.bicycle.key;
      var key = this.bicycle.currentUser;
      var newCount = this.user.num + 1;
      db.ref("bicycles/" + bicycleKey + "/currentUser").set("none");
      db.ref("people/" + key + "/bicycleKey").set("");
      db.ref("people/" + key + "/rentalDate").set("");
      db.ref("people/" + key + "/num").set(newCount);
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
