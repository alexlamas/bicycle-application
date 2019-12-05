<template>
  <div>
    <navbar />
    <b-container>
      <p class="mt-4">Welcome to the Low Tech bicycle dashboard.</p>
      <h5>Users</h5>
      <ul>
        <li>
          <router-link :to="{ name: 'visitors', params: {} }"
            >Visitors ({{ count.visitors }})</router-link
          >
        </li>
        <li>
          <router-link :to="{ name: 'helpers', params: {} }"
            >Helpers ({{ count.helpers }})</router-link
          >
        </li>
        <li>
          <router-link :to="{ name: 'volunteers', params: {} }"
            >Volunteers ({{ count.volunteers }})</router-link
          >
        </li>
      </ul>
      <h5>
        <router-link style="color: black" :to="{ name: 'bicycles', params: {} }"
          >Bicycles</router-link
        >
      </h5>
      <p>
        There are currently <b>{{ count.bicycles }} bicycles</b> being borrowed
        from a total of <b>{{ count.totalBicycles }} bicycles</b>.
      </p>
    </b-container>
  </div>
</template>

<script>
import Navbar from "./Navbar";
import { db } from "@/firebase";

export default {
  data() {
    return {
      count: {
        bicycles: 0,
        totalBicycles: 0,
        visitors: 0,
        volunteers: 0,
        helpers: 0
      }
    };
  },
  components: {
    Navbar
  },
  created: function() {
    Object.keys(this.count).forEach(c => (this.count[c] = 0));
    db.ref("bicycles").on("value", snapshot => {
      snapshot.forEach(() => {
        this.count.totalBicycles++;
      });
    });
    db.ref("people").on("value", snapshot => {
      snapshot.forEach(doc => {
        if (doc.val().bicycleID) {
          this.count.bicycles++;
          switch (doc.val().type) {
            case "visitor":
              this.count.visitors++;
              break;
            case "helper":
              this.count.helpers++;
              break;
            case "volunteer":
              this.count.volunteers++;
              break;
            default:
              break;
          }
        }
      });
    });
  }
};
</script>

<style scoped>
a {
  color: black;
}
</style>
