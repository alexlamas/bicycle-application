<template>
  <b-modal
    no-fade
    @ok="saveBicycle"
    :ok-title="'Save'"
    id="add-bicycle-modal"
    title="Add a New Bicycle"
  >
    <label for="bicycle-id">Bicycle ID</label>
    <b-form-input
      v-model="newBicycle.id"
      class="mb-2"
      id="bicycle-id"
    ></b-form-input>
    <label for="img-url">Image URL</label>
    <b-form-input v-model="newBicycle.src" id="img-url"></b-form-input>
  </b-modal>
</template>

<script>
import { db } from "@/firebase";
export default {
  data() {
    return {
      newBicycle: {
        id: "",
        src: "",
        status: "available",
        currentUser: ""
      }
    };
  },
  methods: {
    saveBicycle() {
      var newBicycleToPush = this.newBicycle;
      db.ref("bicycles").push(newBicycleToPush);
      db.ref("bicycles")
        .once("value", snapshot => {
          this.bicycles = Object.values(snapshot.val());
        })
        .then(() => {
          this.newBicycle.id = "";
          this.newBicycle.src = "";
        });
    }
  }
};
</script>

<style lang="css" scoped></style>
