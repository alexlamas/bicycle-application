<template>
  <b-row class="mt-4 px-3">
    <b-table
      :items="people"
      :fields="fields"
      :filter="filterVariable"
      small
      hover
      selectable
    >
      <template v-slot:cell(actions)="row">
        <b-button
          v-b-modal.edit-modal
          variant="outline-secondary"
          size="sm"
          @click="editUser(row.item)"
          class="mr-1"
          >Edit</b-button
        >
        <b-button
          v-b-modal.modal-3
          variant="outline-danger"
          size="sm"
          @click="deleteUser(row.item)"
          class="mr-1"
        >
          Delete
        </b-button>
      </template>
    </b-table>
  </b-row>
</template>

<script>
import { db } from "../firebase";
export default {
  data() {
    return {
      people: [],
      fields: [
        {
          key: "name",
          label: "Name",
          sortable: true
        },
        {
          key: "code",
          label: "Code",
          sortable: true
        },
        {
          key: "num",
          label: "#",
          sortable: true
        },
        {
          key: "actions",
          label: "",
          class: "text-right"
        }
      ]
    };
  },
  props: {
    filterVariable: String
  },
  beforeMount: function() {
    db.ref("people").on("value", snapshot => {
      this.people = Object.values(snapshot.val());
    });
  }
};
</script>

<style lang="css" scoped></style>
