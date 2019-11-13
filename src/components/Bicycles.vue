<template>
  <div class="my-4">
    <b-button v-b-modal.add-bicycle-modal class="mb-4" variant="primary"
      >Add</b-button
    >
    <add-bicycle />
    <div v-for="i in Math.ceil(bicycles.length / 3)" v-bind:key="i.id">
      <b-card-group columns>
        <bicycle
          v-for="bicycle in bicycles.slice((i - 1) * 3, i * 3)"
          v-bind:bicycle="bicycle"
          v-bind:key="bicycle.id"
        />
      </b-card-group>
    </div>
  </div>
</template>

<script>
import Bicycle from "./Bicycle";
import AddBicycle from "./AddBicycle";
export default {
  components: {
    Bicycle,
    AddBicycle
  },
  data() {
    return {
      bicycles: [
        {
          imgSrc: "https://store.bicycleczar.com/v/vspfiles/photos/07130236-2.jpg?v-cache=1375179093",
          bikeId: "23"
        },
        {
          imgSrc: "https://live.staticflickr.com/1122/1466237914_0f413dea27_b.jpg",
          bikeId: "22"
        },
        {
          imgSrc: "https://cyclingmagazine.ca/wp-content/uploads/2018/10/LT-Wiens-Bikepack--1024x684.png",
          bikeId: "01"
        },
        {
          imgSrc: "https://www.cxmagazine.com/wp-content/uploads/2016/06/lost-and-found-peugeot-gravel-bike-img_0320-cxmagazine_result.jpg",
          bikeId: "12"
        }
      ]
    };
  }
};
</script>
