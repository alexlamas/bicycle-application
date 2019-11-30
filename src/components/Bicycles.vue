<template>
  <div>
    <navbar />

    <b-container>
      <b-navbar sticky class="px-0" style="background-color:white">
        <b-form-input
          v-model="bicycleSearch"
          type="search"
          placeholder="Search..."
          size="sm"
        />

        <b-form-select
          v-model="filters"
          :options="options"
          class="ml-2 my-1"
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
          />
        </b-card-group>
      </div>
    </b-container>
  </div>
</template>

<script>
import Bicycle from "./bicycles/Bicycle";
import AddBicycle from "./bicycles/AddBicycle";
import Navbar from "./Navbar";

import { db } from "@/firebase";

export default {
  components: {
    AddBicycle,
    Bicycle,
    Navbar
  },
  data() {
    return {
      bicycles: [],
      bicycleSearch: "",
      filters: null,
      options: [
        { value: null, text: "All" },
        { value: "available", text: "Available" },
        { value: "onloan", text: "On Loan" },
        { value: "maintenance", text: "Maintenance" }
      ]
    };
  },
  methods: {
    compare(a, b) {
      if (a.id > b.id) {
        return 1;
      } else {
        return -1;
      }
    }
  },
  computed: {
    filteredBicycles() {
      var filtered;
      filtered = this.bicycles.filter(bicycle => {
        return (
          !this.bicycleSearch ||
          bicycle.id.toString().indexOf(this.bicycleSearch) > -1
        );
      });
      if (this.filters) {
        if (this.filters.includes("available")) {
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
            return bicycle.currentUser && bicycle.currentUser != "fixing";
          });
        }
      }
      filtered = filtered.sort(this.compare);
      return filtered;
    }
  },
  created: function() {
    db.ref("bicycles").on("value", snapshot => {
      this.bicycles = [];
      snapshot.forEach(doc => {
        this.bicycles.push({
          key: doc.key,
          src: doc.val().src,
          id: parseInt(doc.val().id),
          currentUser: doc.val().currentUser
        });
      });
    });
  }
};
</script>
