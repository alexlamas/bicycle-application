<template>
  <b-modal
    no-fade
    @shown="initialValues"
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
import { db } from "@/firebase";
export default {
  props: {
    user: Object
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
    initialValues() {
      this.editDetails.name = this.user.name;
      this.editDetails.code = this.user.code;
    },
    editUser(editDetails) {
      var key = this.user.key;
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
