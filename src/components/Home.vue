<template>
  <div>
    <navbar />
    <b-container>
      <b-row>
        <b-col
          ><p class="mt-4">Welcome to the Low Tech bicycle dashboard.</p>
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
            <router-link
              style="color: black"
              :to="{ name: 'bicycles', params: {} }"
              >Bicycles</router-link
            >
          </h5>
          <p>
            There are currently <b>{{ count.bicycles }} bicycles</b> being
            borrowed from a total of <b>{{ count.totalBicycles }} bicycles</b>.
          </p>

          <b-table style="max-width: 200px" :items="data" small hover></b-table>
          So far the total number of rentals this week is {{ total }}
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Navbar from "./Navbar";
import { db } from "@/firebase";

export default {
  computed: {
    bicycles() {
      return this.$store.state.bicycles;
    },
    rentals() {
      return this.$store.state.rentals;
    },
    people() {
      return this.$store.state.people;
    },
    count() {
      var count = {
        bicycles: 0,
        totalBicycles: this.$store.state.bicycles.length,
        visitors: 0,
        volunteers: 0,
        helpers: 0
      };
      return count;
    },
    data() {
      var data = [
        { day: "Monday", count: 0 },
        { day: "Tuesday", count: 0 },
        { day: "Wednesday", count: 0 },
        { day: "Thursday", count: 0 },
        { day: "Friday", count: 0 },
        { day: "Saturday", count: 0 },
        { day: "Sunday", count: 0 }
      ];
      var rentalsByDay = [];
      Object.values(this.rentals).forEach(user => {
        var days = [];
        Object.values(user).forEach(rental => {
          if (!days.includes(rental.start)) {
            if (!rentalsByDay[rental.start]) {
              rentalsByDay[rental.start] = 1;
            } else rentalsByDay[rental.start]++;
            days.push(rental.start);
          }
        });
      });
      var monday = this.$dateToDays() - ((this.$dateToDays() - 18240) % 7);
      rentalsByDay = rentalsByDay.splice(monday);
      rentalsByDay.forEach((day, index) => {
        data[index].count = day;
      });
      return data;
    },
    total() {
      var total = 0;
      this.data.forEach(day => {
        total += day.count;
      });
      return total;
    }
  },
  components: {
    Navbar
  },
  created: function() {
    if (!this.$store.state.rentals) this.$store.commit("fetchRentals");
    if (!this.$store.state.bicycles.length) this.$store.commit("fetchBicycles");
    if (!this.$store.state.people.length) this.$store.commit("fetchPeople");

    db.ref("people").on("value", people => {
      people.forEach(person => {
        if (person.val().bicycleID) {
          this.count.bicycles++;
          switch (person.val().type) {
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
