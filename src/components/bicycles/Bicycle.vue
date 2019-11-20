<template>
  <b-card href="#" style="max-width: 30rem;" :img-src="bicycle.src" img-top>
    <div class="d-flex">
      <div class="my-auto">
        <b-badge variant="light"
          ><span class="text-muted">ID: </span>{{ bicycle.id }}</b-badge
        >
        <b-badge v-if="status == 'available'" variant="primary" class=" ml-2">{{
          status
        }}</b-badge>
        <b-badge
          v-if="status == 'busy'"
          variant="warning"
          class="align-middle ml-2"
          >{{ status }}</b-badge
        >
      </div>

      <b-button
        v-if="withButton"
        @click="setBicycle"
        variant="outline-primary"
        size="sm"
        class="ml-auto"
        >Lend</b-button
      >
      <b-button
        v-if="deletable"
        :id="`popover-${bicycle.key}`"
        :bicycle="bicycle"
        variant="light"
        size="sm"
        class="ml-auto"
      >
        <font-awesome-icon icon="trash" />
      </b-button>
    </div>

    <b-popover
      :target="`popover-${bicycle.key}`"
      triggers="click"
      placement="bottom"
      :show.sync="popoverShow"
    >
      <b-button @click="popoverShow = false" size="sm" variant="secondary"
        >Cancel</b-button
      >
      <b-button @click="deleteBicycle" class="ml-2" size="sm" variant="danger"
        >Delete</b-button
      >
    </b-popover>
  </b-card>
</template>

<script>
import { db } from "@/firebase";
import { storage } from "@/firebase";
export default {
  data() {
    return {
      popoverShow: false
    };
  },
  components: {},
  props: {
    bicycle: Object,
    withButton: Boolean,
    deletable: Boolean
  },
  methods: {
    setBicycle() {
      var key = this.bicycle.key;
      this.$emit("setBicycle", key);
    },
    deleteBicycle() {
      var key = this.bicycle.key;
      if (this.bicycle.currentUser) {
        db.ref("people/" + this.bicycle.currentUser + "/bicycleKey").set(null);
      }
      db.ref("bicycles/" + key).remove();
      storage
        .ref()
        .child("bicycle" + this.bicycle.id)
        .delete();
    }
  },
  computed: {
    status() {
      var status;
      if (!this.bicycle.currentUser) {
        status = "available";
      }
      if (this.bicycle.currentUser) {
        status = "busy";
      }
      return status;
    }
  }
};
</script>
<style>
.card-img-top {
  height: 150px;
  object-fit: cover;
}
.card-body {
  height: 46px !important;
}
</style>
