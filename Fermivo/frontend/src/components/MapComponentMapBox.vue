<template>
  <div id="map" class="map-container"></div>
</template>

<script>
import mapboxgl from "mapbox-gl";

export default {
  name: "MapComponent",
  mounted() {
    // ✅ Token Mapbox (public key)
    mapboxgl.accessToken =
      'pk.eyJ1IjoicGF0cmljaWFmZXJtZW5kamluIiwiYSI6ImNtYmlpNTU4OTA0eTMya3IxNDQ1cHhsdTEifQ.6FFflFdBSBxuK1b6W-nsOg';

    // ✅ Inițializez harta
    this.map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [21.3, 46.1], // România (doar pentru vizualizare inițială)
      zoom: 5,
    });

    // ✅ Aștept încărcarea completă a hărții
    this.map.on("load", () => {
      // Adaug marker roșu în Turcia (corect: [long, lat] = [35, 40])
      new mapboxgl.Marker({ color: "red" })
        .setLngLat([35, 40])
        .addTo(this.map);
    });
  },
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100vh; /* Să ocupe tot ecranul vizibil */
}
</style>
