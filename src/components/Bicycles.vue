<template>
  <div>
    <navbar />
    <b-container>
      <b-navbar sticky class="px-0 mb-1" style="background-color:white">
        <b-form-input
          v-model.lazy="bicycleSearch"
          type="search"
          placeholder="Search..."
          size="sm"
        />

        <b-form-select
          v-model="filters"
          :options="options"
          class="ml-2"
          style="max-width:8rem"
          size="sm"
        >
        </b-form-select>
        <b-button
          v-b-modal.add-bicycle-modal
          variant="primary"
          size="sm"
          class="ml-2"
          ><font-awesome-icon icon="plus"
        /></b-button>
      </b-navbar>
      <add-bicycle />
      <div v-for="i in Math.ceil(bicycles.length / 3)" v-bind:key="i.id">
        <b-card-group columns>
          <bicycle
            :deletable="true"
            v-for="bicycle in filteredBicycles.slice((i - 1) * 3, i * 3)"
            :bicycle="bicycle"
            :key="bicycle.key"
            v-on:setBicycle="setBicycleHistory"
          />
        </b-card-group>
      </div>
    </b-container>
    <history :bicycleHistory="bicycleHistory" />
  </div>
</template>

<script>
import Bicycle from "./bicycles/Bicycle";
import AddBicycle from "./bicycles/AddBicycle";
import Navbar from "./Navbar";
import History from "./bicycles/History.vue";

import { db } from "@/firebase";

export default {
  components: {
    AddBicycle,
    Bicycle,
    Navbar,
    History
  },
  data() {
    return {
      bicycleHistory: [],
      bicycleSearch: "",
      filters: null,
      options: [
        { value: null, text: "All" },
        { value: "available", text: "Available" },
        { value: "onloan", text: "On Loan" },
        { value: "maintenance", text: "Maintenance" },
        { value: "unavailable", text: "Unavailable" }
      ]
    };
  },
  methods: {
    compare(a, b) {
      if (a.id > b.id) return 1;
      else return -1;
    },
    setBicycle(bicycleKey, bicycleID) {
      this.selectedBicycle = { key: bicycleKey, id: bicycleID };
    },
    setBicycleHistory(bicycleKey) {
      this.bicycleHistory = [];
      Object.values(this.$store.state.rentals).forEach(rentalUser => {
        Object.values(rentalUser).forEach(rental => {
          if (bicycleKey == rental.bicycleKey) {
            var name;
            db.ref("people/" + rental.userKey)
              .once("value")
              .then(snapshot => {
                name = snapshot.val().name;
                this.bicycleHistory.push({
                  ...rental,
                  user: name
                });
              });
          }
        });
      });
    }
  },
  computed: {
    bicycles() {
      return this.$store.state.bicycles;
    },
    filteredBicycles() {
      var filtered;
      filtered = this.$store.state.bicycles.filter(bicycle => {
        var testString;
        if (bicycle.id < 10) {
          testString = "00" + bicycle.id.toString();
        } else if (bicycle.id < 100) {
          testString = "0" + bicycle.id.toString();
        } else {
          testString = bicycle.id.toString();
        }
        return (
          !this.bicycleSearch || testString.indexOf(this.bicycleSearch) > -1
        );
      });
      if (this.filters) {
        if (this.filters.includes("unavailable")) {
          filtered = filtered.filter(bicycle => {
            return bicycle.currentUser == "unavailable";
          });
        }
        if (
          this.filters.includes("available") &&
          !this.filters.includes("unavailable")
        ) {
          filtered = filtered.filter(bicycle => {
            return !bicycle.currentUser;
          });
        }
        if (this.filters.includes("maintenance")) {
          filtered = filtered.filter(bicycle => {
            return bicycle.currentUser == "fixing";
          });
        }
        if (this.filters.includes("onloan")) {
          filtered = filtered.filter(bicycle => {
            return (
              bicycle.currentUser &&
              bicycle.currentUser != "fixing" &&
              bicycle.currentUser != "unavailable"
            );
          });
        }
      }
      filtered = filtered.sort(this.compare);
      return filtered;
    }
  },
  mounted: function() {
    if (!this.$store.state.rentals) this.$store.commit("fetchRentals");
    if (!this.$store.state.bicycles.length) this.$store.commit("fetchBicycles");
  }
};
</script>
