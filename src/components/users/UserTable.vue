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
      <template v-slot:cell(code)="row">
        <b-badge v-if="row.item.code" variant="light"
          >{{ row.item.code }}
        </b-badge>
      </template>
      <template v-slot:cell(num)="row">
        <b-badge variant="light"
          >{{ row.item.num
          }}<span class="text-muted">
            {{ row.item.num == 1 ? "rental" : "rentals" }}</span
          >
        </b-badge>
      </template>
      <template v-slot:cell(status)="row">
        <b-button-group>
          <b-button
            v-if="!row.item.bicycleID && !row.item.penalty"
            @click="selectUser(row.item)"
            variant="outline-primary"
            size="sm"
            style="width:10rem;"
          >
            Choose Bike
          </b-button>
          <b-button
            v-if="row.item.penalty"
            @click="selectUser(row.item)"
            variant="outline-secondary"
            size="sm"
            style="width:10rem;"
            disabled
          >
            Penalty:
            <b-badge
              >{{ row.item.penalty }}
              {{ row.item.penalty > 1 ? "days" : "day" }}</b-badge
            >
          </b-button>
          <b-button
            v-if="row.item.bicycleID"
            @click="returnBicycle(row.item)"
            variant="warning"
            size="sm"
            style="width:10rem;"
          >
            Return Bike
            <b-badge
              v-if="row.item.timeRenting < 1"
              class="ml-2"
              variant="light"
              >0 days</b-badge
            >
            <b-badge
              v-if="row.item.timeRenting > 0"
              class="ml-2"
              variant="danger"
              >{{ row.item.timeRenting }} days</b-badge
            >
          </b-button>
          <b-dropdown size="sm" id="dropdown-1" variant="outline-secondary">
            <b-dropdown-item @click="editModal(row.item, $event.target)"
              >Edit</b-dropdown-item
            >
            <b-dropdown-item @click="deleteModal(row.item, $event.target)"
              >Delete</b-dropdown-item
            >
          </b-dropdown>
          <!-- <b-button
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
          </b-button> -->
        </b-button-group>
      </template>
    </b-table>
    <edit-user :user="selectedUser" />
    <delete-user :user="selectedUser" />
    <choose-bicycle v-on:setBicycle="setBicycle" />
    <return-bicycle :bicycle="selectedBicycle" :user="selectedUser" />
  </b-row>
</template>

<script>
import EditUser from "./EditUser";
import DeleteUser from "./DeleteUser";
import ChooseBicycle from "./ChooseBicycle";
import ReturnBicycle from "./ReturnBicycle";
import { db } from "@/firebase";
export default {
  data() {
    return {
      selectedUser: {},
      selectedBicycle: {},
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
          label: "Borrowed",
          sortable: true
        },
        {
          key: "status",
          label: "",
          sortable: true
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
      var key = user.bicycleID;
      var bicycle;
      db.ref("bicycles/" + key).on("value", function(snapshot) {
        bicycle = snapshot.val();
        bicycle.key = snapshot.key;
      });
      this.$root.$emit("bv::show::modal", "return-bicycle");
      this.selectedBicycle = bicycle;
      this.selectedUser = user;
    },
    setBicycle(key, id) {
      var d = new Date();
      d = d.getTime() / 1000 / 60 / 60 / 24;
      var userKey = this.selectedUser.key;
      db.ref("people/" + userKey + "/bicycleID").set(key);
      db.ref("people/" + userKey + "/rentalDate").set(d);
      db.ref("people/" + userKey + "/bicycleID").set(id);
      db.ref("bicycles/" + key + "/currentUser").set(userKey);
      this.$refs.userTable.clearSelected();
      /* eslint-disable no-console */
      console.log(d);
    }
  },
  created: function() {
    var d = new Date();
    d = d.getTime() / 1000 / 60 / 60 / 24;
    db.ref("people").on("value", snapshot => {
      this.people = [];
      snapshot.forEach(doc => {
        this.people.push({
          key: doc.key,
          name: doc.val().name,
          code: doc.val().code,
          num: doc.val().num,
          penalty: doc.val().penalty ? doc.val().penalty : "",
          bicycleID: doc.val().bicycleID,
          timeRenting: Math.floor(d - doc.val().rentalDate)
        });
      });
    });
    /* eslint-disable no-console */
    console.log(this.people);
  }
};
</script>
