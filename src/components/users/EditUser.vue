<template>
  <b-modal
    no-fade
    @shown="initialValues"
    @ok="editUser(editDetails)"
    :ok-title="'Save'"
    id="edit-user-modal"
    title="Edit User"
  >
    <label for="name">Name</label>
    <b-form-input id="name" v-model="editDetails.name"></b-form-input>
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

    <b-form-checkbox
      class="mt-4"
      v-model="editDetails.helper"
      value="true"
      unchecked-value="false"
    >
      Helper
    </b-form-checkbox>
    <b-form-checkbox
      class="mt-2"
      v-model="editDetails.makerspace"
      value="true"
      unchecked-value="false"
    >
      Makerspace
    </b-form-checkbox>
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
        name: null,
        code: null,
        num: 0,
        penalty: 0,
        makerspace: null,
        helper: null
      }
    };
  },
  methods: {
    initialValues() {
      this.editDetails.name = this.user.name;
      this.editDetails.code = this.user.code;
      this.editDetails.num = this.user.num;
      this.editDetails.helper = this.user.helper;
      this.editDetails.makerspace = this.user.makerspace;
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
      if (editDetails.helper) {
        db.ref("people/" + key + "/helper").set(editDetails.helper);
      }
      if (editDetails.makerspace) {
        db.ref("people/" + key + "/makerspace").set(editDetails.makerspace);
      }
      editDetails.name = null;
      editDetails.code = null;
      editDetails.num = 0;
      editDetails.penalty = 0;
      editDetails.helper = false;
      editDetails.makerspace = false;
    }
  }
};
</script>
