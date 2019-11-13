<template>
  <div>
    <b-row class="mt-2">
      <b-col>
        <input
          v-model="userSearch"
          class="form-control"
          type="search"
          placeholder="Search..."
        />
      </b-col>
      <b-col class="pl-0">
        <b-button v-b-modal.add-user-modal variant="primary">Add</b-button>
      </b-col>
    </b-row>

    <b-modal
      no-fade
      @ok="saveUser"
      :ok-title="'Save'"
      id="add-user-modal"
      title="Add a New User"
    >
      <b-form-input v-model="newPerson.name" placeholder="Name"></b-form-input>
      <b-input-group prepend="05/000" class="mt-2">
        <b-form-input
          v-model="newPerson.code"
          placeholder="Code"
        ></b-form-input>
      </b-input-group>
    </b-modal>
    <UserTable :filterVariable="userSearch" />
  </div>
</template>

<script>
import { db } from "../firebase";
import UserTable from "./UserTable";
export default {
  data() {
    return {
      userSearch: "",
      newPerson: {
        name: "",
        code: "",
        num: 0
      }
    };
  },
  components: {
    UserTable
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
