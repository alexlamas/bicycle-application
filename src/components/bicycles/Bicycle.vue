<template>
  <b-card href="#" style="max-width: 30rem;" :img-src="bicycle.src" img-top>
    <div class="d-flex">
      <div class="my-auto">
        <b-badge variant="light"
          ><span class="text-muted">ID: </span>{{ formattedID }}</b-badge
        >
        <b-badge v-if="status == 'available'" variant="primary" class=" ml-2">{{
          status
        }}</b-badge>
        <b-badge
          v-if="status == 'on loan'"
          :id="`tooltip-${bicycle.key}`"
          variant="warning"
          class="align-middle ml-2 loan-badge"
          >{{ status }}</b-badge
        >
        <b-badge
          v-if="status == 'maintenance'"
          variant="warning"
          class="align-middle ml-2"
          >{{ status }}</b-badge
        >
        <b-tooltip :target="`tooltip-${bicycle.key}`" triggers="hover">
          <span style="text-transform:capitalize">{{ userName }}</span>
        </b-tooltip>
      </div>

      <b-button
        v-if="withButton"
        @click="setBicycle"
        variant="outline-primary"
        size="sm"
        class="ml-auto"
        >Lend</b-button
      >
      <b-button-group v-if="deletable" class="ml-auto">
        <b-button
          @click="outOfOrder"
          :bicycle="bicycle"
          variant="light"
          size="sm"
        >
          <font-awesome-icon icon="wrench" />
        </b-button>
        <b-button
          :id="`popover-${bicycle.key}`"
          :bicycle="bicycle"
          variant="light"
          size="sm"
        >
          <font-awesome-icon icon="trash" />
        </b-button>
      </b-button-group>
    </div>

    <b-popover
      :target="`popover-${bicycle.key}`"
      triggers="click"
      placement="bottom"
      :show.sync="popoverShow"
    >
      <b-button @click="popoverShow = false" size="sm" variant="light"
        >Cancel</b-button
      >
      <b-button @click="deleteBicycle" class="ml-2" size="sm" variant="danger"
        >Delete</b-button
      >
    </b-popover>
    <b-modal ok-only ok-variant="warning" id="renting" title="Error">
      <p>
        Please go back to the User page and return the bicycle before setting it
        to maintenance mode.
      </p>
    </b-modal>
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
    outOfOrder() {
      var key = this.bicycle.key;
      if (this.bicycle.currentUser == "fixing") {
        db.ref("bicycles/" + key + "/currentUser").set(null);
      } else if (this.bicycle.currentUser) {
        alert(
          "Please return the bicycle before setting it to maintenance mode."
        );
      } else {
        db.ref("bicycles/" + key + "/currentUser").set("fixing");
      }
    },
    setBicycle() {
      var key = this.bicycle.key;
      var id = this.bicycle.id;
      this.$emit("setBicycle", key, id);
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
    userName() {
      var name;
      db.ref("people/" + this.bicycle.currentUser + "/name").on(
        "value",
        snapshot => {
          name = snapshot.val();
        }
      );
      return name;
    },
    status() {
      var status;
      if (!this.bicycle.currentUser) {
        status = "available";
      }
      if (this.bicycle.currentUser) {
        if (this.bicycle.currentUser == "fixing") {
          status = "maintenance";
        } else {
          status = "on loan";
        }
      }
      return status;
    },
    formattedID() {
      var id;
      if (this.bicycle.id < 10) {
        id = "00" + this.bicycle.id;
      } else if (this.bicycle.id < 99) {
        id = "0" + this.bicycle.id;
      } else {
        id = this.bicycle.id;
      }
      return id;
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
.loan-badge:hover {
  opacity: 0.8;
  cursor: default;
}
</style>
