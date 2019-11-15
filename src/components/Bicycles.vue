<template>
  <div>
    <div id="nav">
      <router-link class="mr-3 button" to="/users"><h1>Users</h1></router-link>
      <router-link to="/bicycles"><h1>Bicycles</h1></router-link>
      <b-col class="text-right align-middle">
        <b-button variant="outline-secondary" @click="signOut"
          >Sign Out</b-button
        >
      </b-col>
    </div>
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
          :deletable="true"
          v-for="bicycle in filteredBicycles.slice((i - 1) * 3, i * 3)"
          :bicycle="bicycle"
          :key="bicycle.id"
        />
      </b-card-group>
    </div>
  </div>
</template>

<script>
import Bicycle from "./bicycles/Bicycle";
import AddBicycle from "./bicycles/AddBicycle";
import { db } from "@/firebase";
import { auth } from "@/firebase";

export default {
  components: {
    AddBicycle,
    Bicycle
  },
  methods: {
    signOut() {
      auth.signOut().then(() => {
        this.$router.replace("login");
      });
    }
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
          currentUser: doc.val().currentUser
        });
      });
    });
  }
};
</script>
