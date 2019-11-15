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
      var bicycleKey = this.user.bicycleKey;
      if (bicycleKey != "") {
        db.ref("bicycles/" + bicycleKey + "/currentUser").set("none");
      }
      db.ref("people/" + key).remove();
    }
  }
};
</script>
