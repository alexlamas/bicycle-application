<template>
  <b-row class="mt-2 px-3">
    <b-table
      stacked="md"
      ref="userTable"
      :items="filteredPeople"
      :fields="filteredFields"
      :filter="userSearch"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      small
    >
      <template v-slot:cell(name)="row">
        {{ row.item.name }}
        <b-badge class="mr-1" variant="warning" v-if="row.item.bicycleID"
          >ID: {{ formattedID(row.item.bicycleID) }}</b-badge
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
      <template v-slot:cell(bicycleKey)="row">
        <b-button-group>
          <b-button
            v-if="!row.item.bicycleKey && !row.item.penalty"
            @click="selectUser(row.item)"
            variant="light"
            size="sm"
            class="pl-2"
          >
            Choose Bike
          </b-button>
          <b-button
            v-if="row.item.penalty"
            @click="selectUser(row.item)"
            variant="light"
            size="sm"
            disabled
            class="pl-2"
          >
            <b-badge
              >{{ row.item.penalty }}
              {{ row.item.penalty == 1 ? "day" : "days" }} remaining</b-badge
            >
          </b-button>
          <b-button
            v-if="row.item.bicycleKey"
            @click="returnBicycle(row.item)"
            variant="warning"
            size="sm"
          >
            Return Bike
            <b-badge
              v-if="
                row.item.timeRenting < 1 &&
                  !row.item.helper &&
                  !row.item.makerspace
              "
              class="ml-2"
              variant="light"
              style="width:4rem"
              >{{ row.item.timeRenting }} days</b-badge
            >
            <b-badge
              v-if="
                row.item.timeRenting > 0 &&
                  !row.item.helper &&
                  !row.item.makerspace
              "
              class="ml-2"
              style="width:4rem"
              variant="danger"
              >{{ row.item.timeRenting }} days</b-badge
            >
          </b-button>
          <b-dropdown
            v-if="!row.item.bicycleKey"
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
            v-if="row.item.bicycleKey"
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
      sortBy: "bicycleKey",
      sortDesc: true,
      fields: [
        {
          key: "name",
          label: "Name",
          class: "text-capitalize",
          sortable: true
        },
        {
          key: "organisation",
          label: "Organisation",
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
          sortable: true,
          class: " d-lg-table-cell"
        },
        {
          key: "bicycleKey",
          label: "",
          sortable: true,
          class: " text-md-right"
        }
      ]
    };
  },
  props: {
    userSearch: String,
    filters: Array
  },
  components: {
    EditUser,
    DeleteUser,
    ChooseBicycle,
    ReturnBicycle
  },
  computed: {
    filteredFields() {
      if (this.filters.includes("visitors")) {
        return this.fields.filter(f => {
          return f.key != "organisation";
        });
      }
      if (this.filters.includes("volunteers")) {
        return this.fields.filter(f => {
          return f.key != "code";
        });
      } else {
        return this.fields;
      }
    },
    filteredPeople() {
      var filtered;
      filtered = this.people;
      if (this.filters.includes("renting")) {
        filtered = this.people.filter(p => {
          return p.bicycleKey;
        });
      }
      if (this.filters.includes("volunteers")) {
        filtered = filtered.filter(p => {
          return p.volunteer;
        });
      }
      if (this.filters.includes("helpers")) {
        filtered = filtered.filter(p => {
          return p.helper;
        });
      }
      if (this.filters.includes("visitors")) {
        filtered = filtered.filter(p => {
          return !p.helper && !p.volunteer;
        });
      }

      return filtered;
    }
  },
  methods: {
    formattedID(id) {
      var formatted;
      if (id < 10) {
        formatted = "00" + id;
      } else if (id < 99) {
        formatted = "0" + id;
      } else {
        formatted = id;
      }
      return formatted;
    },
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
    setBicycle(key, id) {
      var rentalDate = new Date();
      rentalDate = Math.ceil(rentalDate.getTime() / 1000 / 60 / 60 / 24);
      var userKey = this.selectedUser.key;
      db.ref("people/" + userKey + "/bicycleKey").set(key);
      db.ref("people/" + userKey + "/bicycleID").set(id);
      db.ref("people/" + userKey + "/rentalDate").set(rentalDate);
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
          volunteer: doc.val().volunteer,
          organisation: doc.val().organisation,
          penalty:
            Math.ceil(doc.val().penalty / 1000 / 60 / 60 / 24 - today) > 1
              ? Math.ceil(doc.val().penalty / 1000 / 60 / 60 / 24 - today)
              : null,
          bicycleKey: doc.val().bicycleKey ? doc.val().bicycleKey : null,
          bicycleID: doc.val().bicycleID ? parseInt(doc.val().bicycleID) : null,
          timeRenting: today - doc.val().rentalDate
        });
      });
    });
    /* eslint-disable no-console */
    console.log(this.people.bicycleID);
  }
};
</script>

<style>
.b-table-stacked-md [data-label]::before {
  text-align: left !important;
  width: 28% !important;
}
@media (max-width: 576px) {
  .table.b-table.b-table-stacked-md div {
    padding-left: 0 !important;
  }
  .table.b-table.b-table-stacked-md > tbody > tr > [data-label] > div {
    width: 72% !important;
  }
}
</style>
