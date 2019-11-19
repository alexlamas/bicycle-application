<template>
  <b-modal
    :ok-variant="'danger'"
    no-fade
    @ok="deleteUser(user.key)"
    :ok-title="'Delete'"
    id="delete-user-modal"
    title="Delete User"
  >
    Are you sure you want to delete the selected user?
  </b-modal>
</template>

<script>
import { db } from "@/firebase";
export default {
  props: {
    user: Object
  },
  methods: {
    deleteUser(key) {
      if (this.user.bicycleID) {
        db.ref("bicycles/" + this.user.bicycleID + "/currentUser").set(null);
      }
      db.ref("people/" + key).remove();
    }
  }
};
</script>
