<template>
  <b-modal
    no-fade
    @ok="saveUser"
    :ok-title="'Save'"
    id="add-user-modal"
    title="Add a New User"
  >
    <b-form-input v-model="newPerson.name" placeholder="Name"></b-form-input>
    <b-input-group prepend="05/000" class="mt-2">
      <b-form-input v-model="newPerson.code" placeholder="Code"></b-form-input>
    </b-input-group>
  </b-modal>
</template>

<script>
import { db } from "../firebase";
export default {
  data() {
    return {
      newPerson: {
        name: "",
        code: "",
        num: 0
      }
    };
  },
  methods: {
    saveUser() {
      this.newPerson.code = "05/000" + this.newPerson.code;
      var newPersonToPush = this.newPerson;
      db.ref("people").push(newPersonToPush);
      db.ref("people")
        .once("value", snapshot => {
          this.people = Object.values(snapshot.val());
        })
        .then(() => {
          this.newPerson.code = "";
          this.newPerson.name = "";
        });
    }
  }
};
</script>
