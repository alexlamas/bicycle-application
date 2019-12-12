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
            <br />
            So far this week, bicycles have been borrowed
            <b>{{ weeklyRentals }} times</b>.
          </p>
        </b-col>
        <!-- <b-col> <canvas id="planet-chart"></canvas> </b-col> -->
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Navbar from "./Navbar";
import { db } from "@/firebase";
import Chart from "chart.js";

export default {
  data() {
    return {
      weeklyRentals: 0,
      userkeys: [],
      count: {
        bicycles: 0,
        totalBicycles: 0,

        visitors: 0,
        volunteers: 0,
        helpers: 0
      }
    };
  },
  mounted() {
    this.createChart("planet-chart");
  },
  methods: {
    createChart(chartId) {
      const ctx = document.getElementById(chartId);
      const myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["02-12 -> 08-12", "Current Week"],
          datasets: [
            {
              // one line graph
              label: "Bikes borrowed",
              data: [0, 76],
              borderWidth: 3
            }
          ]
        },
        options: {
          responsive: true,
          lineTension: 1,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  padding: 25
                }
              }
            ]
          }
        }
      });
      /* eslint-disable no-console */
      console.log(myChart);
    }
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
    db.ref("rentals").on("value", snapshot => {
      this.weeklyRentals = 0;
      snapshot.forEach(userRental => {
        var today = new Date();
        var monday =
          this.$dateToDays(today) -
          (today.getDay() == 0 ? 7 : today.getDay() - 1);
        var days = [];
        userRental.forEach(rental => {
          if (rental.val().start >= monday) {
            if (!days.includes(rental.val().start)) {
              this.weeklyRentals++;
            }
            days.push(rental.val().start);
          }
        });
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
