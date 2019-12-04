<template lang="html">
  <span>
    <b-badge v-if="item.timeRenting == 0 && !item.returnDate" variant="warning"
      >Due today</b-badge
    >
    <b-badge v-if="item.timeRenting == 1 && !item.returnDate" variant="danger"
      >1 day overdue</b-badge
    >
    <b-badge v-if="item.timeRenting > 1 && !item.returnDate" variant="danger"
      >{{ item.timeRenting }} days overdue</b-badge
    >
    <b-badge v-if="item.daysLeft == 0" variant="warning">Due today</b-badge>
    <b-badge v-if="item.daysLeft < 0" variant="danger"
      >{{ item.daysLeft
      }}{{ item.daysLeft == -1 ? " day" : " days" }} overdue</b-badge
    >
    <b-badge v-if="item.daysLeft == 1" variant="light">1 day remaining</b-badge>
    <b-badge v-if="item.daysLeft > 1 && item.daysLeft < 8" variant="light"
      >{{ item.daysLeft }} days remaining</b-badge
    >
    <b-badge v-if="item.daysLeft > 8" variant="light">{{
      getDateObject(item.returnDate)
    }}</b-badge>
    <b-badge v-if="item.returnDate == 'indefinite'" variant="light"
      >Indefinite</b-badge
    >
  </span>
</template>

<script>
export default {
  props: {
    item: Object
  },
  methods: {
    getDateObject(days) {
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

<style></style>
