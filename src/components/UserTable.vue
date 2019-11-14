<template>
  <b-row class="mt-4 px-3">
    <b-table
      stacked="sm"
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
          <font-awesome-icon icon="trash" />
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
          key: "status",
          label: "Status",
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
    },
    setBicycle(key) {
      this.selectedBicycleKey = key;
      var userKey = this.selectedUser.key;
      db.ref("people/" + userKey + "/bicycleKey").set(key);
      db.ref("bicycles/" + key + "/currentUser").set(userKey);

      this.$refs.userTable.clearSelected();
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
          num: doc.val().num,
          status: doc.val().bicycleKey == "" ? "normal" : "renting"
        });
      });
    });
  }
};
</script>

<style lang="css" scoped></style>
