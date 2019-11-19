<template>
  <b-modal
    @show="reset"
    no-fade
    hide-footer
    :ok-title="'Save'"
    ref="add-user"
    id="add-user-modal"
    title="Add a New User"
  >
    <b-form @submit="saveUser">
      <label for="name">Full Name</label>
      <b-form-input
        autofocus
        id="name"
        required
        v-model="newPerson.name"
        placeholder=""
      ></b-form-input>
      <label class="mt-3" for="code">Ausweiz</label>
      <b-form-input id="code" v-model="newPerson.code"></b-form-input>
      <b-button class="mt-2 float-right" type="submit" variant="primary"
        >Submit</b-button
      >
    </b-form>
  </b-modal>
</template>

<script>
import { db } from "@/firebase";
export default {
  data() {
    return {
      newPerson: {
        code: "05/000",
        num: 0
      }
    };
  },
  methods: {
    saveUser(evt) {
      if (this.newPerson.code == "05/000") {
        this.newPerson.code = "";
      }
      evt.preventDefault();
      var newPersonToPush = this.newPerson;
      db.ref("people").push(newPersonToPush);
      db.ref("people").once("value", snapshot => {
        this.people = Object.values(snapshot.val());
      });
      this.$refs["add-user"].hide();
    },
    reset() {
      this.newPerson.code = "05/000";
      this.newPerson.name = null;
    }
  }
};
</script>
