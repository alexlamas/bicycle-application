<template>
  <b-row class="mt-4 px-3">
    <b-table
      stacked="sm"
      ref="userTable"
      :items="people"
      :fields="fields"
      :filter="filterVariable"
      small
      hover
    >
      <template v-slot:cell(actions)="row">
        <b-button
          v-if="row.item.bicycleKey == ''"
          @click="selectUser(row.item)"
          variant="outline-primary"
          size="sm"
          class="mr-1"
          style="width:8rem;"
        >
          Choose Bike
        </b-button>
        <b-button
          v-if="row.item.bicycleKey != ''"
          @click="returnBicycle(row.item)"
          variant="warning"
          size="sm"
          class="mr-1"
          style="width:8rem;"
        >
          Return Bike
        </b-button>
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
    <return-bicycle :bicycle="selectedBicycle" />
  </b-row>
</template>

<script>
import EditUser from "./EditUser";
import DeleteUser from "./DeleteUser";
import ChooseBicycle from "./ChooseBicycle";
import ReturnBicycle from "./ReturnBicycle";
import { db } from "../firebase";
export default {
  data() {
    return {
      selectedUser: {},
      selectedBicycle: {},
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
          label: ""
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
    ChooseBicycle,
    ReturnBicycle
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
    selectUser(user) {
      this.$root.$emit("bv::show::modal", "choose-bicycle");
      this.selectedUser = user;
    },
    returnBicycle(user) {
      var key = user.bicycleKey;
      var bicycle;
      db.ref("bicycles/" + key).on("value", function(snapshot) {
        bicycle = snapshot.val();
        bicycle.key = snapshot.key;
      });
      this.$root.$emit("bv::show::modal", "return-bicycle");
      this.selectedBicycle = bicycle;
      this.selectedUser = user;
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
          bicycleKey: doc.val().bicycleKey,
          status: doc.val().bicycleKey == "" ? "normal" : "renting"
        });
      });
    });
  }
};
</script>

<style lang="css" scoped></style>
