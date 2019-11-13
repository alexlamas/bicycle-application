<template>
  <b-modal
    no-fade
    @ok="editUser(editDetails)"
    :ok-title="'Save'"
    id="edit-user-modal"
    title="Edit User"
  >
    <b-form-input
      v-model="editDetails.name"
      :placeholder="userArray.name"
    ></b-form-input>
    <b-form-input
      v-model="editDetails.code"
      :placeholder="userArray.code"
      class="mt-2"
    ></b-form-input>
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
      editDetails: {
        name: "",
        code: ""
      }
    };
  },
  methods: {
    editUser(editDetails) {
      var key = this.userArray.key;
      if (editDetails.name != "") {
        db.ref("people/" + key + "/name").set(editDetails.name);
      }
      if (editDetails.code != "") {
        db.ref("people/" + key + "/code").set(editDetails.code);
      }
      editDetails.name = "";
      editDetails.code = "";
    }
  }
};
</script>
