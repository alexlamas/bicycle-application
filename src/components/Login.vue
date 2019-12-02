<template>
  <b-row class="justify-content-md-center mt-4" align-v="center">
    <b-col cols="sm-4">
      <b-card style="height:15rem">
        <b-form @submit="submit">
          <b-form-group label="Email:" label-for="input-1">
            <b-form-input
              autocomplete="username"
              v-model="email"
              id="input-1"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group label="Password:" label-for="input-2">
            <b-form-input
              v-model="password"
              autocomplete="current-password"
              id="input-2"
              required
              type="password"
            ></b-form-input>
          </b-form-group>
          <b-button
            class="mt-2"
            style="width:100%"
            type="submit"
            variant="primary"
            >Login</b-button
          >
        </b-form></b-card
      >
    </b-col>
  </b-row>
</template>

<script>
import { auth } from "@/firebase";
export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    submit(evt) {
      evt.preventDefault();
      auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.$router.replace("refugees");
        })
        .catch(err => {
          alert(err);
        });
    }
  }
};
</script>
