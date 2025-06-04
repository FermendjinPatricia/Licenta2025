<template>
  <div class="header">
    <router-link :to="isBuyer ? '/home-buyer' : '/home'" class="site-title">
      {{ isPremium ? "Fermivo Premium🌾" : "Fermivo🌾" }}
    </router-link>
  </div>

  <div class="profil-user">
    <h1>{{ user.nume }} {{ user.prenume }}</h1>
    <p><strong>Firmă:</strong> {{ user.denumireaFirmei }}</p>
    <p><strong>Telefon:</strong> {{ user.telefon }}</p>
    <p><strong>Adresă:</strong> {{ user.adresa }}</p>
    <p><strong>Rating:</strong> {{ user.rating?.toFixed(1) || "N/A" }} ⭐</p>

    <div v-if="canRate">
      <p><strong>Lasă un rating:</strong></p>
      <div>
        <span
          v-for="star in 5"
          :key="star"
          @click="rateUser(star)"
          :style="{
            cursor: 'pointer',
            fontSize: '28px',
            color: star <= selectedRating ? '#fbc02d' : '#bbb',
          }"
        >
          {{ star <= selectedRating ? "★" : "☆" }}
        </span>
      </div>
    </div>

    <button class="btn-chat" @click="startConversation">
      Conversează cu acest utilizator
    </button>
  </div>
  <button class="btn-back" @click="goBack">← Înapoi</button>
</template>

<script>
import axios from "../axios";

export default {
  data() {
    return {
      user: {},
      currentUser: JSON.parse(localStorage.getItem("user")),
      isPremium: false,
      isLoggedIn: false,
      menuOpen: false,
      showProfileMenu: false,
      selectedRating: 0,
    };
  },
  async created() {
    this.isLoggedIn = !!localStorage.getItem("token");

    const id = this.$route.params.id;
    await this.fetchUserById(id);
  },
  computed: {
    canRate() {
      return this.currentUser?._id !== this.user._id;
    },

    isBuyer() {
      return this.currentUser?.role === "buyer";
    },
    userName() {
      return this.currentUser
        ? `${this.currentUser.nume} ${this.currentUser.prenume}`
        : "Utilizator";
    },
    userProfilePicture() {
      return this.currentUser?.profilePicture
        ? `http://localhost:5000${this.currentUser.profilePicture}`
        : `http://localhost:5000/uploads/default_profile.jpg`;
    },
  },
  methods: {
    goBack() {
      const previous = this.$route.query.from;
      if (previous) {
        this.$router.push(previous);
      } else {
        this.$router.go(-1); // fallback
      }
    },
    async rateUser(rating) {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.post(
          `/users/${this.user._id}/rate`,
          { rating },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("Mulțumim pentru feedback!");

        this.user.rating = parseFloat(response.data.average);
        this.user.numReviews = response.data.numReviews;
        this.selectedRating = rating;
      } catch (err) {
        console.error("Eroare rating:", err);
        alert("Eroare la trimiterea ratingului.");
      }
    },
    async fetchUserById(id) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${id}`
        );
        if (response.data.success) {
          this.user = response.data.user;
          const review = this.user.reviews?.find(
            (r) => r.userId === this.currentUser?._id
          );
          this.selectedRating = review?.rating || 0;
        }
      } catch (err) {
        console.error("Eroare la fetch user profil:", err);
      }
    },
    async fetchUserLocal() {
      const localUser = JSON.parse(localStorage.getItem("user"));
      if (!localUser || !localUser._id) return;

      const response = await axios.get(
        `http://localhost:5000/api/users/${localUser._id}`
      );
      if (response.data.success) {
        this.user = response.data.user;
        this.isPremium = response.data.user.isPremium;
      }
    },
    async startConversation() {
      try {
        const response = await axios.post("/conversatii/start", {
          senderId: this.currentUser._id,
          receiverId: this.user._id,
        });

        if (response.data.success) {
          const convId = response.data.conversatie._id;
          this.$router.push(`/chat/${convId}`);
        }
      } catch (err) {
        console.error("❌ Eroare la inițiere conversație:", err);
        alert("Eroare la inițiere conversație.");
      }
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
  z-index: 1;
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

.sign-out-button {
  background-color: #1b5e20;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 7px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
}
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
  margin-top: 1rem;
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
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
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

.btn-back {
  margin-top: 1rem;
  background: linear-gradient(135deg, #9e9e9e, #bdbdbd);
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
}

.profil-user {
  max-width: 600px;
  margin: 4rem auto;
  padding: 2rem;
  border-radius: 20px;
  background: rgba(197, 241, 186, 0.9);
  font-family: "Inria Sans", sans-serif;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.profil-user h1 {
  color: #1b5e20;
  margin-bottom: 1rem;
}

.profil-user p {
  font-size: 1.2rem;
  margin: 0.5rem 0;
}

.btn-chat {
  margin-top: 2rem;
  background: linear-gradient(135deg, #0288d1, #03a9f4);
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
}
.btn-chat:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
</style>
