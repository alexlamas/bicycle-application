<template lang="html">
  <b-modal
    ref="choose-bicycle"
    hide-footer
    size="xl"
    no-fade
    id="choose-bicycle"
    title="Choose a Bicycle"
  >
    Choose from one of these lovely bicycles :)
    <b-row class="mt-2 mb-4">
      <b-col>
        <input
          v-model="bicycleSearch"
          class="form-control"
          type="search"
          placeholder="Search bicycles..."
        />
      </b-col>
    </b-row>
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
      bicycleSearch: ""
    };
  },
  computed: {
    filteredBicycles() {
      return this.bicycles.filter(bicycle => {
        return (
          bicycle.id.toLowerCase().indexOf(this.bicycleSearch.toLowerCase()) >
            -1 && !bicycle.currentUser
        );
      });
    }
  },
  methods: {
    setBicycle(key, id) {
      this.$emit("setBicycle", key, id);
      this.$refs["choose-bicycle"].hide();
    }
  },
  created: function() {
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
