<template>
  <b-row class="mt-4 px-3">
    <b-table
      ref="userTable"
      :items="people"
      :fields="fields"
      :filter="filterVariable"
      @row-clicked="selectUser"
      :select-mode="'single'"
      small
      hover
      selectable
    >
      <template v-slot:cell(actions)="row">
        <b-button
          @click="editModal(row.item, $event.target)"
          variant="outline-secondary"
          size="sm"
          class="mr-1"
        >
          Edit
        </b-button>
        <b-button
          @click="deleteModal(row.item, $event.target)"
          variant="outline-danger"
          size="sm"
        >
          Delete
        </b-button>
      </template>
    </b-table>
    <edit-user :userArray="selectedUser" />
    <delete-user :userArray="selectedUser" />
    <choose-bicycle v-on:setBicycle="setBicycle" />
  </b-row>
</template>

<script>
import EditUser from "./EditUser";
import DeleteUser from "./DeleteUser";
import ChooseBicycle from "./ChooseBicycle";
import { db } from "../firebase";
export default {
  data() {
    return {
      selectedUser: {},
      selectedBicycleKey: "",
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
  components: {
    EditUser,
    DeleteUser,
    ChooseBicycle
  },
  methods: {
    deleteModal(userArray, button) {
      this.$root.$emit("bv::show::modal", "delete-user-modal", button);
      this.selectedUser = userArray;
    },
    editModal(userArray, button) {
      this.$root.$emit("bv::show::modal", "edit-user-modal", button);
      this.selectedUser = userArray;
    },
    selectUser(record) {
      this.$root.$emit("bv::show::modal", "choose-bicycle");
      this.selectedUser = record;
      /* eslint-disable no-console */
      console.log(this.selectedUser);
    },
    setBicycle(key) {
      this.selectedBicycleKey = key;
      this.$refs.userTable.clearSelected();
      /* eslint-disable no-console */
      console.log(this.selectedBicycleKey);
    }
  },
  created: function() {
    db.ref("people").on("value", snapshot => {
      this.people = [];
      snapshot.forEach(doc => {
        this.people.push({
          key: doc.key,
          name: doc.val().name,
          code: doc.val().code,
          num: doc.val().num
        });
      });
    });
  }
};
</script>

<style lang="css" scoped></style>
