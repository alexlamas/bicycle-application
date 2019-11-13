<template>
  <div>
    <b-row class="my-2">
      <b-col>
        <input
          v-model="bicycleSearch"
          class="form-control"
          type="search"
          placeholder="Search bicycles..."
        />
      </b-col>
      <b-col class="pl-0">
        <b-button v-b-modal.add-bicycle-modal variant="primary">Add</b-button>
      </b-col>
    </b-row>
    <add-bicycle />
    <div v-for="i in Math.ceil(bicycles.length / 3)" v-bind:key="i.id">
      <b-card-group columns>
        <bicycle
          v-for="bicycle in filteredBicycles.slice((i - 1) * 3, i * 3)"
          v-bind:bicycle="bicycle"
          v-bind:key="bicycle.id"
        />
      </b-card-group>
    </div>
  </div>
</template>

<script>
import Bicycle from "./Bicycle";
import AddBicycle from "./AddBicycle";
import { db } from "../firebase";
export default {
  components: {
    Bicycle,
    AddBicycle
  },

  data() {
    return {
      bicycles: [],
      bicycleSearch: ""
    };
  },
  computed: {
    filteredBicycles() {
      return this.bicycles.filter(bicycle => {
        return (
          !this.bicycleSearch ||
          bicycle.id.toLowerCase().indexOf(this.bicycleSearch.toLowerCase()) >
            -1
        );
      });
    }
  },
  created: function() {
    db.ref("bicycles").on("value", snapshot => {
      this.bicycles = [];
      snapshot.forEach(doc => {
        this.bicycles.push({
          key: doc.key,
          src: doc.val().src,
          id: doc.val().id,
          status: doc.val().status
        });
      });
    });
  }
};
</script>
