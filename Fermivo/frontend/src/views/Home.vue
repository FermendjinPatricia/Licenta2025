<template>
  <div class="welcome-page">
    <div class="header">
      <button class="menu-button" @click="toggleMenu">&#9776;</button>
      <button v-if="isLoggedIn" class="sign-out-button" @click="handleLogout">
        Deconectează-te
      </button>
      <router-link v-else to="/login" class="sign-in-button"
        >Conectează-te</router-link
      >
    </div>

    <img src="../assets/login.jpg" alt="Background" class="background-image" />

    <div class="card-container">
      <h2>Anunțurile tale</h2>
      <div v-for="(item, index) in cereals" :key="index" class="card">
        <div class="card-text">
          <p>
            <strong>{{ item.produs }}</strong>
          </p>
          <p>Preț: {{ item.pret_lei_tona }} lei/tonă</p>
          <p>Oraș: {{ item.zona }}</p>
        </div>
        <img src="../assets/grau.jpg" alt="Imagine produs" class="card-image" />
      </div>
    </div>

    <nav v-if="menuOpen" class="menu">
      <ul>
        <li><router-link to="/check-prices">Check prices on the market</router-link></li>
        <li><router-link to="/about">About</router-link></li>
      </ul>
    </nav>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HomePage2",
  data() {
    return {
      menuOpen: false,
      isLoggedIn: false,
      cereals: [], // Datele cerealelor
    };
  },
  created() {
    this.isLoggedIn = !!localStorage.getItem("token");

    if (this.isLoggedIn) {
      this.fetchData();
      setInterval(() => {
        this.fetchData();
      }, 5 * 60 * 1000); // Actualizare la fiecare 5 minute
    }
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    async fetchData() {
      try {
        const response = await axios.get("http://localhost:5000/scrape/brm");
        console.log("📊 Date primite în frontend:", response.data);

        if (!response.data || !response.data.success) {
          console.error("⚠️ Backend nu a trimis date valide!");
          return;
        }

        // Transformăm datele primite pentru a fi afișate corect în tabel
        const parsedData = [];
        const categories = [
          { key: "grau_panificatie", name: "Grâu de panificație" },
          { key: "porumb", name: "Porumb" },
          { key: "grau_furajer", name: "Grâu furajer" },
          { key: "orz", name: "Orz" },
          { key: "orz_furajer", name: "Orz furajer" },
          { key: "floarea_soarelui", name: "Floarea soarelui" },
          { key: "rapita", name: "Rapiță" },
        ];

        categories.forEach((category) => {
          if (response.data[category.key]) {
            response.data[category.key].forEach((item) => {
              parsedData.push({
                zona: item.zona,
                produs: category.name,
                pret_lei_tona:
                  item.pret_lei_tona !== "-" ? item.pret_lei_tona : "N/A",
                variatie_procente:
                  item.variatie_procente !== "-"
                    ? item.variatie_procente
                    : null,
              });
            });
          }
        });

        console.log("📊 Date formatate pentru tabel:", parsedData);
        this.cereals = parsedData;
      } catch (error) {
        console.error("❌ Eroare la preluarea datelor:", error);
      }
    },
    handleLogout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.isLoggedIn = false;
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
/* Stiluri generale */
html,
body {
  overflow: hidden;
  height: 100%;
  margin: 0;
  padding: 0;
}
.welcome-page {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Inria Sans", sans-serif;
}
.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
.header {
  display: flex;
  justify-content: space-between;
  top: 0;
  width: 100%;
  background: rgba(253, 253, 253, 0.9);
  padding: 0rem;
  border-radius: 8px;
  z-index: 0;
}
.card-container {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border: 2px solid #dff1cf45;
  padding: 1rem;
  border-radius: 20px;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 90%;
  width: 800px;
}

.card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(197, 241, 186, 0.8);
  border-radius: 20px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.card-text {
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  color: #000;
}

.card-image {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 12px;
  margin-left: 1rem;
}


/* Butoane */
.sign-in-button,
.sign-out-button {
  background-color: #1b5e20;
  color: rgb(249, 250, 248);
  text-decoration: none;
  padding: 0.5rem 1rem;
  margin: 0.35rem 1rem;
  border-radius: 7px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
}
.sign-in-button:hover,
.sign-out-button:hover {
  background-color: #093b12;
}

/* Tabel cu date */
.data-container {
  background: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  width: 800px;
  text-align: center;
  margin-top: 2rem;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
th,
td {
  padding: 10px;
  border: 1px solid #ddd;
}
th {
  background-color: #012f19;
  color: white;
}
.positive {
  color: green;
  font-weight: bold;
}
.negative {
  color: red;
  font-weight: bold;
}
.menu-button {
  font-size: 2rem;
  background: rgba(217, 242, 208, 1);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #1b5e20;
}
.menu {
  position: absolute;
  top: 60px;
  left: 15px;
  background: white;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 2;
}
</style>
