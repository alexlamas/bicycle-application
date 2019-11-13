<template>
  <b-modal
    no-fade
    :ok-title="'Save'"
    id="add-bicycle-modal"
    title="Add a New Bicycle"
  >
  <label for="bicycle-id">Bicycle ID</label>
  <b-form-input class="mb-2" id="bicycle-id"></b-form-input>
  <label for="img-url">Image URL</label>
  <b-form-input id="img-url"></b-form-input>

  </b-modal>
</template>

<script>
export default {};
</script>

<style lang="css" scoped></style>
