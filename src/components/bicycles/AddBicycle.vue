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
        accept="image/*"
        :state="Boolean(file)"
        placeholder="Choose Image..."
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
        .equalTo(parseInt(this.newBicycle.id))
        .on("value", snapshot => {
          if (!snapshot.val()) {
            this.compress(this.file);
          } else {
            this.idTaken = true;
            this.$bvModal.show("idTaken");
          }
        });
    },
    compress(image) {
      const width = 600;
      const fileName = image.name;
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = event => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const elem = document.createElement("canvas");
          elem.width = width;
          const height = width * (img.height / img.width);
          elem.height = height;
          const ctx = elem.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          ctx.canvas.toBlob(
            blob => {
              const file = new File([blob], fileName, {
                type: "image/jpeg"
              });
              this.saveBicycle(file);
            },
            "image/jpeg",
            1
          );
        };
      };
    },
    saveBicycle(file) {
      this.isSaving = true;
      var storageRef = storage.ref().child("bicycle" + this.newBicycle.id);
      storageRef.put(file).then(() => {
        storageRef.getDownloadURL().then(i => {
          this.newBicycle.src = i;
          db.ref("bicycles").push(this.newBicycle);
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
