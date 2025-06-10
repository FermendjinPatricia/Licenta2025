<template>
  <div id="map" class="map-container"></div>
</template>

<script>
import mapboxgl from "mapbox-gl";

export default {
  name: "MapComponent",
  mounted() {
    
    mapboxgl.accessToken =
      'pk.eyJ1IjoicGF0cmljaWFmZXJtZW5kamluIiwiYSI6ImNtYmlpNTU4OTA0eTMya3IxNDQ1cHhsdTEifQ.6FFflFdBSBxuK1b6W-nsOg';

    
    this.map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [21.3, 46.1], 
      zoom: 5,
    });

    this.map.on("load", () => {
      new mapboxgl.Marker({ color: "red" })
        .setLngLat([21, 40])
        .addTo(this.map);
    });
  },
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100vh;
}
</style>
