<template>
  <div class="track-page">
    <h2>Bun venit! 🚛</h2>
    <p>Introduceți numele dumneavoastră și permiteți locația pentru a fi urmărit de cumpărător.</p>

    <form @submit.prevent="startTracking">
      <input v-model="driverName" placeholder="Nume șofer" required />
      <button type="submit">Permite locația</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "TrackPage",
  data() {
    return {
      driverName: "",
      intervalId: null,
    };
  },
  methods: {
    async startTracking() {
      const token = this.$route.params.token;

      if (!navigator.geolocation) {
        alert("Geolocația nu este suportată de acest browser.");
        return;
      }

      navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            await axios.post(`/api/trackers/${token}/location`, {
              lat: latitude,
              lng: longitude,
              driverName: this.driverName,
            });
          } catch (err) {
            console.error("Eroare la trimiterea locației:", err);
          }
        },
        (error) => {
          alert("Eroare la obținerea locației: " + error.message);
        },
        { enableHighAccuracy: true }
      );
    }
  }
};
</script>

<style scoped>
.track-page {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
input {
  padding: 0.5rem;
  margin-top: 1rem;
  width: 100%;
}
button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
}
</style>
