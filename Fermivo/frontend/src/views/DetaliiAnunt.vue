<template>
  <div class="anunt-details">
    <h1>{{ anunt.produs }}</h1>
    <p>Preț: {{ anunt.pret_lei_tona }} lei/tonă</p>
    <p>Zona: {{ anunt.zona }}</p>
    <p>Descriere: {{ anunt.descriere }}</p>
    <button v-if="!isBuyer" @click="goToEdit">Editează</button>
    <button v-if="!isBuyer" @click="deleteAnunt">Șterge</button>
  </div>
</template>

<script>
import axios from "../axios";

export default {
  data() {
    return {
      anunt: {},
      user: JSON.parse(localStorage.getItem("user")),
    };
  },
  computed: {
    isBuyer() {
      return this.user?.role === "buyer";
    },
  },
  async created() {
    const { id } = this.$route.params;
    const response = await axios.get(`/anunturi/${id}`);
    this.anunt = response.data.anunt;
  },
  methods: {
    goToEdit() {
      this.$router.push(`/editare-anunt/${this.anunt._id}`);
    },
    async deleteAnunt() {
      const confirmDelete = confirm("Sigur vrei să ștergi acest anunț?");
      if (confirmDelete) {
        await axios.delete(`/anunturi/${this.anunt._id}`);
        alert("Anunț șters!");
        this.$router.push("/home");
      }
    },
  },
};
</script>

<style scoped>
.anunt-details {
  background: rgba(197, 241, 186, 0.9);
  padding: 2rem;
  border-radius: 20px;
  max-width: 600px;
  margin: 5rem auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  font-family: "Inria Sans", sans-serif;
}

.anunt-details h1 {
  font-size: 2rem;
  color: #1b5e20;
  margin-bottom: 1rem;
}

.anunt-details p {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.anunt-details button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  margin-right: 1rem;
  transition: all 0.3s ease;
}

.anunt-details button:first-of-type {
  background: linear-gradient(135deg, #1b5e20, #2e7d32);
  color: white;
}

.anunt-details button:last-of-type {
  background: linear-gradient(135deg, #b71c1c, #e53935);
  color: white;
}

.anunt-details button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.anunt-details button:active {
  transform: translateY(0);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
</style>
