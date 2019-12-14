<template lang="html">
  <b-modal
    @shown="reset"
    ref="choose-bicycle"
    hide-footer
    size="xl"
    no-fade
    id="choose-bicycle"
    title="Choose a Bicycle"
  >
    <b-navbar sticky class="px-0 mb-2" style="background-color:white">
      <b-dropdown
        ref="dropdown"
        menu-class="menuClass"
        size="sm"
        variant="primary"
        no-caret
      >
        <template v-slot:button-content>
          {{ buttonContent }}
        </template>
        <b-form-radio
          class="mb-3"
          v-model="form.type"
          name="some-radios"
          value="same-day"
          >Return Today</b-form-radio
        >
        <b-form-radio
          class="mb-3"
          v-model="form.type"
          name="some-radios"
          value="indefinite"
          >Borrow Indefinitely</b-form-radio
        >
        <b-form-radio class="mb-3" v-model="form.type" value="days"
          ><b-input-group append="days" size="sm"
            ><b-form-input
              @input="form.type = 'days'"
              v-model="form.days"
              style="width:7rem"
              type="number"
              size="sm"
              min="1"
              max="1000"
          /></b-input-group>
          <b-form-text style="color: #dc3545 !important" v-show="daysInvalid">
            Must be greater than 1
          </b-form-text>
        </b-form-radio>
        <b-form-radio class="mb-3" v-model="form.type" value="date"
          ><b-input-group size="sm"
            ><b-form-input
              @input="form.type = 'date'"
              style="width:10rem"
              v-model="form.date"
              type="date"
              size="sm"
          /></b-input-group>
          <b-form-text style="color: #dc3545 !important" v-show="dateInvalid">
            Date must be in future
          </b-form-text>
        </b-form-radio>
        <b-button block @click="saveBorrowPeriod()" size="sm" variant="primary"
          >Save</b-button
        >
      </b-dropdown>
      <b-form-input
        v-model="bicycleSearch"
        class="form-control float-right ml-3"
        type="search"
        placeholder="Search..."
        size="sm"
      />
    </b-navbar>
    <div v-for="i in Math.ceil(bicycles.length / 3)" v-bind:key="i.id">
      <b-card-group columns>
        <bicycle
          :withButton="true"
          v-on:setBicycle="setBicycle"
          v-for="bicycle in filteredBicycles.slice((i - 1) * 3, i * 3)"
          v-bind:bicycle="bicycle"
          v-bind:key="bicycle.id"
        />
      </b-card-group>
    </div>
  </b-modal>
</template>

<script>
import { db } from "@/firebase";
import Bicycle from "../bicycles/Bicycle";
export default {
  props: {
    user: Object
  },
  components: {
    Bicycle
  },
  data() {
    return {
      bicycleSearch: "",
      button: { type: "same-day", date: "", days: 1 },
      form: { type: "same-day", date: "", days: 1 }
    };
  },
  computed: {
    bicycles() {
      return this.$store.state.bicycles;
    },
    daysInvalid() {
      if (this.form.type == "days" && this.form.days < 1) {
        return true;
      }
      return false;
    },
    dateInvalid() {
      if (this.form.type == "date") {
        var date = new Date(this.form.date);
        var today = new Date();
        if (today > date) {
          return true;
        } else if (this.form.date == "") {
          return true;
        } else {
          return false;
        }
      }
      return false;
    },
    buttonContent() {
      switch (this.button.type) {
        case "same-day":
          return "Return Today";
        case "indefinite":
          return "Borrow Indefinitely";
        case "days":
          return (
            "Return in " +
            this.button.days +
            (this.button.days == 1 ? " day" : " days")
          );
        case "date":
          if (!this.dateInvalid) {
            return "Return on " + this.button.date;
          }
          return "Invalid";

        default:
          return "Invalid";
      }
    },
    filteredBicycles() {
      return this.bicycles.filter(bicycle => {
        var testString;
        if (bicycle.id < 10) {
          testString = "00" + bicycle.id.toString();
        } else if (bicycle.id < 100) {
          testString = "0" + bicycle.id.toString();
        } else {
          testString = bicycle.id.toString();
        }
        return (
          testString.indexOf(this.bicycleSearch.toLowerCase()) > -1 &&
          !bicycle.currentUser
        );
      });
    }
  },
  methods: {
    returnDate() {
      switch (this.form.type) {
        case "date":
          return Date.parse(this.form.date);
        case "days":
          var today = new Date();
          return today.setDate(today.getDate() + parseInt(this.form.days));
        case "same-day":
          return new Date();
        case "indefinite":
          return "indefinite";
        default:
          return new Date();
      }
    },
    setBicycle(bicycleKey, bicycleID) {
      this.$refs["choose-bicycle"].hide();
      var returnDate;
      var today = new Date();
      today = Math.ceil(today.getTime() / 1000 / 60 / 60 / 24);
      if (this.returnDate() != "indefinite")
        returnDate = Math.ceil(this.returnDate() / 1000 / 60 / 60 / 24);
      else returnDate = "indefinite";
      db.ref("people/" + this.user.key + "/bicycleKey").set(bicycleKey);
      db.ref("people/" + this.user.key + "/bicycleID").set(bicycleID);
      db.ref("people/" + this.user.key + "/returnDate").set(returnDate);

      db.ref("bicycles/" + bicycleKey + "/currentUser").set(this.user.key);
      var rentalRef = db.ref("rentals/" + this.user.key).push();
      rentalRef.set({
        start: today,
        end: returnDate,
        userKey: this.user.key,
        bicycleKey: bicycleKey,
        bicycleID: bicycleID,
        status: "active"
      });
    },
    reset() {
      this.form = { type: "same-day", date: "", days: 1 };
      this.button = { type: "same-day", date: "", days: 1 };
      var today = new Date();
      this.form.date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        (today.getDate() + 7 < 10 ? "0" : "") +
        (today.getDate() + 7);
    },
    saveBorrowPeriod() {
      if (!this.daysInvalid && !this.dateInvalid) {
        this.button.days = this.form.days;
        this.button.date = this.form.date;
        this.button.type = this.form.type;
        this.$refs.dropdown.hide(true);
      }
    }
  },
  mounted: function() {
    if (!this.$store.state.bicycles.length) this.$store.commit("fetchBicycles");
  }
};
</script>
