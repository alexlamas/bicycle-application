<template lang="html">
  <div>
    <navbar />
    <b-container>
      <p class="mt-4">Welcome to the Low Tech bicycle dashboard.</p>
      <h5>Users</h5>
      <ul>
        <li>
          <router-link :to="{ name: 'visitors', params: {} }"
            >Visitors ({{ numVisitors }})</router-link
          >
        </li>
        <li>
          <router-link :to="{ name: 'helpers', params: {} }"
            >Helpers ({{ numHelpers }})</router-link
          >
        </li>
        <li>
          <router-link :to="{ name: 'volunteers', params: {} }"
            >Volunteers ({{ numVolunteers }})</router-link
          >
        </li>
      </ul>
      <h5>
        <router-link style="color: black" :to="{ name: 'bicycles', params: {} }"
          >Bicycles</router-link
        >
      </h5>
      <p>
        There are currently <b>{{ numBikes }} bicycles</b> being borrowed from a
        total of <b>{{ numBikesTotal }} bicycles</b>.
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
      numBikes: 0,
      numBikesTotal: 0,
      numVisitors: 0,
      numHelpers: 0,
      numVolunteers: 0
    };
  },
  components: {
    Navbar
  },
  created: function() {
    this.numBikes = 0;
    this.numBikesTotal = 0;
    this.numVisitors = 0;
    this.numHelpers = 0;
    this.numVolunteers = 0;
    db.ref("bicycles").on("value", snapshot => {
      snapshot.forEach(() => {
        this.numBikesTotal++;
      });
    });
    db.ref("people").on("value", snapshot => {
      snapshot.forEach(doc => {
        if (doc.val().bicycleID) {
          this.numBikes++;
        }
        if (!doc.val().helper && !doc.val().volunteer && doc.val().bicycleID) {
          this.numVisitors++;
        }
        if (doc.val().helper && !doc.val().volunteer && doc.val().bicycleID) {
          this.numHelpers++;
        }
        if (!doc.val().helper && doc.val().volunteer && doc.val().bicycleID) {
          this.numVolunteers++;
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
