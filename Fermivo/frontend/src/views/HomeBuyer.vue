<template>
  <div class="welcome-page">
    <div class="header">
      <button class="menu-button" @click="toggleMenu">&#9776;</button>

      <router-link v-if="isPremium" to="/home-buyer" class="site-title"
        >Fermivo Premium🌾</router-link
      >
      <router-link v-else to="/home-buyer" class="site-title"
        >Fermivo🌾</router-link
      >
      <router-link
        v-if="isLoggedIn && !isPremium"
        to="/premium"
        class="premium-button"
      >
        Devino Premium
      </router-link>
      <router-link
        v-if="isPremium && isLoggedIn"
        to="/camioane-cumparator"
        class="premium-button"
      >
        Urmărește Șofer 🚚
      </router-link>

      <div class="header-right">
        <div class="header-right" v-if="user">
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
              <router-link :to="`/editare-profil/${user._id}`"
                >Editează Profil</router-link
              >
            </div>
          </div>
        </div>

        <button v-if="isLoggedIn" class="sign-out-button" @click="handleLogout">
          Sign Out
        </button>
      </div>
    </div>

    <img src="../assets/login.jpg" alt="Background" class="background-image" />

    <!-- INTRO -->
    <div class="content-box">
      <h1>Bine ai venit! 👋</h1>
      <p>
        Noi suntem <strong>Fermivo</strong>, marketplace-ul tău de încredere.
        <br />
        Explorează cele mai bune oferte de pe piață! 🚜🌾
      </p>
    </div>

    <!-- PREDICTII SLIDER -->
    <div
      v-if="predictii.length"
      class="predictii-slider"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <div class="slide">
        <h3>{{ predictii[currentSlide].produs }}</h3>
        <p><strong>Zonă:</strong> {{ predictii[currentSlide].zona }}</p>
        <p>
          <strong>Preț estimat:</strong>
          {{ predictii[currentSlide].pret_lei_predictie }}
        </p>
      </div>
      <div class="slide-controls">
        <button @click="prevSlide">⬅️</button>
        <button @click="nextSlide">➡️</button>
      </div>
    </div>

    <!-- ANUNTURI -->
    <div class="card-container">
      <p v-if="anunturi.length === 0" class="no-ads">
        Nu există anunțuri disponibile momentan.
      </p>
      <div v-else class="filtru-categorii">
        <button
          v-for="categorie in categories"
          :key="categorie"
          :class="{ activ: selectedCategory === categorie }"
          @click="selectedCategory = categorie"
        >
          {{ categorie }}
        </button>
      </div>
      <div class="harta-button-wrapper">
        <router-link to="/harta-anunturi" class="btn-vezi-harta">
          🗺️ Vezi anunțurile pe hartă
        </router-link>
      </div>

      <div
        v-for="(item, index) in anunturiFiltrate"
        :key="index"
        class="card card-grid"
      >
        <!-- 🟩 Coloana 1: Info anunț -->
        <div class="anunt-info">
          <p>
            <strong>{{ item.produs }}</strong>
          </p>
          <span
            v-if="item.userId?.isPremium"
            style="
              background: #f5b301;
              color: white;
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 0.85rem;
              font-weight: bold;
            "
          >
            🌟 Promovat
          </span>

          <p>
            Preț: {{ item.pret_lei_tona }}
            {{ item.moneda === "euro" ? "€" : "lei" }}/tonă
          </p>
          <p>Județ: {{ item.judet }}</p>
          <p>Localitate: {{ item.localitate }}</p>
          <router-link :to="`/anunturi/${item._id}`" class="detalii-button">
            Vezi detalii
          </router-link>
        </div>

        <!-- 🟨 Coloana 2: Prețuri BRM -->
        <div class="brm-table" v-if="getPreturiProdus(item.produs).length">
          <h4>Prețuri azi</h4>
          <table>
            <thead>
              <tr>
                <th>Zonă</th>
                <th>Preț</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(pret, idx) in getPreturiProdus(item.produs)"
                :key="idx"
              >
                <td>{{ pret.zona }}</td>
                <td>{{ pret.pret_lei_tona }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 🟦 Coloana 3: Imagine -->
        <img src="../assets/grau.jpg" alt="Imagine produs" class="card-image" />
      </div>
    </div>

    <!-- MENIU -->
    <nav v-if="menuOpen" class="menu">
      <ul>
        <li><router-link to="/home-buyer">Home</router-link></li>
        <li><router-link to="/check-prices">Check prices</router-link></li>
        <li><router-link to="/about">About</router-link></li>
      </ul>
    </nav>
  </div>
</template>

<script>
import axios from "../axios";

export default {
  name: "HomeBuyer",
  data() {
    return {
      isLoggedIn: false,
      user: null,
      anunturi: [],
      scraperData: [],
      menuOpen: false,
      showProfileMenu: false,
      predictii: [],
      currentSlide: 0,
      touchStartX: 0,
      touchEndX: 0,
      autoplayInterval: null,
      isPremium: false,
      selectedCategory: "toate",
      categories: [
        "toate",
        "Grâu panificație",
        "Grâu furajer",
        "Orz",
        "Orz furajer",
        "Porumb",
        "Floarea soarelui",
        "Rapiță",
      ],
    };
  },
  computed: {
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
    anunturiFiltrate() {
      if (this.selectedCategory === "toate") return this.anunturi;

      const selected = this.normalize(this.selectedCategory);
      return this.anunturi.filter(
        (anunt) => this.normalize(anunt.produs) === selected
      );
    },
  },
  async created() {
    const localUser = JSON.parse(localStorage.getItem("user"));

    if (localUser && localUser._id) {
      this.isLoggedIn = true;
      await this.fetchUser(localUser._id);
    }
    this.fetchAnunturi();
    await this.fetchScraperData();
    this.fetchPredictii();
    this.startAutoplay();
  },
  mounted() {
    this.startAutoplay();
  },
  beforeDestroy() {
    clearInterval(this.autoplayInterval);
  },
  methods: {
    async fetchUser(userId) {
      try {
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
    async fetchScraperData() {
      try {
        const response = await axios.get("http://localhost:5000/scrape/brm");
        if (response.data.success) {
          this.scraperData = response.data;
        }
      } catch (error) {
        console.error("❌ Eroare la fetch scraper:", error);
      }
    },
    async fetchAnunturi() {
      try {
        const response = await axios.get("/anunturi");
        if (response.data.success) {
          this.anunturi = response.data.anunturi;
          this.anunturi.sort((a, b) => {
            const aPremium = a.userId?.isPremium ? 1 : 0;
            const bPremium = b.userId?.isPremium ? 1 : 0;
            return bPremium - aPremium; // premium primele
          });
        }
      } catch (error) {
        console.error("❌ Eroare la anunturi:", error);
      }
    },
    async fetchPredictii() {
      try {
        const response = await axios.get("http://localhost:5000/api/predictii");
        if (response.data.success) {
          this.predictii = response.data.predictii;
        }
      } catch (error) {
        console.error("❌ Eroare la fetch predictii:", error);
      }
    },
    getPreturiProdus(produs) {
      const mapping = {
        "Grau Panificatie": "grau_panificatie",
        "Grau Furajer": "grau_furajer",
        "Floarea Soarelui": "floarea_soarelui",
        Rapita: "rapita",
        Porumb: "porumb",
        Orz: "orz",
        "Orz Furajer": "orz_furajer",
      };
      const key = mapping[produs];
      return this.scraperData[key] || [];
    },
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.predictii.length;
    },
    prevSlide() {
      this.currentSlide =
        (this.currentSlide - 1 + this.predictii.length) % this.predictii.length;
    },
    handleTouchStart(e) {
      this.touchStartX = e.changedTouches[0].screenX;
    },
    handleTouchEnd(e) {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    },
    handleSwipe() {
      const delta = this.touchEndX - this.touchStartX;
      if (Math.abs(delta) > 50) {
        if (delta < 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
    },
    startAutoplay() {
      this.autoplayInterval = setInterval(() => {
        if (this.predictii.length) {
          this.nextSlide();
        }
      }, 10000); // la 10 secunde
    },
    handleLogout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.$router.push("/login");
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    toggleProfileMenu() {
      this.showProfileMenu = !this.showProfileMenu;
    },
    normalize(text) {
      return text
        .toLowerCase()
        .normalize("NFD") // elimină diacritice
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "") // elimină spațiile
        .trim();
    },
  },
};
</script>

<style scoped>
.filtru-categorii {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem auto;
  justify-content: center;
}

.filtru-categorii button {
  background-color: #f0f0f0;
  color: #1b5e20;
  border: 1px solid #1b5e20;
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.filtru-categorii button.activ,
.filtru-categorii button:hover {
  background-color: #1b5e20;
  color: white;
}

html,
body {
  overflow: hidden;
  height: 100%;
  margin: 0;
  padding: 0;
}
.welcome-page {
  font-family: "Inria Sans", sans-serif;
}

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
  padding: 8px 12px;
  margin-left: 10px;
  margin-right: 60px;
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
}

.header-right {
  display: flex;
  align-items: right;
  gap: 0.2rem;
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

.user-profile-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  gap: 8px;
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

.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.content-box {
  background: rgba(217, 227, 194, 0.8);
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.9);
  max-width: 800px;
  width: 95%;
  text-align: left;
  margin-top: 2rem;
}

h1 {
  font-size: 3rem;
  font-weight: bold;
  color: rgba(0, 114, 31, 1);
}

p {
  font-size: 1.7rem;
  font-weight: bold;
  color: rgba(0, 114, 31, 1);
}

.card-container {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border: 2px solid #02111d45;
  padding: 1rem;
  border-radius: 20px;
  margin-top: 1rem;
  margin-bottom: 2rem;
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
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
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

.card.card-grid {
  display: grid;
  grid-template-columns: 1.5fr 1.5fr 1fr;
  gap: 1rem;
  align-items: start;
  background: rgba(197, 241, 186, 0.8);
  border-radius: 20px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.anunt-info p {
  margin: 0.2rem 0;
  font-weight: bold;
}

.brm-table {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: "Inria Sans", sans-serif;
  font-size: 0.9rem;
  width: 100%;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.brm-table h4 {
  margin-bottom: 0.5rem;
  margin-right: 1rem;
  font-size: 1rem;
  font-weight: bold;
  color: #1b5e20;
  border-bottom: 1px solid #c0c0c0;
  padding-bottom: 0.3rem;
}

.brm-table table {
  width: 100%;
  border-collapse: collapse;
}

.brm-table th {
  background-color: #d9f2d0;
  color: #1b5e20;
  font-weight: bold;
  padding: 6px;
  border-bottom: 1px solid #ccc;
}

.brm-table td {
  padding: 6px;
  border-bottom: 1px solid #eee;
}

.brm-table tr:last-child td {
  border-bottom: none;
}
.brm-table tr:hover {
  background-color: #f1f8e9;
}

.card-image {
  margin-left: 1.5rem;
  width: auto;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
}

.no-ads {
  text-align: center;
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: bold;
}

.menu {
  position: absolute;
  top: 60px;
  left: 15px;
  background: rgb(201, 223, 192);
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.detalii-button,
.adauga_anunt {
  display: inline-block;
  background-color: #1b5e20;
  color: white;
  padding: 0.5rem 1rem;
  text-align: center;
  border-radius: 10px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.detalii-button,
.adauga_anunt:hover {
  background-color: #093b12;
  transform: translateY(-2px);
}

.detalii-button,
.adauga_anunt:active {
  transform: translateY(0);
}

.predictii-slider {
  position: absolute;
  right: 2rem;
  top: 10rem;
  width: 300px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 5;
}

.slide {
  text-align: center;
  font-weight: bold;
  color: #1b5e20;
}

.slide-controls {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.slide-controls button {
  background: #1b5e20;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.2rem;
}

.slide-controls button:hover {
  background: #093b12;
}
</style>
