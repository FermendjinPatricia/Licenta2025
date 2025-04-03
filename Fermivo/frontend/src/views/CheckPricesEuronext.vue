<template>
  <div class="welcome-page">
    <div class="header">
      <button class="menu-button" @click="toggleMenu">&#9776;</button>
      <button v-if="isLoggedIn" class="sign-out-button" @click="handleLogout">
        Sign Out
      </button>
      <router-link v-else to="/login" class="sign-in-button"
        >Sign In</router-link
      >
    </div>

    <img src="../assets/login.jpg" alt="Background" class="background-image" />
    <div class="data-container">
      <h2>Prețuri cereale</h2>
      <table>
        <thead>
          <tr>
            <th>Nume produs</th>
            <th>Cod</th>
            <th>Ultima valoare</th>
            <th>Schimbare</th>
            <th>Volum</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in commodities" :key="item.code">
            <td>{{ item.name }}</td>
            <td>{{ item.code }}</td>
            <td>{{ item.last_price }}</td>
            <td
              :class="{ positive: item.change > 0, negative: item.change < 0 }"
            >
              {{ item.change }}
            </td>
            <td>{{ item.volume }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <nav v-if="menuOpen" class="menu">
      <ul>
        <li><router-link to="/login">Login</router-link></li>
        <li><router-link to="/register">Register</router-link></li>
        <li><router-link to="/about">About</router-link></li>
      </ul>
    </nav>
  </div>
</template>

<script>
import axios from "../axios";

export default {
  name: "WelcomePage",
  data() {
    return {
      menuOpen: false,
      isLoggedIn: false,
      commodities: [], // Stocăm datele de bursă
    };
  },
  created() {
    // Verificăm dacă utilizatorul este logat
    this.isLoggedIn = !!localStorage.getItem("token");

    if (this.isLoggedIn) {
      this.fetchData(); // Dacă este logat, preia datele
      setInterval(this.fetchData, 60000); // Actualizare automată la 1 minut
    }
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    async fetchData() {
      try {
        const response = await axios.get("http://localhost:5000/scrape");
        console.log("📊 Date primite în frontend:", response.data);
        this.commodities = response.data.data; // Stocăm datele
      } catch (error) {
        console.error("❌ Eroare la preluarea datelor:", error);
      }
    },
    handleLogout() {
      localStorage.removeItem("token"); // Șterge token-ul
      localStorage.removeItem("user"); // Șterge și userul (dacă e cazul)
      this.isLoggedIn = false;
      this.$router.push("/login"); // Redirecționează la pagina de login
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
