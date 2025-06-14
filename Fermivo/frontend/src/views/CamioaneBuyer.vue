<template>
  <div class="camioane-page">
    <h2>Camioanele Mele 🚛</h2>

    <div v-if="camioane.length === 0">
      Nu există camioane active în acest moment.
    </div>

    <ul class="camioane-list">
      <li v-for="c in camioane" :key="c._id">
        <strong>{{ c.driverName }}</strong>
        <span v-if="c.lat && c.lng">📍 activ</span>
        <span v-else>🕒 așteaptă acceptul</span>
        <button @click="dezactiveaza(c._id)" class="deactivate-btn">
          Dezactivează urmărirea
        </button>
      </li>
    </ul>

    <button class="genereaza-btn" @click="genereazaLink">
      Generează link nou
    </button>

    <MapComponent v-if="camioane.length" :anunturi="camioane" />
  </div>
</template>

<script>
import axios from "axios";
import MapComponent from "@/components/MapComponent.vue";

export default {
  name: "CamioaneBuyer",
  components: { MapComponent },
  data() {
    return {
      camioane: [],
      user: null,
    };
  },
  methods: {
    async dezactiveaza(id) {
      if (
        !confirm("Ești sigur că vrei să dezactivezi urmărirea acestui șofer?")
      )
        return;
      try {
        await axios.delete(`/api/trackers/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        this.fetchCamioane();
      } catch (e) {
        console.error("Eroare la dezactivare:", e);
      }
    },
    async fetchCamioane() {
      try {
        const res = await axios.get(`/api/trackers/buyer/${this.user._id}`);
        this.camioane = res.data.trackers.map((t) => ({
          _id: t._id,
          driverName: t.driverName,
          lat: t.lat,
          lng: t.lng,
          produs: t.driverName, // pentru marker
        }));
      } catch (e) {
        console.error("Eroare la fetch camioane:", e);
      }
    },
    async genereazaLink() {
      const nume = prompt("Numele șoferului:");
      if (!nume) return;

      try {
        const res = await axios.post(
          "/api/trackers/generate-link",
          { driverName: nume },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        alert("Link generat: " + res.data.link);
        this.fetchCamioane(); // reîncarcă lista după
      } catch (e) {
        console.error("Eroare la generare link:", e);
      }
    },
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.fetchCamioane();
    setInterval(this.fetchCamioane, 10000); // actualizare automată
  },
};
</script>

<style scoped>
.deactivate-btn {
  margin-left: 1rem;
  padding: 0.3rem 0.7rem;
  background: #e53935;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.camioane-page {
  padding: 2rem;
}
.camioane-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}
.camioane-list li {
  margin-bottom: 0.5rem;
}
.genereaza-btn {
  padding: 0.6rem 1.2rem;
  background-color: #009688;
  color: white;
  border: none;
  border-radius: 8px;
  margin-bottom: 2rem;
  cursor: pointer;
}
</style>
