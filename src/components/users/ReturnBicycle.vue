<template lang="html">
  <b-modal
    @ok="returnBicycle"
    @hide="resetPenalty"
    ok-title="Return"
    ok-variant="warning"
    ref="return-bicycle"
    no-fade
    id="return-bicycle"
    title="Return Bicycle"
  >
    <bicycle :bicycle="bicycle" />

    <template v-slot:modal-footer="{ ok, cancel, hide }">
      <div class="d-flex w-100 justify-content-between">
        <!-- Emulate built in modal footer ok and cancel button actions -->
        <b-button
          v-if="!penalty"
          v-b-modal.penalty
          class="float-left"
          size="sm"
          variant="outline-secondary"
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

        <div class="">
          <b-button size="sm" variant="secondary" @click="cancel()">
            Cancel
          </b-button>
          <!-- Button with custom close trigger value -->
          <b-button class="ml-2" size="sm" variant="warning" @click="ok()">
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
      var bicycleID = this.bicycle.key;
      var key = this.bicycle.currentUser;
      var newCount = this.user.num ? this.user.num + 1 : 1;
      db.ref("bicycles/" + bicycleID + "/currentUser").set(null);
      db.ref("people/" + key + "/bicycleID").set(null);
      db.ref("people/" + key + "/rentalDate").set(null);
      db.ref("people/" + key + "/num").set(newCount);
      db.ref("people/" + key + "/penalty").set(this.penalty);
    },
    resetPenalty() {
      this.penalty = null;
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
