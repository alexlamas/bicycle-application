import Vue from "vue";
import Vuex from "vuex";
import { db } from "@/firebase";
Vue.use(Vuex);

function dateToDays(date) {
  if (date) {
    return Math.ceil(date.getTime() / 1000 / 60 / 60 / 24);
  } else {
    var today = new Date();
    return Math.ceil(today.getTime() / 1000 / 60 / 60 / 24);
  }
}

export default new Vuex.Store({
  state: { people: [], rentals: null, rentalKeys: [], bicycles: [] },
  mutations: {
    fetchPeople(state) {
      db.ref("people").on("value", people => {
        state.people = [];
        people.forEach(person => {
          state.people.push({
            ...person.val(),
            key: person.key
          });
        });
        state.people.forEach(person => {
          if (person.penalty) {
            var penalty = Math.ceil(person.penalty / 86400000 - dateToDays());
            person.penalty = penalty > 1 ? penalty : null;
          }
          if (person.bicycleID) person.bicycleID = parseInt(person.bicycleID);
          person.daysLeft = person.returnDate - dateToDays();
        });
      });
    },
    fetchRentals(state) {
      db.ref("rentals").on("value", rentals => {
        state.rentalKeys = Object.keys(rentals.val());
        state.rentals = rentals.val();
      });
    },
    fetchBicycles(state) {
      db.ref("bicycles").on("value", bicycles => {
        state.bicycles = [];
        bicycles.forEach(bicycle => {
          state.bicycles.push({
            ...bicycle.val(),
            key: bicycle.key,
            id: parseInt(bicycle.val().id)
          });
        });
      });
    }
  },
  actions: {},
  modules: {}
});
