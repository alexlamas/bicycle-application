<template>
  <b-modal
    ref="history"
    hide-footer
    size="md"
    no-fade
    id="history"
    title="History"
  >
    <template v-slot:modal-title>
      <span class="text-capitalize"> {{ user.name }}'s History </span></template
    >
    <b-table
      stacked="md"
      ref="userTable"
      v-if="userRentals"
      :items="userRentals"
      :fields="fields"
      small
      table-variant="light"
    >
      <template v-slot:cell(start)="row"
        >{{ getDateObject(row.item.start) }}
      </template>
      <template v-slot:cell(end)="row"
        >{{ getDateObject(row.item.end) }}
      </template>

      <template v-slot:cell(status)="row"
        ><b-badge v-if="row.item.status == 'active'" variant="success"
          >Active</b-badge
        >
        <b-link
          @click="deleteRecord(row.index)"
          v-if="row.item.status == 'returned'"
          >Delete</b-link
        >
      </template>
    </b-table>
    <p v-if="!userRentals">
      There are no records for this user.
    </p>
  </b-modal></template
>

<script>
import { db } from "@/firebase";
export default {
  props: {
    user: Object,
    rentals: Array,
    rentalKeys: Array
  },
  data() {
    return {
      fields: [
        {
          key: "start",
          label: "Start"
        },
        {
          key: "end",
          label: "Due"
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
  computed: {
    rentalIndex() {
      return this.rentalKeys.indexOf(this.user.key);
    },
    userRentals() {
      if (this.rentalIndex != -1) {
        return Object.values(this.rentals[this.rentalIndex]);
      }
      return null;
    }
  },
  methods: {
    deleteRecord(index) {
      var rentalKey = Object.keys(this.rentals[this.rentalIndex])[index];
      db.ref("rentals/" + this.user.key + "/" + rentalKey).remove();
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
        (date.getDate() < 10 ? "0" : "") +
        date.getDate() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getFullYear()
      );
    }
  }
};
</script>
