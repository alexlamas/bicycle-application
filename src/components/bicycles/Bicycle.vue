<template>
  <b-card href="#" :img-src="bicycle.src" img-top>
    <div class="d-flex">
      <div class="my-auto">
        <b-badge variant="light" class="mr-2"
          ><span class="text-muted ">ID: </span>{{ formattedID }}</b-badge
        >

        <b-badge
          v-if="status == 'on loan'"
          variant="secondary"
          :id="`tooltip-${bicycle.key}`"
          style="width: 4rem"
          class="align-middle loan-badge"
          >{{ status }}</b-badge
        >
        <b-badge
          v-if="status == 'maintenance'"
          variant="warning"
          class="align-middle"
          >{{ status }}</b-badge
        >
        <b-badge
          v-if="status == 'unavailable'"
          variant="warning"
          class="align-middle"
          >{{ status }}</b-badge
        >
        <b-tooltip
          v-if="status == 'on loan'"
          :target="`tooltip-${bicycle.key}`"
          triggers="hover"
        >
          <span style="text-transform:capitalize">{{ currentUserName }}</span>
        </b-tooltip>
      </div>

      <b-button
        v-if="withButton"
        @click="setBicycle"
        variant="light"
        size="sm"
        class="ml-auto"
        >Choose</b-button
      >
      <b-button-group v-if="deletable" class="ml-auto">
        <b-button @click="history($event.target)" variant="light" size="sm">
          H
        </b-button>

        <b-button
          @click="unavailable"
          :bicycle="bicycle"
          variant="light"
          size="sm"
          :class="{ active: status == 'unavailable' }"
        >
          <font-awesome-icon icon="ban" />
        </b-button>
        <b-button
          @click="outOfOrder"
          :bicycle="bicycle"
          variant="light"
          size="sm"
          :class="{ active: status == 'maintenance' }"
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
      v-if="deletable"
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
      popoverShow: false,
      currentUserName: ""
    };
  },
  props: {
    bicycle: Object,
    withButton: Boolean,
    deletable: Boolean
  },
  methods: {
    history(button) {
      var key = this.bicycle.key;
      this.$emit("setBicycle", key);
      this.$root.$emit("bv::show::modal", "history", button);
    },
    outOfOrder() {
      var key = this.bicycle.key;
      if (this.bicycle.currentUser == "fixing") {
        db.ref("bicycles/" + key + "/currentUser").set(null);
      } else if (this.bicycle.currentUser == "unavailable") {
        db.ref("bicycles/" + key + "/currentUser").set("fixing");
      } else if (this.bicycle.currentUser) {
        alert(
          "Please return the bicycle before setting it to maintenance mode."
        );
      } else {
        db.ref("bicycles/" + key + "/currentUser").set("fixing");
      }
    },
    unavailable() {
      var key = this.bicycle.key;
      if (this.bicycle.currentUser == "unavailable") {
        db.ref("bicycles/" + key + "/currentUser").set(null);
      } else if (this.bicycle.currentUser == "fixing") {
        db.ref("bicycles/" + key + "/currentUser").set("unavailable");
      } else if (this.bicycle.currentUser) {
        alert(
          "Please return the bicycle before setting it to unvailable mode."
        );
      } else {
        db.ref("bicycles/" + key + "/currentUser").set("unavailable");
      }
    },
    setBicycle() {
      var key = this.bicycle.key;
      var id = this.bicycle.id;
      this.$emit("setBicycle", key, id);
    },
    deleteBicycle() {
      var key = this.bicycle.key;
      var id = this.bicycle.id.toString();
      if (this.bicycle.currentUser) {
        db.ref("people/" + this.bicycle.currentUser + "/bicycleKey").set(null);
      }
      db.ref("bicycles/" + key).remove();
      storage
        .ref()
        .child("bicycle" + id)
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
        if (this.bicycle.currentUser == "fixing") {
          status = "maintenance";
        } else if (this.bicycle.currentUser == "unavailable") {
          status = "unavailable";
        } else {
          status = "on loan";
        }
      }
      return status;
    },
    formattedID() {
      var id;
      var digit = parseInt(this.bicycle.id);
      if (digit < 10) {
        id = "00" + digit;
      } else if (digit < 99) {
        id = "0" + digit;
      } else {
        id = digit;
      }
      return id;
    }
  },
  created() {
    if (this.bicycle.currentUser) {
      if (
        this.bicycle.currentUser != "fixing" &&
        this.bicycle.currentUser != "maintenance"
      ) {
        db.ref("people/" + this.bicycle.currentUser + "/name").on(
          "value",
          snapshot => {
            this.currentUserName = snapshot.val();
          }
        );
      }
    }
  }
};
</script>
<style scoped>
.card-img-top {
  height: 180px;
  object-fit: cover;
}
.loan-badge:hover {
  opacity: 0.8;
  cursor: default;
}
.badge {
  text-transform: capitalize;
}
</style>
