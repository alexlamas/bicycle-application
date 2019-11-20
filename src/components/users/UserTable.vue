<template>
  <b-row class="mt-2 px-3">
    <b-table
      stacked="sm"
      ref="userTable"
      :items="people"
      :fields="fields"
      :filter="userSearch"
      small
    >
      <template v-slot:cell(name)="row">
        {{ row.item.name }}
        <b-badge class="ml-2" v-if="row.item.helper == true">Helper</b-badge>
        <b-badge class="ml-2" v-if="row.item.makerspace == true"
          >Makerspace</b-badge
        >
      </template>
      <template v-slot:cell(num)="row">
        <b-badge variant="light"
          >{{ row.item.num
          }}<span class="text-muted">
            {{ row.item.num == 1 ? "rental" : "rentals" }}</span
          >
        </b-badge>
      </template>
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
      <template class="text-right" v-slot:cell(status)="row">
        <b-button-group>
          <b-button
            v-if="!row.item.bicycleID && !row.item.penalty"
            @click="selectUser(row.item)"
            variant="light"
            size="sm"
            style="width:10rem; text-align:left"
            class="pl-3"
          >
            Choose Bike
          </b-button>
          <b-button
            v-if="row.item.penalty"
            @click="selectUser(row.item)"
            variant="light"
            size="sm"
            disabled
            style="width:10rem; text-align:left"
            class="pl-3"
          >
            <b-badge
              >{{ row.item.penalty }}
              {{ row.item.penalty == 1 ? "day" : "days" }} remaining</b-badge
            >
          </b-button>
          <b-button
            v-if="row.item.bicycleID"
            @click="returnBicycle(row.item)"
            variant="warning"
            size="sm"
            style="width:10rem; text-align:left"
            class="pl-3"
          >
            Return Bike
            <b-badge
              v-if="row.item.timeRenting < 1"
              class="ml-2"
              variant="light"
              >{{ row.item.timeRenting }} days</b-badge
            >
            <b-badge
              v-if="row.item.timeRenting > 0"
              class="ml-2"
              variant="danger"
              >{{ row.item.timeRenting }} days</b-badge
            >
          </b-button>
          <b-dropdown
            v-if="!row.item.bicycleID"
            size="sm"
            id="dropdown-1"
            variant="light"
          >
            <b-dropdown-item @click="editModal(row.item, $event.target)"
              >Edit</b-dropdown-item
            >
            <b-dropdown-item @click="deleteModal(row.item, $event.target)"
              >Delete</b-dropdown-item
            >
          </b-dropdown>
          <b-dropdown
            v-if="row.item.bicycleID"
            size="sm"
            id="dropdown-1"
            variant="warning"
          >
            <b-dropdown-item @click="editModal(row.item, $event.target)"
              >Edit</b-dropdown-item
            >
            <b-dropdown-item @click="deleteModal(row.item, $event.target)"
              >Delete</b-dropdown-item
            >
          </b-dropdown>
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
          class: "text-capitalize",
          sortable: true
        },
        {
          key: "code",
          label: "Ausweis",
          sortable: true
        },
        {
          key: "num",
          label: "Usage",
          sortable: true
        },
        {
          key: "status",
          label: "",
          class: "text-md-right text-center"
        }
      ]
    };
  },
  props: {
    userSearch: String
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
      var rentalDate = new Date();
      rentalDate = Math.ceil(rentalDate.getTime() / 1000 / 60 / 60 / 24);
      var userKey = this.selectedUser.key;
      db.ref("people/" + userKey + "/bicycleID").set(key);
      db.ref("people/" + userKey + "/rentalDate").set(rentalDate);
      db.ref("people/" + userKey + "/bicycleID").set(id);
      db.ref("bicycles/" + key + "/currentUser").set(userKey);
      this.$refs.userTable.clearSelected();
    }
  },
  created: function() {
    var today = new Date();
    today = Math.ceil(today.getTime() / 1000 / 60 / 60 / 24);
    db.ref("people").on("value", snapshot => {
      this.people = [];
      snapshot.forEach(doc => {
        this.people.push({
          key: doc.key,
          name: doc.val().name,
          code: doc.val().code,
          num: doc.val().num ? doc.val().num : 0,
          helper: doc.val().helper,
          makerspace: doc.val().makerspace,
          penalty: Math.ceil(doc.val().penalty / 1000 / 60 / 60 / 24 - today),
          bicycleID: doc.val().bicycleID,
          timeRenting: today - doc.val().rentalDate
        });
      });
    });
  }
};
</script>
