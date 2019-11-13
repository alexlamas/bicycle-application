<template>
  <b-modal
    :ok-variant="'danger'"
    no-fade
    @ok="deleteUser(userArray.key)"
    :ok-title="'Delete'"
    id="delete-user-modal"
    title="Delete User"
  >
    Are you sure you want to delete the selected user?
  </b-modal>
</template>

<script>
import { db } from "../firebase";
export default {
  props: {
    userArray: Object
  },
  methods: {
    deleteUser(key) {
      db.ref("people/" + key).remove();
    }
  }
};
</script>
