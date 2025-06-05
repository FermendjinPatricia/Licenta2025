<template>
  <div id="map" style="width: 100%; height: 500px;"></div>
</template>

<script>
export default {
  name: "MapComponent",
  data() {
    return {
      map: null,
    };
  },
  async mounted() {
    await this.loadGoogleMaps();
    const anunturi = await this.getAnunturi();
    this.initMap(anunturi);
  },
  methods: {
    loadGoogleMaps() {
      return new Promise((resolve) => {
        if (window.google) return resolve();
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDuJX2WVbs4TZgtMOizvr4OHsGm6vXoNq8&callback=initMapCallback`;
        script.async = true;
        script.defer = true;
        window.initMapCallback = resolve;
        document.head.appendChild(script);
      });
    },

    async getAnunturi() {
      try {
        const res = await fetch("http://localhost:5000/api/anunturi");
        const data = await res.json();
        return data.anunturi || [];
      } catch (err) {
        console.error("❌ Eroare la fetch anunturi:", err);
        return [];
      }
    },

    initMap(anunturi) {
      this.map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 45.9432, lng: 24.9668 }, // România
        zoom: 7,
      });

      anunturi.forEach((anunt) => {
        if (anunt.lat && anunt.lng) {
          const marker = new google.maps.Marker({
            position: { lat: anunt.lat, lng: anunt.lng },
            map: this.map,
            title: anunt.produs,
          });

          const info = new google.maps.InfoWindow({
            content: `
              <strong>${anunt.produs}</strong><br/>
              ${anunt.judet} - ${anunt.localitate}<br/>
              ${anunt.pret_lei_tona} ${anunt.moneda}/tonă
            `,
          });

          marker.addListener("click", () => info.open(this.map, marker));
        }
      });
    },
  },
};
</script>
