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
  data() {
    return {
      userkeys: [],
      total: 0,
      data: [
        { day: "Monday", count: 0 },
        { day: "Tuesday", count: 0 },
        { day: "Wednesday", count: 0 },
        { day: "Thursday", count: 0 },
        { day: "Friday", count: 0 },
        { day: "Saturday", count: 0 },
        { day: "Sunday", count: 0 }
      ],
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
    db.ref("bicycles").on("value", snapshot => {
      Object.keys(this.count).forEach(c => (this.count[c] = 0));
      snapshot.forEach(() => {
        this.count.totalBicycles++;
      });
    });
    var rentalsByDay = [];
    db.ref("rentals").on("value", rentals => {
      /* eslint-disable no-console */
      rentals.forEach(user => {
        var days = [];
        user.forEach(rental => {
          if (!days.includes(rental.val().start)) {
            if (!rentalsByDay[rental.val().start]) {
              rentalsByDay[rental.val().start] = 1;
            } else rentalsByDay[rental.val().start]++;
            days.push(rental.val().start);
          }
        });
      });
      var monday = this.$dateToDays() - ((this.$dateToDays() - 18240) % 7);
      rentalsByDay = rentalsByDay.splice(monday);
      rentalsByDay.forEach((day, index) => {
        this.data[index].count = day;
        this.total += day;
      });
    });
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
