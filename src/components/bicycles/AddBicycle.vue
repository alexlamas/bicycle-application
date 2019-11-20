<template>
  <b-modal
    no-fade
    hide-footer
    :ok-title="'Save'"
    id="add-bicycle-modal"
    ref="add-bicycle"
    title="Add a New Bicycle"
  >
    <b-modal ok-only ok-variant="warning" id="idTaken" title="Error">
      <p>
        That bicycle ID is already in use. Please choose a different one or
        delete the existing bicycle.
      </p>
    </b-modal>
    <b-form @submit="checkID">
      <label for="bicycle-id">Bicycle ID</label>
      <b-form-input
        required
        type="number"
        min="1"
        max="999"
        v-model="newBicycle.id"
        class="mb-2"
        id="bicycle-id"
      ></b-form-input>

      <b-form-file
        required
        class="mt-4"
        v-model="file"
        :state="Boolean(file)"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
      ></b-form-file>
      <div class="mt-3">Selected file: {{ file ? file.name : "" }}</div>
      <b-button
        v-if="!isSaving"
        class="mt-2 float-right"
        type="submit"
        variant="primary"
        >Submit</b-button
      >
      <b-button
        v-if="isSaving"
        class="mt-2 float-right"
        variant="primary"
        type="button"
        disabled
      >
        <span
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
        Saving...
      </b-button>
    </b-form>
  </b-modal>
</template>

<script>
import { db } from "@/firebase";
import { storage } from "@/firebase";
export default {
  data() {
    return {
      isSaving: false,
      idTaken: false,
      file: null,
      newBicycle: {
        id: null,
        currentUser: null,
        src: null
      }
    };
  },
  methods: {
    checkID(evt) {
      evt.preventDefault();
      db.ref("bicycles")
        .orderByChild("id")
        .equalTo(this.newBicycle.id)
        .on("value", snapshot => {
          if (!snapshot.val()) {
            this.saveBicycle();
          } else {
            this.idTaken = true;
            this.$bvModal.show("idTaken");
          }
        });
    },
    saveBicycle() {
      this.isSaving = true;
      var storageRef = storage.ref().child("bicycle" + this.newBicycle.id);
      storageRef.put(this.file).then(() => {
        storageRef.getDownloadURL().then(i => {
          this.newBicycle.src = i;
          var newBicycleToPush = this.newBicycle;
          db.ref("bicycles").push(newBicycleToPush);
          db.ref("bicycles").once("value", snapshot => {
            this.bicycles = Object.values(snapshot.val());
            this.newBicycle.id = null;
            this.file = null;
            this.isSaving = false;
            this.$refs["add-bicycle"].hide();
          });
        });
      });
    }
  }
};
</script>

<style lang="css" scoped></style>
