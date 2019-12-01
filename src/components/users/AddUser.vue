<template>
  <b-modal
    @shown="initialValues"
    no-fade
    hide-footer
    :ok-title="'Save'"
    ref="add-user"
    id="add-user-modal"
    title="Add a New User"
  >
    <b-form @submit="saveUser">
      <b-form-select
        v-model="selected"
        class="mb-3"
        :options="options"
      ></b-form-select>
      <label for="name">Full Name</label>
      <b-form-input
        id="name"
        required
        autofocus
        v-model="newPerson.name"
        placeholder=""
      ></b-form-input>
      <label class="mt-3" for="code">Ausweis</label>
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
  props: {
    userSearch: String
  },
  data() {
    return {
      selected: null,
      options: [
        { value: null, text: "Refugee" },
        { value: "helper", text: "Helper" },
        { value: "volunteer", text: "Volunteer" }
      ],
      newPerson: {
        name: "",
        code: "05/000",
        num: 0,
        helper: false,
        makerspace: false
      }
    };
  },
  methods: {
    saveUser(evt) {
      if (this.newPerson.code == "05/000") {
        this.newPerson.code = "";
      }
      evt.preventDefault();
      this.newPerson.helper = this.selected == "helper" ? true : false;
      this.newPerson.makerspace = this.selected == "makerspace" ? true : false;
      var newPersonToPush = this.newPerson;
      db.ref("people").push(newPersonToPush);
      db.ref("people").once("value", snapshot => {
        this.people = Object.values(snapshot.val());
      });
      this.$refs["add-user"].hide();
    },
    initialValues() {
      this.newPerson.code = "05/000";
      this.newPerson.name = this.userSearch;
      this.newPerson.helper = false;
      this.newPerson.makerspace = false;
      this.selected = null;
    }
  }
};
</script>
