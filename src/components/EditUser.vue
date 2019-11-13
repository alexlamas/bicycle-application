<template>
  <b-modal
    no-fade
    @ok="editUser(editDetails)"
    :ok-title="'Save'"
    id="edit-user-modal"
    title="Edit User"
  >
    <b-form-input v-model="editDetails.name"></b-form-input>
    <b-form-input v-model="editDetails.code" class="mt-2"></b-form-input>
  </b-modal>
</template>

<script>
import { db } from "../firebase";
export default {
  props: {
    userArray: Object
  },
  data() {
    return {
      editDetails: this.userArray
    };
  },
  methods: {
    editUser(editDetails) {
      db.ref("people/" + editDetails.key + "/name").set(editDetails.name);
      db.ref("people/" + editDetails.key + "/code").set(editDetails.code);
      /* eslint-disable no-console */
      console.log(editDetails);
    }
  }
};
</script>
