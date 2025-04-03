<template>
  <div class="welcome-page">
    <div class="header">
      <button class="menu-button" @click="toggleMenu">&#9776;</button>
      <router-link to="/" class="site-title">Fermivo🌾</router-link>
      <button v-if="isLoggedIn" class="sign-out-button" @click="handleLogout">
        Sign Out
      </button>
      <router-link v-else to="/login" class="sign-in-button"
        >Sign In</router-link
      >
    </div>

    <img src="../assets/login.jpg" alt="Background" class="background-image" />

    <div class="data-container" v-if="isLoggedIn">
      <h2>Prețuri Cereale</h2>
      <table>
        <thead>
          <tr>
            <th>Zona</th>
            <th>Produs</th>
            <th>Preț (lei/tonă)</th>
            <th>Variație %</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in cereals" :key="index">
            <td>{{ item.zona }}</td>
            <td>{{ item.produs }}</td>
            <td>{{ item.pret_lei_tona }}</td>
            <td
              :class="{
                positive: item.variatie_procente > 0,
                negative: item.variatie_procente < 0,
              }"
            >
              {{
                item.variatie_procente !== null
                  ? item.variatie_procente + "%"
                  : "N/A"
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="data-container" v-else>
      <h2>Prețuri cereale</h2>
      <p>
        Această funcționalitate nu este disponibilă decât dacă sunteți autentificat. Vă rugăm să vă conectați
       sau să creați un cont.
      </p>
    </div>

    <nav v-if="menuOpen" class="menu">
      <ul v-if="isLoggedIn">
        <li><router-link to="/home">Home</router-link></li>
        <li><router-link to="/check-prices">Check prices on the market</router-link></li>
        <li><router-link to="/about">About</router-link></li>
      </ul>
      <ul v-else>
        <li><router-link to="/login">Login</router-link></li>
        <li><router-link to="/register">Register</router-link></li>
        <li><router-link to="/check-prices">Check prices on the market</router-link></li>
        <li><router-link to="/about">About</router-link></li>
      </ul>
    </nav>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CheckPrices",
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
.site-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5rem;
  font-weight: bold;
  color: #1b5e20;
  text-decoration: none;
  font-family: 'Inria Sans', sans-serif;
  cursor: pointer;
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
