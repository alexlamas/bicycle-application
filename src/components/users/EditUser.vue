<template>
  <b-modal
    no-fade
    @shown="initialValues"
    @ok="editUser(editDetails)"
    :ok-title="'Save'"
    id="edit-user-modal"
    title="Edit User"
  >
    <b-form-select
      v-model="editDetails.type"
      class="mb-3"
      :options="options"
    ></b-form-select>
    <label for="name">Name</label>
    <b-form-input id="name" v-model="editDetails.name"></b-form-input>
    <label class="mt-3" v-if="editDetails.type" for="name">Organisation</label>
    <b-form-input
      v-if="editDetails.type"
      id="name"
      v-model="editDetails.organisation"
    ></b-form-input>
    <label class="mt-3" for="ausweis">Ausweis</label>
    <b-form-input id="ausweis" v-model="editDetails.code"></b-form-input>
    <label class="mt-3" for="num">Number of rentals</label>
    <b-form-input
      type="number"
      id="num"
      v-model="editDetails.num"
    ></b-form-input>
    <label class="mt-3" for="penalty">Days of penalty remaining</label>
    <b-form-input
      type="number"
      id="penalty"
      :disabled="user.bicycleKey ? true : false"
      v-model="editDetails.penalty"
    ></b-form-input>
    <small v-if="user.bicycleKey" id="emailHelp" class="form-text text-muted"
      >Cannot change penalty value during rental.</small
    >
  </b-modal>
</template>

<script>
import { db } from "@/firebase";
export default {
  props: {
    user: Object
  },
  data() {
    return {
      editDetails: {
        type: null,
        name: null,
        code: null,
        organisation: null,
        num: 0,
        penalty: 0
      },
      options: [
        { value: null, text: "Visitor" },
        { value: "helper", text: "Helper" },
        { value: "volunteer", text: "Volunteer" }
      ]
    };
  },
  methods: {
    initialValues() {
      this.editDetails.name = this.user.name;
      this.editDetails.code = this.user.code;
      this.editDetails.organisation = this.user.organisation;
      this.editDetails.num = this.user.num;
      this.editDetails.type = this.user.helper
        ? "helper"
        : this.user.volunteer
        ? "volunteer"
        : null;
      this.editDetails.penalty = this.user.penalty ? this.user.penalty : 0;
    },
    editUser(editDetails) {
      var key = this.user.key;
      var penaltyDate = new Date();
      penaltyDate =
        penaltyDate.getTime() + editDetails.penalty * 24 * 60 * 60 * 1000;
      if (editDetails.name) {
        db.ref("people/" + key + "/name").set(editDetails.name);
      }
      if (editDetails.code) {
        db.ref("people/" + key + "/code").set(editDetails.code);
      }
      if (!editDetails.code) {
        db.ref("people/" + key + "/code").set(null);
      }
      if (editDetails.num) {
        db.ref("people/" + key + "/num").set(parseInt(editDetails.num));
      }
      if (editDetails.penalty == 0) {
        db.ref("people/" + key + "/penalty").set(null);
      }
      if (editDetails.penalty > 0) {
        db.ref("people/" + key + "/penalty").set(parseInt(penaltyDate));
      }
      if (editDetails.type == null) {
        db.ref("people/" + key + "/volunteer").set(false);
        db.ref("people/" + key + "/helper").set(false);
      }
      if (editDetails.type == "helper") {
        db.ref("people/" + key + "/volunteer").set(false);
        db.ref("people/" + key + "/helper").set(true);
      }
      if (editDetails.type == "volunteer") {
        db.ref("people/" + key + "/volunteer").set(true);
        db.ref("people/" + key + "/helper").set(false);
      }
      if (editDetails.type != null) {
        db.ref("people/" + key + "/organisation").set(editDetails.organisation);
      }

      editDetails.name = null;
      editDetails.code = null;
      editDetails.num = 0;
      editDetails.penalty = 0;
    }
  }
};
</script>
