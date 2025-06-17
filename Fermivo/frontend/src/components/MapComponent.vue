<template>
  <div id="map" style="width: 100%; height: 500px"></div>
</template>

<script>
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
      markers: [],
    };
  },
  watch: {
    anunturi: {
      handler(newData) {
        this.setMarkers([...newData]); // forțăm o instanță nouă
      },
      deep: true, // 🟢 foarte important!
      immediate: true,
    },
  },
  mounted() {
    this.loadGoogleMaps().then(() => {
      this.initMap();
      this.setMarkers(this.anunturi);
    });
  },
  methods: {
    loadGoogleMaps() {
      return new Promise((resolve) => {
        if (window.google) return resolve();
        const script = document.createElement("script");
        const apiKey = process.env.VUE_APP_GOOGLE_MAPS_API_KEY;
        console.log("🔑 Cheia din .env este:", apiKey); 
        script.src =
          `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMapCallback`;
        script.async = true;
        script.defer = true;
        window.initMapCallback = resolve;
        document.head.appendChild(script);
      });
    },
    initMap() {
      this.map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 45.9432, lng: 24.9668 },
        zoom: 7,
      });
    },
    clearMarkers() {
      this.markers.forEach((marker) => marker.setMap(null));
      this.markers = [];
    },
    setMarkers(anunturi) {
      if (!this.map) return;
      this.clearMarkers();

      anunturi.forEach((anunt) => {
        if (anunt.lat && anunt.lng) {
          const marker = new google.maps.Marker({
            position: { lat: anunt.lat, lng: anunt.lng },
            map: this.map,
            title: anunt.produs || "Camion",
          });

          // Verificăm dacă este un anunț sau un camion
          let content = "";
          if (anunt.pret_lei_tona && anunt.moneda) {
            content = `
          <strong>${anunt.produs}</strong><br/>
          ${anunt.judet || ""} - ${anunt.localitate || ""}<br/>
          ${anunt.pret_lei_tona} ${anunt.moneda}/tonă
        `;
          } else {
            content = `<strong>Camion: ${
              anunt.produs || "Șofer necunoscut"
            }</strong>`;
          }

          const info = new google.maps.InfoWindow({ content });
          marker.addListener("click", () => info.open(this.map, marker));
          this.markers.push(marker);
        }
      });
    },
    setMarkerData(newData) {
      this.setMarkers(newData);
    },
  },
};
</script>
