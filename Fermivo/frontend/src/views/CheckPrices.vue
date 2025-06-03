<template>
  <div class="welcome-page">
    <div class="header">
      <button class="menu-button" @click="toggleMenu">&#9776;</button>

      <router-link v-if="isBuyer && isPremium" to="/home-buyer" class="site-title">Fermivo Premium🌾</router-link>
      <router-link v-if="!isBuyer && isPremium" to="/home" class="site-title">Fermivo Premium🌾</router-link>
      <router-link v-if="isBuyer && !isPremium" to="/home-buyer" class="site-title">Fermivo🌾</router-link>
      <router-link v-if="!isBuyer && !isPremium" to="/home" class="site-title">Fermivo🌾</router-link>
      <router-link
        v-if="isLoggedIn && !isPremium"
        to="/premium"
        class="premium-button"
      >
        Devino Premium
      </router-link>

      <div class="header-right" v-if="isLoggedIn && user">
        <div class="user-profile-wrapper">
          <div class="user-profile" @click="toggleProfileMenu">
            <img :src="userProfilePicture" class="profile-picture" />
            <span class="user-name">{{ userName }}</span>
          </div>

          <img
            src="../assets/chat-icon.png"
            class="chat-icon"
            alt="Chat"
            @click="$router.push('/chat')"
          />

          <div v-if="showProfileMenu" class="profile-menu">
            <router-link :to="`/editare-profil/${user._id}`">
              Editează Profil
            </router-link>
          </div>
        </div>

        <button class="sign-out-button" @click="handleLogout">Sign Out</button>
      </div>

      <router-link v-else to="/login" class="sign-in-button"
        >Sign In</router-link
      >
    </div>

    <img src="../assets/login.jpg" alt="Background" class="background-image" />

    <div class="data-container" v-if="isLoggedIn">
      <h2>Prețuri Cereale</h2>
      <p v-if="!isPremium" style="color: #888; font-size: 0.9rem">
        💡 Vezi toate prețurile activând contul Premium.
      </p>

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
          <tr
            v-for="(item, index) in cereals"
            :key="index"
            :style="{
              backgroundColor: isPremium
                ? 'rgba(245, 241, 195, 0.2)'
                : 'transparent',
            }"
          >
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
        Această funcționalitate nu este disponibilă decât dacă sunteți
        autentificat. Vă rugăm să vă conectați sau să creați un cont.
      </p>
    </div>

    <nav v-if="menuOpen" class="menu">
      <ul v-if="isLoggedIn">
        <li v-if="isBuyer">
          <router-link to="/home-buyer">Home</router-link>
        </li>
        <li v-else>
          <router-link to="/home">Home</router-link>
        </li>

        <li>
          <router-link to="/check-prices"
            >Check prices on the market</router-link
          >
        </li>
        <li><router-link to="/about">About</router-link></li>
      </ul>
      <ul v-else>
        <li><router-link to="/login">Login</router-link></li>
        <li><router-link to="/register">Register</router-link></li>
        <li>
          <router-link to="/check-prices"
            >Check prices on the market</router-link
          >
        </li>
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
      user: JSON.parse(localStorage.getItem("user")),
      isPremium: false,
      showProfileMenu: false,
    };
  },
  computed: {
    isBuyer() {
      return this.user?.role === "buyer";
    },
    userName() {
      return this.user
        ? `${this.user.nume} ${this.user.prenume}`
        : "Utilizator";
    },
    userProfilePicture() {
      return this.user?.profilePicture
        ? `http://localhost:5000${this.user.profilePicture}`
        : `http://localhost:5000/uploads/default_profile.jpg`;
    },
  },
  created() {
    this.isLoggedIn = !!localStorage.getItem("token");

    if (this.isLoggedIn) {
      this.fetchUser().then(() => {
      this.fetchData();
      });
      setInterval(() => {
        this.fetchData();
      }, 5 * 60 * 1000); // reîncarcă datele la fiecare 5 minute
    }
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    toggleProfileMenu() {
      this.showProfileMenu = !this.showProfileMenu;
    },
    async fetchUser() {
      try {
        const userId = this.user?._id;
        if (!userId) return;

        const response = await axios.get(
          `http://localhost:5000/api/users/${userId}`
        );
        if (response.data.success) {
          this.user = response.data.user;
          this.isPremium = response.data.user.isPremium;
        }
      } catch (error) {
        console.error("❌ Eroare la fetch user:", error);
      }
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

        const isPremium = this.user?.isPremium;

        const categories = isPremium
          ? [
              { key: "grau_panificatie", name: "Grâu de panificație" },
              { key: "porumb", name: "Porumb" },
              { key: "grau_furajer", name: "Grâu furajer" },
              { key: "orz", name: "Orz" },
              { key: "orz_furajer", name: "Orz furajer" },
              { key: "floarea_soarelui", name: "Floarea soarelui" },
              { key: "rapita", name: "Rapiță" },
            ]
          : [
              { key: "grau_panificatie", name: "Grâu de panificație" },
              { key: "porumb", name: "Porumb" },
              { key: "orz_furajer", name: "Orz furajer" },
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
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 97%;
  background: rgba(253, 253, 253, 0.9);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  position: relative;
}

.site-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5rem;
  font-weight: bold;
  color: #1b5e20;
  text-decoration: none;
  font-family: "Inria Sans", sans-serif;
  z-index: 1;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.premium-button {
  background-color: #f5b301;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-left: 10px;
  margin-right: 20px;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}
.premium-button:hover {
  background-color: #f5a301;
}

.user-profile-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  gap: 8px;
}

.user-profile {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.profile-picture {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #1b5e20;
}

.user-name {
  font-weight: bold;
  color: #1b5e20;
}

.profile-menu {
  position: absolute;
  top: 50px;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 100;
}

.profile-menu a {
  color: #1b5e20;
  text-decoration: none;
  font-weight: bold;
}

.profile-menu a:hover {
  text-decoration: underline;
}

.chat-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-left: 1rem;
  cursor: pointer;
}

.chat-icon:hover {
  transform: scale(1.1);
  transition: transform 0.2s;
}

.menu-button {
  font-size: 2rem;
  background: rgba(217, 242, 208, 1);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #1b5e20;
}

.sign-in-button,
.sign-out-button {
  background-color: #1b5e20;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 7px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
}

.sign-in-button:hover,
.sign-out-button:hover {
  background-color: #093b12;
}

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

.premium-button {
  background-color: #f5b301;
  color: white;
  border: none;
  padding: 8px 12px;
  margin-left: 10px;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}
.premium-button:hover {
  background-color: #f5a301;
}

.site-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5rem;
  font-weight: bold;
  color: #1b5e20;
  text-decoration: none;
  font-family: "Inria Sans", sans-serif;
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
