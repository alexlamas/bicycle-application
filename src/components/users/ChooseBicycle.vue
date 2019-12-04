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
      <b-form-input
        v-model="bicycleSearch"
        class="form-control mr-2"
        type="search"
        placeholder="Search..."
        size="sm"
      />
      <p class="my-0 ml-4 mr-2 text-muted" style="font-size:0.875rem">
        Return:
      </p>
      <b-dropdown
        ref="dropdown"
        menu-class="menuClass"
        size="sm"
        variant="light"
        no-caret
      >
        <template v-slot:button-content>
          <b-badge variant="light">{{ buttonContent }}</b-badge>
        </template>
        <b-form-radio
          class="mb-2"
          v-model="form.type"
          name="some-radios"
          value="same-day"
          >Today</b-form-radio
        >
        <b-form-radio
          class="mb-2"
          v-model="form.type"
          name="some-radios"
          value="indefinite"
          >Indefinite</b-form-radio
        >
        <b-form-radio class="mb-2" v-model="form.type" value="days"
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
        <b-form-radio class="mb-4" v-model="form.type" value="date"
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
        <b-button @click="save()" size="sm" variant="primary">Save</b-button>
      </b-dropdown>
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
  components: {
    Bicycle
  },
  data() {
    return {
      bicycles: [],
      bicycleSearch: "",
      button: { type: "same-day", date: "", days: 1 },
      form: { type: "same-day", date: "", days: 1 }
    };
  },
  computed: {
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
        } else {
          return false;
        }
      }
      return false;
    },
    buttonContent() {
      switch (this.button.type) {
        case "same-day":
          return "Today";
        case "indefinite":
          return "Indefinite";
        case "days":
          return this.button.days + (this.button.days == 1 ? " day" : " days");
        case "date":
          if (!this.dateInvalid) {
            return this.button.date;
          } else {
            return "no date";
          }
        default:
          return "Invalid";
      }
    },
    filteredBicycles() {
      return this.bicycles.filter(bicycle => {
        return (
          bicycle.id.toString().indexOf(this.bicycleSearch.toLowerCase()) >
            -1 && !bicycle.currentUser
        );
      });
    }
  },
  methods: {
    returnDate() {
      const date = new Date();
      switch (this.form.type) {
        case "date":
          return new Date(this.form.date);
        case "days":
          date.setDate(date.getDate() + parseInt(this.form.days));
          return date;
        case "same-day":
          return date;
        case "indefinite":
          return "indefinite";
        default:
          return new Date();
      }
    },
    setBicycle(key, id) {
      this.$emit("setBicycle", key, id, this.returnDate());
      this.$refs["choose-bicycle"].hide();
    },
    reset() {
      this.form = { type: "same-day", date: "", days: 1 };
      this.button = { type: "same-day", date: "", days: 1 };
    },
    save() {
      if (!this.daysInvalid && !this.dateInvalid) {
        this.button.days = this.form.days;
        this.button.date = this.form.date;
        this.button.type = this.form.type;
        this.$refs.dropdown.hide(true);
      }
    }
  },
  created: function() {
    var today = new Date();
    this.form.date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      (today.getDay() + 2 < 10 ? "0" : "") +
      (today.getDay() + 2);
    db.ref("bicycles").on("value", snapshot => {
      this.bicycles = [];
      snapshot.forEach(doc => {
        this.bicycles.push({
          key: doc.key,
          src: doc.val().src,
          id: doc.val().id,
          currentUser: doc.val().currentUser
        });
      });
    });
  }
};
</script>
