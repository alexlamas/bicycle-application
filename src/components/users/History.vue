<template>
  <b-modal
    ref="history"
    hide-footer
    size="md"
    no-fade
    id="history"
    title="History"
    ><b-table
      stacked="md"
      ref="userTable"
      v-if="filteredRentals.length"
      :items="filteredRentals"
      :fields="fields"
      small
      table-variant="light"
    >
      <template v-slot:cell(status)="row"
        ><b-badge v-if="row.item.status == 'active'" variant="success"
          >Active</b-badge
        >
        <b-link
          @click="deleteRecord(row.item)"
          v-if="row.item.status == 'returned'"
          >Delete</b-link
        >
      </template>
    </b-table>
    <p v-if="!filteredRentals.length">
      This user has not borrowed any bicycles yet.
    </p>
  </b-modal></template
>

<script>
import { db } from "@/firebase";
export default {
  props: {
    user: Object
  },
  data() {
    return {
      rentals: [],
      fields: [
        {
          key: "start",
          label: "Start"
        },
        {
          key: "end",
          label: "End"
        },
        {
          key: "bicycleID",
          label: "Bicycle"
        },
        {
          key: "status",
          label: ""
        }
      ]
    };
  },
  created: function() {
    db.ref("rentals").on("value", snapshot => {
      this.rentals = [];
      snapshot.forEach(doc => {
        this.rentals.push({
          key: doc.key,
          start: this.getDateObject(doc.val().start),
          end: this.getDateObject(doc.val().end),
          bicycleID: this.formattedID(doc.val().bicycleID),
          userKey: doc.val().userKey,
          status: doc.val().status
        });
      });
    });
  },
  computed: {
    filteredRentals() {
      var filtered;
      filtered = this.rentals.filter(rental => {
        return rental.userKey == this.user.key;
      });
      /* eslint-disable no-console */

      console.log(filtered);
      return filtered;
    }
  },
  methods: {
    deleteRecord(item) {
      db.ref("rentals")
        .child(item.key)
        .set(null);
    },
    formattedID(input) {
      var id;
      var digit = parseInt(input);
      if (digit < 10) {
        id = "00" + digit;
      } else if (digit < 99) {
        id = "0" + digit;
      } else {
        id = digit;
      }
      return id;
    },
    getDateObject(days) {
      if (days == "indefinite") {
        return "Indefinite";
      }
      var date = new Date();
      date.setTime(days * 24 * 60 * 60 * 1000);
      return (
        (date.getDay() + 2 < 10 ? "0" : "") +
        (date.getDay() + 2) +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getFullYear()
      );
    }
  }
};
</script>
