<template>
  <b-card hover style="max-width: 30rem;" :img-src="bicycle.src" img-bottom>
    <b-card-title><span class="text-muted">ID:</span>{{ bicycle.id }}</b-card-title>
    <h6><b-badge variant="success">Available</b-badge></h6>
  </b-card>
</template>

<script>
export default {
  props: {
    bicycle: Object
  }
};
</script>
<style>
  .card-img-bottom {
    height: 200px;
    object-fit: cover;
  }
</style>
