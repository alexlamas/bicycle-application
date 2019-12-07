<template>
  <b-modal
    ref="history"
    hide-footer
    size="md"
    no-fade
    id="history"
    title="History"
  >
    <b-button @click="yo">yo</b-button>
    <template v-slot:modal-title>
      <span class="text-capitalize"> {{ user.name }}'s History </span></template
    >
    <b-table
      stacked="md"
      ref="userTable"
      v-if="rentals.length"
      :items="rentals"
      :fields="fields"
      small
      table-variant="light"
    >
      <template v-slot:cell(start)="row"
        >{{ getDateObject(row.item.start) }}
      </template>

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
    <p v-if="!rentals.length">
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
    db.ref("rentals/" + this.user.key).on("value", snapshot => {
      this.rentals = [];
      snapshot.forEach(doc => {
        this.rentals.push(doc.val());
      });
    });
  },
  methods: {
    yo() {
      /* eslint-disable no-console */
      console.log(this.rentals);
    },
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
      /* eslint-disable no-console */
      console.log(this.rentals);
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
