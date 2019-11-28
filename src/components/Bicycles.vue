<template>
  <div>
    <navbar />

    <b-container>
      <div class="d-flex mt-2">
        <div class=" text-muted">
          Filter by:
        </div>
        <b-form-checkbox-group
          v-model="filters"
          :options="options"
          class=" ml-3"
          switches
        >
        </b-form-checkbox-group>
      </div>
      <b-navbar sticky class="px-0" style="background-color:white">
        <b-input-group size="sm">
          <input
            v-model="bicycleSearch"
            class="form-control"
            type="search"
            placeholder="Search bicycles..."
          />
          <b-input-group-append>
            <b-button v-b-modal.add-bicycle-modal variant="primary"
              ><font-awesome-icon icon="plus" class="mr-1" /> Bicycle</b-button
            >
          </b-input-group-append>
        </b-input-group>
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
      filters: [],
      options: [{ text: "Available", value: "available" }]
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
      if (this.filters.includes("available")) {
        filtered = filtered.filter(bicycle => {
          return !bicycle.currentUser;
        });
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
      /* eslint-disable no-console */
      console.log(this.bicycles);
    });
  }
};
</script>
