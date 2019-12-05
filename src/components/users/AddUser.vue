<template>
  <b-modal
    @shown="initialValues"
    no-fade
    hide-footer
    :ok-title="'Save'"
    ref="add-user"
    id="add-user-modal"
    title="Add a New User"
  >
    <b-form @submit="saveUser">
      <b-form-select
        v-model="newPerson.type"
        class="mb-3"
        :options="options"
      ></b-form-select>
      <label for="name">Full Name</label>
      <b-form-input
        id="name"
        class="mb-3"
        required
        autofocus
        v-model="newPerson.name"
        placeholder=""
      ></b-form-input>
      <label v-if="newPerson.type != 'visitor'" for="organisation"
        >Organisation <span class="text-muted">(optional)</span>
      </label>
      <b-form-input
        id="organisation"
        class="mb-3"
        v-if="newPerson.type != 'visitor'"
        v-model="newPerson.organisation"
        placeholder=""
      ></b-form-input>
      <label v-if="newPerson.type == 'volunteer'" for="phone"
        >Phone number <span class="text-muted">(optional)</span>
      </label>
      <b-form-input
        id="phone"
        size="sm"
        v-if="newPerson.type == 'volunteer'"
        v-model="newPerson.phone"
        placeholder=""
      ></b-form-input>
      <b-form-checkbox
        v-model="newPerson.deposit"
        v-if="newPerson.type == 'volunteer'"
        class="mt-3"
      >
        Deposit paid
      </b-form-checkbox>
      <b-form-checkbox
        v-model="newPerson.donation"
        v-if="newPerson.type == 'volunteer'"
        class="mt-1"
      >
        Donation
      </b-form-checkbox>
      <b-input-group
        v-if="newPerson.donation"
        style="width: 5rem"
        class="mt-1"
        prepend="€"
        size="sm"
      >
        <b-form-input
          size="sm"
          v-if="newPerson.donation"
          v-model="newPerson.amount"
          placeholder=""
        ></b-form-input>
      </b-input-group>
      <label v-if="newPerson.type != 'volunteer'" class="mt-1" for="code"
        >Ausweis</label
      >
      <b-form-input
        v-if="newPerson.type != 'volunteer'"
        id="code"
        v-model="newPerson.code"
      ></b-form-input>
      <b-button class="mt-2 float-right" type="submit" variant="primary"
        >Submit</b-button
      >
    </b-form>
  </b-modal>
</template>

<script>
import { db } from "@/firebase";
export default {
  props: {
    userSearch: String,
    default: String
  },
  data() {
    return {
      options: [
        { value: "visitor", text: "Visitor" },
        { value: "helper", text: "Helper" },
        { value: "volunteer", text: "Volunteer" }
      ],
      newPerson: {
        type: "",
        name: "",
        code: "05/000",
        num: 0,
        organisation: "",
        donation: false,
        deposit: false,
        amount: 0,
        phone: ""
      }
    };
  },
  methods: {
    saveUser(evt) {
      evt.preventDefault();
      if (this.newPerson.code == "05/000") this.newPerson.code = "";
      var newPersonToPush = this.newPerson;
      db.ref("people").push(newPersonToPush);
      db.ref("people").once("value", snapshot => {
        this.people = Object.values(snapshot.val());
      });
      this.$refs["add-user"].hide();
    },
    initialValues() {
      this.newPerson.donation = false;
      this.newPerson.deposit = false;
      this.newPerson.amount = 0;
      this.newPerson.phone = "";
      this.newPerson.code = "05/000";
      this.newPerson.name = this.userSearch;
      this.newPerson.organisation = "";
      this.newPerson.type = this.default;
    }
  }
};
</script>
