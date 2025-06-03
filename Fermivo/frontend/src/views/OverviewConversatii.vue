<template>
  <div class="conversatii-container">
    <h2>Conversațiile tale 📬</h2>

    <div v-if="conversatii.length === 0" class="no-conversations">
      Nu ai conversații active încă.
    </div>

    <div v-else class="conversatie-card" v-for="conv in conversatii" :key="conv._id" @click="goToChat(conv)">
      <img :src="getOtherUserPicture(conv)" class="avatar" />
      <div class="info">
        <p class="name">{{ getOtherUserName(conv) }}</p>
        <p class="last-message">{{ conv.lastMessage?.text || 'Fără mesaje' }}</p>
      </div>
      <span class="timestamp">{{ formatDate(conv.updatedAt) }}</span>
    </div>
  </div>
  <div v-if="user.role === 'buyer'" >
    <router-link to="/home-buyer">
      <button class="btn-back">Înapoi</button>
    </router-link>
  </div>
  <div v-else>
    <router-link to="/home">
      <button class="btn-back">Înapoi</button>
    </router-link>
  </div>
</template>

<script>
import axios from "../axios";

export default {
  name: "OverviewConversatii",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")),
      conversatii: [],
    };
  },
  async created() {
    try {
      const res = await axios.get(`/conversatii/user/${this.user._id}`);
      this.conversatii = res.data.conversatii;
    } catch (err) {
      console.error("❌ Eroare la fetch conversatii:", err);
    }
  },
  methods: {
    getOtherUserName(conv) {
      const other = conv.participants.find(p => p._id !== this.user._id);
      return `${other.nume} ${other.prenume}`;
    },
    getOtherUserPicture(conv) {
      const other = conv.participants.find(p => p._id !== this.user._id);
      return other.profilePicture
        ? `http://localhost:5000${other.profilePicture}`
        : `http://localhost:5000/uploads/default_profile.jpg`;
    },
    goToChat(conv) {
      this.$router.push(`/chat/${conv._id}`);
    },
    formatDate(date) {
      return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  },
};
</script>

<style scoped>
.btn-back {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}
.btn-back:hover {
  background-color: #1b5e20;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 7px;
  font-size: 1rem;
  border: none;
  cursor: pointer;
}

.btn-back {
  background-color: #093b12;
}
.conversatii-container {
  max-width: 700px;
  margin: 4rem auto;
  padding: 1rem;
  background: #f1f8e9;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  font-family: "Inria Sans", sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 1rem;
  color: #1b5e20;
}

.no-conversations {
  text-align: center;
  color: #666;
  font-style: italic;
  margin-top: 2rem;
}

.conversatie-card {
  display: flex;
  align-items: center;
  background: white;
  padding: 0.8rem;
  border-radius: 10px;
  margin-bottom: 0.8rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.conversatie-card:hover {
  background-color: #e0f2f1;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
}

.info {
  flex: 1;
}

.name {
  font-weight: bold;
  color: #2e7d32;
}

.last-message {
  color: #444;
  font-size: 0.9rem;
}

.timestamp {
  font-size: 0.8rem;
  color: gray;
}
</style>
