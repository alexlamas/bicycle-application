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
      :items="bicycleHistory"
      :fields="fields"
      :sort-by="'start'"
      :sort-desc="true"
      small
      table-variant="light"
      ><template v-slot:cell(start)="row"
        >{{ getDateObject(row.item.start) }} </template
      ><template v-slot:cell(end)="row"
        >{{ getDateObject(row.item.end) }}
      </template>
      <template v-slot:cell(status)="row"
        ><b-badge v-if="row.item.status == 'active'" variant="success"
          >Active</b-badge
        >
        <b-link
          @click="deleteRecord(row.index, row.item.userKey)"
          v-if="row.item.status == 'returned'"
          >Delete</b-link
        >
      </template></b-table
    >
  </b-modal></template
>

<script>
import { db } from "@/firebase";

export default {
  data() {
    return {
      sortBy: "start",
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
          key: "user",
          label: "Name",
          class: "text-capitalize"
        },
        {
          key: "status",
          label: ""
        }
      ]
    };
  },

  methods: {
    deleteRecord(index, userKey) {
      var rentalKey = Object.keys(this.rentalsObject[userKey])[index];
      db.ref("rentals/" + userKey + "/" + rentalKey).remove();
      this.bicycleHistory.splice(index, 1);
    },
    getDateObject(days) {
      if (days == "indefinite") {
        return "Indefinite";
      }
      var date = new Date();
      date.setTime((days - 1) * 24 * 60 * 60 * 1000);
      return (
        (date.getDate() < 10 ? "0" : "") +
        date.getDate() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getFullYear()
      );
    }
  },
  props: {
    bicycleHistory: Array,
    rentalKeys: Array,
    rentalsObject: Object
  }
};
</script>
