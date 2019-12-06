<template>
  <span>
    <b-badge v-if="item.daysLeft == 0" variant="warning">Due today</b-badge>
    <b-badge v-if="item.daysLeft == -1" variant="danger">1 day overdue</b-badge>
    <b-badge v-if="item.daysLeft < -1" variant="danger"
      >{{ -item.daysLeft }} days overdue</b-badge
    >
    <b-badge v-if="item.daysLeft == 1" variant="light">1 day remaining</b-badge>
    <b-badge v-if="item.daysLeft > 1 && item.daysLeft < 8" variant="light"
      >{{ item.daysLeft }} days remaining</b-badge
    >
    <b-badge v-if="item.daysLeft > 7" variant="light">{{
      getDateObject(item.returnDate)
    }}</b-badge>
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
