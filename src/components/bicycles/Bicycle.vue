<template>
  <b-card href="#" style="max-width: 30rem;" :img-src="bicycle.src" img-top>
    <b-badge variant="light" class="align-middle"
      ><span class="text-muted">ID: </span>{{ bicycle.id }}</b-badge
    >
    <b-badge
      v-if="status == 'available'"
      variant="primary"
      class="align-middle ml-2"
      >{{ status }}</b-badge
    >
    <b-badge
      v-if="status == 'busy'"
      variant="warning"
      class="align-middle ml-2"
      >{{ status }}</b-badge
    >
    <b-button
      v-if="withButton"
      @click="setBicycle"
      variant="outline-primary"
      class="float-right align-middle btn-sm"
      >Lend</b-button
    >
    <b-button
      v-if="deletable"
      :id="`popover-${bicycle.key}`"
      :bicycle="bicycle"
      variant="outline-danger"
      class="float-right align-middle btn-sm"
    >
      <font-awesome-icon icon="trash" />
    </b-button>
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
      var id = this.bicycle.id;
      this.$emit("setBicycle", key, id);
    },
    deleteBicycle() {
      var key = this.bicycle.key;
      if (this.bicycle.currentUser) {
        db.ref("people/" + this.bicycle.currentUser + "/bicycleID").set(null);
      }
      db.ref("bicycles/" + key).remove();
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
</style>
