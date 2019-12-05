<template>
  <b-modal
    no-fade
    @shown="initialValues"
    @ok="editUser(editDetails)"
    :ok-title="'Save'"
    id="edit-user-modal"
    title="Edit User"
  >
    <b-form-select
      v-model="editDetails.type"
      class="mb-3"
      :options="options"
    ></b-form-select>
    <label for="name">Name</label>
    <b-form-input id="name" v-model="editDetails.name"></b-form-input>
    <label class="mt-3" v-if="editDetails.type != 'visitor'" for="name"
      >Organisation</label
    >
    <b-form-input
      v-if="editDetails.type != 'visitor'"
      id="name"
      v-model="editDetails.organisation"
    ></b-form-input>
    <label class="mt-3" v-if="editDetails.type == 'volunteer'" for="phone"
      >Phone number <span class="text-muted">(optional)</span>
    </label>
    <b-form-input
      id="phone"
      size="sm"
      v-if="editDetails.type == 'volunteer'"
      v-model="editDetails.phone"
      placeholder=""
    ></b-form-input>
    <b-form-checkbox
      v-model="editDetails.deposit"
      v-if="editDetails.type == 'volunteer'"
      class="mt-3"
    >
      Deposit paid
    </b-form-checkbox>
    <b-form-checkbox
      v-model="editDetails.donation"
      v-if="editDetails.type == 'volunteer'"
      class="mt-1"
    >
      Donation
    </b-form-checkbox>
    <b-input-group
      v-if="editDetails.donation"
      style="width: 5rem"
      class="mt-1"
      prepend="€"
      size="sm"
    >
      <b-form-input
        size="sm"
        v-if="editDetails.donation"
        v-model="editDetails.amount"
        placeholder=""
      ></b-form-input>
    </b-input-group>
    <label v-if="editDetails.type != 'volunteer'" class="mt-3" for="ausweis"
      >Ausweis</label
    >
    <b-form-input
      v-if="editDetails.type != 'volunteer'"
      id="ausweis"
      v-model="editDetails.code"
    ></b-form-input>
    <label v-if="editDetails.type != 'volunteer'" class="mt-3" for="usage"
      >Number of rentals</label
    >
    <b-form-input
      v-if="editDetails.type != 'volunteer'"
      type="number"
      id="usage"
      v-model="editDetails.usage"
    ></b-form-input>
    <label class="mt-3" for="penalty">Days of penalty remaining</label>
    <b-form-input
      type="number"
      id="penalty"
      :disabled="user.bicycleKey ? true : false"
      v-model="editDetails.penalty"
    ></b-form-input>
    <small v-if="user.bicycleKey" id="emailHelp" class="form-text text-muted"
      >Cannot change penalty value during rental.</small
    >
  </b-modal>
</template>

<script>
import { db } from "@/firebase";
export default {
  props: {
    user: Object
  },
  data() {
    return {
      editDetails: {
        type: "",
        name: null,
        code: null,
        organisation: null,
        usage: 0,
        penalty: 0,
        donation: false,
        deposit: false,
        amount: 0,
        phone: null
      },
      options: [
        { value: "visitor", text: "Visitor" },
        { value: "helper", text: "Helper" },
        { value: "volunteer", text: "Volunteer" }
      ]
    };
  },
  methods: {
    initialValues() {
      this.editDetails.name = this.user.name;
      this.editDetails.phone = this.user.phone;
      this.editDetails.code = this.user.code;
      this.editDetails.organisation = this.user.organisation;
      this.editDetails.usage = this.user.usage;
      this.editDetails.amount = this.user.amount;
      this.editDetails.donation = this.user.donation;
      this.editDetails.deposit = this.user.deposit;
      this.editDetails.type = this.user.type;
      this.editDetails.penalty = this.user.penalty ? this.user.penalty : 0;
    },
    editUser(editDetails) {
      var key = this.user.key;
      var penaltyDate = new Date();
      penaltyDate =
        penaltyDate.getTime() + editDetails.penalty * 24 * 60 * 60 * 1000;
      if (editDetails.name)
        db.ref("people/" + key + "/name").set(editDetails.name);
      if (editDetails.code)
        db.ref("people/" + key + "/code").set(editDetails.code);
      if (!editDetails.code) db.ref("people/" + key + "/code").set(null);
      if (editDetails.usage)
        db.ref("people/" + key + "/num").set(parseInt(editDetails.usage));
      if (editDetails.penalty == 0)
        db.ref("people/" + key + "/penalty").set(null);
      if (editDetails.penalty > 0)
        db.ref("people/" + key + "/penalty").set(parseInt(penaltyDate));
      db.ref("people/" + key + "/type").set(editDetails.type);
      db.ref("people/" + key + "/deposit").set(editDetails.deposit);
      db.ref("people/" + key + "/amount").set(editDetails.amount);
      db.ref("people/" + key + "/donation").set(editDetails.donation);
      db.ref("people/" + key + "/phone").set(editDetails.phone);
      if (editDetails.type != "visitor")
        db.ref("people/" + key + "/organisation").set(editDetails.organisation);

      editDetails.name = null;
      editDetails.code = null;
      editDetails.usage = 0;
      editDetails.penalty = 0;
      editDetails.type = null;
      editDetails.phone = null;
    }
  }
};
</script>
