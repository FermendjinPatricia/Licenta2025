<template>
  <div class="welcome-page">
    <!-- HEADER -->
    <div class="header">
      <button class="menu-button" @click="toggleMenu">&#9776;</button>

      <router-link to="/" class="site-title">Fermivo🌾</router-link>

      <div class="header-right" v-if="user">
        <div class="user-profile" @click="toggleProfileMenu">
          <img :src="userProfilePicture" class="profile-picture" />
          <span class="user-name">{{ userName }}</span>

          <div v-if="showProfileMenu" class="profile-menu">
            <router-link :to="`/editare-profil/${user._id}`"
              >Editează Profil</router-link
            >
          </div>
        </div>

        <button class="sign-out-button" @click="logout">Logout</button>
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

      <div v-else v-for="(item, index) in anunturi" :key="index" class="card">
        <div class="card-text">
          <p>
            <strong>{{ item.produs }}</strong>
          </p>
          <p>Preț: {{ item.pret_lei_tona }} lei/tonă</p>
          <p>Zona: {{ item.zona }}</p>

          <router-link :to="`/anunturi/${item._id}`" class="detalii-button">
            Vezi detalii
          </router-link>
        </div>
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
      user: null,
      anunturi: [],
      predictii: [],
      currentSlide: 0,
      touchStartX: 0,
      touchEndX: 0,
      autoplayInterval: null,
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
  },
  async created() {
    const localUser = JSON.parse(localStorage.getItem("user"));
    if (localUser && localUser._id) {
      await this.fetchUser(localUser._id);
    }
    this.fetchAnunturi();
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
        }
      } catch (error) {
        console.error("❌ Eroare la fetch user:", error);
      }
    },
    async fetchAnunturi() {
      try {
        const response = await axios.get("/anunturi");
        if (response.data.success) {
          this.anunturi = response.data.anunturi;
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
      }, 5000); // la 5 secunde
    },
    logout() {
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
  },
};
</script>

<style scoped>
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
