<template lang="html">
  <b-modal
    @ok="returnBicycle"
    @hide="resetPenalty"
    ok-title="Return"
    ref="return-bicycle"
    no-fade
    id="return-bicycle"
    title="Return Bicycle"
  >
    <bicycle :bicycle="bicycle" />
    <template v-slot:modal-footer="{ ok, cancel, hide }">
      <div class="d-flex w-100 justify-content-between">
        <b-button
          v-if="!penalty"
          v-b-modal.penalty
          class="float-left"
          size="sm"
          variant="light"
        >
          Add Penalty
        </b-button>
        <b-modal
          @shown="resetPenalty"
          @cancel="resetPenalty"
          size="sm"
          id="penalty"
          title="Add a penalty"
        >
          <label for="days">Choose penalty length</label>
          <b-input-group id="days" append="days" label="sdf">
            <b-form-input
              autofocus
              type="number"
              v-model="penalty"
            ></b-form-input>
          </b-input-group>
        </b-modal>

        <b-button
          @click="penalty = null"
          v-if="penalty"
          v-b-modal.penalty
          class="float-left"
          size="sm"
          variant="danger"
        >
          Penalty
          <b-badge variant="light"
            >{{ penalty }} <span class="text-muted">days</span></b-badge
          >
          <font-awesome-icon class="ml-2" icon="times-circle" />
        </b-button>

        <div>
          <b-button class="ml-2" size="sm" variant="primary" @click="ok()">
            Return
          </b-button>
        </div>
      </div>
    </template>
  </b-modal>
</template>

<script>
import { db } from "@/firebase";
import Bicycle from "../bicycles/Bicycle";
export default {
  data() {
    return {
      penalty: null
    };
  },
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
      var userKey = this.bicycle.currentUser;
      var penaltyDate = new Date();
      penaltyDate = penaltyDate.getTime() + this.penalty * 24 * 60 * 60 * 1000;
      db.ref("bicycles/" + bicycleKey + "/currentUser").set(null);
      db.ref("people/" + userKey + "/bicycleKey").set(null);
      db.ref("people/" + userKey + "/bicycleID").set(null);
      db.ref("people/" + userKey + "/returnDate").set(null);
      db.ref("people/" + userKey + "/penalty").set(
        this.penalty ? penaltyDate : null
      );
      db.ref("rentals")
        .child(this.user.key)
        .once("value")
        .then(snapshot => {
          snapshot.forEach(doc => {
            this.setReturned(doc.key);
          });
        });
    },
    resetPenalty() {
      this.penalty = null;
    },
    setReturned(key) {
      db.ref("rentals")
        .child(this.user.key)
        .child(key)
        .child("status")
        .set("returned");
    }
  }
};
</script>

<style>
.card-body {
  padding: 0.5rem !important;
}
</style>
