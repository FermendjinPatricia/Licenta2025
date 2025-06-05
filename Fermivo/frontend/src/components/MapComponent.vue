<template>
  <div id="map" class="map-container"></div>
</template>
<script>
import mapboxgl from "mapbox-gl";

export default {
  name: "MapComponent",
  props: {
    anunturi: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      map: null,
    };
  },
  methods: {
    async geocodeLocatie(adresa) {
      const accessToken = mapboxgl.accessToken;
      const encoded = encodeURIComponent(adresa);
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?access_token=${accessToken}`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.features.length > 0) {
          return data.features[0].center; // [lng, lat]
        }
      } catch (err) {
        console.error("Eroare geocodare:", err);
      }

      return null;
    },

    async adaugaMarker(anunt) {
      let coords = null;

      if (typeof anunt.lat === "number" && typeof anunt.lng === "number") {
        coords = [anunt.lng, anunt.lat];
      } else if (anunt.localitate && anunt.judet) {
        coords = await this.geocodeLocatie(
          `${anunt.localitate}, ${anunt.judet}`
        );
      }

      if (coords) {
        new mapboxgl.Marker()
          .setLngLat(coords)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
                <strong>${anunt.produs}</strong><br>
                ${anunt.pret_lei_tona} ${
              anunt.moneda === "euro" ? "€" : "lei"
            }/tonă<br>
                <em>${anunt.judet}, ${anunt.localitate}</em>
              `)
          )
          .addTo(this.map);
      }
    },
  },
  watch: {
    anunturi: {
      handler(nouaLista) {
        if (this.map && nouaLista.length) {
          nouaLista.forEach((anunt) => this.adaugaMarker(anunt));
        }
      },
      immediate: true,
    },
  },
  async mounted() {
    mapboxgl.accessToken =
      "pk.eyJ1IjoicGF0cmljaWFmZXJtZW5kamluIiwiYSI6ImNtYmlpNTU4OTA0eTMya3IxNDQ1cHhsdTEifQ.6FFflFdBSBxuK1b6W-nsOg";

    this.map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [25.0, 45.9],
      zoom: 6,
    });
  },
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 600px;
  border-radius: 16px;
  margin-top: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
