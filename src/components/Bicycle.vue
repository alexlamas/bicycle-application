<template>
  <b-card style="max-width: 30rem;" :img-src="bicycle.src" img-top>
    <b-badge variant="light" class="align-middle"
      ><span class="text-muted">ID: </span>{{ bicycle.id }}</b-badge
    >
    <b-badge variant="light" class="align-middle">{{ status }}</b-badge>
    <b-button
      v-if="withButton"
      @click="setBicycle"
      variant="outline-success"
      class="float-right align-middle"
      >Lend</b-button
    >
  </b-card>
</template>

<script>
export default {
  props: {
    bicycle: Object,
    withButton: Boolean
  },
  methods: {
    setBicycle() {
      var key = this.bicycle.key;
      this.$emit("setBicycle", key);
    }
  },
  computed: {
    status() {
      var status;
      if (this.bicycle.currentUser == "none") {
        status = "available";
      }
      if (this.bicycle.currentUser != "none") {
        status = "busy";
      }
      /* eslint-disable no-console */
      console.log(status);
      console.log(this.bicycle);
      return status;
    }
  }
};
</script>
<style>
.card-img-top {
  height: 150px;
  object-fit: cover;
}
</style>
